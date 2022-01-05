class Animator {
    constructor(
        spriteSheet,
        frameWidth, frameHeight,
        frameAmount,
        startX = 0, startY = 0,
        frameDuration = 1/30,
        scale = 1,
        isHorizontal = true,
    ) {
        this.scale = scale;
        this.spriteSheet = spriteSheet;
        this.isHorizontal = isHorizontal;

        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameAmount = frameAmount - 1;
        this.frameDuration = frameDuration;

        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.startY = startY;

        this.timeSinceLastFrameChange = 0;
        this.isPlaying = false;
        this.isReverse = false;
        this.isLooping = true;
    }

    update(gameEngine) {
        if (!this.isPlaying) return;

        this.timeSinceLastFrameChange += gameEngine.deltaTime;

        if (this.timeSinceLastFrameChange >= this.frameDuration) {
            // Frame Change Logic
            if (this.isHorizontal) {
                this.x += (this.isReverse ? -1 : 1) * this.frameWidth;
            } else {
                this.y += (this.isReverse ? -1 : 1) * this.frameHeight;
            }
            if (
                (abs(this.y - this.startY)
                    >= this.frameAmount * this.frameHeight) && !this.isHorizontal
                ||
                (abs(this.x - this.startX) * (this.isHorizontal ? 1 : 0)
                    >= this.frameAmount * this.frameWidth) && this.isHorizontal
            ) {
                if (this.isLooping) {
                    this.x = this.startX;
                    this.y = this.startY;
                } else {
                    this.pause();
                }
            }
            this.timeSinceLastFrameChange = 0;
        }
    }

    // setFrame(x, y) { this.x = x; this.y = y; }

    play(isReverse = false) {
        this.isPlaying = true;
        this.isReverse = isReverse;
    }

    pause() { this.isPlaying = false; }

    setLooping(isLooping = true) { this.isLooping = isLooping; }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.timeSinceLastFrameChange = 0;
    }

    getDrawFunction() {
        const draw = (ctx, x, y) => {
            ctx.drawImage(
                this.spriteSheet,
                this.x, this.y,
                this.frameWidth, this.frameHeight,
                x, y,
                this.frameWidth * this.scale,
                this.frameHeight * this.scale
            );
        };

        return draw;
    };
}