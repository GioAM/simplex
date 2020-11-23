$("#calcular").click(calcular);
$("#estrutura").click(montarEstrutura);
$('[data-toggle="tooltip"]').tooltip()
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
	while(tem_negativos(dados[0]) && iteracoes < 10){
		var pivo = calcularPivo(dados);
		dados = calcularNovaMatriz(dados, pivo);
		desenharMatriz(dados);
		informacoes(dados);
	}
}

function montarEstrutura(){
	variaveis = parseInt($("#variaveis").val());
	restricoes = parseInt($("#restricoes").val());
	if($("#variaveis").val() != "" && $("#restricoes").val() != ""){
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
	                <input type="number" class="form-control" id="x${i}" placeholder="" value="">
	            </div>`);
		}
		var divisao = 2;
		if(variaveis < 5){
			divisao = parseInt(12/(variaveis + 1));
		}
		$("#box_estrutura").append("<h5 >Sujeito a:</h5>")
		for(var i = 1; i <= restricoes; i++){
			$("#box_estrutura").append(`<div class='row' id='restricao_${i}'></div>`)
			for(var j = 1; j <= variaveis; j++){
				$("#restricao_" + i).append(`
					<div class='col-md-${divisao} mb-3'>
		                <label for='firstName'>x${j}</label>
		                <input type="number" class="form-control" id="restricao_${i}_x${j}" placeholder="" value="">
		            </div>`);
			}
			$("#restricao_" + i).append(`
				<div class='col-md-${divisao} mb-3'>
	                <label for='firstName'>b</label>
	                <= <input type="number" class="form-control" id="restricao_${i}_b" placeholder="" value="">
	            </div>`);
		}
		atualizar_labels();
	}
}
	

function montarDados(){
	var matriz = [];
	var fila = [];
	fila.push(1)
	for(var i = 1; i <= variaveis; i++){
		var valor = 0;
		if($("#x" + i).val() != ""){
			valor = -parseInt($("#x" + i).val());
		}
		fila.push(valor);
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
			var valor = 0;
			if($(`#restricao_${i}_x${j}`).val() != ""){
				valor = parseInt($(`#restricao_${i}_x${j}`).val());
			}
			fila.push(valor);
		}
		for(var j = 1; j <= restricoes; j++){
			if(j == i){
				fila.push(1)
			}else{
				fila.push(0);
			}
		}
		var valorb = 0;
		if($(`#restricao_${i}_b`).val() != ""){
			valorb = parseInt($(`#restricao_${i}_b`).val());
		}
		fila.push(valorb);
		matriz.push(fila);
	}
	return matriz;
}

function calcularPivo(dados){
	var x = 0;
	var y = 0;
	var menorValor = 99999;

	dados[0].forEach(function (value, index) {
		if(value < menorValor && value < 0){
			menorValor = value;
			x = index;
		}
	}); 

	menorValor = 99999;
	for(var i = 1; i < dados.length; i++){
		var total = dados[i][dados[i].length-1]/dados[i][x];
		if(total < menorValor && total >= 0){
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
		$("#resultado").append("<h5>Tabela Inicial </h5>");
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
	for(var o = 0; o <= array.length; o++){
		var value = array[o];
		if(value < 0){
			tem_negativos = true;
		}
	}
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
	$(`#informacoes_${iteracoes} tbody`).append(`<tr class="vb"><th scope="row"> Variáveis básicas  
			<span data-toggle="tooltip" title="Colunas com valores 1 e 0 (multiplica-se o 1 pelo valor de b).">
				<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-info-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
					<path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
					<circle cx="8" cy="4.5" r="1"/>
				</svg>
			</span>
		</th></tr>`);
	for (var [key, value] of vb) {
	  $(`#informacoes_${iteracoes} tbody .vb`).append(`<td>${key} = ${value}</td>`);
	}
	$(`#informacoes_${iteracoes} tbody`).append(`<tr class="vnb"><th scope="row"> Variáveis não básicas 
			<span data-toggle="tooltip" title="Colunas da linha Z que não estão zeradas (Para zerar seus valores, seu conteúdo deve ser 0).">
				<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-info-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
					<path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
					<circle cx="8" cy="4.5" r="1"/>
				</svg>
			</span>
		</th></tr>`);
	for (var [key, value] of vnb) {
	  $(`#informacoes_${iteracoes} tbody .vnb`).append(`<td>${key} = ${value}</td>`);
	}

	if(tem_negativos(dados[0])){
		$(`#informacoes_${iteracoes} tbody`).append(`<tr class="solucao"><th scope="row"> Solução não ótima
			<span data-toggle="tooltip" title="A solução não é ótima, precisa ser recalculada (Para ser ótima, todos os valores de Z devem ser positivos).">
				<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-info-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
					<path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
					<circle cx="8" cy="4.5" r="1"/>
				</svg>
			</span>
		</th></tr>`);
	}else{
		$(`#informacoes_${iteracoes} tbody`).append(`<tr class="solucao"><th scope="row"> Solução ótima 
			<span data-toggle="tooltip" title="Esta solução é ótima não precisa recalcular a tabela!">
				<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-info-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
					<path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
					<circle cx="8" cy="4.5" r="1"/>
				</svg>
			</span>
		</th></tr>`);
	}
	$(`#informacoes_${iteracoes} tbody .solucao`).append(`<td>Z = ${dados[0][size-1]}</td>`);

	$('[data-toggle="tooltip"]').tooltip()
}