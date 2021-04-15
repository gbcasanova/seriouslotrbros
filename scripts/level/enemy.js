class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, type, firstX, lastX)
    {
        super(scene, x, y, "enemies")

        // Add to updatelist.
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.firstX      = firstX
        this.lastX       = lastX
        this.dir         = "left"
        this.enemyVel    = 0
        this.enemyHealth = 1
        this.enemyDead   = false
		this.type = type
		this.attacks = false

        this.setOrigin(0.5, 1)

        switch(type)
        {
            case "orc":
                this.body.setSize(16, 42)
				this.attacks = false

                this.anims.create ({
                    key: "orcWalking",
                    frames: this.anims.generateFrameNumbers("enemies", {start: 0, end: 1}),
                    frameRate: 5,
                    repeat: -1
                }),
                this.play("orcWalking", true)

                this.enemyVel    = 1
                this.enemyHealth = 2
                break
			
			case "goblin":
                this.body.setSize(16, 42)
				this.attacks = true

                this.anims.create ({
                    key: "goblinWalking",
                    frames: this.anims.generateFrameNumbers("enemies", {start: 2, end: 3}),
                    frameRate: 5,
                    repeat: -1
                }),
                this.play("goblinWalking", true)

                this.enemyVel    = 0.5
                this.enemyHealth = 2
                break
			
			case "bomb":
				this.body.setSize(16, 16)
				this.y += 13
				this.attacks = false

                this.anims.create ({
                    key: "bombWalking",
                    frames: this.anims.generateFrameNumbers("enemies", {start: 4, end: 5}),
                    frameRate: 10,
                    repeat: -1
                }),
                this.play("bombWalking", true)

                this.enemyVel    = 3
                this.enemyHealth = 4
                break
        }

        // Destroy projectile and get hurt.
        scene.physics.add.overlap(this, scene.player.projectileGroup, function(_this, _projectile)
        {
            _projectile.destroy()
            this.enemyHealth -= 1
            this.scene.cameras.main.shake(50, 0.003);
        }, null, this)

        // Hurt player.
        scene.physics.add.overlap(this, scene.player, function()
        {
            if (!this.enemyDead)
            {
                scene.player.hurt()
            }
        }, null, this)
		
		// Projectiles
        this.projectileCounter = 0
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta)

        // Check iof the enemy isn't dead.
        if (!this.enemyDead)
        {
            // Enemy walk.
            if (this.dir == "left")
            {
                this.x-= this.enemyVel
            }
            else if (this.dir == "right")
            {
                this.x+= this.enemyVel
            }

            // Change direction
            if (this.x <= this.firstX)
            {
                this.dir = "right"
				
				if (!this.attacks)
				{
					this.flipX = false
				}
				else
				{
					this.flipX = true
				}
            }
            else if (this.x >= this.lastX)
            {
                this.dir = "left"
				
				this.flipX = true
            }

            if (this.enemyHealth <= 0)
            {
                this.enemyDead = true
                this.scene.sound.play("enemy")
                this.anims.stop()

                // Make sprite red.
                let redTween = this.scene.tweens.add({
                    targets: this,
                    tint: {from: 0xFFFFFF, to: 0xFF0000},
                    ease: 'bounce.easeOut',
                    duration: 300,
                    repeat: 0,
                    yoyo: false
                })

                redTween.on('complete', function(tween, targets){
                    // Make sprite transparent.
                    let transparentTween = this.scene.tweens.add({
                        targets: this,
                        alpha: {
                            getStart: () => 1,
                            getEnd: () => 0
                        },
                        ease: 'Bounce.easeOut',
                        duration: 200,
                        repeat: 0,
                        yoyo: false
                    })

                    // Destroy Body.
                    transparentTween.on("complete", function(tween, targets) {
                        this.destroy()
                    }, this)
                }, this);

            }
        }
		
		// Attack projectiles.
		switch(this.type)
		{
			case "goblin":
				// Shoot projectiles.
				if(this.projectileCounter >= 15)    
				{
					this.scene.enemyProjectiles.add(new Projectile(this.scene, this.x, this.y - this.height/2, this.flipX, "goblinAxe", 100, 30))
					this.projectileCounter = 0;
				}
				else 
				{
					this.projectileCounter++
				}
				break
		}
    }
}