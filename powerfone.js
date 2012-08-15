less.watch();

function obterPessoas() {
	var pessoas = [];

	$('tr').each(function(index,element) {if (index != 0) pessoas.push(extrairPessoaDaLinha(element));});
	console.log(pessoas);

	return {pessoas:pessoas};
};


function extrairPessoaDaLinha(linha) {
	var campos = $(['nome', 'ramal', 'local', 'alocacao', 'profile']);

	var valores = $('td', linha).map(function(index,element){
		return element.innerHTML;
	});

	var novaPessoa = {};	
	campos.each(function(index,element) {
		novaPessoa[element] = valores[index];
	});
	
	return novaPessoa;
};


function renderPessoas(container, pessoas) {
//	var templatePessoas = '<div>{{#pessoas}}<div class="cartao"><img src="./images/no_pic.jpeg"><div class="informacao"><div class="principal">{{nome}}</div><div class="secundaria">{{alocacao}}</div><div class="complementar"><div class="telefone">{{ramal}}</div> <div class="local">{{local}}</div></div><img src="./images/qrcode.png"></div>{{/pessoas}}</div>';
	$.get('pessoas.moustache', function(templatePessoas) {
		var htmlPessoas = renderMoustache(templatePessoas, pessoas);
		$(container).html(htmlPessoas);
	});
};


function renderMoustache(template, jsonData) {
	return Mustache.render(template, jsonData);
};


$(function() {
	var pessoas = obterPessoas();
	$('h1').after('<div id="cartoes">aqui!</div>');
	renderPessoas('#cartoes', pessoas);
});
