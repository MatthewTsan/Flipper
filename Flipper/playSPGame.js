
var playSPGame = function(game){};
playSPGame.prototype = {
    create: function(){
        this.failSound = game.add.audio("failsound");
        this.hitSound = [game.add.audio("hitsound"), game.add.audio("hit2sound")];
        this.runUpdate = false;
        this.score = 0;
        this.destroy = false;
        this.rotationSpeed = 2;
        this.movingPixel = 8;
        this.randomDistance = 0;
        this.targetArray = [];
        this.steps = 0;
        this.rotatingDirection = game.rnd.between(0, 1);
        this.gameGroup = game.add.group();
        this.targetGroup = game.add.group();
        this.ballGroup = game.add.group();
        this.gameGroup.add(this.targetGroup);
        this.gameGroup.add(this.ballGroup);
        this.balls = [
            game.add.sprite(game.width / 2, 900, "ball"),
            game.add.sprite(game.width / 2, 900 + gameOptions.ballDistance, "ball")
        ]
        this.balls[0].anchor.set(0.5);
        this.balls[1].anchor.set(0.5);
        this.ballGroup.add(this.balls[0]);
        this.ballGroup.add(this.balls[1]);
        this.rotationAngle = 0;
        this.rotatingBall = 1;
        var target = game.add.sprite(0, 0, "target");
        target.anchor.set(0.5);
        target.x = this.balls[0].x;
        target.y = this.balls[0].y;
        this.balls[1].x = this.balls[0].x;
        this.balls[1].y = this.balls[0].y;
        this.targetGroup.add(target);
        this.targetArray.push(target);
        game.input.onDown.add(this.runUpdateflag, this);   //input
        game.input.onUp.add(this.changeBall, this);   //input
        for(var i = 0; i < gameOptions.visibleTargets; i++){
            this.addTarget();
        }
        this.homeButton = game.add.button(game.width / 2, game.height, "homebutton", function(){
            this.exit = game.add.image(game.width / 2, game.height / 2, "exit");
            this.exit.anchor.set(0.5, 0.5);
            this.exithome = game.add.button((game.width / 4) + 50, (game.height / 2), "exithome", function(){game.state.start("TitleScreen");});
            this.exithome.anchor.set(0.5, 0);
            this.exitrestart = game.add.button((game.width*3 / 4) - 50, (game.height / 2), "exitrestart", function(){game.state.start("PlaySPGame");});   //resume
            this.exitrestart.anchor.set(0.5, 0);
        });
        
        this.homeButton.anchor.set(0.5, 1);
        this.tap = game.add.sprite(game.width / 8, this.balls[0].y - 50, "tap");
        this.tap.anchor.set(0.5);
        var fog = game.add.image(0, 0, "fog");
        fog.width = game.width;                                                
        this.scoreText = game.add.bitmapText(20, 20, "whitefont", "0", 60);
    },
    runUpdateflag: function(){this.runUpdate = true},
    update: function(){
        if(this.runUpdate){
            var distanceFromTarget = this.balls[this.rotatingBall].position.distance(this.targetArray[1].position);
            var distanceFromBall = this.balls[this.rotatingBall].position.distance(this.balls[1 - this.rotatingBall].position);
            if(distanceFromTarget > 90 && distanceFromBall < 100 && this.destroy && this.steps > gameOptions.visibleTargets){
                var ohnoText = game.add.bitmapText(0, 100, "whitefont", "TOO LATE!!", 48);
                ohnoText.anchor.set(0.5);
                this.targetArray[0].addChild(ohnoText);
                this.gameOver();
            }
            if(distanceFromTarget < 25 && !this.destroy){
                this.destroy = true;
            }
            this.rotationAngle += this.rotationSpeed;
            this.randomDistance = this.randomDistance + this.movingPixel * Math.cos(Phaser.Math.degToRad(this.rotationAngle));
            this.balls[this.rotatingBall].x = this.balls[1 - this.rotatingBall].x + this.randomDistance * Math.sin(Phaser.Math.degToRad(this.randomAngle));
            this.balls[this.rotatingBall].y = this.balls[1 - this.rotatingBall].y + this.randomDistance * Math.cos(Phaser.Math.degToRad(this.randomAngle));
            var distanceX = this.balls[1 - this.rotatingBall].worldPosition.x - game.width / 2;
            var distanceY = this.balls[1 - this.rotatingBall].worldPosition.y - 900;
            this.gameGroup.x = Phaser.Math.linearInterpolation([this.gameGroup.x, this.gameGroup.x - distanceX], 0.05);
            this.gameGroup.y = Phaser.Math.linearInterpolation([this.gameGroup.y, this.gameGroup.y - distanceY], 0.05);
        }
    },
    changeBall:function(e){
        if(this.tap != null){
            this.tap.destroy();
            this.tap = null;
        }
        var homeBounds = this.homeButton.getBounds();
        if(homeBounds.contains(e.position.x, e.position.y)){
            return;
        }
        this.hitSound[this.rotatingBall].play();
        this.destroy = false;
        var distanceFromTarget = this.balls[this.rotatingBall].position.distance(this.targetArray[1].position);
        if(distanceFromTarget < 20){
            var points = Math.floor((20 - distanceFromTarget) / 2);
            this.score += points;
            this.scoreText.text = this.score.toString();
            this.rotatingDirection = game.rnd.between(0, 1);
            var fallingTarget = this.targetArray.shift();
            var tween = game.add.tween(fallingTarget).to({
                alpha: 0,
                width: 0,
                height: 0
            }, 2500, Phaser.Easing.Cubic.Out, true);
            tween.onComplete.add(function(target){
                target.destroy();
            }, this)
            this.rotatingBall = 1 - this.rotatingBall;
            this.randomDistance = 0;
            this.rotationAngle = 0;
            this.runUpdate = false;
            if(this.steps % 2 == 0){
                this.rotationSpeed += 0.5;
                this.movingPixel *= 1.25;
            }
            this.addTarget();
        }
        else{
            var ohnoText = game.add.bitmapText(0, 100, "whitefont", "MISSED!!", 48);
            ohnoText.anchor.set(0.5);
            this.targetArray[0].addChild(ohnoText);
            this.gameOver();
        }
    },
    addTarget: function(){
        this.steps++;
        startX = this.targetArray[this.targetArray.length - 1].x;
        startY = this.targetArray[this.targetArray.length - 1].y;
        var target = game.add.sprite(0, 0, "target");
        target.anchor.set(0.5);
        this.randomAngle = game.rnd.between(gameOptions.angleRange[0] + 90, gameOptions.angleRange[1] + 90);
        var randomDistance = game.rnd.between(100, 200);
        target.x = startX + randomDistance * Math.sin(Phaser.Math.degToRad(this.randomAngle));
        target.y = startY + randomDistance * Math.cos(Phaser.Math.degToRad(this.randomAngle));
        var stepText = game.add.bitmapText(0, 0, "whitefont", this.steps.toString(), 32);
        stepText.anchor.set(0.5);
        target.addChild(stepText);
        this.targetGroup.add(target);
        this.targetArray.push(target);
    },
    gameOver: function(){
        this.failSound.play();
        this.runUpdate = false;
        game.input.onDown.remove(this.runUpdateflag, this);   //input
        game.input.onUp.remove(this.changeBall, this);   //input
        var finalSteps = this.steps - gameOptions.visibleTargets;
        this.scoreText.text = this.score.toString() + " * " + finalSteps + " = " + (this.score * finalSteps).toString();
        this.score *= finalSteps;
        localStorage.setItem(gameOptions.localStorageName,JSON.stringify({
            score: Math.max(savedData.score, this.score)
        }));
        this.rotationSpeed = 0;
        var gameOverTween = game.add.tween(this.balls[1 - this.rotatingBall]).to({
            alpha: 0
        }, 1500, Phaser.Easing.Cubic.Out, true);
        gameOverTween.onComplete.add(function(){
            game.state.start("PlaySPGame");
        },this);
    }
}