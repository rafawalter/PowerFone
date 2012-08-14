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


function renderPessoas(pessoas) {
	var templatePessoas = '{{#pessoas}}<div class="cartao"><div><img src="./images/no_pic.jpeg"></div><div class="informacao"><div class="principal">{{nome}}</div><div class="secundaria">{{alocacao}}</div><div class="complementar"><div class="telefone">{{ramal}}</div> <div class="local">{{local}}</div></div></div>{{/pessoas}}';
	return renderMoustache(templatePessoas, pessoas);
};


function renderMoustache(template, jsonData) {
	return Mustache.render(template, jsonData);
};

$(function() {
	var pessoas = obterPessoas();
	var htmlCartoes = renderPessoas(pessoas);
	$('h1').after(htmlCartoes);
});