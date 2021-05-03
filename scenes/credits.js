class Credits extends Phaser.Scene
{
    constructor()
    {
        super({key: "Credits"})
    }

    preload()
    {
        this.load.text("credits", "assets/credits.txt")
        this.load.audio("creditsMusic", "assets/music/credits.mp3")

        // Load video if it's the ending of
        // the game.
        if (currentLevel >= 9)
        {
            this.load.video("ending", "assets/cutscenes/ending.mp4", 'loadeddata', false, false)
        }
    }

    create()
    {
        this.musicVolume = 1
        this.music = this.sound.add("creditsMusic")
        this.text = this.add.text(0, config.height, this.cache.text.get("credits"), {font: "13px Arial", align: "center"})

        if (currentLevel >= 9)
        {
            this.cutsceneVideo = this.add.video(config.width/2, config.height/2, 'ending')
            this.cutsceneVideo.displayWidth = config.width+64
            this.cutsceneVideo.displayHeight = config.height
            this.cutsceneVideo.play(false)
            this.cutsceneVideo.setPaused(false);
            this.creditsRolling = false
        }
        else
        {
            this.creditsRolling = true
            this.music.play()
        }
    }

    update(time, delta)
    {
        if (this.creditsRolling)
        {
            this.text.y -= 0.3
        
            // Fade out music.
            if (this.text.y < -this.text.height)
            {
                if (this.musicVolume > 0)
                {
                    this.musicVolume -= 0.003
                    this.sound.setVolume(this.musicVolume)   
                }
                else
                {
                    this.sound.stopAll()
                    this.sound.setVolume(1)
                    currentLevel = 0
                    this.scene.start("Menu");
                }
            }   
        }
        else
        {
            if (!this.cutsceneVideo.isPlaying())
            {
                this.music.play()
                this.creditsRolling = true
                this.cutsceneVideo.destroy()
            }
        }
    }
}