class BlackRider extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, firstX, lastX)
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
		this.moving = false
		this.velocity  = 1
		this.firstX = firstX
        this.lastX  = lastX
		this.flipX = false
		
		this.movingTimer = scene.time.addEvent({
			delay: 4000,
			callback: function(){
				this.moving = true
				},
			args: [],
			callbackScope: this,
			loop: false,
			repeat: 0,
			startAt: 0,
			timeScale: 1,
			paused: true
		});
	}
	
	preUpdate(time, delta)
	{
		super.preUpdate(time, delta)
		
		//
		if (this.scene.cameraLock)
		{
			if (!this.started)
			{
				this.scene.sound.stopAll()
				this.scene.sound.play("bossMusic")
				this.body.setGravityY(300)
				this.started = true
				this.movingTimer.paused = false
			}
		}
		
		if (this.moving)
		{
			// Enemy walk.
            if (!this.flipX)
            {
                this.x -= this.velocity
            }
            else if (this.flipX)
            {
                this.x+= this.velocity
            }
		}
		
		// Change direction
        if (this.x <= this.firstX)
        {
			this.flipX = true
        }
        else if (this.x >= this.lastX)
        {
				
			this.flipX = false
        }
	}
}