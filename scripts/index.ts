// MAIN GAME FILE
import 'phaser';
import PreloadScene from './scenes/PreloadScene';
import GameScene from './scenes/GameScene';
import WelcomeScene from './scenes/WelcomeScene';
import FinishScene from './scenes/FinishScene';
import { getClosestKey } from './core/Display';

// object to initialize the Scale Manager
const scaleObject: Phaser.Types.Core.ScaleConfig = {
  mode: Phaser.Scale.NONE,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  autoRound: true,
  width: window.innerWidth,
  height: window.innerHeight,
};
// object to initialize the Render
const renderObject: Phaser.Types.Core.RenderConfig = {
  roundPixels: true,
  transparent: true,
  maxTextures: 8,
};
// game configuration object
const configObject: Phaser.Types.Core.GameConfig = {
  parent: 'vikamalichgame',
  type: Phaser.AUTO,
  backgroundColor: 0x000000,
  scale: scaleObject,
  render: renderObject,
  scene: [PreloadScene, WelcomeScene, GameScene, FinishScene],
};
// the game
const game = new Phaser.Game(configObject);
// function resize the game
function resize(): void {
  const { scale } = game;

  const dpr: number = window.devicePixelRatio;

  scale.zoom = 1 / dpr;
  scale.resize(window.innerWidth * dpr, window.innerHeight * dpr);

  const arKey: string = getClosestKey(window.innerWidth / window.innerHeight);
  console.log(arKey);
}
// resize the game
window.addEventListener('resize', () => {
  resize();
});
