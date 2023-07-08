// CLASS TO WELCOME
import configResize from '../core/configResize';
import { transformElement } from '../core/Display';

export default class WelcomeScene extends Phaser.Scene {
  welcomeContainer: Phaser.GameObjects.Container;

  sounds: any = {};

  constructor() {
    super({
      key: 'Welcome',
    });
  }

  preload(): void {
    this.scale.on('resize', this.resize, this);
  }

  create(): void {
    this.welcomeContainer = this.add.container(0, 0);

    this.createWelcomeWindow();
    this.createButton();
    this.addSounds();

    this.resize({});
  }

  addSounds(): void {
    this.sounds.click = this.sound.add('click', { volume: 0.1 });
  }

  // method create welcome window with text
  createWelcomeWindow(): void {
    const window: Phaser.GameObjects.Image = this.add.image(0, 0, 'window').setScale(2);

    const title = this.add.text(window.x, window.y - 155, 'ПРИВЕТ!', {
      font: '40px BalsamiqSans',
      align: 'center',
      color: '#901d14',
    }).setOrigin(0.5, 0.5);

    const text = this.add.text(window.x, window.y + 71, 'Меня зовут Вика Малич!\nХочу представить вашему\nвниманию мое тестовое задание.\nНа TypeScript писала в первый раз,\nно надеюсь у меня\nвсе получилось правильно :)', {
      font: '30px BalsamiqSans',
      align: 'center',
      color: '#901d14',
    }).setOrigin(0.5, 0.5);

    this.welcomeContainer.add([window, title, text]);
  }

  // method create button to go to the game
  createButton(): void {
    const buttonContainer = this.add.container(0, 273);
    const button: Phaser.GameObjects.Image = this.add.image(0, 0, 'button').setScale(2).setInteractive();

    const text = this.add.text(0, 0, 'Круто!', {
      font: '35px BalsamiqSans',
      align: 'center',
      color: '#901d14',
    }).setOrigin(0.5, 0.5);

    buttonContainer.add([button, text]);

    this.tweens.add({
      targets: buttonContainer,
      scale: 0.95,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    button.once('pointerdown', () => {
      this.sounds.click.play();

      this.tweens.add({
        targets: buttonContainer,
        scale: 0.85,
        duration: 150,
        yoyo: true,
        onComplete: () => {
          // call Game class
          this.scene.start('Game');
        },
      });
    });

    this.welcomeContainer.add(buttonContainer);
  }

  resize({ width, height }: any): void {
    if (!this.scene.settings.active) return;

    transformElement(this, this.welcomeContainer, { width, height }, configResize.welcomeContainer.transform);
  }
}
