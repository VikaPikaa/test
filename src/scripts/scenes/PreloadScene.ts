// CLASS TO PRELOAD ASSETS
import configResize from '../core/configResize';
import { transformElement } from '../core/Display';

export default class PreloadScene extends Phaser.Scene {
  
  loadingContainer: any = {};

  constructor() {
    super({
      key: 'Preload',
    });
  }

  init() {
    this.scale.on('resize', this.resize, this);
  }

  // method for creating beauty asset loading
  createPreloadVisualization(): void {
    this.loadingContainer = this.add.container(400, 300);

    const preloadText = this.add.text(0, 0, '%0', {
      font: '70px',
      align: 'center',
    }).setOrigin(0.5, 0.5);
    this.load.on('progress', (percent) => {
      const per = percent * 100;
      preloadText.text = `%${Math.round(per)}`;
    }, this);

    const makeLine = (y: number, color: number): Phaser.GameObjects.Graphics => {
      const line = this.add.graphics();
      line.lineStyle(13, color, 1);
      line.beginPath();
      line.arc(0, 0, y, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), true);
      line.strokePath();

      return line;
    };

    const reMakeLine = (line, y, color, tweenValue) => {
      line.clear();
      line.lineStyle(13, color, 1);
      line.arc(0, 0, y, Phaser.Math.DegToRad(tweenValue), Phaser.Math.DegToRad(tweenValue + 180), true);
      line.strokePath();

      return line;
    };

    let graphicLine1 = makeLine(100, 0xff680e);
    let graphicLine2 = makeLine(120, 0xf76f08);
    let graphicLine3 = makeLine(140, 0xffad00);
    let graphicLine4 = makeLine(160, 0xfdc438);
    let graphicLine5 = makeLine(180, 0xfbd870);

    const addAnimation = () => {
      this.tweens.addCounter({
        from: 0,
        to: 360,
        duration: 3000,
        onUpdate: (tween) => {
          graphicLine1 = reMakeLine(graphicLine1, 100, 0xff680e, tween.getValue());
        },
      });
      this.tweens.addCounter({
        from: 0,
        to: 360,
        duration: 3000,
        delay: 200,
        onUpdate: (tween) => {
          graphicLine2 = reMakeLine(graphicLine2, 120, 0xf76f08, tween.getValue());
        },
      });
      this.tweens.addCounter({
        from: 0,
        to: 360,
        duration: 3000,
        delay: 400,
        onUpdate: (tween) => {
          graphicLine3 = reMakeLine(graphicLine3, 140, 0xffad00, tween.getValue());
        },
      });
      this.tweens.addCounter({
        from: 0,
        to: 360,
        duration: 3000,
        delay: 600,
        onUpdate: (tween) => {
          graphicLine4 = reMakeLine(graphicLine4, 160, 0xfdc438, tween.getValue());
        },
      });
      this.tweens.addCounter({
        from: 0,
        to: 360,
        duration: 3000,
        delay: 800,
        onUpdate: (tween) => {
          graphicLine5 = reMakeLine(graphicLine5, 180, 0xfbd870, tween.getValue());
        },
        onComplete: () => {
          if (preloadText.text !== '%100') addAnimation();
        },
      });
    };
    addAnimation();

    this.loadingContainer.add([preloadText, graphicLine1, graphicLine2, graphicLine3, graphicLine4, graphicLine5]);
  }

  preload(): void {
    this.createPreloadVisualization();

    this.load.image('fence', '../assets/img/fence.png');
    this.load.image('hive', '../assets/img/hive.png');
    this.load.image('target', '../assets/img/target.png');
    this.load.image('star_1', '../assets/img/star_1.png');
    this.load.image('star_2', '../assets/img/star_2.png');
    this.load.image('star_3', '../assets/img/star_3.png');
    this.load.image('health_bar', '../assets/img/health_bar.png');
    this.load.image('window', '../assets/img/window.png');
    this.load.image('window_finish', '../assets/img/window_finish.png');
    this.load.image('button', '../assets/img/button.png');
    this.load.image('shine', '../assets/img/shine.png');
    this.load.spritesheet('bee_1', '../assets/img/bee_1.png', { frameWidth: 67, frameHeight: 51 });
    this.load.spritesheet('bee_2', '../assets/img/bee_2.png', { frameWidth: 79, frameHeight: 51 });
    this.load.spritesheet('bee_3', '../assets/img/bee_3.png', { frameWidth: 79, frameHeight: 51 });
    this.load.spritesheet('dog_normal', '../assets/img/dog/dog_normal.png', { frameWidth: 310, frameHeight: 310 });
    this.load.spritesheet('dog_wary', '../assets/img/dog/dog_wary.png', { frameWidth: 310, frameHeight: 310 });
    this.load.spritesheet('dog_hurt', '../assets/img/dog/dog_hurt.png', { frameWidth: 310, frameHeight: 310 });
    this.load.spritesheet('dog_bitten', '../assets/img/dog/dog_bitten.png', { frameWidth: 310, frameHeight: 310 });
    this.load.spritesheet('dog_happy', '../assets/img/dog/dog_happy.png', { frameWidth: 310, frameHeight: 310 });
    this.load.audio('music', '../assets/sounds/music.mp3');
    this.load.audio('click', '../assets/sounds/click.mp3');
    this.load.audio('charge', '../assets/sounds/charge.mp3');
    this.load.audio('fire', '../assets/sounds/fire.mp3');
    this.load.audio('cry', '../assets/sounds/cry.mp3');
    this.load.audio('laugh', '../assets/sounds/laugh.mp3');
    this.load.audio('win', '../assets/sounds/win.mp3');
  }

  create(): void {
    // add main game music
    this.sound.add('music', { volume: 0.1, loop: true }).play();
    // reinsurance so that the font loads accurately
    this.add.text(-100, -100, '.', {
      font: '18px BalsamiqSans',
      align: 'center',
    }).setOrigin(0.5, 0.5);
    this.time.addEvent({
      delay: 500,
      callback: () => {
        // call Welcome class
        this.scene.start('Welcome');
      },
    });
  }

  resize({ width, height }) {
    if (!this.scene.settings.active) return;

    transformElement(this, this.loadingContainer, { width, height }, configResize.loadingContainer.transform);
  }
}
