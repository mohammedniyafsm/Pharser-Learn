const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: "arcade",
        arcade: { debug: true }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: { preload, create, update }
};

new Phaser.Game(config);

let player, cursors, map, wallLayer;

function preload() {
    this.load.tilemapTiledJSON("town", "maps/towinfy.json");

    this.load.image("floor", "tilesets/floor.png");
    this.load.image("floordiff", "tilesets/floordiff.png");
    this.load.image("Inside_home_B", "tilesets/Inside_home_B.png");
    this.load.image("Interiors", "tilesets/Interiors_free_32x32.png");
    this.load.image("main-bg", "tilesets/main-bg.png");
    this.load.image("Room_wall", "tilesets/Room_Builder_free_32x32.png");
    this.load.image("sa", "tilesets/sa.jpg");
    this.load.image("Tileset_32x32_2", "tilesets/Tileset_32x32_2.png");
    this.load.image("trees", "tilesets/trees.png");

    this.load.image("player", "tilesets/Sample.png");
}

function create() {
    map = this.make.tilemap({ key: "town" });
    
    const allSets = [
        map.addTilesetImage("floor", "floor"),
        map.addTilesetImage("floordiff", "floordiff"),
        map.addTilesetImage("Inside_home_B", "Inside_home_B"),
        map.addTilesetImage("Interiors", "Interiors"),
        map.addTilesetImage("main-bg", "main-bg"),
        map.addTilesetImage("Room_wall", "Room_wall"),
        map.addTilesetImage("sa", "sa"),
        map.addTilesetImage("Tileset_32x32_2", "Tileset_32x32_2"),
        map.addTilesetImage("trees", "trees"),
    ];

    map.createLayer("bg-main", allSets, 0, 0);
    map.createLayer("floor", allSets, 0, 0);
    map.createLayer("design-wall", allSets, 0, 0);
    a = map.createLayer("white-wall", allSets, 0, 0);

    wallLayer = map.createLayer("furniture", allSets, 0, 0);
    wallLayer.setCollisionByProperty({ collides: true });
    a.setCollisionByProperty({ collides: true });

    player = this.physics.add.sprite(200, 200, "player");

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(1); // <— ZOOM HERE

    this.physics.add.collider(player, wallLayer);
    this.physics.add.collider(player, a);
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.setVelocity(0);

    if (cursors.left.isDown) player.setVelocityX(-150);
    if (cursors.right.isDown) player.setVelocityX(150);
    if (cursors.up.isDown) player.setVelocityY(-150);
    if (cursors.down.isDown) player.setVelocityY(150);
}
