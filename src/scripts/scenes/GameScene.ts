import configResize from '../core/configResize';
import { transformElement } from '../core/Display';
import { Dog } from '../objects/Dog';
import { Bees } from '../objects/Bees';
import { PowerScale } from '../objects/PowerScale';

export default class GameScene extends Phaser.Scene {

  bees: Bees;
  dog: Dog;
  power: number = 0;
  playerHealth: number;
  health: Phaser.GameObjects.Rectangle;
  isCharging: boolean = false;
  isLockInput: Boolean = false;
  sounds: any = {};
  powerScale: any;
  gameElements: any = {};

  constructor() {
    super({
      key: 'Game',
    });
  }

  preload(): void {
    this.scale.on('resize', this.resize, this);
  }

  create(): void {
    this.gameElements.gameContainer = this.add.container(0, 0);
    this.playerHealth = 100;

    this.createFences();
    this.createDog();
    this.createHive();
    this.createHealth();
    this.addSounds();

    this.resize({});
  }

  addSounds(): void {
    this.sounds.charge = this.sound.add('charge', { volume: 0.5, loop: true });
    this.sounds.fire = this.sound.add('fire', { volume: 0.5 });
    this.sounds.cry = this.sound.add('cry', { volume: 0.5 });
    this.sounds.laugh = this.sound.add('laugh', { volume: 0.4 });
  }
  // create dog's health bar
  createHealth(): void {
    const healthBar: Phaser.GameObjects.Image = this.add.image(-10, -1200, 'health_bar').setScale(2);
    this.health = this.add.rectangle(-160, -1200, 347, 25, 0xff0025).setOrigin(0, 0.5);

    this.gameElements.gameContainer.add([this.health, healthBar]);
  }
  // when bee stings dog health decreases
  decreaseHealth(): void {
    this.playerHealth -= 20;

    this.tweens.add({
      targets: this.health,
      scaleX: this.playerHealth / 100,
      duration: 500,
    });
  }
  // create fences
  createFences(): void {
    const fenceTop: Phaser.GameObjects.Image = this.add.image(0, -500, 'fence');
    const fenceBot: Phaser.GameObjects.Image = this.add.image(0, 500, 'fence');

    this.gameElements.gameContainer.add([fenceTop, fenceBot]);
  }
  // create dog
  createDog(): void {
    this.dog = new Dog(this, 0, -900, 'dog');
    this.gameElements.gameContainer.add(this.dog);
  }
  // create hive and bees
  createHive() {
    const hive: Phaser.GameObjects.Image = this.add.image(0, 1000, 'hive').setScale(2).setInteractive().setAngle(90);
    hive.on('pointerdown', this.charge, this);
    hive.on('pointerup', this.fire, this);

    this.bees = new Bees(this);
    this.gameElements.gameContainer.add([hive]);
  }
  // method to charge
  charge(): void {
    if (this.isLockInput) return;

    this.sounds.charge.play();

    this.dog.playWaryAnimation();
    this.isCharging = true;

    this.powerScale = new PowerScale(this);
    this.powerScale.createPowerScale(this.gameElements.gameContainer);
  }
  // method to fire
  fire(): void {
    if (this.isLockInput || this.power === 0) return;
    this.lockInput();

    this.sounds.fire.play();
    this.sounds.charge.stop();

    this.dog.playHurtAnimation();
    this.bees.fire(this.power, this.gameElements.gameContainer);
    this.isCharging = false;
    this.checkHit(this.power);
    this.power = 0;
  }
  // check hit bee to dog
  checkHit(power: number): void {
    const isHit: boolean = !((power < 45 || power > 70));
    this.time.addEvent({
      delay: 1000,
      callback() {
        if (isHit) {
          this.sounds.cry.play();
          this.dog.playBittenAnimation();
          this.decreaseHealth();
        } else {
          this.sounds.laugh.play();
          this.dog.playHappyAnimation();
        }
      },
      callbackScope: this,
    });

    this.time.addEvent({
      delay: 2500,
      callback() {
        this.unlockInput();
        // check dog's health
        if (this.playerHealth <= 0) {
          // call Game class
          this.scene.start('Finish');
          return;
        }
        this.dog.playNormalAnimation();
      },
      callbackScope: this,
    });
  }

  update(): void {
    // check is charging now
    if (this.isCharging) {
      if (this.power > 85) return;

      this.powerScale.gainPower(this.gameElements.gameContainer);
      this.power++;
    } else if (this.powerScale) this.powerScale.destroyPowerScale(this.gameElements.gameContainer);
  }
  // lock input in game
  lockInput() {
    this.isLockInput = true;
  }
  // unlock input in game
  unlockInput() {
    this.isLockInput = false;
  }

  resize({ width, height }: any): void {
    if (!this.scene.settings.active) return;

    const {
      gameContainer, finishContainer,
    } = this.gameElements;

    transformElement(this, gameContainer, { width, height }, configResize.gameContainer.transform);
    transformElement(this, finishContainer, { width, height }, configResize.welcomeContainer.transform);
  }
}
