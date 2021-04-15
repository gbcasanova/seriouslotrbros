var config = {
    type:Phaser.WEBGL,
    width: 256,
    height: 240,
    roundPixels: true,
    pixelArt: true,
    disableContextMenu: true,

    fps: 
    {
        //target: 60,
        //forceSetTimeOut: true
    },

    scale:
    {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    render: 
    {
        pixelArt: true, 
        antialias: false
    },

    physics: 
    {
        default: 'arcade',
        arcade: 
        {
            debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            fps: 60
        }
    },

    scene: [Select, Level, Menu]
}

var levels = [
    {
        dir: "assets/tilemaps/hobbiton-1.json",
        backgrounds: [
            "assets/backgrounds/hobbitonSkies.png", 
            "assets/backgrounds/hobbitonClouds.png", 
            "assets/backgrounds/hobbitonMountains2.png"
        ],
        music: "assets/music/hobbiton-1.mp3"
    },
    {
        dir: "assets/tilemaps/hobbiton-2.json",
        backgrounds: [
            "assets/backgrounds/hobbitonSkies.png", 
            "assets/backgrounds/hobbitonClouds.png", 
            "assets/backgrounds/hobbitonMountains2.png"
        ],
        music: "assets/music/hobbiton-1.mp3"
    },
	{
        dir: "assets/tilemaps/hobbiton-3.json",
        backgrounds: [
            "assets/backgrounds/hobbitonSkies.png", 
            "assets/backgrounds/hobbitonClouds.png", 
            "assets/backgrounds/hobbitonMountains2.png"
        ],
        music: "assets/music/hobbiton-1.mp3"
    },
	{
		dir: "assets/tilemaps/bree-0.json",
		backgrounds: [
			"assets/backgrounds/breeSkies.png",
			"assets/backgrounds/breeBuildings0.png",
			"assets/backgrounds/breeBuildings1.png"
		],
		music: "assets/music/bree.mp3"
	},
	{
		dir: "assets/tilemaps/bree-1.json",
		backgrounds: [
			"assets/backgrounds/breeSkies.png",
			"assets/backgrounds/breeBuildings0.png",
			"assets/backgrounds/breeBuildings1.png"
		],
		music: "assets/music/bree.mp3"
	}
]

var currentLevel = 4

var game = new Phaser.Game(config)
