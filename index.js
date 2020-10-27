let buffer = document.createElement("canvas").getContext("2d");
let ctx = document.querySelector("canvas").getContext("2d");

let player = new Player();

let controller = new Controller();

let tileSheetImage = new Image();
tileSheetImage.src = "space4.png";
let tilesheet_columns = 8;
let tileSize = 16;

let columns = 24;
let rows = 18;

let sprite_sheet = {
    sprite_size: 16,
    frame_sets: [[0, 1], [2, 3], [4, 5]],
    image: new Image()
};

sprite_sheet.image.src = "player.png"

let mapBackground = [
    25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27,
    33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35,
    41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43,
    25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27,
    33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35,
    41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43,
    25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27,
    33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35,
    41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43,
    25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27,
    33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35,
    41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43,
    25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27,
    33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35,
    41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43,
    25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27, 25, 26, 27,
    33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35, 33, 34, 35,
    41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43, 41, 42, 43,
];

buffer.canvas.width = columns * tileSize;
buffer.canvas.height = rows * tileSize;

function drawMap(map) {
    if (!map) {
        updateMap(level1)
    }
    for (let index = 0; index < map.length; index++) {
        let value = map[index] - 1;
        let sourceX = (value % tilesheet_columns) * tileSize;
        let sourceY = Math.floor(value / tilesheet_columns) * tileSize;
        let destinationX = (index % columns) * tileSize;
        let destinationY = Math.floor(index / columns) * tileSize;
        buffer.drawImage(tileSheetImage, sourceX, sourceY, tileSize, tileSize, destinationX, destinationY, tileSize, tileSize);
    }
}

let currentLevel = level1

let currentMap = {
    background: mapBackground,
    level: currentLevel.map,
    collision_map: currentLevel.collison_map,
    door: {
        X: currentLevel.doorX,
        Y: currentLevel.doorY,
        width: currentLevel.doorWidth,
        height: currentLevel.doorHeight,
        destination: currentLevel.destination
    },
}

function updateMap(newLevel) {
    currentLevel = newLevel
    currentMap = {
        background: mapBackground,
        level: currentLevel.map,
        collision_map: currentLevel.collison_map,
        door: {
            X: currentLevel.doorX,
            Y: currentLevel.doorY,
            width: currentLevel.doorWidth,
            height: currentLevel.doorHeight,
            destination: currentLevel.destination
        },
    }
}


function isGrounded() {
    if (player.y > buffer.canvas.height - tileSize - (player.height - 4)) {
        return true;
    }
    return false;
}

function detectBoundaryCollision() {
    if (isGrounded()) {
        jumps = 0;
        player.jumping = false;
        player.y = buffer.canvas.height - tileSize - (player.height - 4);
        player.y_velocity = 0;
    } else if (player.y < 0) {
        player.y = 0;
        player.y_velocity = 0;
    }

    if (player.x < 0) {
        player.x_velocity = 0;
        player.x = 0;
    } else if (player.x > buffer.canvas.width - player.width) {
        player.x_velocity = 0;
        player.x = buffer.canvas.width - player.width;
    }
}

function detectDoor() {
    if (player.x > (currentMap.door.X - 5) && player.x < (currentMap.door.X + 5) && player.y > (currentMap.door.Y - 5) && player.y < (currentMap.door.Y + 5)) {
        if (currentMap.door.destination) {
            updateMap(currentMap.door.destination)
        } else {
            updateMap(level1)
        }
    }
}

function detectPlatformCollision(index) {
    let tile_x = (index % columns) * tileSize;
    let tile_y = Math.floor(index / columns) * tileSize - 8;
    if (player.x > (tile_x - (tileSize / 2)) && player.x < (tile_x + (tileSize / 2)) && player.y > (tile_y - tileSize) && player.y < (tile_y)) {
        player.y = tile_y - tileSize
        player.jumping = false
        player.y_velocity = 0
        jumps = 0
    }
}

function detectBoxCollision(index) {
    let tile_x = (index % columns) * tileSize;
    let tile_y = Math.floor(index / columns) * tileSize;
    if (player.x > (tile_x - tileSize) && player.x < (tile_x + tileSize) && player.y > (tile_y - tileSize) && player.y < (tile_y)) {
        player.y = tile_y - tileSize
        player.jumping = false
        player.y_velocity = 0
        jumps = 0
    }
}

function detectSideCollision(index) {
    let tile_x = (index % columns) * tileSize - 3;
    let tile_y = Math.floor(index / columns) * tileSize;
    if (player.x > (tile_x - tileSize) && player.x < (tile_x + tileSize) && player.y > (tile_y - tileSize) && player.y < (tile_y)) {
        if (player.x_velocity > 0) {
            player.x = tile_x - tileSize
        } else {
            player.x = tile_x + tileSize
        }
    }
}

function detectItemCollision(index) {
    let item_x = (index % columns) * tileSize;
    let item_y = Math.floor(index / columns) * tileSize;
    if (player.x > (item_x - tileSize) && player.x < (item_x + tileSize) && player.y > (item_y - tileSize) && player.y < (item_y + tileSize)) {
        currentMap.level[index] = 00;
    }
}

function detectCollision(map) {
    for (let index = 0; index < map.length; index++) {
        let value = map[index]
        switch (value) {
            case 01:
                detectPlatformCollision(index);
                break;
            case 02:
                detectBoxCollision(index)
                break;
            case 03:
                detectItemCollision(index);
                break;
            case 04:
                detectSideCollision(index);
                break;
            default:
                break;
        }
    }
}


let jumps = 0;
function jump() {
    controller.up.active = false;
    player.jumping = true;
    if (jumps < 1) {
        player.y_velocity -= 20;
    } else {
        player.y_velocity -= 20;
    }
    jumps++;
}

function gameLoop() {
    if (controller.up.active && !player.jumping) {
        jump();
    }

    if (jumps < 2 && !isGrounded() && controller.up.active) {
        jump();
    }

    if (controller.left.active) {
        player.animation.change(sprite_sheet.frame_sets[2], 15);
        player.x_velocity -= 0.5;
    }

    if (controller.right.active) {
        player.animation.change(sprite_sheet.frame_sets[1], 15);
        player.x_velocity += 0.5;
    }

    if (!controller.left.active && !controller.right.active) {
        player.animation.change(sprite_sheet.frame_sets[0], 20);
    }

    player.update();
    player.animation.update();
    detectBoundaryCollision();
    detectDoor();
    detectCollision(currentMap.collision_map);

    buffer.imageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
    buffer.clearRect(0, 0, buffer.canvas.width, buffer.canvas.height)
    drawMap(currentMap.background);
    drawMap(currentMap.level);
    player.draw();
    if (currentLevel == level6) {
        buffer.font = "15px Comic Sans MS";
        buffer.fillStyle = "red";
        buffer.textAlign = "center";
        buffer.fillText("Game Over", buffer.canvas.width / 2, buffer.canvas.height / 2);
        buffer.font = "8px Comic Sans MS";
        buffer.fillStyle = "red";
        buffer.fillText("Level 1", 17, 215);
    }
    ctx.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, ctx.canvas.width, ctx.canvas.height);

    window.requestAnimationFrame(gameLoop);
}

function resize() {
    const window_width = document.documentElement.clientWidth;
    const window_height = document.documentElement.clientHeight;

    const display_width = buffer.canvas.width;
    const display_height = buffer.canvas.height;

    const width_ratio = window_width / display_width;
    const height_ratio = window_height / display_height;

    const scale = width_ratio < height_ratio ? width_ratio : height_ratio;

    ctx.canvas.width = Math.floor(display_width * scale);
    ctx.canvas.height = Math.floor(display_height * scale);

    drawMap(currentMap.background);
    drawMap(currentMap.level);
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.addEventListener("resize", resize);
tileSheetImage.addEventListener("load", function (event) {
    sprite_sheet.image.addEventListener("load", function (event) {
        resize();
        window.requestAnimationFrame(gameLoop);
    }, { once: true });
}, { once: true });
