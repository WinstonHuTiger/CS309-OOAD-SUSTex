var Typo = require("./typo/typo.js");
var aff_loading = false;
var dic_loading = false;
var num_loaded = 0;
var dic_data;
var aff_data;
var typo;
if(!aff_loading) {
			aff_loading = true;
			var xhr_aff = new XMLHttpRequest();
			xhr_aff.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.aff", true);
			xhr_aff.onload = function() {
				if(xhr_aff.readyState === 4 && xhr_aff.status === 200) {
					aff_data = xhr_aff.responseText;
					num_loaded++;

					if(num_loaded == 2) {
						typo = new Typo("en_US", aff_data, dic_data, {
							platform: "any"
						});
					}
				}
			};
			xhr_aff.send(null);
		}
if(!dic_loading) {
	dic_loading = true;
	var xhr_dic = new XMLHttpRequest();
	xhr_dic.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.dic", true);
	xhr_dic.onload = function() {
		if(xhr_dic.readyState === 4 && xhr_dic.status === 200) {
			dic_data = xhr_dic.responseText;
			num_loaded++;
			if(num_loaded == 2) {
				typo = new Typo("en_US", aff_data, dic_data, {
					platform: "any"
				});
			}
		}
	};
	xhr_dic.send(null);
}
