class Button extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, frame, execute)
    {
        super(scene, x, y, "buttons", frame)

        this.setInteractive({cursor: 'pointer'});

        this.on('pointerover', () => 
        { 
            this.setFrame(frame + 1)
        });

        this.on('pointerout', () => 
        { 
            this.setFrame(frame)
        });

        this.on('pointerdown', function (event) 
        {
            if (typeof execute !== 'undefined')
            {
                execute(scene)
            }
        }, this);

        scene.add.existing(this)
    }
}