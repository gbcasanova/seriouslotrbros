class BlackRider extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
	{
		super(scene, x, y, "blackrider")
		
		// Add to updatelist.
        scene.add.existing(this)
        scene.physics.add.existing(this)
	}
}