class Level extends Phaser.Scene 
{
    constructor()
    {
        super({key: "Level"})
    }

    preload()
    {
        // Clear cache.
        //console.log(this.cache)
        this.cache.tilemap.remove("tilemap")
		this.cache.audio.remove("levelMusic")
		this.textures.remove("background0")
		this.textures.remove("background1")
		this.textures.remove("background2")

        // Load images.
        this.load.image("playerProjectile", "assets/sprites/playerProjectile.png")
        this.load.image("gotThrough", "assets/sprites/gotThrough.png")
		this.load.image("goblinAxe", "assets/sprites/goblinAxe.png")
		this.load.image("aiFucked", "assets/sprites/aiFucked.png")

        // Load spritesheets.
        this.load.spritesheet("cutsceneLevel", "assets/cutscenes/cutsceneLevel.png", {frameWidth: 256, frameHeight: 240})
        this.load.spritesheet("frodo", "assets/sprites/frodo.png", {frameWidth: 33, frameHeight: 33})
        this.load.spritesheet("sam", "assets/sprites/sam.png", {frameWidth: 33, frameHeight: 33})
        this.load.spritesheet("lifebar", "assets/sprites/lifebar.png", {frameWidth: 8, frameHeight: 62})
        this.load.spritesheet("enemies", "assets/sprites/enemies.png", {frameWidth: 16, frameHeight: 42})
		this.load.spritesheet("blackrider", "assets/sprites/blackrider.png", {frameWidth: 63, frameHeight: 68})
		this.load.spritesheet("bossHealthBar", "assets/sprites/bossHealthBar.png", {frameWidth: 42, frameHeight: 9})
		this.load.spritesheet("legolasHorse", "assets/sprites/legolasHorse.png", {frameWidth: 92, frameHeight: 95})

        // Load map.
        this.load.image("tileset", "assets/sprites/tileset.png")
        this.load.spritesheet("items", "assets/sprites/items.png", {frameWidth: 16, frameHeight: 16})
        this.load.tilemapTiledJSON("tilemap", levels[currentLevel].dir)

        // Load backgrounds.
        this.load.image("background0", levels[currentLevel].backgrounds[0])
        this.load.image("background1", levels[currentLevel].backgrounds[1])
        this.load.image("background2", levels[currentLevel].backgrounds[2])

        // Load sounds.
        this.load.audio("coin", "assets/sounds/coin.wav")
        this.load.audio("jump", "assets/sounds/jump.wav")
        this.load.audio("bump", "assets/sounds/bump.wav")
        this.load.audio("life", "assets/sounds/life.wav")
        this.load.audio("spring","assets/sounds/spring.mp3")
        this.load.audio("enemy", "assets/sounds/enemy.wav")
		this.load.audio("sword", "assets/sounds/sword.wav")

        // Load music.
        this.load.audio("fanfare", "assets/music/fanfare.mp3")
        this.load.audio("actClear", "assets/music/actClear.mp3")
        this.load.audio("levelMusic", levels[currentLevel].music)
		this.load.audio("bossMusic", "assets/music/bossMusic.mp3")

        // Load level specific assets.
        if (currentLevel >= 7)
        {
            this.load.image("caradhrasSnow", "assets/backgrounds/caradhrasSnow.png")
            this.load.image("caradhrasSnowSmall", "assets/backgrounds/caradhrasSnowSmall.png")
            this.load.spritesheet("aragornSprites", "assets/sprites/aragornSprites.png", {frameWidth: 45, frameHeight: 66})
            this.load.spritesheet("legolasSprites", "assets/sprites/legolasSprites.png", {frameWidth: 45, frameHeight: 66})
        }
    }

    create()
    {
        // Mission briefing.
        this.cameras.main.fadeIn(500)
        this.sound.play("fanfare")

        let cutsceneLevel = this.add.sprite(0, 0, "cutsceneLevel", currentLevel)
        cutsceneLevel.setOrigin(0, 0)
        cutsceneLevel.setDepth(4)
        cutsceneLevel.setScrollFactor(0, 0)
        cutsceneLevel.setInteractive({cursor: 'pointer'})

        cutsceneLevel.on('pointerdown', function (event) 
        {
            cutsceneLevel.destroy()
            this.player.canMove = true
            this.sound.stopAll()
            this.sound.play("levelMusic")
        }, this);
		
		// Enemy projectiles group.
		this.enemyProjectiles = this.physics.add.group()

        // Create player.
        this.player = new Player(this, 200, 100)

        // Import map and tileset.
        let map     = this.make.tilemap({key: "tilemap"})
        let tileset = map.addTilesetImage("tileset", "tileset")
        this.layers  = [
            map.createLayer(0, tileset, 0, 0),       // Background.
            map.createLayer(1, tileset, 0, 0),       // Collisions.
            map.createLayer(2, tileset, 0, 0),       // Foreground.
            map.getObjectLayer("Objects")["objects"] // Objects.
        ]

        this.layers[1].setCollisionByExclusion([-1])
        this.layers[2].depth = 1
        this.cameras.main.setBounds(0, 0, map.width * map.tileWidth, map.height * map.tileHeight)

        this.physics.add.collider(this.player, this.layers[1]);

        // Ai Player.
        this.hasAiPlayer = true
        this.aiPlayer = new AiPlayer(this, this.player.x - 5, this.player.y, "sam", 30)
        this.physics.add.collider(this.aiPlayer, this.layers[1]);
		
		this.importObjects(this.layers[3]) // Import objects from map.
		
		// Destroy AI player if disabled in map.
        if (!map.properties[0].value)
        {
            this.aiPlayer.destroy()
        }

        // Import parallax backgrounds.
        this.add.image(config.width/2, config.height/2, "background0").setScrollFactor(0).setDepth(-1)
        createParallax(this, config.width * 30, "background1", 0.25)
        createParallax(this, config.width * 30, "background2", 0.5)

        // GUI.
        this.lifebar = this.add.sprite(10, config.height/2, "lifebar", this.player.lives)
        this.lifebar.setScrollFactor(0)
        this.lifebar.setDepth(3)
		
		this.cameraLock = false
        this.levelFinished = false

        // Check if level is caradhras.
        if (currentLevel >= 7)
        {   // Snow.
            this.caradhrasSnow = this.add.tileSprite(0, 0, config.width, config.height, "caradhrasSnow")
            this.caradhrasSnow.setScrollFactor(0, 0)
            this.caradhrasSnow.setOrigin(0, 0)
            this.caradhrasSnow.depth = 100

            this.caradhrasSnowSmall = this.add.tileSprite(0, 0, config.width, config.height, "caradhrasSnowSmall")
            this.caradhrasSnowSmall.setScrollFactor(0, 0)
            this.caradhrasSnowSmall.setOrigin(0, 0)
            this.caradhrasSnowSmall.depth = 100

            // Ai Players.
            let aragorn = new AiPlayer(this, this.player.x - 20, this.player.y, "aragornSprites", 75)
            this.physics.add.collider(aragorn, this.layers[1]);

            let legolas = new AiPlayer(this, this.player.x - 40, this.player.y, "legolasSprites", 135)
            this.physics.add.collider(legolas, this.layers[1]);
        }
    }

    importObjects(layer)
    {
        // Import objects from layer.
        layer.forEach(object => 
        {
            switch(object.type)
            {
                case "playerStart":
                    this.player.x = object.x
                    this.player.y = object.y
                    break
                    
                case "coin":
                case "spike":
                case "spring":
				case "lockScreen":
                case "life":
				case "endSpot":
				case "bridge":
				case "redKey":
				case "yellowKey":
				case "redBlock":
				case "yellowBlock":
				case "shooter":
                    new Item(this, object.x, object.y, object.type, object.flippedVertical, object.flippedHorizontal)
                    break
					
                case "orc":
				case "goblin":
				case "bomb":
                    new Enemy(
                        this, object.x, object.y, object.type, 
                        object.properties[0].value, object.properties[1].value
                    )
                    break
					
				case "blackrider":
					let blackRider = new BlackRider(
						this, object.x, object.y,
						object.properties[0].value, object.properties[1].value
					)
					this.physics.add.collider(blackRider, this.layers[1]);
					break
            }
        })
    }

    update()
    {
        // Update lifebar.
        this.lifebar.setFrame(this.player.lives)

        if (currentLevel >= 7)
        {
            this.caradhrasSnow.tilePositionX += 1
            this.caradhrasSnow.tilePositionY -= 1
            this.caradhrasSnowSmall.tilePositionX += 0.5
            this.caradhrasSnowSmall.tilePositionY -= 0.5

            this.caradhrasSnow.visible = this.player.canMove
            this.caradhrasSnowSmall.visible = this.player.canMove
        }
    }

    finishLevel()
    {
        // Level finish "got through".
        let finishSprite = this.add.sprite(config.width/2, -100, "gotThrough")
        finishSprite.setScrollFactor(0, 0)
        finishSprite.setDepth(3)

        let finishTween = this.tweens.add({
            targets: finishSprite,
            y: {from: -100, to: config.height/2},
            ease: 'Bounce.easeOut',
            duration: 2000,
            repeat: 0,
            yoyo: false,
            completeDelay: 4000
        })

        finishTween.on("complete", function(tween, targets) {
            this.cameras.main.fadeOut(1000)
        }, this)

        this.cameras.main.once('camerafadeoutcomplete', function (camera) {
            currentLevel += 1
            this.scene.restart()
        }, this)
    }
}

