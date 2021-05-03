class Balrog extends Phaser.Scene
{
    constructor()
    {
        super({key: "Balrog"})
    }

    preload()
    {
        // Backgrounds.
        this.load.image("moria3D", "assets/backgrounds/moria3D.png")
        this.load.image("moriaSkies", "assets/backgrounds/moriaSkies.png")
        this.load.image("moriaMountains", "assets/backgrounds/moriaMountains.png")
        this.load.image("moriaTombs", "assets/backgrounds/moriaTombs.png")

        // Sprites.
        this.load.image("moriaStaff", "assets/sprites/moriaStaff.png")
        this.load.image("balrog", "assets/sprites/balrog.png")
        this.load.image("finalBriefing", "assets/cutscenes/finalbriefing.png")
        this.load.spritesheet("bossHealthBar", "assets/sprites/bossHealthBar.png", {frameWidth: 42, frameHeight: 9})
        this.load.spritesheet("balrogProjectiles", "assets/sprites/balrogProjectiles.png", {frameWidth: 21, frameHeight: 21})
    }

    create()
    {
        this.cameras.main.fadeIn(500)

        // UI and GUI.
        this.started = false
        this.fading = false
        this.healthValue = 5
        this.phaseLevel = 1
        this.collectedFlames = 0
        this.add.text(10, 10, "HEALTH: ", {font: "10px Arial"})
            .setScrollFactor(0, 0)
            .setDepth(1)
        this.healthBar = this.add.sprite(55, 12, "bossHealthBar", this.healthValue)
            .setScrollFactor(0, 0)
            .setOrigin(0, 0)
            .setDepth(1)
        this.phaseText = this.add.text(256 - 60, 10, "PHASE: " + this.phaseLevel, {font: "10px Arial"})
            .setScrollFactor(0, 0)
            .setDepth(1)

        let briefing = this.add.sprite(config.width/2, config.height/2, "finalBriefing")
            .setScrollFactor(0, 0)
            .setDepth(2)
            .setInteractive({cursor: 'pointer'})

        briefing.on('pointerdown', function (event) 
        {
            this.started = true
            briefing.destroy()
        }, this)

        // Player.
        this.keys = {
            d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            pointer: this.input.activePointer
        }
        this.playerCamera = {x: 350, y: config.height/2}
        this.cameras.main.startFollow(this.playerCamera, true, 0.2, 1)

        // Parallax.
        this.add.image(config.width/2, config.height/2, "moriaSkies").setScrollFactor(0).setDepth(-1)
        createParallax(this, config.width * 5, "moriaTombs", 0.25)
        createParallax(this, config.width * 5, "moriaMountains", 0.5)
        this.add.image(0, 0, "moria3D").setOrigin(0, 0)

        // Staff.
        this.moriaStaff = this.add.image(config.width/2, config.height/2, "moriaStaff")
            .setScrollFactor(0, 0)
            .setDepth(1)

        // Balrog.
        let balrog = this.add.image(345, 80, "balrog")
            .setDepth(-1)
        let balrogTween = this.tweens.add({
            targets: balrog,
            y: 100,
            ease: 'linear',
            duration: 1500,
            repeat: -1,
            yoyo: true,
        });

        // Generate Projectiles.
        this.projectileTimer = this.time.addEvent({
            delay: 6000,
            callback: function(){
                if (this.started)
                {
                    // Generate a random position.
                    let randomX = this.getRndInteger(150, 537)
                    let randomY = this.getRndInteger(80, 204)

                    let sprite = this.add.sprite(344, 46, "balrogProjectiles")
                        .setOrigin(0, 0)
                        .setInteractive({cursor: 'pointer'})
                    sprite.displayWidth = 0
                    sprite.displayHeight = 0

                    let clicked = false
                    sprite.on('pointerdown', function (event) 
                    {
                        clicked = true
                        this.collectedFlames += 1
                        sprite.destroy()
                    }, this);

                    // Size and position tween.
                    let sizePosTween = this.tweens.add({
                        targets: sprite,
                        x: randomX,
                        y: randomY,
                        displayWidth: sprite.width * (randomY / 100),
                        displayHeight: sprite.height * (randomY / 100),
                        ease: 'Back.easeOut',
                        duration: 1000,
                    })

                    // Disappear tween.
                    let disappearTween = this.tweens.add({
                        targets: sprite,
                        alpha: {
                            getStart: () => 1,
                            getEnd: () => 0
                        },
                        onComplete: function () {
                            if (!clicked)
                            {
                                sprite.destroy()
                                this.healthValue -= 1
                                this.healthBar.setFrame(this.healthValue)
                            }
                        },
                        onCompleteScope: this,
                        ease: 'linear',
                        duration: 7000,
                    })
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    update(time, delta)
    {
        if (this.started)
        {
            this.projectileTimer.delay = 6000 / this.phaseLevel

            if (this.healthValue <= 0)
            {
                this.healthValue = 5
                this.healthBar.setFrame(this.healthValue)
                if (this.phaseLevel > 1) {this.phaseLevel -= 1}
                this.phaseText.setText("PHASE: " + this.phaseLevel)
            }

            if (this.collectedFlames >= this.phaseLevel * 5)
            {
                this.collectedFlames = 0
                this.phaseLevel += 1
                this.phaseText.setText("PHASE: " + this.phaseLevel)
            }

            // Player camera horizontal movement.
            if (this.keys.a.isDown)
            {
                if (this.playerCamera.x >= 130)
                {
                    this.playerCamera.x -= 3
                }
            }
            else if (this.keys.d.isDown)
            {
                if (this.playerCamera.x <= 560)
                {
                    this.playerCamera.x += 3
                }
            }

            // Move Staff.
            if (this.keys.pointer.y >= 117)
            {
                this.moriaStaff.y = this.keys.pointer.y
            }
            this.moriaStaff.x = this.keys.pointer.x

            if (this.phaseLevel >= 2)
            {
                this.started = false
                this.moriaStaff.x = config.width/2
                this.moriaStaff.y = config.height/2
                if (!this.fading)
                {
                    this.finishLevel()
                }
            }

            // Print mouse position on the world.
            // console.log(this.playerCamera.x + " " + this.playerCamera.y)
        }
    }

    getRndInteger(min, max) 
    {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    finishLevel()
    {
        this.fading = true
            
        this.cameras.main.fadeOut(2000, 255, 255, 255)

        this.cameras.main.once('camerafadeoutcomplete', function (camera) {
            this.scene.start("Credits");
        }, this)
    }
}


  