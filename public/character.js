export default class Character {
    constructor(id, x, y) {
        this.id = id;  // Unique player ID
        this.x = x;     // Character's X position
        this.y = y;     // Character's Y position
        this.color = "white";
        this.health = 100;  // Player health
        this.velocity = { x: 0, y: 0 }; // Movement speed
        this.isAttacking = false;
        this.isBlocking = false;
        this.isDodging = false;
    }

    // Move the character
    move(direction) {
        const speed = 5;
        switch (direction) {
            case 'left':
                this.velocity.x = -speed;
                break;
            case 'right':
                this.velocity.x = speed;
                break;
            case 'up':
                this.velocity.y = -speed;
                break;
            case 'down':
                this.velocity.y = speed;
                break;
            default:
                this.velocity.x = 0;
                this.velocity.y = 0;
                break;
        }
    }

    draw(c) {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, 50, 190); // Example square sprite for the player
    }

    // Attack action
    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 500); // Attack animation duration
    }

    // Block action
    block() {
        this.isBlocking = true;
        setTimeout(() => {
            this.isBlocking = false;
        }, 300); // Block duration
    }

    // Dodge action
    dodge() {
        this.isDodging = true;
        setTimeout(() => {
            this.isDodging = false;
        }, 400); // Dodge duration
    }

    // Update character position based on velocity
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    // Serialize for sending via sockets
    serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            color: this.color, 
            health: this.health,
            isAttacking: this.isAttacking,
            isBlocking: this.isBlocking,
            isDodging: this.isDodging,
        };
    }
}

