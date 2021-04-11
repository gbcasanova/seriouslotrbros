class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "frodo")

        // Add to updatelist.
        scene.add.existing(this)
        scene.physics.add.existing(this)

        let playerAnimations = [
            this.anims.create ({
                key: "idle",
                frames: [{key: "frodo", frame: 0}],
                frameRate: 7,
            }),

            this.anims.create ({
                key: "walking",
                frames: this.anims.generateFrameNumbers("frodo", {start: 1, end: 3}),
                frameRate: 7,
                repeat: -1
            }),

            this.anims.create({
                key: "attacking",
                frames: this.anims.generateFrameNumbers("frodo", {start: 4, end: 5}),
                frameRate: 5,
                repeat: -1
            }),

            this.anims.create({
                key: "falling",
                frames: [{key: "frodo", frame: 6}],
                frameRate: 7,
            }),

            this.anims.create({
                key: "jumping",
                frames: [{key: "frodo", frame: 7}],
                frameRate: 7,
            }),

            this.anims.create({
                key: "walkingAttacking",
                frames: this.anims.generateFrameNumbers("frodo", {start: 8, end: 10}),
                frameRate: 7,
            })
        ]

        this.play('idle')
        this.depth = 1
        this.canMove = false

        this.body.setGravityY(300)
        this.body.setSize(this.width - 20, this.height)
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
        }

        // Jumping animation.
        if (this.body.velocity.y < 0) {
            this.play("jumping", true)
        } else if (this.body.velocity.y > 0) {
            this.play("falling", true)
        }

        // Shoot projectiles.
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