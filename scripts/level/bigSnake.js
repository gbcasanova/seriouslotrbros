class BigSnake extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "bigSnake")

        // Add to updatelist.
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setOrigin(0.5, 1)
        this.body.setSize(this.width - 20, this.height - 40, true)
        
    }
}