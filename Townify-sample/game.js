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
let interactZones = [];
let currentInteract = null;
let isSitting = false;

function preload() {
    this.load.tilemapTiledJSON("town", "maps/townify.json");

    this.load.image("floor", "tilesets/floor.png");
    this.load.image("floordiff", "tilesets/floordiff.png");
    this.load.image("Inside_home_B", "tilesets/Inside_home_B.png");
    this.load.image("Interiors", "tilesets/Interiors_free_32x32.png");
    this.load.image("main-bg", "tilesets/main-bg.png");
    this.load.image("Room_wall", "tilesets/Room_Builder_free_32x32.png");
    this.load.image("sa", "tilesets/sa.jpg");
    this.load.image("Tileset_32x32_2", "tilesets/Tileset_32x32_2.png");
    this.load.image("trees", "trees");

    // ⭐ Standing & Sitting images
    this.load.image("playerStanding", "tilesets/Sample.png");
    this.load.image("playerSitting", "tilesets/Sample2.png");
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
    const whiteWall = map.createLayer("white-wall", allSets, 0, 0);
    wallLayer = map.createLayer("furniture", allSets, 0, 0);

    wallLayer.setCollisionByProperty({ collides: true });
    whiteWall.setCollisionByProperty({ collides: true });

    // ⭐ Player starts standing
    player = this.physics.add.sprite(200, 200, "playerStanding");

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(1);

    this.physics.add.collider(player, wallLayer);
    this.physics.add.collider(player, whiteWall);

    cursors = this.input.keyboard.createCursorKeys();

    loadInteractObjects.call(this);
}

// ⭐ Read chairs from object layer
function loadInteractObjects() {
    const objectLayer = map.getObjectLayer("objects");

    if (!objectLayer) {
        console.warn("⚠ No object layer named 'objects' found!");
        return;
    }

    objectLayer.objects.forEach(obj => {
        if (!obj.properties) return;

        let props = {};
        obj.properties.forEach(p => props[p.name.trim()] = p.value);

        if (props.interact === "chair") {

            let zone = this.add.zone(obj.x, obj.y, obj.width, obj.height);
            this.physics.add.existing(zone);
            zone.body.setAllowGravity(false);
            zone.body.setImmovable(true);

            zone.interactType = "chair";
            zone.cx = obj.x + obj.width / 2;
            zone.cy = obj.y + obj.height / 2;

            interactZones.push(zone);

            this.physics.add.overlap(player, zone, () => {
                currentInteract = zone;
            });
        }
    });
}

function update() {

    // ⭐ Check if player is still overlapping with zone
    currentInteract = interactZones.find(z =>
        Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), z.getBounds())
    );

    // ⭐ Sitting mode
    if (isSitting) {
        player.setVelocity(0);

        // stand up automatically when leaving the zone
        if (!currentInteract) {
            isSitting = false;
            player.setTexture("playerStanding");
        }

        return;
    }

    // ⭐ Movement
    player.setVelocity(0);

    if (cursors.left.isDown) player.setVelocityX(-150);
    if (cursors.right.isDown) player.setVelocityX(150);
    if (cursors.up.isDown) player.setVelocityY(-150);
    if (cursors.down.isDown) player.setVelocityY(150);

    // ⭐ Auto-sit when player enters chair zone
    if (currentInteract && currentInteract.interactType === "chair") {
        player.setTexture("playerSitting");
        player.x = currentInteract.cx;
        player.y = currentInteract.cy - 10;
        isSitting = true;
    }
}
