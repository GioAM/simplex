$("#calcular").click(calcular);
var dados = []
var casasDecimais = 3;

function Pivo(x, y, valor){
	this.x = x;
	this.y = y;
	this.valor = valor;
}

function calcular(){
	var dados = montarDados();
	var pivo = calcularPivo(dados);
	dados = calcularNovaMatriz(dados, pivo);
	var pivo = calcularPivo(dados);
	calcularNovaMatriz(dados, pivo);
}

function montarDados(){
	var matriz = [];
	var fila = [];

	var funcao_x1 = parseInt(-$("#funcao_x1").val());
	var funcao_x2 = parseInt(-$("#funcao_x2").val());
	fila.push(1, funcao_x1, funcao_x2, 0, 0, 0);
	matriz.push(fila);

	fila = []
	var res1_x1 = parseInt($("#res1_x1").val());
	var res1_x2 = parseInt($("#res1_x2").val());
	var res1_b = parseInt($("#res1_b").val());
	fila.push(0, res1_x1, res1_x2, 1, 0, res1_b);
	matriz.push(fila);

	fila = []
	var res2_x1 = parseInt($("#res2_x1").val());
	var res2_x2 = parseInt($("#res2_x2").val());
	var res2_b = parseInt($("#res2_b").val());
	fila.push(0, res2_x1, res2_x2, 0, 1, res2_b);
	matriz.push(fila);

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
	console.log(novaMatriz);
	return novaMatriz;
}

function desenharMatriz(dados){
	for(var i = 0; i < dados.length; i++){
		var fila = []
		if(i == pivo.y){
			novaMatriz.push(nlp);
		}else{
			dados[i].forEach(function (value, index) {
				console.log(-dados[i][pivo.x]);
				console.log(value);
				console.log(nlp[index]);
				var novoValor = (nlp[index] * -dados[i][pivo.x]) + value;
				fila.push(novoValor);
			});
			novaMatriz.push(fila);
		}
	}
	return novaMatriz;
}