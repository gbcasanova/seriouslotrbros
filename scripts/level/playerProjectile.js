class Projectile extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, goingLeft, projectileSprite)
    {
        super(scene, x, y, projectileSprite)

        // Add to updatelist.
        scene.add.existing(this)
        scene.physics.add.existing(this)
        
        this.goingLeft = goingLeft
        this.flipX = this.goingLeft
        this.projectileVelocity = 160
        this.projectileDuration = 30
        this.setDepth(3)
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta)

        this.projectileDuration--

        if (this.goingLeft)
        {
            this.setVelocityX(-this.projectileVelocity)
        }
        else
        {
            this.setVelocityX(this.projectileVelocity)
        }

        if (this.projectileDuration <= 0)
        {
            this.destroy()
        }
    }
}