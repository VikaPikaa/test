export class PowerScale extends Phaser.GameObjects.Group {

  circle1: Phaser.GameObjects.Arc;
  circle2: Phaser.GameObjects.Arc;
  circle3: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  createPowerScale(parent) {
    this.circle1 = this.scene.add.circle(0, 1000, 250, 0xff0025).setScale(0.7).setAlpha(0);
    this.circle2 = this.scene.add.circle(0, 1000, 250, 0x00fe00).setScale(0.44).setAlpha(0);
    this.circle3 = this.scene.add.circle(0, 1000, 250, 0xf7fa00).setScale(0);

    parent.add([this.circle1, this.circle2, this.circle3]);
  }
  // change circles scale when gain power
  gainPower() {
    if (this.circle3.scale < 0.44) {
      this.circle3.setScale(this.circle3.scale + 0.01);
    } else if (this.circle2.scale < 0.7) {
      this.circle2.setAlpha(1);
      this.circle2.setScale(this.circle2.scale + 0.01);
    } else if (this.circle1.scale < 1) {
      this.circle1.setAlpha(1);
      this.circle1.setScale(this.circle1.scale + 0.01);
    }
  }

  destroyPowerScale(): void {
    if (this.circle3) this.circle3.destroy();
    if (this.circle2) this.circle2.destroy();
    if (this.circle1) this.circle1.destroy();
  }
}
