class BlackRider extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
	{
		super(scene, x, y, "blackrider")
		
		// Add to updatelist.
        scene.add.existing(this)
        scene.physics.add.existing(this)
		this.setOrigin(0.5, 1)
		
		// Animation
		this.anims.create ({
            key: "riderWalking",
            frames: this.anims.generateFrameNumbers("blackrider", {start: 0, end: 3}),
            frameRate: 7,
			repeat: -1
        }),
		this.play("riderWalking", true)
		
		this.started = false
	}
	
	preUpdate(time, delta)
	{
		//
		if (this.scene.cameraLock)
		{
			if (!this.started)
			{
				this.scene.sound.stopAll()
				this.scene.sound.play("bossMusic")
				this.body.setGravityY(300)
				this.started = true
			}
		}
	}
}