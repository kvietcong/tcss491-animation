const gameEngine = new GameEngine();

const assetManager = new AssetManager();

assetManager.queueDownload("./skeleton.png");
assetManager.queueDownload("./girl.png");

const controlsSection = document.getElementById("controls");
const animators = {};

let entity;
let animator;

class TestEntity {
	constructor(animator, x, y) {
		this.x = x; this.y = y;
		this.changeAnimator(animator);
	}
	update(gameEngine) { this.animator.update(gameEngine); }
	draw(ctx) {
		this.animator.getDrawFunction()(ctx, this.x, this.y);
	}
	changeAnimator(newAnimator) {
		this.animator = newAnimator;
		newAnimator.play()
	}
}

assetManager.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	const frameDuration = 1 / 15;

	const skeleton = assetManager.getAsset("./skeleton.png");
	const skeletonFrameAmount = 10;
	const skeletonWidth = skeleton.width / skeletonFrameAmount;
	const skeletonHeight = skeleton.height / 5;
	const skeletonAnimationInfo = {
		stillFrame: { frameAmount: 0, startX: 0, startY: 0 },
		idle: { frameAmount: skeletonFrameAmount, startX: 0, startY: skeletonHeight * 0 },
		derp: { frameAmount: skeletonFrameAmount, startX: 0, startY: skeletonHeight * 1 },
		walk: { frameAmount: skeletonFrameAmount, startX: 0, startY: skeletonHeight * 2 },
		attack: { frameAmount: skeletonFrameAmount, startX: 0, startY: skeletonHeight * 3 },
		die: { frameAmount: skeletonFrameAmount, startX: 0, startY: skeletonHeight * 4 },
	};

	animators.skeleton = new Animator(
        skeleton, "walk", skeletonAnimationInfo,
        skeletonWidth, skeletonHeight,
        frameDuration, scale = 10,
	);

	const girl = assetManager.getAsset("./girl.png");
	const girlFrameAmount = 8;
	const girlWidth = girl.width / girlFrameAmount;
	const girlHeight = girl.height / 4;
	const girlAnimationInfo = {
		stillFrame: { frameAmount: 0, startX: 0, startY: 0 },
		runForward: { frameAmount: girlFrameAmount, startX: 0, startY: girlHeight * 0 },
		runLeft: { frameAmount: girlFrameAmount, startX: 0, startY: girlHeight * 1 },
		runRight: { frameAmount: girlFrameAmount, startX: 0, startY: girlHeight * 2 },
		runBack: { frameAmount: girlFrameAmount, startX: 0, startY: girlHeight * 3 },
	};

	animators.girl = new Animator(
        girl, "runForward", girlAnimationInfo,
        girlWidth, girlHeight,
        frameDuration, scale = 5.2,
	);

	animator = animators.skeleton;

	entity = new TestEntity(animator, 0, 0);
	gameEngine.addEntity(entity);

	gameEngine.init(ctx);
	gameEngine.start();

	resetControls();
});

// =========================
// Functions to add controls
// =========================
document.getElementById("sprite-change").addEventListener("submit", event => {
	event.preventDefault();
	animator = animators[event.target.sprite.value];
	entity.changeAnimator(animator);
	resetControls();
});

const addAllControls = () => {
	addAnimationList();
	addAnimationLooper();
	addAnimationReverser();
	addAnimationControls();
	addFpsControl();
	addAnimationFlipper();
};

const resetControls = () => {
	controlsSection.innerHTML = "";
	addAllControls();
};

const addAnimationList = () => {
	const animationList = Object.keys(animator.animationInfo);
	const select = document.createElement("select");
	animationList.forEach(animation => {
		const option = document.createElement("option");
		option.textContent = animation;
		option.value = animation;
		select.appendChild(option);
	});
	select.value = animator.currentAnimationKey;
	select.addEventListener("change", event => {
		const newAnimationKey = event.target.value;
		animator.setAnimation(newAnimationKey);
	});

	const div = document.createElement("div");
	const label = document.createElement("label");
	label.textContent = "Current Animation: ";
	div.appendChild(label);
	div.appendChild(select);

	controlsSection.appendChild(div);
};

const addAnimationControls = () => {
	const controls = document.createElement("div");

	const playButton = document.createElement("button");
	playButton.textContent = "▶️ Play";
	playButton.onclick = () => animator.play();

	const pauseButton = document.createElement("button");
	pauseButton.textContent = "⏸️️ Pause";
	pauseButton.onclick = () => animator.pause();

	const stopButton = document.createElement("button");
	stopButton.textContent = "⏹️ Stop";
	stopButton.onclick = () => animator.stop();

	const resetButton = document.createElement("button");
	resetButton.textContent = "Reset️️️";
	resetButton.onclick = () => animator.reset();

	const restartButton = document.createElement("button");
	restartButton.textContent = "Restart";
	restartButton.onclick = () => animator.restart();

	controls.appendChild(playButton);
	controls.appendChild(pauseButton);
	controls.appendChild(stopButton);
	controls.appendChild(resetButton);
	controls.appendChild(restartButton);

	controlsSection.appendChild(controls);
};

const addAnimationLooper = () => {
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = animator.isLooping;
	checkbox.onchange = event => {
		animator.setIsLooping(event.target.checked);
		animator.play();
	}

	const loopControl = document.createElement("div");
	const label = document.createElement("label");
	label.textContent = "Loop?";

	loopControl.appendChild(checkbox);
	loopControl.appendChild(label);

	controlsSection.appendChild(loopControl);
};

const addAnimationReverser = () => {
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = animator.isReverse;
	checkbox.onchange = event => {
		animator.setIsReverse(event.target.checked);
		animator.play();
	};

	const reverseControl = document.createElement("div");
	const label = document.createElement("label");
	label.textContent = "Reverse?";

	reverseControl.appendChild(checkbox);
	reverseControl.appendChild(label);

	controlsSection.appendChild(reverseControl);
};

const addAnimationFlipper = () => {
	const flipX = document.createElement("input");
	flipX.type = "checkbox";
	flipX.checked = animator.willFlipX;
	flipX.onchange = event => animator.setWillFlipX(event.target.checked);

	const flipY = document.createElement("input");
	flipY.type = "checkbox";
	flipY.checked = animator.willFlipY;
	flipY.onchange = event => animator.setWillFlipY(event.target.checked);

	const flipControls = document.createElement("div");

	const labelX = document.createElement("label");
	labelX.textContent = "Flip X?";
	const labelY = document.createElement("label");
	labelY.textContent = "Flip Y?";

	flipControls.appendChild(labelX);
	flipControls.appendChild(flipX);
	flipControls.appendChild(flipY);
	flipControls.appendChild(labelY);

	controlsSection.appendChild(flipControls);
};

const addFpsControl = () => {
	const controls = document.createElement("div");

	const input = document.createElement("input");
	input.type = "number";
	input.value = 1 / animator.frameDuration;

	const setFpsButton = document.createElement("button");
	setFpsButton.textContent = "Set FPS";
	setFpsButton.onclick = () => animator.setFrameDuration(1 / input.value);

	controls.appendChild(input);
	controls.appendChild(setFpsButton);

	controlsSection.appendChild(controls);
};