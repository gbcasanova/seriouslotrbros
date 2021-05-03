class Play extends Phaser.Scene
{
    constructor()
    {
        super({key: "Play"})
    }

    preload()
    {
        this.load.image("playButton", "assets/sprites/playButton.png")
    }

    create()
    {
        let playButton = this.add.sprite(config.width/2, config.height/2, "playButton")
            .setInteractive({cursor: 'pointer'});
        
        playButton.on('pointerdown', function (event) 
        {
            this.scene.start("Menu");
        }, this);
    }
}