var game;
var savedData;

var gameOptions = {
    gameHeight: 1334,
    backgroundColor: 0x08131a,
    visibleTargets: 1,
    ballDistance: 120,
    angleRange: [25, 155],
    localStorageName: "riskystepsgame"
}

FBInstant.initializeAsync().then(function() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    if(windowWidth > windowHeight){
        windowWidth = windowHeight / 1.8;
    }
    var gameWidth = windowWidth * gameOptions.gameHeight / windowHeight;

    game = new Phaser.Game(gameWidth, gameOptions.gameHeight, Phaser.CANVAS);
    FBInstant.setLoadingProgress(100);
    FBInstant.startGameAsync().then(function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.disableVisibilityChange = true;
        game.stage.backgroundColor = gameOptions.backgroundColor;
        game.state.add("Preload", preload);
        game.state.add("TitleScreen", titleScreen);
        game.state.add("LeaderBoardrMode", leaderboardmode);     //leaderboardmode
        game.state.add("PlaySPGame", playSPGame);
        game.state.start("Preload");
        })
})

var preload = function(game){};
preload.prototype = {
    preload: function(){
        game.load.image("title", "assets/sprites/title.png");
        game.load.image("playbutton", "assets/sprites/playbutton.png");
        game.load.image("ball", "assets/sprites/ball.png");
        game.load.image("target", "assets/sprites/target.png");
        game.load.image("homebutton", "assets/sprites/homebutton.png");
        game.load.image("tap", "assets/sprites/tap.png");
        game.load.image("fog", "assets/sprites/fog.png");
        game.load.image("leaderboardbutton", "assets/sprites/leaderboard.png");   //load leaderboard
        game.load.image("exit", "assets/sprites/exit.png");
        game.load.image("exithome", "assets/sprites/exithome.png");
        game.load.image("exitrestart", "assets/sprites/exitrestart.png");
        game.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
        game.load.bitmapFont("whitefont", "assets/fonts/whitefont.png", "assets/fonts/whitefont.fnt");
        game.load.audio("failsound", ["assets/sounds/fail.mp3", "assets/sounds/fail.ogg"]);
        game.load.audio("hitsound", ["assets/sounds/hit.mp3", "assets/sounds/hit.mp3"]);
        game.load.audio("hit2sound", ["assets/sounds/hit2.mp3", "assets/sounds/hit2.ogg"]);
    },
    create: function(){
        game.state.start("TitleScreen");
    }
}

var titleScreen = function(game){};
titleScreen.prototype = {
    create: function(){
        savedData = localStorage.getItem(gameOptions.localStorageName) == null ? {score: 0} : JSON.parse(localStorage.getItem(gameOptions.localStorageName));
        var title = game.add.image(game.width / 2, 50, "title");
        title.anchor.set(0.5, 0);
        var playButton = game.add.button(game.width / 2, game.height / 2 - 150, "playbutton", this.startGame);
        playButton.anchor.set(0.5);
        var tween = game.add.tween(playButton.scale).to({
            x: 0.8,
            y: 0.8
        }, 500, Phaser.Easing.Linear.None, true, 0, -1);
        tween.yoyo(true);
        var leaderboardButton = game.add.button(game.width / 2, 900, "leaderboardbutton", function(){
            game.state.start("LeaderBoardrMode");
        });
        leaderboardButton.anchor.set(0.5);
        var lbtween = game.add.tween(leaderboardButton.scale).to({
            x: 0.9,
            y: 0.9
        }, 500, Phaser.Easing.Linear.None, true, 0, -1);
        lbtween.yoyo(true);
        game.add.bitmapText(game.width / 2, game.height - 70, "whitefont", savedData.score.toString(), 60).anchor.set(0.5, 1);
        game.add.bitmapText(game.width / 2, game.height - 130, "font", "BEST SCORE", 48).anchor.set(0.5, 1);
    },
    startGame: function(){
        game.state.start("PlaySPGame");
    }
}

//leaderboardmode
var leaderboardmode = function(game){};
leaderboardmode.prototype = {
    create: function(){
        var lbtitle = game.add.image(game.width / 2, 50, "leaderboardbutton");
        lbtitle.anchor.set(0.5, 0);
        var list = [["1", "user1", "135"], ["2", "user2", "130"], ["3", "user1", "128"], ["4", "matthew", "128"], ["5", "Tailin", "120"]];
        game.add.bitmapText(game.width / 2, 200, "whitefont", "Top 5 of friends", 48).anchor.set(0.5,0.5);
        game.add.bitmapText(game.width / 2, 250, "whitefont", "Your Ranking: 8", 48).anchor.set(0.5,0.5);
        for (var i = 0; i < list.length; i++) {
            var position = i
            var user_name = list[i][0];
            var score = list[i][1];
            game.add.bitmapText(game.width / 3 * 1-100, game.height / 7 * i+300, "whitefont", list[i][0], 48).anchor.set(0.2, 0.2+i*0.1);
            game.add.bitmapText(game.width / 2, game.height / 7 * i+300, "whitefont", list[i][1], 48).anchor.set(0.2, 0.2+i*0.1);
            game.add.bitmapText(game.width / 3 * 3-100, game.height / 7 * i+300, "whitefont", list[i][2], 48).anchor.set(0.8, 0.2+i*0.1);
        }
        this.homeButton = game.add.button(game.width / 2, game.height, "homebutton", function(){
            game.state.start("TitleScreen");
        });
        this.homeButton.anchor.set(0.5, 1);
        game.add.bitmapText(game.width / 2, game.height - 70, "whitefont", savedData.score.toString(), 60).anchor.set(0.5, 1);
        game.add.bitmapText(game.width / 2, game.height - 130, "font", "BEST SCORE", 48).anchor.set(0.5, 1);
    }
}