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

var EXTENSION_BASE_URL = chrome.extension.getURL('');
var IMAGE_BASE_URL = chrome.extension.getURL("images");
var powerFoneLessUrl = chrome.extension.getURL("css/powerFone.less");
const NO_PIC = IMAGE_BASE_URL + '/no_pic.jpg';


jQuery('head').append('<link rel="stylesheet/less" type="text/css" href="'+powerFoneLessUrl+'">');

jQuery('form > table > tbody > tr:nth-child(2)').after('<tr><td colspan=6 id="cartoes"></td></tr>');

jQuery('table table tr a[href]').each(function (index, element) {

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

        var novaPessoa = extrairPessoaDaPerfil(data);
        renderPessoa('#cartoes', novaPessoa);
    });

});


function extrairPessoaDaPerfil(htmlDoPerfil) {
    var celulas = jQuery(htmlDoPerfil, "form[name='_Pessoa'] > table > tbody > tr:nth-child(3)");
    var celulaInformacoes = jQuery("td:nth-child(2)", celulas);
    var celulaFoto = jQuery("td:nth-child(1)", celulas);
    var pessoa = extrairPessoaDaCelula(celulaInformacoes);
    pessoa.foto = extrairFotoDaCelula(celulaFoto);
    return pessoa;
};


function obterPessoas() {
	var pessoas = [];

	jQuery('table table tr').each(function(index,element) {
		if (index != 0) pessoas.push(extrairPessoaDaLinha(element));
	});

	return {pessoas:pessoas};
};


function obterPessoa() {
    var celulas = jQuery("form[name='_Pessoa'] > table > tbody > tr:nth-child(3) > td:nth-child(2)");
    var celulaInformacoes = jQuery("form[name='_Pessoa'] > table > tbody > tr:nth-child(3) > td:nth-child(2)");
    var celulaFoto = jQuery("form[name='_Pessoa'] > table > tbody > tr:nth-child(3) > td:nth-child(1)");
    var pessoa = extrairPessoaDaCelula(celulaInformacoes);
    pessoa.foto = extrairFotoDaCelula(celulaFoto);
    return pessoa;
};

function extrairFotoDaCelula(celula) {
    return jQuery('img', celula).attr('src');
};

function extrairPessoaDaCelula(celula) {
	var campos = jQuery(['nome','matricula', 'userid', 'lotacao', 'cargo', 'funcao', 'empresa', 'local', 'ramal']);

    var valores = jQuery('b', celula).map(function(index,element){
        return jQuery(element).text();
    });

    var novaPessoa = {};
    novaPessoa.foto = NO_PIC;
    campos.each(function(index,element) {
        novaPessoa[element] = valores[index];
    });

    return novaPessoa;
};


function extrairPessoaDaLinha(linha) {
    var campos = jQuery(['nome', 'ramal', 'matricula', 'lotacao', 'userid', 'funcao']);

	var valores = jQuery('td', linha).map(function(index,element){
		return jQuery(element).text();
	});

	var novaPessoa = {};
    novaPessoa.foto = NO_PIC;

    campos.each(function(index,element) {
		novaPessoa[element] = valores[index];
	});
	
	return novaPessoa;
};


function renderPessoa(container, pessoa) {
    var templateUrl = chrome.extension.getURL("pessoa.mustache");

    jQuery.get(templateUrl, function(template) {
        var html = renderMoustache(template, pessoa);
        jQuery(container).append(html);
    });

};


function renderPessoas(container, pessoas) {

	var templateUrl = chrome.extension.getURL("pessoas.mustache");

	jQuery.get(templateUrl, function(templatePessoas) {
		var htmlPessoas = renderMoustache(templatePessoas, pessoas);
		jQuery(container).append(htmlPessoas);
	});
};


function renderMoustache(template, jsonData) {
	return Mustache.render(template, jsonData);
};

