// Enemies our player must avoid

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
	this.track = (this.y-60)/83;
	console.log("Enemy Track: "+this.track);
	this.speed = Math.random()*150;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	//console.log("enemy update: " + dt);
	this.x += dt*this.speed;
	if(this.x >505) {
		this.x = -101;
	}
	for(var i=0;i<4;i++) {
		if(this.x >= playerRows[this.track+1][i][0]-90 && this.x < playerRows[this.track+1][i+1][0]+5) {
			enemyOwnedPositions[this.track][i] = true;
		}
		
		else {
			enemyOwnedPositions[this.track][i] = false;
		}
	}
	

	if(this.x >= playerRows[this.track+1][4][0]-90){
		enemyOwnedPositions[this.track][4] = true;
	}
	else {
		enemyOwnedPositions[this.track][4] = false;
	}
	
	if(player.curPosX >0 && player.curPosX <4) {
		var atRiskX = player.curPosX-1;
		var atRiskY = player.curPosY;
		if(enemyOwnedPositions[atRiskX][atRiskY]) {
			console.log("collision!");
			player.reset();
		}
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
	return [Math.floor(Math.random()*606)-101,60+(Math.floor((Math.random()*3)))*83];
}

//corresponds to the gray squares
enemyOwnedPositions = [];
enemyOwnedPositions.push([false,false,false,false,false]);
enemyOwnedPositions.push([false,false,false,false,false]);
enemyOwnedPositions.push([false,false,false,false,false]);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.sprite = "images/char-boy.png";
	this.x = playerRows[4][2][0];
	this.y = playerRows[4][2][1];
	this.curPosX = 4;
	this.curPosY = 2;
	//this.x = 200;//200
	//this.y = 321;//321
};

/*Valid player positions:
Blue1: -2,-11  99,-11  200,-11  301,-11  402,-11   Victory!
Gray1: -2,72   99,72   200,72   301,72   402,72    At Risk
Gray2: -2,155  99,155  200,155  301,155  402,155   At Risk
Gray3: -2,238  99,238  200,238  301,238  402,238   At Risk
Green1:-2,321  99,321  200,321  301,321  402,321   Safe
Green2:-2,404  99,404  200,404  301,404  402,404   Safe
*/
playerRows = [];
playerRows.push([[-2,-11],[99,-11],[200,-11],[301,-11],[402,-11]]);
playerRows.push([[-2,72],[99,72],[200,72],[301,72],[402,72]]);
playerRows.push([[-2,155],[99,155],[200,155],[301,155],[402,155]]);
playerRows.push([[-2,238],[99,238],[200,238],[301,238],[402,238]]);
playerRows.push([[-2,321],[99,321],[200,321],[301,321],[402,321]]);
playerRows.push([[-2,404],[99,404],[200,404],[301,404],[402,404]]);
Player.prototype.update = function(dt) {
	//console.log("player update: "+dt);
	if(this.curPosX >0 && this.curPosX <4) {
		var atRiskX = this.curPosX-1;
		var atRiskY = this.curPosY;
		if(enemyOwnedPositions[atRiskX][atRiskY]) {
			console.log("collision!");
			this.reset();
		}
	}
};
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.reset = function() {
	this.x = playerRows[4][2][0];
	this.y = playerRows[4][2][1];
	this.curPosX = 4;
	this.curPosY = 2;
}
Player.prototype.handleInput = function(theKey) {
	console.log("Player input: "+theKey+", "+this.curPosX+", "+this.curPosY);
	switch(theKey) {
		case "left":
			if(this.curPosY > 0) {
				this.curPosY -= 1;
				this.x = playerRows[this.curPosX][this.curPosY][0];
				this.y = playerRows[this.curPosX][this.curPosY][1];
			}
			break;
		
		case "right":
			if(this.curPosY < 4) {
				this.curPosY += 1;
				this.x = playerRows[this.curPosX][this.curPosY][0];
				this.y = playerRows[this.curPosX][this.curPosY][1];
			}
			break;
		
		case "up":
			if(this.curPosX > 0) {
				this.curPosX -= 1;
				this.x = playerRows[this.curPosX][this.curPosY][0];
				this.y = playerRows[this.curPosX][this.curPosY][1];
			}
			break;
		
		case "down":
			if(this.curPosX < 5) {
				this.curPosX += 1;
				this.x = playerRows[this.curPosX][this.curPosY][0];
				this.y = playerRows[this.curPosX][this.curPosY][1];
			}
			break;
	}
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = [];
var enemyCount = Math.floor(Math.random()*5)+1;
for(var i=0;i<enemyCount;i++) {
	allEnemies.push(new Enemy());
}
player = new Player();


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
window.addEventListener('load',function(f) {
	document.getElementById("upBtn").addEventListener('click', function(e) {
		console.log(e);
		player.handleInput('up');
	});
	document.getElementById("downBtn").addEventListener('click', function(e) {
		console.log(e);
		player.handleInput('down');
	});
	document.getElementById("leftBtn").addEventListener('click', function(e) {
		console.log(e);
		player.handleInput('left');
	});
	document.getElementById("rightBtn").addEventListener('click', function(e) {
		console.log(e);
		player.handleInput('right');
	});
});
