// ==UserScript==
// @name            PowerFone
// @description     Lista Telefônica Aumentada
//
// @include         */cata*.htm*
//
// ==/UserScript==

//alert('carregado!');

less.watch();

function obterPessoas() {
	var pessoas = [];

	jQuery('table table tr').each(function(index,element) {
		if (index != 0) pessoas.push(extrairPessoaDaLinha(element));
	});
	console.log(pessoas);

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
		$(container).html(htmlPessoas);
	});
};


function renderMoustache(template, jsonData) {
	return Mustache.render(template, jsonData);
};


$(function() {
	var pessoas = obterPessoas();
	jQuery('table tr:nth-child(2)').after(jQuery('<tr/>')).after(jQuery('<td/>', {
	    id: 'cartoes',
	    innerHTML: 'AQUI!',
	    colspan: 3,
    }));
	renderPessoas('#cartoes', pessoas);
});
