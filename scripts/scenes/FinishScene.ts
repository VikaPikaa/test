// CLASS TO FINISH
import configResize from '../core/configResize';
import { transformElement } from '../core/Display';

export default class FinishScene extends Phaser.Scene {

  finishContainer: Phaser.GameObjects.Container;
  sounds: any = {};

  constructor() {
    super({
      key: 'Finish',
    });
  }

  preload(): void {
    this.scale.on('resize', this.resize, this);
  }

  create(): void {
    this.finishContainer = this.add.container(0, 0);

    this.createDog();
    this.createFinishWindow();
    this.createButton();
    this.addSounds();

    this.resize({});
  }

  addSounds(): void {
    this.sounds.click = this.sound.add('click', { volume: 0.1 });
    this.sounds.win = this.sound.add('win', { volume: 0.15 }).play();
  }

  // method create animation dog
  createDog(): void {
    const shine: Phaser.GameObjects.Sprite = this.add.sprite(0, -270, 'shine').setScale(1.7);
    const dog: Phaser.GameObjects.Sprite = this.add.sprite(0, -270, 'dog');

    this.anims.create({
      key: 'dog',
      frames: this.anims.generateFrameNumbers('dog_bitten'),
      frameRate: 10,
      repeat: -1,
    });
    dog.play('dog');

    this.tweens.add({
      targets: shine,
      angle: 360,
      duration: 10000,
      repeat: -1,
    });

    this.finishContainer.add([shine, dog]);
  }

  createFinishWindow(): void {
    const window: Phaser.GameObjects.Image = this.add.image(0, 0, 'window_finish').setScale(2);

    const title: Phaser.GameObjects.Text = this.add.text(window.x, window.y - 150, 'ПОБЕДА!', {
      font: '40px BalsamiqSans',
      align: 'center',
      color: '#901d14',
    }).setOrigin(0.5, 0.5);

    const text: Phaser.GameObjects.Text = this.add.text(window.x, window.y + 31, 'Хочешь сыграть еще раз?', {
      font: '30px BalsamiqSans',
      align: 'center',
      color: '#901d14',
    }).setOrigin(0.5, 0.5);

    this.finishContainer.add([window, title, text]);
  }

  // method create button to go to the game again
  createButton(): void {
    const buttonContainer: Phaser.GameObjects.Container = this.add.container(0, 178);
    const button: Phaser.GameObjects.Image = this.add.image(0, 0, 'button').setScale(2).setInteractive();

    const text: Phaser.GameObjects.Text = this.add.text(0, 0, 'Конечно!', {
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
          this.scene.start('Game');
        },
      });
    });

    this.finishContainer.add(buttonContainer);
  }

  resize({ width, height }: any): void {
    if (!this.scene.settings.active) return;

    transformElement(this, this.finishContainer, { width, height }, configResize.finishContainer.transform);
  }
}
