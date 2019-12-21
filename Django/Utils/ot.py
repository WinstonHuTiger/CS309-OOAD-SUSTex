"""
https://github.com/Operational-Transformation/ot.py

The MIT License (MIT)
Copyright © 2012 Tim Baumann, http://timbaumann.info

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
"""

# Operations are lists of ops. There are three types of ops:
#
# * Insert ops: insert a given string at the current cursor position.
#   Represented by strings.
# * Retain ops: Advance the cursor position by a given number of characters.
#   Represented by positive ints.
# * Delete ops: Delete the next n characters. Represented by negative ints.


def _is_retain(op):
    return isinstance(op, int) and op > 0


def _is_delete(op):
    return isinstance(op, int) and op < 0


def _is_insert(op):
    return isinstance(op, str)


def _op_len(op):
    if isinstance(op, str):
        return len(op)
    if op < 0:
        return -op
    return op


def _shorten(op, by):
    if isinstance(op, str):
        return op[by:]
    if op < 0:
        return op + by
    return op - by


def _shorten_ops(a, b):
    """Shorten two ops by the part that cancels each other out."""

    len_a = _op_len(a)
    len_b = _op_len(b)
    if len_a == len_b:
        return (None, None)
    if len_a > len_b:
        return (_shorten(a, len_b), None)
    return (None, _shorten(b, len_a))


class TextOperation(object):
    """Diff between two strings."""

    def __init__(self, ops=[]):
        self.ops = ops[:]

    def __eq__(self, other):
        return isinstance(other, TextOperation) and self.ops == other.ops

    def __iter__(self):
        return self.ops.__iter__()

    def __add__(self, other):
        return self.compose(other)

    def len_difference(self):
        """Returns the difference in length between the input and the output
        string when this operations is applied.
        """
        s = 0
        for op in self:
            if isinstance(op, str):
                s += len(op)
            elif op < 0:
                s += op
        return s

    def retain(self, r):
        """Skips a given number of characters at the current cursor position."""

        if r == 0:
            return self
        if len(self.ops) > 0 and isinstance(self.ops[-1], int) and self.ops[-1] > 0:
            self.ops[-1] += r
        else:
            self.ops.append(r)
        return self

    def insert(self, s):
        """Inserts the given string at the current cursor position."""

        if len(s) == 0:
            return self
        if len(self.ops) > 0 and isinstance(self.ops[-1], str):
            self.ops[-1] += s
        elif len(self.ops) > 0 and isinstance(self.ops[-1], int) and self.ops[-1] < 0:
            # It doesn't matter when an operation is applied whether the operation
            # is delete(3), insert("something") or insert("something"), delete(3).
            # Here we enforce that in this case, the insert op always comes first.
            # This makes all operations that have the same effect when applied to
            # a document of the right length equal in respect to the `equals` method.
            if len(self.ops) > 1 and isinstance(self.ops[-2], str):
                self.ops[-2] += s
            else:
                self.ops.append(self.ops[-1])
                self.ops[-2] = s
        else:
            self.ops.append(s)
        return self

    def delete(self, d):
        """Deletes a given number of characters at the current cursor position."""

        if d == 0:
            return self
        if d > 0:
            d = -d
        if len(self.ops) > 0 and isinstance(self.ops[-1], int) and self.ops[-1] < 0:
            self.ops[-1] += d
        else:
            self.ops.append(d)
        return self

    def __call__(self, doc):
        """Apply this operation to a string, returning a new string."""

        i = 0
        parts = []
        for op in self:
            print("LEN")
            if _is_retain(op):
                if i + op > len(doc):
                    raise Exception("Cannot apply operation: operation is too long.")
                parts.append(doc[i:(i + op)])
                i += op
            elif _is_insert(op):
                parts.append(op)
            else:
                i -= op
                if i > len(doc):
                    raise IncompatibleOperationError("Cannot apply operation: operation is too long.")

        if i != len(doc):
            raise IncompatibleOperationError("Cannot apply operation: operation is too short.")

        return ''.join(parts)

    def invert(self, doc):
        """Make an operation that does the opposite. When you apply an operation
        to a string and then the operation generated by this operation, you
        end up with your original string. This method can be used to implement
        undo.
        """

        i = 0
        inverse = TextOperation()

        for op in self:
            if _is_retain(op):
                inverse.retain(op)
                i += op
            elif _is_insert(op):
                inverse.delete(len(op))
            else:
                inverse.insert(doc[i:(i - op)])
                i -= op

        return inverse

    def compose(self, other):
        """Combine two consecutive operations into one that has the same effect
        when applied to a document.
        """

        iter_a = iter(self)
        iter_b = iter(other)
        operation = TextOperation()

        a = b = None
        while True:
            if a == None:
                a = next(iter_a, None)
            if b == None:
                b = next(iter_b, None)

            if a == b == None:
                # end condition: both operations have been processed
                break

            if _is_delete(a):
                operation.delete(a)
                a = None
                continue
            if _is_insert(b):
                operation.insert(b)
                b = None
                continue

            if a == None:
                raise IncompatibleOperationError("Cannot compose operations: first operation is too short")
            if b == None:
                raise IncompatibleOperationError("Cannot compose operations: first operation is too long")

            min_len = min(_op_len(a), _op_len(b))
            if _is_retain(a) and _is_retain(b):
                operation.retain(min_len)
            elif _is_insert(a) and _is_retain(b):
                operation.insert(a[:min_len])
            elif _is_retain(a) and _is_delete(b):
                operation.delete(min_len)
            # remaining case: _is_insert(a) and _is_delete(b)
            # in this case the delete op deletes the text that has been added
            # by the insert operation and we don't need to do anything

            (a, b) = _shorten_ops(a, b)

        return operation

    @staticmethod
    def transform(operation_a, operation_b):
        """Transform two operations a and b to a' and b' such that b' applied
        after a yields the same result as a' applied after b. Try to preserve
        the operations' intentions in the process.
        """

        iter_a = iter(operation_a)
        iter_b = iter(operation_b)
        a_prime = TextOperation()
        b_prime = TextOperation()
        a = b = None

        while True:
            if a == None:
                a = next(iter_a, None)
            if b == None:
                b = next(iter_b, None)

            if a == b == None:
                # end condition: both operations have been processed
                break

            if _is_insert(a):
                a_prime.insert(a)
                b_prime.retain(len(a))
                a = None
                continue

            if _is_insert(b):
                a_prime.retain(len(b))
                b_prime.insert(b)
                b = None
                continue

            if a == None:
                raise IncompatibleOperationError("Cannot compose operations: first operation is too short")
            if b == None:
                raise IncompatibleOperationError("Cannot compose operations: first operation is too long")

            min_len = min(_op_len(a), _op_len(b))
            if _is_retain(a) and _is_retain(b):
                a_prime.retain(min_len)
                b_prime.retain(min_len)
            elif _is_delete(a) and _is_retain(b):
                a_prime.delete(min_len)
            elif _is_retain(a) and _is_delete(b):
                b_prime.delete(min_len)
            # remaining case: _is_delete(a) and _is_delete(b)
            # in this case both operations delete the same string and we don't
            # need to do anything

            (a, b) = _shorten_ops(a, b)

        return (a_prime, b_prime)


class IncompatibleOperationError(Exception):
    """Two operations or an operation and a string have different lengths."""
    pass