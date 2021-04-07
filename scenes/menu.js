class Menu extends Phaser.Scene 
{
    constructor()
    {
        super({key: "Menu"})
    }

    preload()
    {
        this.load.image("hobbitonClouds", "assets/backgrounds/hobbitonClouds.png")
        this.load.image("hobbitonMountains", "assets/backgrounds/hobbitonMountains.png")
        this.load.image("logo", "assets/sprites/logo.png")

        this.load.spritesheet("cutscene", "assets/cutscenes/cutscene01.png", {frameWidth: 256, frameHeight:240})
        this.load.spritesheet("buttons", "assets/sprites/buttons.png", {frameWidth: 76, frameHeight: 24})

        this.load.audio("intro", "assets/music/intro.mp3")
        this.load.audio("menu", "assets/music/khazadDum.mp3")
		this.load.video("video", "assets/aaa.mp4")

    }

    create()
    {
		let video = this.add.video(0, 0, 'video').setOrigin(0, 0)
		video.displayWidth = config.width
		video.displayHeight = config.height
		video.play()
		
        /*this.cutscenePlaying = false
        this.menuPlaying = false

        this.createCutscene()*/
    }

    createCutscene()
    {
		
		
        this.cutscenePlaying = true
        this.cameras.main.fadeIn(2000)

        this.custceneSprite = this.add.sprite(0, 0, "cutscene")
        this.custceneSprite.setOrigin(0, 0)
        this.custceneSprite.setInteractive({cursor: 'pointer' })

        let cutsceneMusic = this.sound.add("intro", {loop: true})
        cutsceneMusic.play()

        // Check if mouse is being pressed.
        this.custceneSprite.on('pointerdown', (event) => 
        {
            if (event.leftButtonDown())
            {
                // Check if cutscene is active.
                if (this.cutscenePlaying)
                {
                    // If so, when clicked, check if the current frame isn't the last and go to the next frame.
                    if (this.custceneSprite.texture.frameTotal - 3 >= this.custceneSprite.frame.name + 1)
                    {
                        this.custceneSprite.setFrame(this.custceneSprite.frame.name + 1)
                    }
                    // If not, make the cutscene unactive and destroy the sprite.
                    else 
                    {
                        this.cameras.main.fadeOut(2000)
                        this.cutscenePlaying = false
                        
                        // Fade out music.
                        this.tweens.add
                        ({
                            targets:  cutsceneMusic,
                            volume:   0,
                            duration: 1000
                        });

                        // Once the screen fade out is over, destroy the sprite and music.
                        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => 
                        {
                            this.custceneSprite.destroy()
                            cutsceneMusic.destroy()

                            this.createTitle()
                        })
                    }
                }
            }
        });
    }

    createTitle()
    {
        this.menuPlaying = true
        this.cameras.main.fadeIn(2000)

        let menuMusic = this.sound.add("menu", {loop: true})
        menuMusic.play()

        this.backgrounds = [
            this.add.tileSprite(0, 0, config.width, config.height, "hobbitonMountains"),
            this.add.tileSprite(0, 0, config.width, config.height, "hobbitonClouds")
        ]

        this.backgrounds[0].setOrigin(0, 0)
        this.backgrounds[0].setScrollFactor(0)

        this.backgrounds[1].setOrigin(0, 0)
        this.backgrounds[1].setScrollFactor(0)

        this.logo = this.add.image(config.width/2, config.height/2, "logo")

        this.playButton = new Button(this, config.width/2, 180, 0, function playAction(scene) 
        {
            scene.sound.stopAll()
            scene.scene.start("Level");
        })
        
        this.loadButton = new Button(this, config.width/2, 207, 2)
        this.loadButton = new Button(this, config.width/2, 15, 4)
    }

    update(time, delta)
    {
        if (this.menuPlaying) 
        {
            this.backgrounds[1].tilePositionX += 2
            this.backgrounds[0].tilePositionX += 1
        }
    }
}