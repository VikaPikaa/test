// FUNCTIONS FOR RESIZE
import "phaser";

const Breakpoints = {
  '9x21': 0.43,
  '9x19.5': 0.46,
  '9x18': 0.5,
  '9x16': 0.57,
  '5x8': 0.625,
  '2x3': 0.666,
  '3x4': 0.75,
  '1x1': 1,
  '4x3': 1.33,
  '3x2': 1.5,
  '8x5': 1.6,
  '16x9': 1.78,
  '18x9': 2,
  '19.5x9': 2.17,
  '21x9': 2.33,
};
function getClosest(aspectRatio: number): string {
  let closest;
  Object.values(Breakpoints).forEach((breakpoint) => {
    if (!closest) {
      closest = breakpoint;
    } else {
      const diff = Math.abs(aspectRatio - breakpoint);
      if (diff < Math.abs(aspectRatio - closest)) {
        closest = breakpoint;
      }
    }
  });
  return closest;
}
export function getClosestKey(aspectRatio) {
  const closestAspectRatio = getClosest(aspectRatio);
  return Object.keys(Breakpoints).find((key) => Breakpoints[key] === closestAspectRatio);
}
export function fillTransform(
  transform: {
    scaleX?: number;
    scaleY?: number;
    scale?: any;
    position?: number;
    offsetX?: number;
    offsetY?: number;
  } = {},
  {
    width = -1,
    height = -1,
    position = Phaser.Scale.CENTER_BOTH,
    offsetX = 0,
    offsetY = 0,
  }: {
    width?: number;
    height?: number;
    position?: number;
    offsetX?: number;
    offsetY?: number;
  } = {}
): {
  width: number;
  height: number;
  position: number | undefined;
  offsetX: number;
  offsetY: number;
} {
  const getValid = (...nums: (number | undefined)[]): number | undefined => nums.find((n) => typeof n === 'number' && !Number.isNaN(n));
  return {
    width: width * getValid(transform.scaleX, transform.scale.x, transform?.scale, 1) as number | undefined,
    height: height * getValid(transform.scaleY, transform.scale.y, transform.scale, 1) as number | undefined,
    position: getValid(transform.position, position) as number | undefined,
    offsetX: width * getValid(transform.offsetX, offsetX) as number | undefined,
    offsetY: height * getValid(transform.offsetY, offsetY) as number | undefined,
  };
}
export function transformElement(
  scene: Phaser.Scene,
  element: any,
  {
    width = scene.scale.width,
    height = scene.scale.height,
  }: { width?: number; height?: number } = {},
  transformSettings: Record<string, any> = {},
  {
    position = Phaser.Display.Align.CENTER,
    fit = true,
    changeVisibility = false,
  }: {
    position?: number;
    fit?: boolean;
    changeVisibility?: boolean;
  } = {}
) {
  const mainCamera = scene.cameras.main;
  const camera: any = {
    x: mainCamera.centerX,
    y: mainCamera.centerY,
    width: mainCamera.width,
    height: mainCamera.height,
    originX: 0.5,
    originY: 0.5,
  };
  const isLandscape = scene.scale.baseSize.width > scene.scale.baseSize.height;
  const arKey = getClosestKey(width / height);
  if (!element) return;
  const transformConfig = transformSettings[arKey] || transformSettings[isLandscape ? 'landscape' : 'portrait'] || transformSettings;
  if (changeVisibility) {
    const { visible = true } = transformConfig;
    element.visible = visible;
  }
  if (!element.visible) return;
  const transform = fillTransform(transformConfig, {
    width,
    height,
    position,
  });
  scaleSprite(element, transform.width, transform.height, fit);
  Phaser.Display.Align.In.QuickSet(element, camera, transform.position, transform.offsetX, transform.offsetY);
}

export function scaleSprite(sprite, width, height, letterBox) {
  if (letterBox === undefined) { letterBox = false; }
  if (!sprite || !sprite.scale) {
    return sprite;
  }
  const { width: currentWidth, height: currentHeight } = sprite.getBounds();
  if ((currentWidth <= 0) || (currentHeight <= 0) || (width <= 0) || (height <= 0)) {
    return sprite;
  }
  const scaleX1 = width;
  const scaleY1 = (currentHeight * width) / currentWidth;
  const scaleX2 = (currentWidth * height) / currentHeight;
  const scaleY2 = height;
  let scaleOnWidth = (scaleX2 > width);
  if (scaleOnWidth) {
    scaleOnWidth = letterBox;
  } else {
    scaleOnWidth = !letterBox;
  }
  if (scaleOnWidth) {
    sprite.setScale(scaleX1 / (currentWidth / sprite.scaleX), scaleY1 / (currentHeight / sprite.scaleY));
  } else {
    sprite.setScale(scaleX2 / (currentWidth / sprite.scaleX), scaleY2 / (currentHeight / sprite.scaleY));
  }
  return sprite;
}
