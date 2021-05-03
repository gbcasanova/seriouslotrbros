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
        /*arcade: 
        {
            debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            fps: 60
        }*/
    },

    scene: [Play, Menu, Level, Select, Balrog, Credits]
}

var levels = [
    { // 0 - Hobbiton 1
        dir: "assets/tilemaps/hobbiton-1.json",
        backgrounds: [
            "assets/backgrounds/hobbitonSkies.png", 
            "assets/backgrounds/hobbitonClouds.png", 
            "assets/backgrounds/hobbitonMountains2.png"
        ],
        music: "assets/music/hobbiton-1.mp3"
    },
    { // 1 - Hobbiton 2
        dir: "assets/tilemaps/hobbiton-2.json",
        backgrounds: [
            "assets/backgrounds/hobbitonSkies.png", 
            "assets/backgrounds/hobbitonClouds.png", 
            "assets/backgrounds/hobbitonMountains2.png"
        ],
        music: "assets/music/hobbiton-1.mp3"
    },
	{ // 2 - Hobbiton 3
        dir: "assets/tilemaps/hobbiton-3.json",
        backgrounds: [
            "assets/backgrounds/hobbitonSkies.png", 
            "assets/backgrounds/hobbitonClouds.png", 
            "assets/backgrounds/hobbitonMountains2.png"
        ],
        music: "assets/music/hobbiton-1.mp3"
    },
	{ // 3 - Bree 1
		dir: "assets/tilemaps/bree-0.json",
		backgrounds: [
			"assets/backgrounds/breeSkies.png",
			"assets/backgrounds/breeBuildings0.png",
			"assets/backgrounds/breeBuildings1.png"
		],
		music: "assets/music/bree.mp3"
	},
	{ // 4 - Bree 2
		dir: "assets/tilemaps/bree-1.json",
		backgrounds: [
			"assets/backgrounds/breeSkies.png",
			"assets/backgrounds/breeBuildings0.png",
			"assets/backgrounds/breeBuildings1.png"
		],
		music: "assets/music/bree.mp3"
	},
	{ // 5 - Bree 3
		dir: "assets/tilemaps/bree-2.json",
		backgrounds: [
			"assets/backgrounds/breeSkies.png",
			"assets/backgrounds/breeBuildings0.png",
			"assets/backgrounds/breeBuildings1.png"
		],
		music: "assets/music/bree.mp3"
	},
	{ // 6 - Bree 4
		dir: "assets/tilemaps/bree-3.json",
		backgrounds: [
			"assets/backgrounds/breeSkies.png",
			"assets/backgrounds/breeBuildings0.png",
			"assets/backgrounds/breeBuildings1.png"
		],
		music: "assets/music/bree.mp3"
	},
    { // 7 - Caradhras 1
        dir: "assets/tilemaps/caradhras-0.json",
        backgrounds: [
			"assets/backgrounds/caradhrasSkies.png",
			"assets/backgrounds/caradhrasClouds.png",
			"assets/backgrounds/caradhrasMountains.png"
		],
        music: "assets/music/caradhras.mp3"
    },
    { // 8 - Caradhras 2
        dir: "assets/tilemaps/caradhras-1.json",
        backgrounds: [
			"assets/backgrounds/caradhrasSkies.png",
			"assets/backgrounds/caradhrasClouds.png",
			"assets/backgrounds/caradhrasMountains.png"
		],
        music: "assets/music/caradhras.mp3"
    },
    { // 9 - Moria 1
        dir: "assets/tilemaps/moria-0.json",
        backgrounds: [
			"assets/backgrounds/moriaSkies.png",
			"assets/backgrounds/moriaTombs.png",
			"assets/backgrounds/moriaMountains.png"
		],
        music: "assets/music/moria.mp3"
    }
]

var currentLevel = 0

var game = new Phaser.Game(config)
