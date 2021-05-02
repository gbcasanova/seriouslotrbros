class Credits extends Phaser.Scene
{
    constructor()
    {
        super({key: "Credits"})
    }

    preload()
    {
        //
        this.load.text("credits", "assets/credits.txt")
        this.load.audio("creditsMusic", "assets/music/credits.mp3")

        this.load.plugin('rexsoundfadeplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsoundfadeplugin.min.js', true);
    }

    create()
    {
        this.musicVolume = 1
        this.music = this.sound.add("creditsMusic").play()
        this.text = this.add.text(0, config.height, this.cache.text.get("credits"), {font: "13px Arial", align: "center"})
    }

    update(time, delta)
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
                this.scene.start("Menu");
            }
        }
    }
}