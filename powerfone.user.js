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


var powerFoneLessUrl = chrome.extension.getURL("css/powerFone.less");

jQuery('head').append('<link rel="stylesheet/less" type="text/css" href="'+powerFoneLessUrl+'">');


jQuery('table table tr a[href]').each(function (index, element) {
    console.log(element);
    var url = $(element).attr('href');
    jQuery.get(url, function(data) {

        jQuery(element).qtip({
            content: data,
            style: {
                tip: true,
                border: {
                    width: 0,
                    radius: 4
                },
                name: 'light',
                width: 570
            }
        });
    });
});


$('table table tr a[href]')
jQuery('#result').load('ajax/test.html');

function obterPessoas() {
	var pessoas = [];

	jQuery('table table tr').each(function(index,element) {
		if (index != 0) pessoas.push(extrairPessoaDaLinha(element));
	});

	return {pessoas:pessoas};
};


function obterPessoa() {
    var celula = jQuery("form[name='_Pessoa'] > table > tbody > tr:nth-child(3) > td:nth-child(2)");
    return extrairPessoaDaCelula(celula);
};


function extrairPessoaDaCelula(celula) {
	var campos = jQuery(['nome','matrícula', 'userid', 'lotacao', 'cargo', 'empresa', 'local', 'ramais']);

    var valores = jQuery('b', celula).map(function(index,element){
        return jQuery(element).text();
    });

    var novaPessoa = {};
    campos.each(function(index,element) {
        novaPessoa[element] = valores[index];
    });

    return novaPessoa;
};


function extrairPessoaDaLinha(linha) {
    var campos = jQuery(['nome', 'ramais', 'local', 'lotação', 'profile']);

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
	var templateUrl = chrome.extension.getURL("pessoas.mustache");

	var baseUrlInterna = chrome.extension.getURL("images");

	
	jQuery.get(templateUrl, function(templatePessoas) {
		var htmlPessoas = renderMoustache(templatePessoas, pessoas);
        console.log(pessoas, htmlPessoas);
		var htmlAjustado = htmlPessoas.replace( /<img src="(.*?)">/g, '<img src="'+baseUrlInterna+'/no_pic.jpg">' );
		jQuery(container).append(htmlAjustado);
	});
};


function renderMoustache(template, jsonData) {
	return Mustache.render(template, jsonData);
};


jQuery(function() {
	var pessoas = obterPessoas();
    if (pessoas.pessoas.length == 0) {
        var pessoa = obterPessoa();
        console.log(pessoa);
        pessoas.pessoas.push(pessoa);
    };
	jQuery('form > table > tbody > tr:nth-child(2)').after('<tr><td colspan=6 id="cartoes"></td></tr>');
	renderPessoas('#cartoes', pessoas);
});
