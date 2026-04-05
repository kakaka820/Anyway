// src/scenes/RoomScene.ts
import Phaser from 'phaser';
import { getState } from '../store/gameStore';
import { advanceDay } from '../logic/advanceDay';
import type { MonthEndResult } from '../logic/monthEnd';
import type { MorningEvent } from '../types/gameState';

export class RoomScene extends Phaser.Scene {
  private currentAreaIndex: number = 0;

  constructor() {
    super({ key: 'RoomScene' });
  }

  create() {
    this.currentAreaIndex = 0;
    // UISceneが未起動なら起動する
    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene');
    }
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
     // ── 「寝る」ボタン（右下）────────────────────
    const sleepBtn = this.add.text(width - 20, height - 60, '🌙 寝る', {
      fontSize: '26px',
      color: '#ffffff',
      backgroundColor: '#44446a',
      padding: { x: 16, y: 10 },
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    sleepBtn.on('pointerover', () => sleepBtn.setColor('#ffff99'));
    sleepBtn.on('pointerout', () => sleepBtn.setColor('#ffffff'));
    sleepBtn.on('pointerdown', () => {
      this.onSleep();
    });
  }
  // ── 「寝る」を押したときの処理 ───────────────────
  private onSleep() {
    const result = advanceDay();
    const { morningEvents, isMonthEnd, monthEndResult } = result;
    if (isMonthEnd && monthEndResult) {
      // 月末 → 月末結果を先に表示してから朝イベントへ
      this.showMonthEndOverlay(monthEndResult, () => {
        if (monthEndResult.isGameOver) {
          this.scene.start('TitleScene');
        } else {
          this.showMorningEventsOverlay(morningEvents, () => {
            this.renderArea();
          });
        }
      });
    } else {
      // 通常日 → 朝イベントを表示してから部屋へ
      this.showMorningEventsOverlay(morningEvents, () => {
        this.renderArea();
      });
    }
  }
  // ── 朝イベントのオーバーレイ表示 ────────────────
  private showMorningEventsOverlay(events: MorningEvent[], onClose: () => void) {
    const { width, height } = this.scale;
    const container = this.add.container(0, 0);
    // 半透明背景
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75);
    container.add(bg);
    const title = this.add.text(width / 2, 80, '☀️ 朝の報告', {
      fontSize: '32px', color: '#ffffff',
    }).setOrigin(0.5);
    container.add(title);
    if (events.length === 0) {
      const msg = this.add.text(width / 2, height / 2, '特になし', {
        fontSize: '22px', color: '#aaaaaa',
      }).setOrigin(0.5);
      container.add(msg);
    } else {
      let yOffset = 150;
      for (const ev of events) {
        const line = this.buildEventText(ev);
        const txt = this.add.text(width / 2, yOffset, line.text, {
          fontSize: '20px', color: line.color,
        }).setOrigin(0.5);
        container.add(txt);
        yOffset += 36;
      }
    }
  // 確認ボタン
    const confirmBtn = this.add.text(width / 2, height - 80, '確認', {
      fontSize: '26px',
      color: '#ffffff',
      backgroundColor: '#444466',
      padding: { x: 24, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    confirmBtn.on('pointerover', () => confirmBtn.setColor('#ffff99'));
    confirmBtn.on('pointerout', () => confirmBtn.setColor('#ffffff'));
    confirmBtn.on('pointerdown', () => {
      container.destroy();
      onClose();
    });
    container.add(confirmBtn);
  }
  // ── 月末オーバーレイ表示 ─────────────────────────
  private showMonthEndOverlay(result: MonthEndResult, onClose: () => void) {
    const { width, height } = this.scale;
    const container = this.add.container(0, 0);
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);
    container.add(bg);
    const title = this.add.text(width / 2, 60, '📅 月末精算', {
      fontSize: '32px', color: '#ffffff',
    }).setOrigin(0.5);
    container.add(title);
     const lines = [
      { text: `元気度（月平均）: ${result.avgVitality.toFixed(1)}`, color: '#90ee90' },
      { text: `給料（支給前）: ¥${result.grossSalary.toLocaleString()}`, color: '#f0e68c' },
      { text: `遅刻控除: -¥${result.latePenalty.toLocaleString()}`, color: '#ff9999' },
      { text: `手取り給料: ¥${result.netSalary.toLocaleString()}`, color: '#90ee90' },
      { text: `家賃: -¥${result.rent.toLocaleString()}`, color: '#ff9999' },
      { text: `残高: ¥${result.newMoney.toLocaleString()}`, color: result.newMoney > 0 ? '#ffffff' : '#ff4444' },
    ];
    let yOffset = 150;
    for (const line of lines) {
      const txt = this.add.text(width / 2, yOffset, line.text, {
        fontSize: '22px', color: line.color,
      }).setOrigin(0.5);
      container.add(txt);
      yOffset += 42;
    }
    if (result.isGameOver) {
      const gameOverTxt = this.add.text(width / 2, yOffset + 20, '💸 家賃が払えず…ゲームオーバー', {
        fontSize: '24px', color: '#ff4444',
      }).setOrigin(0.5);
      container.add(gameOverTxt);
    }
    const label = result.isGameOver ? 'タイトルへ' : '次の月へ';
    const confirmBtn = this.add.text(width / 2, height - 80, label, {
      fontSize: '26px',
      color: '#ffffff',
      backgroundColor: '#444466',
      padding: { x: 24, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    confirmBtn.on('pointerover', () => confirmBtn.setColor('#ffff99'));
    confirmBtn.on('pointerout', () => confirmBtn.setColor('#ffffff'));
    confirmBtn.on('pointerdown', () => {
      container.destroy();
      onClose();
    });
    container.add(confirmBtn);
  }
  // ── イベントを文字列に変換 ────────────────────────
  private buildEventText(ev: MorningEvent): { text: string; color: string } {
    switch (ev.type) {
      case 'flea_sold':
        return {
          text: `フリマでアイテムが売れた！ ¥${(ev.soldPrice ?? 0).toLocaleString()}`,
          color: '#90ee90',
        };
      case 'flea_unsold':
        return {
          text: `フリマで売れなかったアイテムがある`,
          color: '#aaaaaa',
        };
      case 'delivery':
        return {
          text: `荷物が届いた！`,
          color: '#87ceeb',
        };
      case 'late_for_work':
        return {
          text: `⚠️ 玄関が散らかって遅刻した！`,
          color: '#ff9999',
        };
    }
  }
}