const latex_grammar = {

// prefix ID for regular expressions, represented as strings, used in the grammar
"RegExpID"                  : "RE::",

"Extra"                     : {

    "fold"                  : "\\begin,\\end"

},

// Style model
"Style"                     : {

    "char"                 : "char"
    ,"symbol"               : "symbol"
    ,"description"          : "description"

},

// Lexical model
"Lex"                       : {
    "description"          : {"autocomplete":true,"tokens":[
                            "math", "displaymath", "toc", "section", "name",
                            "text", "name", "amount", "author", "begin",
                            "length", "counter", "names", "environment",
                            "abstract", "array", "lrc", "center", "description",
                            "displaymath", "document", "enumerate", "eqnarray",
                            "eqnarray*", "equation", "figure", "figure*",
                            "flushleft", "flushright", "itemize", "list",
                            "labeling", "spacing", "minipage", "picture",
                            "vsize", "quotation", "quote", "tabbing", "table",
                            "table*", "tabular", "arg", "theorem", "titlepage",
                            "verbatim", "verse", "dwid",
                            ]}
    ,"keyword"              : {"autocomplete":true,"tokens":[
                            "\\addcontentsline", "\\address", "\\addtocontents",
                            "\\addtocounter", "\\addtolength", "\\and",
                            "\\appendix", "\\arabic", "\\author", "\\begin",
                            "\\bf", "\\bibitem", "\\bibliography",
                            "\\bibliographystyle", "\\boldmath", "\\bmod",
                            "\\bottomfraction", "\\caption", "\\cc",
                            "\\centering", "\\chapter", "\\chapter*", "\\circle",
                            "\\circle*", "\\cleardoublepage", "\\cite",
                            "\\clearpage", "\\cline", "\\closing", "\\columnsep",
                            "\\columnseprule", "\\columnwidth", "\\circle",
                            "\\date", "\\day", "\\dblfloatpagefraction",
                            "\\dblfloatsep", "\\dbltextfloatsep",
                            "\\dbltopfraction", "\\displaystyle"
                            ]}
    ,"char"                 : {"autocomplete":false,"tokens":[
                            "\\!", "\\\"", "\\#", "\\$", "\\%", "\\&", "\\\'",
                            "\\(", "\\)", "\\*", "\\+", "\\,", "\\-", "\\.",
                            "\\/", "\\:", "\\;", "\\<", "\\=", "\\>", "\\@",
                            "\\[", "\\\\", "\\\\*", "\\]", "\\^", "\_", "\\\'",
                            "\\{", "\\|", "\\}", "\\~", "\\a\'", "\\a=", "\\ ",
                            "\\b", "\\nl", "\\c"
                            ]}
    ,"symbol"               : {"autocomplete":true,"tokens":[
                            "\\aa", "\\acute", "\\ae", "\\aleph", "\\alph",
                            "\\alpha", "\\amalg", "\\angle", "\\approx",
                            "\\arccos", "\\arcsin", "\\arctan", "\\arg",
                            "\\arraycolsep", "\\arrayrulewidth",
                            "\\arraystretch", "\\ast", "\\asymp", "\\backslash",
                            "\\bar", "\\baselineskip", "\\baselinestretch",
                            "\\baselineskip", "\\nonumber", "\\beta",
                            "\\bigcap", "\\bigcirc", "\\bigcup", "\\bigodot",
                            "\\bigoplus", "\\bigotimes", "\\bigtriangledown",
                            "\\bigtriangleup", "\\bigskip", "\\bigskipamount",
                            "\\bigsqcup", "\\biguplus", "\\bigvee", "\\bigwedge",
                            "\\bot", "\\bowtie", "\\Box", "\\breve", "\\bullet",
                            "\\cal", "\\cap", "\\cdot", "\\cdots", "\\check",
                            "\\chi", "\\circ", "\\clubsuit", "\\cong", "\\coprod",
                            "\\copyright", "\\cos", "\\cosh", "\\cot", "\\coth",
                            "\\csc", "\\cup", "\\d", "\\dag", "\\dagger",
                            "\\dashbox", "\\dashv", "\\ddag", "\\ddagger",
                            "\\ddot", "\\ddots", "\\deg", "\\delta", "\\det",
                            "\\diamond", "\\diamondsuit", "\\dim", "\\div"
                            ]}

},

// Syntax model (optional)
"Syntax"                    : {

    "latex"                    : "char | symbol | keyword"

},

// what to parse and in what order
// an array i.e ["py"], instead of single token i.e "py", is a shorthand for an "ngram"-type syntax token (for parser use)
"Parser"                    : [ ["latex"] ]

};
global.constants = {
  latex_grammar: latex_grammar
}
