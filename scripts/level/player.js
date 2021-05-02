class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, sprite)
    {
        super(scene, x, y, "frodo")

        // Add to updatelist.
        scene.add.existing(this)
        scene.physics.add.existing(this)
		this.sprite = sprite

        let playerAnimations = [
            this.anims.create ({
                key: "idle",
                frames: [{key: sprite, frame: 0}],
                frameRate: 7,
            }),

            this.anims.create ({
                key: "walking",
                frames: this.anims.generateFrameNumbers(sprite, {start: 1, end: 3}),
                frameRate: 7,
                repeat: -1
            }),

            this.anims.create({
                key: "attacking",
                frames: this.anims.generateFrameNumbers(sprite, {start: 4, end: 5}),
                frameRate: 5,
                repeat: -1
            }),

            this.anims.create({
                key: "falling",
                frames: [{key: sprite, frame: 6}],
                frameRate: 7,
            }),

            this.anims.create({
                key: "jumping",
                frames: [{key: sprite, frame: 7}],
                frameRate: 7,
            }),

            this.anims.create({
                key: "walkingAttacking",
                frames: this.anims.generateFrameNumbers(sprite, {start: 8, end: 10}),
                frameRate: 7,
            }),
			
			this.anims.create({
				key: "legolasHorseIdle",
				frames: [{key: "legolasHorse", frame: 1}],
				frameRate: 10,
			}),
			
			this.anims.create({
				key: "legolasHorseWalking",
				frames: this.anims.generateFrameNumbers("legolasHorse", {start: 0, end: 3}),
				frameRate: 10,
			})
        ]
        this.depth = 1
        this.canMove = false

        // Check if it isn't horse level.
		if (currentLevel != 6)
		{
			this.play('idle')
			this.body.setSize(this.width - 20, this.height)
		}
		else
		{
			this.play('legolasHorseWalking')
			this.body.setSize(this.width - 20, this.height)
			this.setOrigin(0.5, 1)
		}
		
		this.body.setGravityY(300)
		this.setMaxVelocity(500, 500)
        scene.cameras.main.startFollow(this, true, 0.2, 1)

        this.aKey    = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.sKey    = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.cursors = scene.input.keyboard.createCursorKeys()

        // Hurt Timer.
        this.timer = {}
        this.timer.max = 100
        this.timer.current = 0
        this.timer.execute = true
        this.timer.tween = scene.add.tween({
            paused: true,
            targets: this,
            ease: 'Power0',
            duration: 500,
            delay: 0,
            alpha: {
              getStart: () => 1,
              getEnd: () => 0.5
            },

            repeat: 0,
            yoyo: true
        })
        this.fading = false
        this.lives = 4

        // Projectiles
        this.projectileCounter = 0
        this.projectileGroup = scene.physics.add.group()
		
		// Enemy projectiles.
		scene.physics.add.overlap(this, scene.enemyProjectiles, function(_this, _projectile)
        {
            _this.hurt()
			_projectile.destroy()
        }, null, this)
		
		// Keys;
		this.keys = {
			red: false,
			yellow: false
		}
    }

    hurt() {
        if (this.timer.execute) {
            this.scene.cameras.main.shake(100, 0.007);
            this.scene.sound.play("bump")
            this.lives -= 1 // Remove a life.

            this.timer.execute = false
            this.timer.current = this.timer.max
        } 
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta)

        if (this.canMove)
        {
			if (currentLevel != 6)
			{
				// ### NORMAL WALKING. ###
				if (this.cursors.left.isDown)
				{
					this.setVelocityX(-130)

					if (this.sKey.isDown)
					{
						this.play("walkingAttacking", true)
					}
					else
					{
						this.play('walking', true)
					}
					
					this.flipX = true
				}
				else if (this.cursors.right.isDown)
				{
					this.setVelocityX(130)
					if (this.sKey.isDown)
					{
						this.play("walkingAttacking", true)
					}
					else
					{
						this.play('walking', true)
					}
					this.flipX = false
				}
				else
				{
					this.setVelocityX(0)

					if (this.sKey.isDown)
					{
						this.play("attacking", true)
					}
					else
					{
						this.play('idle', true)
					}
				}
				
				if (this.aKey.isDown && this.body.onFloor())
				{
					this.setVelocityY(-170)
					this.scene.sound.play("jump")
				}
				
				// Jumping animation.
				if (this.body.velocity.y < 0) {
					this.play("jumping", true)
				} else if (this.body.velocity.y > 0) {
					this.play("falling", true)
				}
				
				// Shoot projectiles.
				if (this.sprite == "frodo")
				{
					if(this.sKey.isDown && this.projectileCounter >= 15)    
					{
						this.projectileGroup.add(new Projectile(this.scene, this.x, this.y, this.flipX, "playerProjectile", 160, 30))
						this.scene.sound.play("sword")
						this.projectileCounter = 0;
					}
					else 
					{
						this.projectileCounter++
					}
				}
			}
			else
			{
				// ### HORSE WALKING. ###
				if (this.cursors.left.isDown)
				{
					if (this.body.velocity.y < 0) 
					{
						this.setVelocityX(-190)
						this.play("legolasHorseWalking", true)
					}
					else
					{
						this.setVelocityX(0)
						this.play("legolasHorseIdle", true)
					}
					//console.log("aaaaa")
				}
				else if (this.cursors.right.isDown)
				{
					//
				}
				else
				{
					this.play("legolasHorseWalking", true)
					this.setVelocityX(150)
				}
				
				if (this.aKey.isDown && this.body.onFloor())
				{
					this.setVelocityY(-190)
					this.scene.sound.play("jump")
				}
			}
        }

        // Update timer.
        if (this.timer.current > 0) {
            this.timer.current -= 1
            this.timer.tween.play()
            this.timer.paused = false
        }

        // If the timer is zero, you can
        // execute.
        if (this.timer.current == 0) {
            this.timer.execute = true
        }

        // Restart level with a fade out.
        if (this.lives <= 0) {
            if (!this.fading) {
                this.scene.cameras.main.fadeOut(1000, 180, 32, 42)
                this.scene.cameras.main.once('camerafadeoutcomplete', function (camera) {
                    this.scene.sound.stopAll()
                    this.scene.scene.restart()
                })
                this.fading = true
            }
        }
    }
}