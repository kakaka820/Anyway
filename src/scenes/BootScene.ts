// src/scenes/BootScene.ts
// アセット（画像・音など）を読み込んでからTitleSceneへ移動する
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // ここに後でアセットの読み込みを追加する
    // 例: this.load.image('key', 'assets/image.png');
  }

  create() {
    this.scene.start('TitleScene');
  }
}