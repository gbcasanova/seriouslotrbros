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

        this.load.spritesheet("buttons", "assets/sprites/buttons.png", {frameWidth: 76, frameHeight: 24})

        this.load.audio("menu", "assets/music/khazadDum.mp3")
		this.load.video("intro", "assets/cutscenes/intro.mp4", 'loadeddata', false, false)

    }

    create()
    {
		this.cutsceneVideo = this.add.video(config.width/2, config.height/2, 'intro')
		this.cutsceneVideo.displayWidth = config.width+64
		this.cutsceneVideo.displayHeight = config.height
		this.cutsceneVideo.play(false)
		this.cutsceneVideo.setPaused(false);
		let cutscenePlaying = true
		this.menuPlaying = false
		
		this.cutsceneVideo.setInteractive({cursor: 'pointer'});

        this.cutsceneVideo.on('pointerdown', function (event) 
        {
			if (cutscenePlaying)
			{
				this.cameras.main.fadeOut(2000)
				cutscenePlaying = false
				
				// Fade out music.
                this.tweens.add
                ({
                    targets:  this.cutsceneVideo,
                    volume:   0,
                    duration: 1000
                });
				
				// Once the screen fade out is over, destroy the sprite and music.
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => 
                {
					this.cutsceneVideo.destroy()
                    this.createTitle()
					this.menuPlaying = true
                })
			}
        }, this);
    }

    createTitle()
    {
        this.cameras.main.fadeIn(2000)

        this.fadeStarted = false

        let menuMusic = this.sound.add("menu", {loop: true})
        menuMusic.play()

        this.backgrounds = [
            this.add.tileSprite(0, 0, 0, 0, "hobbitonMountains"),
            this.add.tileSprite(0, 0, 0, 0, "hobbitonClouds")
        ]

        this.backgrounds[0].setOrigin(0, 0)
        this.backgrounds[0].setScrollFactor(0)

        this.backgrounds[1].setOrigin(0, 0)
        this.backgrounds[1].setScrollFactor(0)

        this.logo = this.add.image(config.width/2, 100, "logo")

        this.playButton = new Button(this, config.width/2, 180, 0, function playAction(scene) 
        {
            if (!scene.fadeStarted)
            {
                scene.fadeStarted = true
                scene.sound.stopAll()
                scene.cameras.main.fadeOut(2000)
                scene.cameras.main.once('camerafadeoutcomplete', function (camera) {
                    scene.scene.start("Level");
                });
            }
        })
        
        this.creditsButton = new Button(this, config.width/2, 207, 4, function creditsAction(scene)
        {
            if (!scene.fadeStarted)
            {
                scene.fadeStarted = true
                scene.sound.stopAll()
                scene.cameras.main.fadeOut(2000)
                scene.cameras.main.once('camerafadeoutcomplete', function (camera) {
                    scene.scene.start("Credits");
                });
            }
        })
    }

    update(time, delta)
    {
		if (!this.cutsceneVideo.isPlaying())
		{
			if(!this.menuPlaying)
			{
				this.cutsceneVideo.destroy()
				this.createTitle()
				this.menuPlaying = true
			}
		}
		
        if (this.menuPlaying) 
        {
            this.backgrounds[1].tilePositionX += 2
            this.backgrounds[0].tilePositionX += 1
        }
    }
}