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
	var templateUrl = chrome.extension.getURL("pessoas.mustache");

	var novaUrl = chrome.extension.getURL("images/no_pic.jpg");

	
	jQuery.get(templateUrl, function(templatePessoas) {
		var htmlPessoas = renderMoustache(templatePessoas, pessoas);
		var htmlAjustado = htmlPessoas.replace( /<img src=".*?">/g, '<img src="'+novaUrl+'">' );
		jQuery(container).append(htmlAjustado);
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
