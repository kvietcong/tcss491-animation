const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./skeleton.png");

const animators = []
ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	const skeleton = ASSET_MANAGER.getAsset("./skeleton.png");

	const scale = 4;
	const frameWidth = skeleton.width / 10;
	const frameHeight = skeleton.height / 5;
	const frameAmount = 10;
	const duration = 1/16;

	for (let i = 0; i < 5; i++)
		animators.push(new Animator(
			skeleton, frameWidth, frameHeight, frameAmount,
			0, 32*i, duration, scale));

	class TestEntity {
		constructor(animator, x, y) {
			this.x = x; this.y = y;
			this.animator = animator; this.animator.play();
		}
		update(gameEngine) { this.animator.update(gameEngine); }
		draw(ctx) { this.animator.getDrawFunction()(ctx, this.x, this.y); }
	}

	const entities = animators
		.map((animator, i) => new TestEntity(animator, 0, i*32*scale));

	entities.forEach(entity => gameEngine.addEntity(entity))

	gameEngine.init(ctx);
	gameEngine.start();
});

const playAll = () => animators.forEach(a => a.play());
const pauseAll = () => animators.forEach(a => a.pause());
const resetAll = () => animators.forEach(a => a.reset());