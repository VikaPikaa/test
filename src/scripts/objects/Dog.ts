export class Dog extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    this.setScale(1.6);
    this.createAnimations();
    this.playNormalAnimation();
  }
  // create others dog animations
  createAnimations() {
    this.scene.anims.create({
      key: 'normal',
      frames: this.anims.generateFrameNumbers('dog_normal'),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'wary',
      frames: this.anims.generateFrameNumbers('dog_wary'),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'hurt',
      frames: this.anims.generateFrameNumbers('dog_hurt'),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'bitten',
      frames: this.anims.generateFrameNumbers('dog_bitten'),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'happy',
      frames: this.anims.generateFrameNumbers('dog_happy'),
      frameRate: 10,
      repeat: -1,
    });
  }
  // play others dog animations
  playNormalAnimation() {
    this.play('normal');
  }

  playWaryAnimation() {
    this.play('wary');
  }

  playHurtAnimation() {
    this.play('hurt');
  }

  playBittenAnimation() {
    this.play('bitten');
  }

  playHappyAnimation() {
    this.play('happy');
  }
}
