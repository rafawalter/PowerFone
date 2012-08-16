// ==UserScript==
// @name            PowerFone
// @description     Lista Telefônica Aumentada
// @version			0.5
//
// @include         */cata*.htm*
// @include         */listel.nsf/pesquisa*
//
// @require  http://code.jquery.com/jquery-1.8.0.min.js
// @require  https://raw.github.com/janl/mustache.js/master/mustache.js
//
// ==/UserScript==

// less.watch();

jQuery('head').append('<link rel="stylesheet/less" type="text/css" href="./css/powerFone.less">');
jQuery('head').append('<script src="http://lesscss.googlecode.com/files/less-1.3.0.min.js" type="text/javascript">');

function obterPessoas() {
	var pessoas = [];

	jQuery('table table tr').each(function(index,element) {
		if (index != 0) pessoas.push(extrairPessoaDaLinha(element));
	});

	return {pessoas:pessoas};
};


function extrairPessoaDaLinha(linha) {
	var campos = jQuery(['nome', 'ramal', 'local', 'alocacao', 'profile']);

	var valores = jQuery('td', linha).map(function(index,element){
		return jQuery(element).text();
	});

	var novaPessoa = {};	
	campos.each(function(index,element) {
		novaPessoa[element] = valores[index];
	});
	
	return novaPessoa;
};


function renderPessoas(container, pessoas) {
	jQuery.get('pessoas.moustache', function(templatePessoas) {
		var htmlPessoas = renderMoustache(templatePessoas, pessoas);
		jQuery(container).append(htmlPessoas);
	});
};


function renderMoustache(template, jsonData) {
	return Mustache.render(template, jsonData);
};


jQuery(function() {
	var pessoas = obterPessoas();
	jQuery('form > table > tbody > tr:nth-child(2)').after('<tr><td colspan=6 id="cartoes"></td></tr>');
	renderPessoas('#cartoes', pessoas);
});
