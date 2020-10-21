class Controller {
    constructor() {
        this.left = { active: false, down: false };
        this.right = { active: false, down: false };
        this.up = { active: false, down: false };
    }

    keyListener(event) {
        var key_state = event.type == "keydown" ? true : false;

        switch (event.keyCode) {
            case 37:
                if (controller.left.state != key_state) controller.left.active = key_state;
                controller.left.state = key_state;
                break;
            case 38:
                if (controller.up.state != key_state) controller.up.active = key_state;
                controller.up.state = key_state;
                break;
            case 39:
                if (controller.right.state != key_state) controller.right.active = key_state;
                controller.right.state = key_state;
                break;
        }
    }
}
