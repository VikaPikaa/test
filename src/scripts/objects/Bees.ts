// BEES CLASS
export class Bees extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  // method to fire bees
  fire(power, parent): void {
    const distance: number = -(power * 15);
    // create points to path bee
    const points: Phaser.Math.Vector2[] = [];

    points.push(new Phaser.Math.Vector2(0, 850));
    points.push(new Phaser.Math.Vector2(-200, (850 + distance) / 2));
    points.push(new Phaser.Math.Vector2(0, distance));
    // create path
    const curve: any = new Phaser.Curves.Spline(points);

    const graphics: Phaser.GameObjects.Graphics = this.scene.add.graphics();

    graphics.lineStyle(20, 0xfa3636, 1);

    curve.draw(graphics, 64);
    // create target
    const target: Phaser.GameObjects.Image = this.scene.add.image(0, distance, 'target');

    // create bee
    const id: number = Phaser.Math.Between(1, 3);
    const follower: Phaser.GameObjects.PathFollower = this.scene.add.follower(curve, 0, 850, '').setScale(3);
    // add animations bee
    this.scene.anims.create({
      key: `fly_${id}`,
      frames: this.scene.anims.generateFrameNumbers(`bee_${id}`, { frames: [0, 1] }),
      frameRate: 8,
      repeat: -1,
    });
    follower.play(`fly_${id}`);
    // start animation fly to dog
    follower.startFollow({
      duration: 1000,
      startAt: 0,
      rotateToPath: true,
      onComplete: () => {
        // create particles
        const explode = this.scene.add.particles(0, distance, `star_${id}`, {
          angle: { start: 0, end: 360, steps: 32 },
          lifespan: 300,
          speed: 600,
          quantity: 32,
          maxParticles: 32,
          scale: { start: 0.3, end: 0 },
        });
        parent.add(explode);
        // destroy objects
        follower.destroy();
        target.destroy();
        graphics.destroy();
      },
    });

    parent.add([graphics, target, follower]);
  }
}
