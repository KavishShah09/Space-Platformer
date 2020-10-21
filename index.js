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
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
    48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32, 48, 32,
];



let currentMapBackGround = mapBackground
let currentMapWorld = level1

buffer.canvas.width = columns * tileSize;
buffer.canvas.height = rows * tileSize;

function drawMap(map) {
    for (let index = 0; index < map.length; index++) {
        let value = map[index] - 1;
        let sourceX = (value % tilesheet_columns) * tileSize;
        let sourceY = Math.floor(value / tilesheet_columns) * tileSize;
        let destinationX = (index % columns) * tileSize;
        let destinationY = Math.floor(index / columns) * tileSize;
        buffer.drawImage(tileSheetImage, sourceX, sourceY, tileSize, tileSize, destinationX, destinationY, tileSize, tileSize);
    }
}

let jumps = 0;

function isGrounded() {
    if (player.y > buffer.canvas.height - tileSize - player.height) {
        return true;
    }
    return false;
}

function detectBoundaryCollision() {
    if (isGrounded()) {
        jumps = 0;
        player.jumping = false;
        player.y = buffer.canvas.height - tileSize - player.height;
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

    buffer.imageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
    buffer.clearRect(0, 0, buffer.canvas.width, buffer.canvas.height)
    drawMap(currentMapBackGround);
    drawMap(currentMapWorld);
    player.draw();
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

    drawMap(currentMapBackGround);
    drawMap(currentMapWorld);
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.addEventListener("resize", resize);
tileSheetImage.addEventListener("load", function (event) {
    sprite_sheet.image.addEventListener("load", function (event) {
        resize();
        window.requestAnimationFrame(gameLoop);
    });
}, { once: true });
