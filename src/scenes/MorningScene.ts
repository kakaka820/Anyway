//src/scenes/MorningScene.ts
//朝イベントと月末清算の表示を担当

import Phaser from 'phaser';
import type { MonthEndResult } from '../logic/monthEnd';
import type { MorningEvent } from '../types/gameState';

interface MorningSceneData {
  isMonthEnd: boolean;
  morningEvents: MorningEvent[];
  monthEndResult?: MonthEndResult;
}

export class MorningScene extends Phaser.Scene {
  private initData!: MorningSceneData;

  constructor() {
    super({ key: 'MorningScene' });
  }

  init(data: MorningSceneData) {
    this.initData = data;
  }

  create() {
    const { isMonthEnd, morningEvents, monthEndResult } = this.initData;

    if (isMonthEnd && monthEndResult) {
         // 月末 → 月末結果を先に表示してから朝イベントへ
      this.showMonthEndScreen(monthEndResult, () => {
        if (monthEndResult.isGameOver) {
          this.scene.start('TitleScene');
        } else {
          this.showMorningEventsScreen(morningEvents, () => {
            this.scene.start('RoomScene');
          });
        }
      });
    } else {
        // 通常日 → 朝イベントを表示してから部屋へ
      this.showMorningEventsScreen(morningEvents, () => {
        this.scene.start('RoomScene');
      });
    }
  }
// ── 朝イベントのオーバーレイ表示 ────────────────
  private showMorningEventsScreen(events: MorningEvent[], onClose: () => void) {
    this.children.removeAll(true);
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);
    this.add.text(width / 2, 80, '☀️ 朝の報告', {
      fontSize: '32px', color: '#ffffff',
    }).setOrigin(0.5);

    if (events.length === 0) {
      this.add.text(width / 2, height / 2, '特になし', {
        fontSize: '22px', color: '#aaaaaa',
      }).setOrigin(0.5);
    } else {
      let yOffset = 150;
      for (const ev of events) {
        const line = this.buildEventText(ev);
        this.add.text(width / 2, yOffset, line.text, {
          fontSize: '20px', color: line.color,
        }).setOrigin(0.5);
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
    confirmBtn.on('pointerdown', () => onClose());
  }

  // ── 月末オーバーレイ表示 ─────────────────────────
  private showMonthEndScreen(result: MonthEndResult, onClose: () => void) {
    this.children.removeAll(true);
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);
    this.add.text(width / 2, 60, '📅 月末精算', {
      fontSize: '32px', color: '#ffffff',
    }).setOrigin(0.5);

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
      this.add.text(width / 2, yOffset, line.text, {
        fontSize: '22px', color: line.color,
      }).setOrigin(0.5);
      yOffset += 42;
    }

    if (result.isGameOver) {
      this.add.text(width / 2, yOffset + 20, '💸 家賃が払えず…ゲームオーバー', {
        fontSize: '24px', color: '#ff4444',
      }).setOrigin(0.5);
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
    confirmBtn.on('pointerdown', () => onClose());
  }
// ── イベントを文字列に変換 ────────────────────────
  private buildEventText(ev: MorningEvent): { text: string; color: string } {
    switch (ev.type) {
      case 'flea_sold':
        return { text: `フリマでアイテムが売れた！ ¥${(ev.soldPrice ?? 0).toLocaleString()}`, color: '#90ee90' };
      case 'flea_unsold':
        return { text: `フリマで売れなかったアイテムがある`, color: '#aaaaaa' };
      case 'delivery':
        return { text: `荷物が届いた！`, color: '#87ceeb' };
      case 'late_for_work':
        return { text: `⚠️ 玄関が散らかって遅刻した！`, color: '#ff9999' };
    }
  }
}