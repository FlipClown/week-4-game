function reset() {
	window.gameObj = {

		attackOccured: false,
		winsOccured: false,
		lossOccured: false,
		gameOver: false,

		characterArrayList: [

		{
			name: "Son Goku",
			visual: "assets/images/Goku.jpg",
			healthPoints: 250,
			attackPower: 20,
			counterAttackPower: 30,

		},
		{
			name: "Son Gohan",
			visual: "assets/images/Gohan.jpg",
			healthPoints: 200,
			attackPower: 30,
			counterAttackPower: 25,
		},
		{
			name: "Vegeta",
			visual: "assets/images/Vegeta.jpg",
			healthPoints: 240,
			attackPower: 25,
			counterAttackPower: 35,
		},
		{
			name: "Trunks",
			visual: "assets/images/Trunks.jpg",
			healthPoints: 300,
			attackPower: 15,
			counterAttackPower: 20,
		},
		{
			name: "Freeza",
			visual: "assets/images/Freeza.jpg",
			healthPoints: 175,
			attackPower: 50,
			counterAttackPower: 75,
		},
		{
			name: "Goku Black",
			visual: "assets/images/Black.jpg",
			healthPoints: 230,
			attackPower: 40,
			counterAttackPower: 50,
		}
		],

		gameStart: true,
		yourCharacter: null,
		currentEnemy: null,
		previouslyFought: [],
		yourCurrentAttackPower: null,
		winOccured: false,

		battleSoundsArray: ["assets/audio/beam.mp3", "assets/audio/blast.mp3", "assets/audio/mediumkick.mp3", "assets/audio/mediumpunch.mp3", "assets/audio/strongkick.mp3", "assets/audio/strongpunch.mp3", ],
		characterSelectSound: "assets/audio/teleport.mp3",

		battleSoundPick: function() {
			return this.battleSoundsArray[Math.floor(Math.random() * this.battleSoundsArray.length)];
		},
	}
};

$(document).ready(function() {
	reset();
	var audioElement = document.createElement("audio");
	audioElement.autoplay = true;
	audioElement.loop = true;
	audioElement.setAttribute("src", "assets/audio/Wild Soul.mp3");

	$("myModal").modal("show");

	function render() {
		var $charList = $("#characterList");
		var $enemyList = $("enemyList");
		var $yourCharacter = $("#yourCharacter");
		var $attackText = $("#attackText");
		var $yourEnemy = $("#yourEnemy");
		var $winText = $("#attackText");
		var $lossText = $("#attackText");
		var $gameOver = $("#gameOver");
		var $fighterText = $("#attackText");
		
		var $charTemplate = _.template($("#characterTmpl").html());
		var $attackTemplate = _.template($("#attackTmpl").html());
		var $winTemplate = _.template($("#winTmpl").html());
		var $lossTemplate = _.template($("#lossTmpl").html());
		var $fighterTemplate = _.template($("#fighterTmpl").html());

		var charHtml = "";
		$yourCharacter.html("");
		$yourEnemy.html("");
		$attackText.html("");
		$gameOver.html("");

		var listBg = gameObj.yourCharacter ? "bg-black" : "bg-white";

		gameObj.characterArrayList.forEach(function(character, index) {
			charHtml = charHtml + $charTemplate({index: index, background: listBg, character: character});
		});
		if (gameObj.yourCharacter) {
			$yourCharacter.html($charTemplate({index: 0, background: "bg-white", character: gameObj.yourCharacter}));

			$enemyList.html(charHtml);
			$charList.html("");
		} else {
			$charList.html(charHtml);
			$enemyList.html("");
		}
		if 	(gameObj.currentEnemy) {
			 $yourEnemy.html($charTemplate({index: 0, background: "bg-red", character: gameObj.currentEnemy}));
		}
		if	(gameObj.attackOccured) {
			 $attackText.html($attackTemplate({gameObj: gameObj}));
		}

		if (gameObj.winOccured) {
			$winText.html($winTemplate({lastOpponenet: gameObj.lastOpponenet}));

			$("#yourEnemy").empty(gameObj.currentEnemy);
		}

		if (gameObj.lossOccured) {
			$lossText.html($lossTemplate({gameObj: gameObj}));
		}

		if (gameObj.gameOver) {
			var b = $("<button>");
			b.addClass("btn-primary btn-lg");
			b.html("Fight Again?");
			reset();

			b.click(render);
			$("gameOver").append(b);
		}
		if (gameObj.fighter) {
			$fighterText.html($fighterTemplate({lastOpponent:gameObj.lastOpponent}));
			$("#yourEnemy").empty(gameObj.currentEnemy);

			var b = $("<button>");
			b.addClass("btn-primary btn-lg");
			b.html("Fight Again?");
			reset();

			b.click(render);
			$("#gameOver").append(b);
		}


	}

	$("#characterList").on("click", ".characterContainer", function(e) {
		audioElement.pause();

		var element =$(this);
		var charIndex = element.data("character-index");

		if (!gameObj.yourCharacter) {

			gameObj.yourCharacter = gameObj.characterArrayList.splice(charIndex, 1)[0];
			gameObj.yourCurrentAttackPower = gameObj.yourCharacter.attackPower;

		}

		render();

		var $audioCharacter = document.createElement("audio");
		$audioCharacter.setAttribute("src", gameObj.characterSelectSound);
		$audioCharacter.play();
	
});

	$("#enemyList").on("click", ".characterContainer", function(e) {
		var element = $(this);
		var charIndex = element.data("character-index");

		if (!gameObj.currentEnemy) {

			gameObj.winOccured = false;

			gameObj.attackOccured = false;
			gameObj.currentEnemy = gameObj.characterArrayList.splice(charIndex, 1)[0];
		}

		render();

		var $audioCharacter = document.createElement("audio");
		$audioCharacter.setAttribute("src", gameObj.characterSelectSound);
		$audioCharacter.play();
	});

	$("#attackBtn").on("click", function(e) {

		if (!gameObj.yourCharacter || !gameObj.currentEnemy) {
			$("#attackText").html("No enemy. Choose an opponent!")
			return;
		}

		gameObj.attackOccured = true;
		var yourCharacter = gameObj.yourCharacter;
		var currentEnemy = gameObj.currentEnemy;

		gameObj.yourCurrentAttackPower = gameObj.yourCurrentAttackPower + yourCharacter.attackPower;
		currentEnemy.healthPoints = currentEnemy.healthPoints - gameObj.yourCurrentAttackPower;
		yourCharacter.healthPoints = yourCharacter.healthPoints - currentEnemy.counterAttackPower;
		console.log ("enemy health points:" + currentEnemy.healthPoints + "your health:" + yourCharacter.healthPoints);

		var $audioBattle = document.createElement("audio");
		$audioBattle.setAttribute("src", gameObj.battleSoundPick());
		$audioBattle.play();

		var win = (currentEnemy.healthPoints < 1 && yourCharacter.healthPoints > 1 ||
			((yourCharacter.healthPoints < 1 && currentEnemy.healthPoints < 1) &&
				(yourCharacter.healthPoints > currentEnemy.healthPoints))
			) ? true : false;

		var loss = (yourCharacter.healthPoints < 1 && currentEnemy.healthPoints > 1 ||
			((yourCharacter.healthPoints < 1 && currentEnemy.healthPoints < 1) &&
				(yourCharacter.healthPoints < currentEnemy.healthPoints))
			) ? true: false;

		if (win) {

			console.log("healthPoints of enemy should be greater than or equal to 0" + currentEnemy.healthPoints);
			if (gameObj.characterArrayList.length > 0){
				console.log(gameObj.characterArrayList.length);
				gameObj.winOccured = true;

				gameObj.lastOpponent = gameObj.currentEnemy;
				gameObj.currentEnemy = null;
			}

			else if (gameObj.characterArrayList.length == 0){
				console.log("Last Fighter Portion" + gameObj.characterArrayList.length);
				gameObj.lastOpponent = gameObj.currentEnemy;
				gameObj.attackOccured = false;
				gameObj.fighter = true;
			}
		}

		else if (loss){
			gameObj.lossOccured = true;
			console.log("Entered the loss occured section");
			gameObj.attackOccured = false;
			gameObj.gameOver = true;
		}
		render();
	});


});