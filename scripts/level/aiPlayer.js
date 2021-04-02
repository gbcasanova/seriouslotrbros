class AiPlayer extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, sprite)
    {
        super(scene, x, y, sprite)

        scene.hasAiPlayer = true

        // Add to updatelist.
        scene.add.existing(this)
        scene.physics.add.existing(this)

        let aiAnimations = [
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
            })
        ]

        this.body.setGravityY(300)
        this.body.setSize(this.width - 20, this.height)

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
    }

    hurt() {
        if (this.timer.execute) {
            this.lives -= 1 // Remove a life.
            this.timer.execute = false
            this.timer.current = this.timer.max
        } 
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta)

        if (this.scene.player.x - 30 > this.x)
        {
            this.setVelocityX(100)
            this.play("walking", true)
            this.flipX = false
        }
        else if (this.scene.player.x + 30 < this.x)
        {
            this.setVelocityX(-100)
            this.play("walking", true)
            this.flipX = true
        }
        else
        {
            this.setVelocityX(0)
            this.play("idle", true)
        }

        if (this.scene.player.y < this.y && this.body.onFloor())
        {
            this.setVelocityY(-170)
        }

        // Jumping animation.
        if (this.body.velocity.y < 0) {
            this.play("jumping", true)
        } else if (this.body.velocity.y > 0) {
            this.play("falling", true)
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
                    this.y = -300
                    this.x = this.scene.player.x
                    this.lives = 4
                    this.fading = false
                    this.tint = 0xFFFFFF
                }, this);

                this.fading = true
            }
        }
    }
}