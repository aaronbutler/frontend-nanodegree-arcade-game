/*
This file exists to provide javascript functionality for the Frogger game.
In particular, it includes class definitions, some game-related event listeners,
and functions accessed by multiple objects.
With the exception of the handling of "PAUSE" this file does not provide game looping functionality.
That is handled by engine.js
-Created by Aaron Butler on 9/8/2015
*/

// Enemies our player must avoid
//This block contains variables and functions which can only be invoked by enemy activity
var Enemy = function() {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started

	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
	var pos = getEnemyDomainRandom();
	//console.log(pos);
	this.x = pos[0];
	this.y = pos[1];
	this.track = (this.y - 60) / 83;
	this.speed = Math.random() * 150;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	//console.log("enemy update: " + dt);
	this.x += dt * this.speed;
	if (this.x > 505) {
		this.x = -101;
	}
	for (var i = 0; i < 4; i++) {
		if (this.x >= playerRows[this.track + 1][i][0] - 90 && this.x < playerRows[this.track + 1][i + 1][0] + 5) {
			enemyOwnedPositions[this.track][i] = true;
		}

		else {
			enemyOwnedPositions[this.track][i] = false;
		}
	}

	if (this.x >= playerRows[this.track + 1][4][0] - 90) {
		enemyOwnedPositions[this.track][4] = true;
	}
	else {
		enemyOwnedPositions[this.track][4] = false;
	}

	if (player.curPosX > 0 && player.curPosX < 4) {
		checkCollision.call(player);
	}

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//EnemyDomain: 0,83 to 505,331; bug size is 101,171 counting transparent background
//first row starts at -101,60 and ends at 505,60
//second row starts at -101,143 and ends at 505,143
//third row starts at -101,226 and ends at 505,143
function getEnemyDomainRandom() {
	return [Math.floor(Math.random() * 606) - 101, 60 + (Math.floor((Math.random() * 3))) * 83];
}

//"resetEnemyPositions" would be a better name, this function declares that the enemy has control over 0 positions on the game board
recalcEnemyPositions = function() {
	//console.log(allEnemies);
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 5; j++) {
			enemyOwnedPositions[i][j] = false;
		}
	}
	//console.log(enemyOwnedPositions);
};
//end Enemy definition

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//This block contains variables and functions which can only be invoked by player activity
var Player = function() {
	this.sprite = 'images/char-boy.png';
	this.avatar = 0;
	this.x = playerRows[4][2][0];
	this.y = playerRows[4][2][1];
	this.curPosX = 4;
	this.curPosY = 2;
};

Player.prototype.update = function(dt) {
	//console.log("player update: "+dt);
	if (this.curPosX > 0 && this.curPosX < 4) {
		checkCollision.call(this);
	}

	//blue row means victory, and can only happen as a result of player activity
	if (this.curPosX === 0) {
		//console.log("You win!");
		this.reset();

		alert('You Win!');
		currentScore += 10;
		document.getElementById('current-score')
			.innerHTML = currentScore;
		allEnemies.push(new Enemy());
		recalcEnemyPositions();
	}
};

//draw the player avatar
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//sends player to middle of top green row
Player.prototype.reset = function() {
	this.x = playerRows[4][2][0];
	this.y = playerRows[4][2][1];
	this.curPosX = 4;
	this.curPosY = 2;
};

//Specifically, this is input related to moving around the game board.
//On large screens, "theKey" comes from the keyboard arrow keys.
//On small screens, "theKey" comes from a button.
Player.prototype.handleInput = function(theKey) {
	//console.log("Player input: "+theKey+", "+this.curPosX+", "+this.curPosY);
	if (!unpausefunction[0].paused) {
		switch (theKey) {
			case 'left':
				if (this.curPosY > 0) {
					this.curPosY -= 1;
					this.x = playerRows[this.curPosX][this.curPosY][0];
					this.y = playerRows[this.curPosX][this.curPosY][1];
				}
				break;

			case 'right':
				if (this.curPosY < 4) {
					this.curPosY += 1;
					this.x = playerRows[this.curPosX][this.curPosY][0];
					this.y = playerRows[this.curPosX][this.curPosY][1];
				}
				break;

			case 'up':
				if (this.curPosX > 0) {
					this.curPosX -= 1;
					this.x = playerRows[this.curPosX][this.curPosY][0];
					this.y = playerRows[this.curPosX][this.curPosY][1];
				}
				break;

			case 'down':
				if (this.curPosX < 5) {
					this.curPosX += 1;
					this.x = playerRows[this.curPosX][this.curPosY][0];
					this.y = playerRows[this.curPosX][this.curPosY][1];
				}
				break;
		}
	}
};
//end Player definition

//Creates and attaches user interaction objects and events
//Provides a place for optimization based on screen type
//i.e. not necessary to have button events when the buttons are hidden on large screens.
window.addEventListener('load', function(f) {
	// This listens for key presses and sends the keys to your
	// Player.handleInput() method. You don't need to modify this.
	document.addEventListener('keyup', function(e) {
		var allowedKeys = {
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};

		player.handleInput(allowedKeys[e.keyCode]);
	});

	//This subsection is for event handlers on the game navigation buttons on small screens.
	document.getElementById('up-btn')
		.addEventListener('click', function(e) {
			//console.log(e);
			player.handleInput('up');
		});
	document.getElementById('down-btn')
		.addEventListener('click', function(e) {
			//console.log(e);
			player.handleInput('down');
		});
	document.getElementById('left-btn')
		.addEventListener('click', function(e) {
			//console.log(e);
			player.handleInput('left');
		});
	document.getElementById('right-btn')
		.addEventListener('click', function(e) {
			//console.log(e);
			player.handleInput('right');
		});

	//Pause handling block
	//The game doesn't really pause - the enemies "move" in the background with no collisions
	var pauser = document.querySelector('#pause');
	pauser.addEventListener('click', function(e) {
		pauseGame();
	});

	pauseGame = function() {
			//console.log("Paused state: "+paused);
			var pauser = document.querySelector('#pause');
			if (unpausefunction[0].paused) {
				pauser.innerHTML = 'PAUSE';
				unpausefunction[0].paused = !unpausefunction[0].paused;
				unpausefunction[0].requestAnimationFrame(unpausefunction[1]);
			}
			else {
				pauser.innerHTML = 'UNPAUSE';
				unpausefunction[0].paused = !unpausefunction[0].paused;
			}
		};
		//end pause block

	//create list of possible avatars and preload them
	//Is there any difference between this and an array?
	var avatarMap = {
		0: 'images/char-boy.png',
		1: 'images/char-cat-girl.png',
		2: 'images/char-horn-girl.png',
		3: 'images/char-pink-girl.png',
		4: 'images/char-princess-girl.png'

	};
	//do this so the game doesn't pause or throw errors while loading assets while playing
	for (var i = 0; i < 5; i++) {
		Resources.load(avatarMap[i]);
	}

	//Avatar selection block
	//The user can toggle through all possible avatars in avatarMap
	var avatar = document.querySelector('#avatar');
	avatar.addEventListener('click', function(e) {
		//console.log("Switching avatar");
		var av = (player.avatar + 1) % 5;
		var newsprite = avatarMap[av];
		Resources.load(newsprite);
		player.avatar = av;
		player.sprite = newsprite;

		//do this so the avatar changes on screen while game is paused
		if (unpausefunction[0].paused) {
			pauseGame();
			pauseGame();
		}

	});
	//end avatar selection block

});
//end user interaction section

//Creates and attaches game objects and functions
//Provides a location for security improvements
//i.e. change global vars to functions which test caller, context, etc.
//Could also refactor and put this in engine
var gamePrep = (function(global) {
	/*Valid player positions in pixel positions:
	Blue1: -2,-11  99,-11  200,-11  301,-11  402,-11   Victory!
	Gray1: -2,72   99,72   200,72   301,72   402,72    At Risk
	Gray2: -2,155  99,155  200,155  301,155  402,155   At Risk
	Gray3: -2,238  99,238  200,238  301,238  402,238   At Risk
	Green1:-2,321  99,321  200,321  301,321  402,321   Safe
	Green2:-2,404  99,404  200,404  301,404  402,404   Safe
	*/
	global.playerRows = [];
	playerRows.push([[-2, -11], [99, -11], [200, -11], [301, -11], [402, -11]]);
	playerRows.push([[-2, 72], [99, 72], [200, 72], [301, 72], [402, 72]]);
	playerRows.push([[-2, 155], [99, 155], [200, 155], [301, 155], [402, 155]]);
	playerRows.push([[-2, 238], [99, 238], [200, 238], [301, 238], [402, 238]]);
	playerRows.push([[-2, 321], [99, 321], [200, 321], [301, 321], [402, 321]]);
	playerRows.push([[-2, 404], [99, 404], [200, 404], [301, 404], [402, 404]]);

	//corresponds to the gray squares, positions where a collision will happen if the square is held by an enemy
	global.enemyOwnedPositions = [];
	enemyOwnedPositions.push([false, false, false, false, false]);
	enemyOwnedPositions.push([false, false, false, false, false]);
	enemyOwnedPositions.push([false, false, false, false, false]);

	//Expects to be called with player as this
	global.checkCollision = function() {
		var atRiskX = this.curPosX - 1;
		var atRiskY = this.curPosY;
		if (enemyOwnedPositions[atRiskX][atRiskY]) {
			//console.log("collision!");
			this.reset();
			alert('Oh no!');
			currentScore -= 10;
			document.getElementById('current-score')
				.innerHTML = currentScore;
			if (allEnemies.length > 1) {
				allEnemies.pop();
			}
			recalcEnemyPositions();
		}
	};

	// Now instantiate your objects.
	// Place all enemy objects in an array called allEnemies
	// Place the player object in a variable called player
	global.allEnemies = [];

	//Start with 1 enemy, increase as the player wins, decrease as they lose
	var enemyCount = 1;
	for (var i = 0; i < enemyCount; i++) {
		allEnemies.push(new Enemy());
	}
	global.player = new Player();

	global.currentScore = 0;

})(this);
//end gameboard prep
