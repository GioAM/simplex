$("#calcular").click(calcular);
$("#estrutura").click(montarEstrutura);

var dados = []
var labels = []
var casasDecimais = 3;
var variaveis = 0;
var restricoes = 0;
var iteracoes = 0;

function Pivo(x, y, valor){
	this.x = x;
	this.y = y;
	this.valor = valor;
}

function calcular(){
	iteracoes = 0; 
	$("#resultado").html("");
	var dados = montarDados();
	desenharMatriz(dados);	
	while(tem_negativos(dados[0])){
		var pivo = calcularPivo(dados);
		dados = calcularNovaMatriz(dados, pivo);
		desenharMatriz(dados);
		informacoes(dados);
	}
}

function montarEstrutura(){
	variaveis = parseInt($("#variaveis").val());
	restricoes = parseInt($("#restricoes").val());
	$("#box_estrutura").html("")
	$("#box_estrutura").append("<h5>Função Z=</h5>")
	$("#box_estrutura").append("<div class='row' id='funcao'></div>")
	var divisao = 2;
	if(variaveis < 6){
		divisao = parseInt(12/variaveis);
	}
	for(var i = 1; i <= variaveis; i++){
		$("#funcao").append(`
			<div class='col-md-${divisao} mb-3'>
                <label for='firstName'>x${i}</label>
                <input type="text" class="form-control" id="x${i}" placeholder="" value="">
            </div>`);
	}
	var divisao = 2;
	if(variaveis < 5){
		divisao = parseInt(12/(variaveis + 1));
	}
	$("#box_estrutura").append("<h5>Sujeito a:</h5>")
	for(var i = 1; i <= restricoes; i++){
		$("#box_estrutura").append(`<div class='row' id='restricao_${i}'></div>`)
		for(var j = 1; j <= variaveis; j++){
			$("#restricao_" + i).append(`
				<div class='col-md-${divisao} mb-3'>
	                <label for='firstName'>x${j}</label>
	                <input type="text" class="form-control" id="restricao_${i}_x${j}" placeholder="" value="">
	            </div>`);
		}
		$("#restricao_" + i).append(`
			<div class='col-md-${divisao} mb-3'>
                <label for='firstName'>b</label>
                <= <input type="text" class="form-control" id="restricao_${i}_b" placeholder="" value="">
            </div>`);
	}
	atualizar_labels();
}
	

function montarDados(){
	var matriz = [];
	var fila = [];
	fila.push(1)
	for(var i = 1; i <= variaveis; i++){
		fila.push(-parseInt($("#x" + i).val()));
	}
	for(var i = 1; i <= restricoes; i++){
		fila.push(0);
	}
	fila.push(0);
	matriz.push(fila);
	
	for(var i = 1; i <= restricoes; i++){
		fila = []
		fila.push(0);
		for(var j = 1; j <= variaveis; j++){
			fila.push(parseInt($(`#restricao_${i}_x${j}`).val()));
		}
		for(var j = 1; j <= restricoes; j++){
			if(j == i){
				fila.push(1)
			}else{
				fila.push(0);
			}
		}
		fila.push(parseInt($(`#restricao_${i}_b`).val()));
		matriz.push(fila);
	}
	return matriz;
}

function calcularPivo(dados){
	var x = 0;
	var y = 0;
	var menorValor = 99999;

	dados[0].forEach(function (value, index) {
		if(value < menorValor){
			menorValor = value;
			x = index;
		}
	}); 

	menorValor = 99999;
	for(var i = 1; i < dados.length; i++){
		var total = dados[i][dados[i].length-1]/dados[i][x];
		if(total < menorValor){
			menorValor = total;
			y = i;
		}
	}

	var pivo = new Pivo(x, y, dados[y][x]);
	console.log(pivo);
	return pivo; 
}

function calcularNovaMatriz(dados, pivo){
	var nlp = [];
	var novaMatriz = [];


	dados[pivo.y].forEach(function (value, index) {
		var valorPivo = value/pivo.valor;
		nlp.push(parseFloat(valorPivo.toFixed(casasDecimais)));
	});

	for(var i = 0; i < dados.length; i++){
		var fila = []
		if(i == pivo.y){
			novaMatriz.push(nlp);
		}else{
			dados[i].forEach(function (value, index) {
				var novoValor = (nlp[index] * -dados[i][pivo.x]) + value;
				fila.push(parseFloat(novoValor.toFixed(casasDecimais)));
			});
			novaMatriz.push(fila);
		}
	}
	return novaMatriz;
}

function desenharMatriz(dados){
	if(iteracoes == 0){
		$("#resultado").append("<h5>Tabela Inicial</h5>");
	}else{
		$("#resultado").append(`<h5>Iteração ${iteracoes}</h5>`);
	}
	cabecalho();
	$(`#iteracao_${iteracoes}`).append(`<tbody></tbody>`);
	for(var i = 0; i < dados.length; i++){
		var label = "";
		if(i == 0){
			label = "Z";
		}else{
			label = "L" + i;
		}
		$(`#iteracao_${iteracoes} tbody`).append(`<tr id="iteracao_${iteracoes}_${i}"><th scope="row">${label}</th></tr>`);
		dados[i].forEach(function (value, index) {
			$(`#iteracao_${iteracoes}_${i}`).append(`<td>${value}</td>`);
		});
	}

	iteracoes++;
}
function cabecalho(){
	$("#resultado").append(`
		<table class="table table-bordered" id="iteracao_${iteracoes}">
    		<thead class="thead-light">
    			<tr>
    			</tr>
    		</thead>
  		</table>
		`);
	$(`#iteracao_${iteracoes} thead tr`).append(`<th scope="col">#</th>`);
	labels.forEach(function (value, index) {
		$(`#iteracao_${iteracoes} thead tr`).append(`<th scope="col">${value}</th>`);
	});
}
function tem_negativos(array){
	var tem_negativos = false;
	array.forEach(function (value, index) {
		if(value < 0){
			tem_negativos = true;
		}
	});
	return tem_negativos;
}
function atualizar_labels(){
	labels=[];
	labels.push("Z");
	for(var i = 1; i <= variaveis; i++){
		labels.push("x" + i);
	}
	for(var i = 1; i <= restricoes; i++){
		labels.push("xF" + i);
	}
	labels.push("b");;
}
function informacoes(dados){
	var vb = new Map();
	var vnb = new Map();
	var size = dados[0].length
	
	dados[0].forEach(function (value, index) {
		if(labels[index] != "Z" && labels[index] != "b"){
			if(value == 0){
				for(var i = 0; i < dados.length; i++){
					if(dados[i][index] > 0){
						vb.set(labels[index], dados[i][size-1]);
					}
				}
			}else{
				vnb.set(labels[index], 0);
			}
		}
	});
	$("#resultado").append(`
		<table class="table table-bordered" id="informacoes_${iteracoes}">
			<tbody>
			</tbody>
		</table>`);
	$(`#informacoes_${iteracoes} tbody`).append(`<tr class="vb"><th scope="row"> Variáveis básicas </th></tr>`);
	for (var [key, value] of vb) {
	  $(`#informacoes_${iteracoes} tbody .vb`).append(`<td>${key} = ${value}</td>`);
	}
	$(`#informacoes_${iteracoes} tbody`).append(`<tr class="vnb"><th scope="row"> Variáveis não básicas </th></tr>`);
	for (var [key, value] of vnb) {
	  $(`#informacoes_${iteracoes} tbody .vnb`).append(`<td>${key} = ${value}</td>`);
	}

	if(tem_negativos(dados[0])){
		$(`#informacoes_${iteracoes} tbody`).append(`<tr class="solucao"><th scope="row"> Solução não ótima </th></tr>`);
	}else{
		$(`#informacoes_${iteracoes} tbody`).append(`<tr class="solucao"><th scope="row"> Solução ótima </th></tr>`);
	}
	$(`#informacoes_${iteracoes} tbody .solucao`).append(`<td>Z = ${dados[0][size-1]}</td>`);
}