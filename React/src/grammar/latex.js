const latex_grammar = {

// prefix ID for regular expressions, represented as strings, used in the grammar
"RegExpID"                  : "RE::",

"Extra"                     : {

    "fold"                  : "indent"
},

// Style model
"Style"                     : {

     "char"                 : "char"
    ,"symbol"               : "symbol"
    ,"description"          : "description"
    ,"keyword"              : "keyword"
    ,"lb"                   : "lb"
    ,"rb"                   : "rb"
    ,"lc"                   : "lc"
    ,"rc"                   : "rc"
    ,"lp"                   : "lp"
    ,"rp"                   : "rp"
    ,"unknown"              : "unknown"
    ,"any"                  : "any"
    ,"str"                  : "str"
    ,"math"                 : "math"
    ,"test"                 : "test"
},

// Lexical model
"Lex"                       : {
    "def"                   : {"autocomplete":true,"tokens":[
                            "math", "displaymath", "toc", "section", "name",
                            "text", "amount", "author", "begin",
                            "length", "counter", "names", "environment",
                            "abstract", "array", "lrc", "center", "description",
                            "displaymath", "document", "enumerate", "eqnarray",
                            "eqnarray*", "equation", "figure", "figure*",
                            "flushleft", "flushright", "itemize", "list",
                            "labeling", "spacing", "minipage", "picture",
                            "vsize", "quotation", "quote", "tabbing", "table",
                            "table*", "tabular", "arg", "theorem", "titlepage",
                            "verbatim", "verse", "dwid", "numerator",
                            "denominator", "len", "filename", "ref", "file",
                            "formula", "dimen", "lhd", "rhd", "noc", "fmt",
                            "obj", "def", "envname", "cs", "sty", "modulus",
                            "positions", "stuff", "width", "height", "cc",
                            "footnote"
                            ]}
    ,"sequence"             : {"autocomplete":true,"tokens":[
                            "n", "size", "pos", "narg", "sectyp", "toctitle"
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
                            "\\dbltopfraction", "\\displaystyle",
                            "\\documentstyle", "\\dotfill", "\\doublerulesep",
                            "\\em", "\\encl", "\\end", "\\evensidemargin",
                            "\\fbox", "\\fboxrule", "\\fill",
                            "\\floatpagefraction", "\\floatsep", "\\flushbottom",
                            "\\fnsymbol", "\\footheight", "\\footnote",
                            "\\footnotemark", "\\footnotesep", "\\footnotesize",
                            "\\footskip", "\\footnotetext", "\\frac", "\\frame",
                            "\\framebox", "\\fussy", "\\glossary",
                            "\\glossaryentry", "\\headheight", "\\headsep",
                            "\\hfill", "\\hline", "\\hrulefill", "\\hspace",
                            "\\hspace", "\\huge", "\\Huge", "\\hyphenation",
                            "\\include", "\\includeonly", "\\index",
                            "\\indexentry", "\\indexspace", "\\input",
                            "\\intextsep", "\\it", "\\item", "\\itemindent",
                            "\\itemsep", "\\kill", "\\label", "\\labelwidth",
                            "\\labelsep", "\\large", "\\Large", "\\LARGE",
                            "\\LaTeX", "\\lefteqn", "\\leftmargin", "\\line",
                            "\\linebreak", "\\linethickness", "\\linewidth",
                            "\\listoffigures", "\\listoftables",
                            "\\listparindent", "\\makebox", "\\makeglossary",
                            "\\makeindex", "\\maketitle", "\\marginpar",
                            "\\marginparpush", "\\marginparsep",
                            "\\marginparwidth", "\\markboth", "\\markright",
                            "\\mbox", "\\medskip", "\\medskipamount", "\\month",
                            "\\multicolumn",  "\\multiput", "\\newcommand",
                            "\\cs", "\\newcounter", "\\newenvironment",
                            "\\newfont", "\\newlength", "\\nl", "\\newline",
                            "\\newpage", "\\newsavebox", "\\binname",
                            "\\newtheorem", "\\nofiles", "\\noindent",
                            "\\nolinebreak", "\\nonumber", "\\nopagebreak",
                            "\\normalmarginpar", "\\normalsize", "\\obeycr",
                            "\\oddsidemargin",  "\\onecolumn", "\\twocolumn",
                            "\\opening",  "\\oval", "\\pagebreak",
                            "\\pagenumbering", "\\pageref", "\\pagestyle",
                            "\\paragraph", "\\paragraph*", "\\parbox",
                            "\\parindent", "\\parsep", "\\parskip", "\\part",
                            "\\part*", "\\partopsep", "\\poptabs", "\\pushtabs",
                            "\\protect", "\\ps",  "\\pushtabs", "\\put",
                            "\\raggedbottom", "\\raggedleft", "\\raggedright",
                            "\\raisebox", "\\ref", "\\renewcommand",
                            "\\renewenvironment", "\\restorecr",
                            "\\reversemarginpar", "\\rightmargin", "\\rm",
                            "\\roman", "\\rule", "\\savebox", "\\binname",
                            "\\sbox", "\\sc", "\\scriptsize", "\\scriptstyle",
                            "\\scriptscriptstyle", "\\section", "\\section*",
                            "\\setcounter", "\\setlength", "\\settowidth",
                            "\\sf", "\\shortstack", "\\signature", "\\sl",
                            "\\sloppy", "\\small", "\\smallskip",
                            "\\smallskipamount", "\\stackrel", "\\stop",
                            "\\subparagraph", "\\subparagraph*", "\\subsection",
                            "\\subsubsection", "\\subsection*", "\\symbol",
                            "\\subsubsection*",
                            "\\tabbingsep", "\\tabcolsep", "\\tableofcontents",
                            "\\textfloatsep", "\\textfraction", "\\textheight",
                            "\\textstyle", "\\textwidth", "\\thanks",
                            "\\thicklines", "\\thinlines", "\\thinspace",
                            "\\thispagestyle", "\\tiny", "\\title", "\\today",
                            "\\topfraction", "\\topmargin", "\\topsep",
                            "\\topskip", "\\tt", "\\typein", "\\typeout",
                            "\\unboldmat", "\\unitlength", "\\usebox",
                            "\\usecounter", "\\value", "\\vector", "\\verb",
                            "\\verb*", "\\vfill", "\\vspace", "\\vspace*",
                            "\\year", "\\unboldmath", "\\fboxsep"
                            ]}
    ,"custom"               : "RE::/\\[0-9a-zA-Z]+/"
    ,"char"                 : "RE::/\\\\[!#$%&'()*+,-./:;<=>@\[\\\]^_{|}~ b]/"
    ,"symbol"               : {"autocomplete":false,"tokens":[
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
                            "\\diamond", "\\diamondsuit", "\\dim", "\\div",
                            "\\dot", "\\doteq", "\\downarrow", "\\ell",
                            "\\emptyset", "\\epsilon", "\\equiv", "\\eta",
                            "\\exists", "\\exp", "\\flat", "\\forall", "\\frown",
                            "\\gamma", "\\Gamma", "\\gcd", "\\ge", "\\geq",
                            "\\gets", "\\gg", "\\grave", "\\H", "\\hat",
                            "\\hbar", "\\heartsuit", "\\hom", "\\hookleftarrow",
                            "\\hookrightarrow", "\\i", "\\iff", "\\Im",
                            "\\imath", "\\in", "\\inf", "\\infty", "\\int",
                            "\\iota", "\\j", "\\jmath", "\\Join", "\\kappa",
                            "\\ker", "\\l", "\\L", "\\lambda", "\\Lambda",
                            "\\land", "\\langle", "\\lbrace", "\\lbrack",
                            "\\lceil", "\\ldots", "\\le", "\\leadsto", "\\left*",
                            "\\right*", "\\leftarrow", "\\Leftarrow",
                            "\\leftharpoondown", "\\leftharpoonup",
                            "\\leftrightarrow", "\\leq", "\\lfloor", "\\lg",
                            "\\lhd", "\\lim", "\\liminf", "\\limsup", "\\ll",
                            "\\ln", "\\lnot", "\\log", "\\longleftarrow",
                            "\\Longleftarrow", "\\longleftrightarrow",
                            "\\Longleftrightarrow", "\\longmapsto",
                            "\\longrightarrow", "\\Longrightarrow", "\\lor",
                            "\\lq", "\\mapsto", "\\max", "\\mho", "\\mid",
                            "\\min", "\\mit", "\\models", "\\mp", "\\mu",
                            "\\nabla", "\\natural", "\\ne", "\\nearrow", "\\neg",
                            "\\neq", "\\ni", "\\not", "\\notin", "\\nu",
                            "\\nwarrow", "\\o", "\\O", "\\odot", "\\oe", "\\OE",
                            "\\oint", "\\omega", "\\Omega", "\\ominus",
                            "\\oplus", "\\oslash", "\\otimes", "\\overbrace",
                            "\\overline", "\\owns", "\\P", "\\parallel",
                            "\\partial", "\\partopsep", "\\phi", "\\Phi", "\\pi",
                            "\\Pi", "\\pm", "\\pmod", "\\pounds", "\\Pr",
                            "\\prec", "\\preceq", "\\prime", "\\prod",
                            "\\propto", "\\psi", "\\rangle", "\\rbrace",
                            "\\rbrack", "\\rceil", "\\Re", "\\rfloor", "\\rhd",
                            "\\rho", "\\right*", "\\rightarrow", "\\Rightarrow",
                            "\\rightharpoondown", "\\rightharpoonup",
                            "\\rightleftharpoons", "\\rq", "\\S", "\\searrow",
                            "\\sec", "\\setminus", "\\sharp", "\\sigma", "\\sim",
                            "\\simeq", "\\sin", "\\sinh", "\\smallint",
                            "\\smile", "\\spadesuit", "\\sqcap", "\\sqcup",
                            "\\sqrt", "\\sqsubset", "\\sqsubseteq", "\\sqsupset",
                            "\\sqsupseteq", "\\ss", "\\star", "\\subset",
                            "\\subseteq", "\\succ", "\\succeq", "\\sum", "\\sup",
                            "\\supset", "\\supseteq", "\\surd", "\\swarrow",
                            "\\t", "\\tan", "\\tanh", "\\tau", "\\TeX",
                            "\\theta", "\\tilde", "\\times", "\\to", "\\top",
                            "\\triangle", "\\triangleleft", "\\triangleright",
                            "\\u", "\\underbrace", "\\underline", "\\unlhd",
                            "\\unrhd", "\\uparrow", "\\Uparrow", "\\updownarrow",
                            "\\Updownarrow", "\\uplus", "\\upsilon", "\\Upsilon",
                            "\\v", "\\varepsilon", "\\varphi", "\\varpi",
                            "\\varrho", "\\varsigma", "\\vartheta", "\\vdash",
                            "\\vdots", "\\vec", "\\vee", "\\vert", "\\Vert",
                            "\\wedge", "\\widehat", "\\widetilde", "\\wp",
                            "\\wr", "\\xi", "\\Xi", "\\zeta"
                            ]}
    ,"unknown"              : "RE::/[^\\\\)}\\]]*/"
    ,"lb"                   : "["
    ,"rb"                   : "]"
    ,"lc"                   : "("
    ,"rc"                   : ")"
    ,"lp"                   : "{"
    ,"rp"                   : "}"
    ,"any"                  : "RE::/[^\\n]*/"
    ,"math"                 : "RE::/[$].*[$]/"
    ,"description"          : "RE::/(math|displaymath|toc|section|name|text" +
                              "|amount|author|begin|length|counter|names" +
                              "|environment|abstract|array|lrc|center|description" +
                              "|document|enumerate|eqnarray|eqnarray*|equation" +
                              "|figure|figure*|flushleft|flushright|itemize" +
                              "|list|labeling|spacing|minipage|picture|vsize" +
                              "|quotation|quote|tabbing|table|table*|tabular" +
                              "|arg|theorem|titlepage|verbatim|verse|dwid" +
                              "|numerator|denominator|len|filename|ref|file" +
                              "|formula|dimen|lhd|rhd|noc|fmt|obj|def|envname" +
                              "|cs|sty|modulus|positions|stuff|width|height" +
                              "|cc|footnote|article|fancyhdr|extramarks|amsmath" +
                              "|amsthm|amsfonts|tikz|algorithm|algpseudocode" +
                              "|tikzpicture)(?=[)}\\]])/"
},

// Syntax model (optional)
"Syntax"                    : {

    "brackets"                 : "(lb def rb) | (lc def rc) | (lp def rp)",
    "latex"                    : "lb | math | keyword | char_str | description",
    "char_str"                 : "char latex",

},

// what to parse and in what order
// an array i.e ["py"], instead of single token i.e "py", is a shorthand for an "ngram"-type syntax token (for parser use)
"Parser"                    : [ ["latex"] ]

};
global.constants = {
  latex_grammar: latex_grammar
}
