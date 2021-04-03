class Item extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, type, flippedVertical)
    {
        super(scene, x, y, "items", 0)

        // Add to updatelist.
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setOrigin(0, 1)
        this.setImmovable(true)
        this.setDepth(2)
		this.flipY = flippedVertical
		
		this.bridgeTimer = 0

        switch(type)
        {
            case "coin":
                this.setFrame(1)
                scene.physics.add.overlap(this, scene.player, function()
                {
                    scene.sound.play("coin")
                    this.destroy()
                }, null, this)
                break

            case "spike":
                this.setFrame(2)

                // Collisions w/ player.
                scene.physics.add.overlap(this, scene.player, function()
                {
                    scene.player.hurt()
                }, null, this)

                // Collisions w/ AI.
                scene.physics.add.overlap(this, scene.aiPlayer, function()
                {
                    scene.aiPlayer.hurt()
                }, null, this)
                break

            case "spring":
                this.setFrame(3)

                // Collisions w/ player.
                scene.physics.add.collider(
                    scene.player,
                    this,
                    function (_player, _this)
                    {
                        if (_player.body.touching.down && _this.body.touching.up)
                        {
                            scene.sound.play("spring")
                            scene.player.setVelocityY(-250)
                        }
                    }
                )

                // Collisions w/ AI.
                scene.physics.add.collider(
                    scene.aiPlayer,
                    this,
                    function (_aiPlayer, _this)
                    {
                        if (_aiPlayer.body.touching.down && _this.body.touching.up)
                        {
                            _aiPlayer.setVelocityY(-250)
                        }
                    }
                )
                break

            case "life":
                this.setFrame(7)
                scene.physics.add.overlap(this, scene.player, function()
                {
                    if (scene.player.lives < 4)
                    {
                        scene.player.lives += 1
                        scene.sound.play("life")
                        this.destroy()
                    } 
                }, null, this)
                break
			
			case "bridge":
				this.setFrame(9)
				
				// Player
				scene.physics.add.collider(
                    scene.player,
                    this,
                    function (_player, _this)
                    {
                        if (_player.body.touching.down && _this.body.touching.up)
                        {
                            _this.bridgeTimer += 1
							if (_this.bridgeTimer >= 7)
							{
								_this.setVelocityY(60)
								_player.canJump
							}
                        }
                    }
                )
				
				//Ai Player
				scene.physics.add.collider(
                    scene.aiPlayer,
                    this,
                    function (_aiPlayer, _this)
                    {
                        if (_aiPlayer.body.touching.down && _this.body.touching.up)
                        {
                            _this.bridgeTimer += 1
							if (_this.bridgeTimer >= 0)
							{
								_this.setVelocityY(100)
							}
                        }
                    }
                )
				break
			
			case "redKey":
				this.setFrame(4)
				
				// Player
				scene.physics.add.overlap(this, scene.player, function()
				{
					scene.player.keys.red = true
					this.destroy()
				}, null, this)
				break
			
			case "yellowKey":
				this.setFrame(5)
				
				// Player
				scene.physics.add.overlap(this, scene.player, function()
				{
					scene.player.keys.yellow = true
					this.destroy()
				}, null, this)
				break
				
			case "redBlock":
				this.setFrame(10)
				
				// Player
				scene.physics.add.collider(
                    scene.player,
                    this,
                    function (_player, _this)
                    {
                        if (_player.keys.red)
						{
							_this.destroy()
						}
                    }
                )
				
				// AI Player.
				scene.physics.add.collider(scene.aiPlayer, this)
				break
			
			case "yellowBlock":
				this.setFrame(11)
				
				// Player
				scene.physics.add.collider(
                    scene.player,
                    this,
                    function (_player, _this)
                    {
                        if (_player.keys.yellow)
						{
							_this.destroy()
						}
                    }
                )
				
				// AI Player.
				scene.physics.add.collider(scene.aiPlayer, this)
				break
        }
    }
}