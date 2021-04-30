class Balrog extends Phaser.Scene
{
    constructor()
    {
        super({key: "Balrog"})
    }

    preload()
    {
        this.load.image("moria3D", "assets/backgrounds/moria3D.png")
        this.load.image("moriaSkies", "assets/backgrounds/moriaSkies.png")
        this.load.image("moriaMountains", "assets/backgrounds/moriaMountains.png")
        this.load.image("moriaTombs", "assets/backgrounds/moriaTombs.png")
    }

    create()
    {
        this.playerCamera = {x: config.width/2, y: config.height/2}
        this.cameras.main.startFollow(this.playerCamera, true, 0.2, 1)

        this.keys = {
            d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        }

        // Parallax.
        this.add.image(config.width/2, config.height/2, "moriaSkies").setScrollFactor(0).setDepth(-1)
        createParallax(this, config.width * 5, "moriaTombs", 0.25)
        createParallax(this, config.width * 5, "moriaMountains", 0.5)
        this.add.sprite(0, 0, "moria3D").setOrigin(0, 0)
    }

    update(time, delta)
    {
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
    }
}