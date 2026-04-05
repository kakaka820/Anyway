// src/scenes/UIScene.ts
import Phaser from 'phaser';
import { getState } from '../store/gameStore';

export class UIScene extends Phaser.Scene {
  private dateText!: Phaser.GameObjects.Text;
  private moneyText!: Phaser.GameObjects.Text;
  private actionText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
 

    this.dateText = this.add.text(16, 16, '', {
      fontSize: '20px', color: '#ffffff',
    });
    this.moneyText = this.add.text(16, 44, '', {
      fontSize: '18px', color: '#f0e68c',
    });
    this.actionText = this.add.text(120, 44, '', {
      fontSize: '18px', color: '#90ee90',
    });

    this.refreshHUD();
  }

  update() {
    this.refreshHUD();
  }

  private refreshHUD() {
    const state = getState();
    const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
    this.dateText.setText(`${state.month}月 ${state.day}日（${dayNames[state.dayOfWeek]}）`);
    this.moneyText.setText(`¥${state.money.toLocaleString()}`);
    this.actionText.setText(`行動力: ${state.actionPoints}`);
  }
}