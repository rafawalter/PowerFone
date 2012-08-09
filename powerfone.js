less.watch();

function obterPessoas() {
	return {pessoas:[
		{
			nome: "Fulano de Tal",
			ramal: "1234",
			local: "VL12 E34",
			profile: "/profiles/1234",	
		},{
			nome: "Zé das Couves",
			ramal: "4321",
			local: "VL21 E43",
			profile: "/profiles/4321",				
		}
	], };
};


function renderPessoas(pessoas) {
	var templatePessoas = '{{#pessoas}}<div class="cartao"><span><img src="./images/no_pic.jpeg"></span><span><div>{{nome}}</div><div>{{ramal}} - {{local}}</div></div>{{/pessoas}}';
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
