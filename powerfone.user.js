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

const powerFoneLessUrl = chrome.extension.getURL("css/powerFone.less");
const NO_PIC = chrome.extension.getURL("images/no_pic.png");


jQuery('head').append('<link rel="stylesheet/less" type="text/css" href="'+powerFoneLessUrl+'">');

jQuery('form > table > tbody > tr:nth-child(2)').after('<tr><td colspan=6 id="busca_cartoes""><input type="text" id="textoDaBusca"></td></tr><tr><td colspan=6 id="cartoes"></td></tr>');

jQuery('#textoDaBusca').keyup( function(event) {
    benchmark( mostrarApenasCartoesComTexto, event.target.value);
});

jQuery('#textoDaBusca').focus();


function benchmark( funcao, parametros ) {
    var inicio = Date.now();
    funcao(parametros);
    var fim = Date.now();
    console.log(funcao.name, fim - inicio, 'ms');
};


function mostrarApenasCartoesComTexto() {
    var textoDaBusca = event.target.value.toLowerCase();
    jQuery('.cartao').each(function(index, elemento) {
        var cartao = jQuery(elemento);
        var texto = cartao.text().toLowerCase();
        if (texto.indexOf(textoDaBusca) != -1) {
            cartao.show();
        } else {
            cartao.hide();
        };
    });
};



function fotoNaoEncontrada(element) {
	alert('fNE powerfone.user.js');
	jQuery(element).attr('src', NO_PIC);
};



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
	pessoa.semFoto = fotoNaoEncontrada;
    pessoa.iconeTelefone = chrome.extension.getURL('images/telefone.png');
    return pessoa;
};


function extrairFotoDaCelula(celula) {
    return jQuery('img', celula).attr('src');
};


function extrairPessoaDaCelula(celula) {
    var campos = jQuery('font[color="#0000ff"]', celula).map(function(index,element){
        return jQuery(element).text().toLowerCase().replace(/\//g, '_');
    });

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


function renderPessoa(container, pessoa) {
    var jadeTemplateUrl = chrome.extension.getURL("pessoa.jade");
    jQuery.get(jadeTemplateUrl, function(template) {
        var html = renderJade(template, pessoa);
        jQuery(container).append(html);
    });
};


function renderJade(template, jsonData) {
    var compiledTemplate = jade.compile(template, {});
    return compiledTemplate(jsonData);
};

