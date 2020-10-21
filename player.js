class Player {
    constructor() {
        this.height = 32;
        this.jumping = false;
        this.width = 32;
        this.x = 9;
        this.x_velocity = 0;
        this.y = 272;
        this.y_velocity = 0;
        this.animation = new PlayerAnimation()
    }

    update() {
        this.y_velocity += 1.5;
        this.x += this.x_velocity;
        this.y += this.y_velocity;
        this.x_velocity *= 0.9;
        this.y_velocity *= 0.9;
    }

    draw() {
        buffer.drawImage(sprite_sheet.image, player.animation.frame * sprite_sheet.sprite_size, 0, sprite_sheet.sprite_size, sprite_sheet.sprite_size, Math.floor(player.x), Math.floor(player.y), player.width, player.height);
    }
}
