function ScoreBoardGameControl (){
	var score = 0;
	var POINT_GAME = 10;
	var TEXT_SCORE = "Score : "

	var TOTAL_CORRECT = 10;
	var corrects = 0;

	this.updateScore =  function (){
		var scoreDiv = document.getElementById("score");
		scoreDiv.innerHTML =  TEXT_SCORE + score;
	}

	this.incrementScore =  function (){
		corrects++;
		score+= POINT_GAME;
		if (corrects ==  TOTAL_CORRECT){
			alert("Fim de Jogo! Sua Pontuação foi " + score);
		}
	}

	this.decrementScore =  function (){
		score-= POINT_GAME;
	}
}

function Card(picture){
	var FOLDER_IMAGES = 'img/'
	var IMAGE_QUESTION  = "parte-traz.png"
	this.picture = picture;
	this.visible = false;
	this.block = false;

	this.equals =  function (cardGame){
		if (this.picture.valueOf() == cardGame.picture.valueOf()){
			return true;
		}
		return false;
	}
	this.getPathCardImage =  function(){
		return FOLDER_IMAGES+picture;
	}
	this.getQuestionImage =  function(){
		return FOLDER_IMAGES+IMAGE_QUESTION;
	}
}

function ControllerLogicGame(){
	var firstSelected;
	var secondSelected;
	var block = false;
	var TIME_SLEEP_BETWEEN_INTERVAL = 1000;
	var eventController = this;

	this.addEventListener =  function (eventName, callback){
		eventController[eventName] = callback;
	};

	this.doLogicGame =  function (card,callback){
		if (!card.block && !block) {
			if (firstSelected == null){
				firstSelected = card;
				card.visible = true;
			}else if (secondSelected == null && firstSelected != card){
				secondSelected = card;
				card.visible = true;
			}

			if (firstSelected != null && secondSelected != null){
				block = true;
				var timer = setInterval(function(){
					if (secondSelected.equals(firstSelected)){
						firstSelected.block = true;
						secondSelected.block = true;
						eventController["correct"](); 
					}else{
						firstSelected.visible  = false;
						secondSelected.visible  = false;
						eventController["wrong"]();
					}        				  		
					firstSelected = null;
					secondSelected = null;
					clearInterval(timer);
					block = false;
					eventController["show"]();
				},TIME_SLEEP_BETWEEN_INTERVAL);
			} 
			eventController["show"]();
		};
	};

}

function CardGame (cards , controllerLogicGame,scoreBoard){
	var LINES = 4;
	var COLS  = 5;
	this.cards = cards;
	var logicGame = controllerLogicGame;
	var scoreBoardGameControl = scoreBoard;

	this.clear = function (){
		var game = document.getElementById("game");
		game.innerHTML = '';
	}

	this.show =  function (){
		this.clear();
		//scoreBoardGameControl.updateScore();
		var cardCount = 0;
		var game = document.getElementById("game");
		for(var i = 0 ; i < LINES; i++){
			for(var j = 0 ; j < COLS; j++){
				card = cards[cardCount++];
				var cardImage = document.createElement("img");
				if (card.visible){
					cardImage.setAttribute("src",card.getPathCardImage());
				}else{
					cardImage.setAttribute("src",card.getQuestionImage());
				}
				cardImage.onclick =  (function(position,cardGame) {
					return function() {
						card = cards[position];
						var callback =  function (){
							cardGame.show();
						};
						logicGame.addEventListener("correct",function (){
							scoreBoardGameControl.incrementScore();
							//scoreBoardGameControl.updateScore();
						});
						logicGame.addEventListener("wrong",function (){
							scoreBoardGameControl.decrementScore();
							//scoreBoardGameControl.updateScore();
						});

						logicGame.addEventListener("show",function (){
							cardGame.show();
						});

						logicGame.doLogicGame(card);
						
					};
				})(cardCount-1,this);

				game.appendChild(cardImage);
			}
			var br = document.createElement("br");
			game.appendChild(br);
		}
	}
}

function BuilderCardGame(){
	var pictures = new Array ('10.png','10.png',
		'1.png','1.png',
		'2.png','2.png',
		'3.png','3.png',
		'4.png','4.png',
		'5.png','5.png',
		'6.png','6.png',
		'7.png','7.png',
		'8.png','8.png',
		'9.png','9.png');

	this.doCardGame =  function (){
		shufflePictures();
		cards  = buildCardGame();
		cardGame =  new CardGame(cards, new ControllerLogicGame(), new ScoreBoardGameControl())
		cardGame.clear();
		return cardGame;
	}

	var shufflePictures = function(){
		var i = pictures.length, j, tempi, tempj;
		if ( i == 0 ) return false;
		while ( --i ) {
			j = Math.floor( Math.random() * ( i + 1 ) );
			tempi = pictures[i];
			tempj = pictures[j];
			pictures[i] = tempj;
			pictures[j] = tempi;
		}
	}

	var buildCardGame =  function (){
		var countCards = 0;
		cards =  new Array();
		for (var i = pictures.length - 1; i >= 0; i--) {
			card =  new Card(pictures[i]);
			cards[countCards++] = card;
		};
		return cards;
	}
}

function GameControl (){

}

GameControl.createGame = function(){
	var builderCardGame =  new BuilderCardGame();
	cardGame = builderCardGame.doCardGame();
	cardGame.show();
}


///Aritmetica

var pos = 0;
var correto = 0;
var test, progress, question, choice, choices, chA, chB, chC;

var questions = [
  ["Quanto é 2 * 7 ?", "24", "13", "14", "17", "C"],
  ["Quanto é 320 + 246?","525","566","656","584","B"],
  ["Quanto é 3345 - 275?", "3070", "3145", "3045", "3130", "A"],
  ["Quanto é 2500 / 125?", "25", "15", "20", "22", "C"],
  ["Quanto é 15 * 3 / 5?", "7", "9", "6", "5", "B"],
  ["Quanto é 3400 - 1655 + 345?", "2000", "2200", "1400", "2090", "D"],
  ["Quanto é 8 * 10 / 4?", "15", "25", "22", "20", "D"],
  ["Quanto é 18 * 4 * 3?", "254", "216", "232", "272", "B"],
  ["Quanto é 16 / 4 * 10", "40", "42", "36", "44", "A"],
  ["Quanto é 10500 + 1850 - 5400", "6500", "7200", "6950", "6250", "C"],
];

function get(x) {
  return document.getElementById(x);
}
function gerarQuestao() {
  test = get("aritmetica");

  if (pos >= questions.length) {
  	if(correto == 10 ){
	    test.innerHTML =
	      "<h2>Parabéns você acertou " +
	      "todas as " +
	      correto +
	      " questões</h2>" +
	      "<br>" +"<button onclick='gerarQuestao()'>Recomeçar</button>";
	}
	else if(correto > 7 && correto <=9){
	    test.innerHTML =
	      "<h2>Você está acima da média "+ "<br>" +
	      "continue se esforçando você acertou "+
	      correto +
	      " questões</h2>" +
	      "<br>" + "<button onclick='gerarQuestao()'>Recomeçar</button>";
	}
	else if(correto > 4 && correto <=7){
	    test.innerHTML =
	      "<h2>Você está na média "+
	      "acertou "+
	      correto +
	      " questões</h2>" +
	      "<br>" + "<button onclick='gerarQuestao()'>Recomeçar</button>";
	}
	else if(correto > 0 && correto <=4){
	    test.innerHTML =
	      "<h2>Você está precisando estudar mais " + "<br>"+
	      "acertou apenas "+
	      correto +
	      " questões</h2>" +
	      "<br>" + "<button onclick='gerarQuestao()'>Recomeçar</button>";
	}
	else if(correto == 0){
	    test.innerHTML =
	      "<h2>Você está precisando estudar mais " + "<br>"+
	      "errou todas as "+
	      correto +
	      " questões</h2>" +
	      "<br>" + "<button onclick='gerarQuestao()'>Recomeçar</button>";
	}
    pos = 0;
    correto = 0;
    return false;
  }

  get("progress").innerHTML =
    "Questão " + (pos + 1) + " de " + questions.length;
  question = questions[pos][0];
  chA = questions[pos][1];
  chB = questions[pos][2];
  chC = questions[pos][3];
  chD = questions[pos][4];
  test.innerHTML = "<h3>" + question + "</h3>";
  test.innerHTML +=
    "<input type='radio' name='choices' value='A'> " + chA + "<br>";
  test.innerHTML +=
    "<input type='radio' name='choices' value='B'> " + chB + "<br>";
  test.innerHTML +=
    "<input type='radio' name='choices' value='C'> " + chC + "<br>";
  test.innerHTML +=
    "<input type='radio' name='choices' value='D'> " + chD + "<br><br>";
  test.innerHTML += "<button onclick='verificarResposta()'>Enviar Resposta</button>";
}
function verificarResposta() {
  choices = document.getElementsByName("choices");
  for (var i = 0; i < choices.length; i++) {
    if (choices[i].checked) {
      choice = choices[i].value;
    }
  }
  if (choice == questions[pos][5]) {
    correto++;
  }
  pos++;
  gerarQuestao();
}

window.addEventListener("load", gerarQuestao, false);


///Jogo da Velha

var x = "img/x.png";

var o = "img/o.png";

var blank = "img/blank.jpg";

var pause = 0;
var all = 0;
var a = 0;
var b = 0;
var c = 0;
var d = 0;
var e = 0;
var f = 0;
var g = 0;
var h = 0;
var i = 0;
var temp="";
var ok = 0;
var cf = 0;
var choice=9;
var aRandomNumber = 0;
var comp = 0; 
var t = 0;
var wn = 0;
var ls = 0;
var ts = 0;

function help() {
	alert("Bem-Vindo ao jogo da velha ! Você joga com o X e o computador com o 0. Escolha o espaço que você queira colocar seu X clicando nele. O primeiro que conseguir fazer uma linha de 3 é o vencedor. Boa Sorte!!")
}

function logicOne() {
	if ((a==1)&&(b==1)&&(c==1)) all=1;
	if ((a==1)&&(d==1)&&(g==1)) all=1;
	if ((a==1)&&(e==1)&&(i==1)) all=1;
	if ((b==1)&&(e==1)&&(h==1)) all=1;
	if ((d==1)&&(e==1)&&(f==1)) all=1;
	if ((g==1)&&(h==1)&&(i==1)) all=1;
	if ((c==1)&&(f==1)&&(i==1)) all=1;
	if ((g==1)&&(e==1)&&(c==1)) all=1;
	if ((a==2)&&(b==2)&&(c==2)) all=2;
	if ((a==2)&&(d==2)&&(g==2)) all=2;
	if ((a==2)&&(e==2)&&(i==2)) all=2;
	if ((b==2)&&(e==2)&&(h==2)) all=2;
	if ((d==2)&&(e==2)&&(f==2)) all=2;
	if ((g==2)&&(h==2)&&(i==2)) all=2;
	if ((c==2)&&(f==2)&&(i==2)) all=2;
	if ((g==2)&&(e==2)&&(c==2)) all=2;
	if ((a != 0)&&(b != 0)&&(c != 0)&&(d != 0)&&(e != 0)&&(f != 0)&&(g != 0)&&(h != 0)&&(i != 0)&&(all == 0)) all = 3;
}

function logicTwo() {
	if ((a==2)&&(b==2)&&(c== 0)&&(temp=="")) temp="C";
	if ((a==2)&&(b== 0)&&(c==2)&&(temp=="")) temp="B";
	if ((a== 0)&&(b==2)&&(c==2)&&(temp=="")) temp="A";
	if ((a==2)&&(d==2)&&(g== 0)&&(temp=="")) temp="G";
	if ((a==2)&&(d== 0)&&(g==2)&&(temp=="")) temp="D";
	if ((a== 0)&&(d==2)&&(g==2)&&(temp=="")) temp="A";
	if ((a==2)&&(e==2)&&(i== 0)&&(temp=="")) temp="I";
	if ((a==2)&&(e== 0)&&(i==2)&&(temp=="")) temp="E";
	if ((a== 0)&&(e==2)&&(i==2)&&(temp=="")) temp="A";
	if ((b==2)&&(e==2)&&(h== 0)&&(temp=="")) temp="H";
	if ((b==2)&&(e== 0)&&(h==2)&&(temp=="")) temp="E";
	if ((b== 0)&&(e==2)&&(h==2)&&(temp=="")) temp="B";
	if ((d==2)&&(e==2)&&(f== 0)&&(temp=="")) temp="F";
	if ((d==2)&&(e== 0)&&(f==2)&&(temp=="")) temp="E";
	if ((d== 0)&&(e==2)&&(f==2)&&(temp=="")) temp="D";
	if ((g==2)&&(h==2)&&(i== 0)&&(temp=="")) temp="I";
	if ((g==2)&&(h== 0)&&(i==2)&&(temp=="")) temp="H";
	if ((g== 0)&&(h==2)&&(i==2)&&(temp=="")) temp="G";
	if ((c==2)&&(f==2)&&(i== 0)&&(temp=="")) temp="I";
	if ((c==2)&&(f== 0)&&(i==2)&&(temp=="")) temp="F";
	if ((c== 0)&&(f==2)&&(i==2)&&(temp=="")) temp="C";
	if ((g==2)&&(e==2)&&(c== 0)&&(temp=="")) temp="C";
	if ((g==2)&&(e== 0)&&(c==2)&&(temp=="")) temp="E";
	if ((g== 0)&&(e==2)&&(c==2)&&(temp=="")) temp="G";
}

function logicThree() {
	if ((a==1)&&(b==1)&&(c==0)&&(temp=="")) temp="C";
	if ((a==1)&&(b==0)&&(c==1)&&(temp=="")) temp="B";
	if ((a==0)&&(b==1)&&(c==1)&&(temp=="")) temp="A";
	if ((a==1)&&(d==1)&&(g==0)&&(temp=="")) temp="G";
	if ((a==1)&&(d==0)&&(g==1)&&(temp=="")) temp="D";
	if ((a==0)&&(d==1)&&(g==1)&&(temp=="")) temp="A";
	if ((a==1)&&(e==1)&&(i==0)&&(temp=="")) temp="I";
	if ((a==1)&&(e==0)&&(i==1)&&(temp=="")) temp="E";
	if ((a==0)&&(e==1)&&(i==1)&&(temp=="")) temp="A";
	if ((b==1)&&(e==1)&&(h==0)&&(temp=="")) temp="H";
	if ((b==1)&&(e==0)&&(h==1)&&(temp=="")) temp="E";
	if ((b==0)&&(e==1)&&(h==1)&&(temp=="")) temp="B";
	if ((d==1)&&(e==1)&&(f==0)&&(temp=="")) temp="F";
	if ((d==1)&&(e==0)&&(f==1)&&(temp=="")) temp="E";
	if ((d==0)&&(e==1)&&(f==1)&&(temp=="")) temp="D";
	if ((g==1)&&(h==1)&&(i==0)&&(temp=="")) temp="I";
	if ((g==1)&&(h==0)&&(i==1)&&(temp=="")) temp="H";
	if ((g==0)&&(h==1)&&(i==1)&&(temp=="")) temp="G";
	if ((c==1)&&(f==1)&&(i==0)&&(temp=="")) temp="I";
	if ((c==1)&&(f==0)&&(i==1)&&(temp=="")) temp="F";
	if ((c==0)&&(f==1)&&(i==1)&&(temp=="")) temp="C";
	if ((g==1)&&(e==1)&&(c==0)&&(temp=="")) temp="C";
	if ((g==1)&&(e==0)&&(c==1)&&(temp=="")) temp="E";
	if ((g==0)&&(e==1)&&(c==1)&&(temp=="")) temp="G";
}

function clearOut() {
	document.game.you.value="0";
	document.game.computer.value="0";
	document.game.ties.value="0";
}

function checkSpace() {
	if ((temp=="A")&&(a==0)) {
		ok=1;
		if (cf==0) a=1;
		if (cf==1) a=2;
	}
	if ((temp=="B")&&(b==0)) {
		ok=1;
		if (cf==0) b=1;
		if (cf==1) b=2;
	}
	if ((temp=="C")&&(c==0)) {
		ok=1;
		if (cf==0) c=1;
		if (cf==1) c=2;
	}
	if ((temp=="D")&&(d==0)) {
		ok=1;
		if (cf==0) d=1;
		if (cf==1) d=2;
	}
	if ((temp=="E")&&(e==0)) {
		ok=1;
		if (cf==0) e=1;
		if (cf==1) e=2;
	}
	if ((temp=="F")&&(f==0)) {
		ok=1
		if (cf==0) f=1;
		if (cf==1) f=2;
	}
	if ((temp=="G")&&(g==0)) {
		ok=1
		if (cf==0) g=1;
		if (cf==1) g=2;
	}
	if ((temp=="H")&&(h==0)) {
		ok=1;
		if (cf==0) h=1;
		if (cf==1) h=2;
	}
	if ((temp=="I")&&(i==0)) {
		ok=1;
		if (cf==0) i=1; 
		if (cf==1) i=2; 
	}
}

function yourChoice(chName) {
	pause = 0;
	if (all!=0) ended();
	if (all==0) {
		cf = 0;
		ok = 0;
		temp=chName;
		checkSpace();
		if (ok==1) {
			document.images[chName].src = x;
		}
		if (ok==0)taken();
			process();
		if ((all==0)&&(pause==0)) myChoice();
   }
}

function taken() {
	alert("Este espaço já está ocupado, por favor escolha outro.")
	pause=1;
}

function myChoice() {
	temp="";
	ok = 0;
	cf=1;
	logicTwo();
	logicThree();
	checkSpace();
	while(ok==0) {
		aRandomNumber=Math.random()
		comp=Math.round((choice-1)*aRandomNumber)+1;
		if (comp==1) temp="A";
		if (comp==2) temp="B";
		if (comp==3) temp="C";
		if (comp==4) temp="D";
		if (comp==5) temp="E";
		if (comp==6) temp="F";
		if (comp==7) temp="G";
		if (comp==8) temp="H";
		if (comp==9) temp="I";
		checkSpace();
	}
	document.images[temp].src= o;
	process();
}

function ended() {
	alert("O jogo acabou, para jogar novamente clique no botão Jogar Denovo.")
}

function process() {
	logicOne();
	if (all==1){ alert("Você ganhou, parabéns!"); wn++; }
	if (all==2){ alert("Te peguei! Eu venci!"); ls++; }
	if (all==3){ alert("Empate não pega mal nem pra mim nem pra você. Vamos jogar denovo?"); ts++; }
	if (all!=0) {
		document.game.you.value = wn;
		document.game.computer.value = ls;
		document.game.ties.value = ts;
   	}
}

function playAgain() {
	if (all==0) {
		if(confirm("Quer desistir desse jogo?")) reset();
	}
	if (all>0) reset();
}

function reset() {
	all = 0;
	a = 0;
	b = 0;
	c = 0;
	d = 0;
	e = 0;
	f = 0;
	g = 0;
	h = 0;
	i = 0;
	temp="";
	ok = 0;
	cf = 0;
	choice=9;
	aRandomNumber = 0;
	comp = 0; 
	document.images.A.src= blank;
	document.images.B.src= blank;
	document.images.C.src= blank;
	document.images.D.src= blank;
	document.images.E.src= blank;
	document.images.F.src= blank;
	document.images.G.src= blank;
	document.images.H.src= blank;
	document.images.I.src= blank;
	if (t==0) { t=2; myChoice(); }
	t--;
}