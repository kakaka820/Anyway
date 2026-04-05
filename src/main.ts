// src/main.ts
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { RoomScene } from './scenes/RoomScene';
import { UIScene } from './scenes/UIScene';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  scene: [BootScene, TitleScene, RoomScene, UIScene],
});