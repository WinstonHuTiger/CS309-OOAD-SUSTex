var concatenate = function concatenate(item, start) {
  let str = item.start;
  let tab = "";
  for (var y = 0; y < start; y++) {
    tab += "\t";
  }
  if (item.items) {
    for (var x = 0; x < item.items.length; x++) {
      str += "\n" + tab + "\t" + item.items[x];
    }
  }
  str += "\n" + tab + item.end;
  return str;
}

function html_escaper_entities( c )
{
    return '&' === c
        ? '&amp;'
        :(
        '<' === c
        ? '&lt;'
        : (
        '>' === c
        ? '&gt;'
        : (
        '"' === c
        ? '&quot;'
        : '&apos;'
        )))
    ;
}

var escaped_re = /([.*+?^${}()|[\]\/\\\-])/g,
    html_special_re = /[&"'<>]/g,
    de_html_special_re = /&(amp|lt|gt|apos|quot);/g,
    peg_bnf_special_re = /^([.!&\[\]{}()*+?\/|'"]|\s)/,
    default_combine_delimiter = "\\b",
    combine_delimiter = "(\\s|\\W|$)" /* more flexible than \\b */;

function esc_html( s, entities )
{
    return s.replace(html_special_re, entities ? html_escaper_entities : html_escaper);
}

function html_escaper( c )
{
    return "&#" + c.charCodeAt(0) + ";";
}

function autocomplete_renderer( elt, data, cmpl )
{
    var word = cmpl.name, type = cmpl.meta, p1 = cmpl.start, p2 = cmpl.end,
        padding = 5;
        console.log("HERE+", word.slice(p2))
    elt.innerHTML = [
        '<span class="cmg-autocomplete-keyword">',
        '<strong class="cmg-autocomplete-keyword-match">', esc_html( word.slice(p1,p2) ), '</strong>',
        esc_html( word.slice(p2) ), '</span>',
        new Array(1+padding).join('&nbsp;'),
        '<strong class="cmg-autocomplete-keyword-meta">', esc_html( type ), '</strong>',
        '&nbsp;'
    ].join('');
    // adjust to fit keywords
    elt.className = (elt.className&&elt.className.length ? elt.className+' ' : '') + 'cmg-autocomplete-keyword-hint';
    elt.style.position = 'relative'; //elt.style.boxSizing = 'border-box';
    elt.style.width = '100%'; elt.style.maxWidth = '120%';
}

function autocompleter(cm, options) {
  let cursor = cm.getCursor();
  let line = cursor.line;
  let token = cm.getTokenAt(cm.getCursor());
  let from = {
    line: line,
    ch: token.start
  };
  let to = {
    line: line,
    ch: token.end
  };
  let list = {
    from: from,
    list: [],
    to: to
  };
  for (var x = 0; x < global.constants.latex_autocomplete.length; x++) {
    let item = global.constants.latex_autocomplete[x];
    if (prefixMatch(item.start, token.string)) {
      let str = concatenate(item, token.start);
      list.list.push({
        text: str,
        name: item.name,
        meta: "",
        match: token.string,
        render: autocomplete_renderer,
        start: token.start,
        end: token.end
      });
    }
  }
  return list;
};

var prefixMatch = function prefixMatch(match, str) {
  if (str.length > match.length) {
    return false;
  } else {
    for (var x = 0; x < str.length; x++) {
      if (str[x] !== match[x]) {
        return false;
      }
    }
  }
  return true;
}
