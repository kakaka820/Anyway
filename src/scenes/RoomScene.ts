// src/scenes/RoomScene.ts
import Phaser from 'phaser';
import { getState } from '../store/gameStore';

export class RoomScene extends Phaser.Scene {
  private currentAreaIndex: number = 0;

  constructor() {
    super({ key: 'RoomScene' });
  }

  create() {
    this.currentAreaIndex = 0;
    this.renderArea();
  }

  private renderArea() {
    // 画面をクリアして再描画
    this.children.removeAll(true);
    const { width, height } = this.scale;
    const state = getState();
    this.currentAreaIndex = Phaser.Math.Clamp(
    this.currentAreaIndex, 0, state.areas.length - 1
  );
    const area = state.areas[this.currentAreaIndex];
    const areaState = state.areaStates.find(a => a.areaId === area.id);
    const messiness = areaState?.currentMessiness ?? 0;

    // ── 背景 ──────────────────────────────────────
    this.add.rectangle(width / 2, height / 2, width, height, 0x2a2a3e);

    // ── ステータスバー（上部）─────────────────────
    const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
    this.add.text(16, 16, `${state.month}月 ${state.day}日（${dayNames[state.dayOfWeek]}）`, {
      fontSize: '20px', color: '#ffffff',
    });
    this.add.text(16, 44, `¥${state.money.toLocaleString()}`, {
      fontSize: '18px', color: '#f0e68c',
    });
    this.add.text(120, 44, `行動力: ${state.actionPoints}`, {
      fontSize: '18px', color: '#90ee90',
    });

    // ── エリア表示（中央）────────────────────────
    this.add.rectangle(width / 2, height / 2 + 30, width - 120, height - 160, 0x3a3a5e);
    this.add.text(width / 2, height / 2 - 60, area.name, {
      fontSize: '32px', color: '#ffffff',
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 - 10, `散らかり度: ${messiness}`, {
      fontSize: '22px', color: '#ff9999',
    }).setOrigin(0.5);

    // ── 左矢印 ────────────────────────────────────
    if (this.currentAreaIndex > 0) {
      const leftBtn = this.add.text(36, height / 2, '◀', {
        fontSize: '40px', color: '#ffffff',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      leftBtn.on('pointerover', () => leftBtn.setColor('#ffff00'));
      leftBtn.on('pointerout', () => leftBtn.setColor('#ffffff'));
      leftBtn.on('pointerdown', () => {
        if (this.currentAreaIndex <= 0) return;
        this.currentAreaIndex--;
        this.renderArea();
      });
    }

    // ── 右矢印 ────────────────────────────────────
    if (this.currentAreaIndex < state.areas.length - 1) {
      const rightBtn = this.add.text(width - 36, height / 2, '▶', {
        fontSize: '40px', color: '#ffffff',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      rightBtn.on('pointerover', () => rightBtn.setColor('#ffff00'));
      rightBtn.on('pointerout', () => rightBtn.setColor('#ffffff'));
      rightBtn.on('pointerdown', () => {
        if (this.currentAreaIndex >= state.areas.length - 1) return;
        this.currentAreaIndex++;
        this.renderArea();
      });
    }

    // ── エリアインジケーター（下部）──────────────
    state.areas.forEach((_, i) => {
      const dotX = width / 2 + (i - (state.areas.length - 1) / 2) * 20;
      const color = i === this.currentAreaIndex ? 0xffffff : 0x666666;
      this.add.circle(dotX, height - 24, 5, color);
    });
  }
}