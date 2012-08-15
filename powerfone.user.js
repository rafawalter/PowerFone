// ==UserScript==
// @name            PowerFone
// @description     Lista Telefônica Aumentada
// @version			0.5
//
// @include         */cata*.htm*
// @include         */listel.nsf/pesquisa*
//
// @require  http://code.jquery.com/jquery-1.8.0.min.js
// @require  http://lesscss.googlecode.com/files/less-1.3.0.min.js
// @require  https://raw.github.com/janl/mustache.js/master/mustache.js
//
// ==/UserScript==

alert('carregado!');

// less.watch();

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
		jQuery(container).html(htmlPessoas);
	});
};


function renderMoustache(template, jsonData) {
	return Mustache.render(template, jsonData);
};


jQuery(function() {
	var pessoas = obterPessoas();
	jQuery('table tr:nth-child(2)').after(jQuery('<tr/>')).after(jQuery('<td/>', {
	    id: 'cartoes',
	    innerHTML: 'AQUI!',
	    colspan: 3,
    }));
	renderPessoas('#cartoes', pessoas);
});
