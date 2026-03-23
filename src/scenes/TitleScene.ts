// src/scenes/TitleScene.ts
import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2 - 60, 'Anyway', {
      fontSize: '72px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const startText = this.add.text(width / 2, height / 2 + 40, 'クリックしてはじめる', {
      fontSize: '24px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // 点滅アニメーション
    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // クリックでゲーム開始
    this.input.once('pointerdown', () => {
      this.scene.start('RoomScene');
    });
  }
}