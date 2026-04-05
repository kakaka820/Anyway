// src/scenes/RoomScene.ts
import Phaser from 'phaser';
import { getState } from '../store/gameStore';
import { advanceDay } from '../logic/advanceDay';
import {
  getBathCost, getTidyCost, PHONE_SUB_COSTS,
  canAfford, doBath, doTidy,
  doPhoneFleaMarket, doPhoneOnlineShopping, doPhoneSurfing,
} from '../logic/actions';

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
     // ── 「行動」ボタン（右下）────────────────────
    const actionBtn = this.add.text(width - 20, height - 60, '⚡ 行動', {
      fontSize: '26px',
      color: '#ffffff',
      backgroundColor: '#44446a',
      padding: { x: 16, y: 10 },
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    actionBtn.on('pointerover', () => actionBtn.setColor('#ffff99'));
    actionBtn.on('pointerout', () => actionBtn.setColor('#ffffff'));
    actionBtn.on('pointerdown', () => { this.showActionMenu(); });
  }
  // ── メインの行動メニュー ──────────────────────────
  private showActionMenu() {
    const { width, height } = this.scale;
    const state = getState();
    const area = state.areas[this.currentAreaIndex];
    const ap = state.actionPoints;
    const bathCost = getBathCost();
    const tidyCost = getTidyCost(area.id);
    const container = this.add.container(0, 0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
      .setInteractive();
    overlay.on('pointerdown', () => container.destroy());
    container.add(overlay);
    const panelH = 300;
    container.add(this.add.rectangle(width / 2, height - panelH / 2, width, panelH, 0x1e1e3a));
    container.add(this.add.text(width / 2, height - panelH + 16, `行動を選ぶ　残り行動力: ${ap}`, {
      fontSize: '17px', color: '#8888aa',
    }).setOrigin(0.5, 0));
    // アクションの定義
    const actions: { label: string; cost: number; onDo: () => void }[] = [
      {
        label: `お風呂  ${bathCost}AP`,
        cost: bathCost,
        onDo: () => { doBath(); container.destroy(); this.renderArea(); },
      },
      {
        label: `片付け  ${tidyCost}AP`,
        cost: tidyCost,
        onDo: () => { doTidy(area.id); container.destroy(); this.renderArea(); },
      },
      {
        label: `スマホ  ▶`,
        cost: Math.min(PHONE_SUB_COSTS.fleaMarket, PHONE_SUB_COSTS.onlineShopping, PHONE_SUB_COSTS.surfing),
        onDo: () => { container.destroy(); this.showPhoneMenu(); },
      },
      {
        label: '寝る',
        cost: 0,
        onDo: () => { container.destroy(); this.onSleep(); },
      },
    ];
    let yOffset = height - panelH + 58;
    for (const action of actions) {
      const affordable = canAfford(action.cost);
      const color = affordable ? '#ffffff' : '#555577';
      const bgColor = affordable ? '#33335a' : '#1a1a2e';
      const row = this.add.text(width / 2, yOffset, action.label, {
        fontSize: '22px', color, backgroundColor: bgColor,
        padding: { x: 30, y: 8 },
      }).setOrigin(0.5);
      if (affordable) {
        row.setInteractive({ useHandCursor: true });
        row.on('pointerover', () => row.setStyle({ backgroundColor: '#55558a' }));
        row.on('pointerout',  () => row.setStyle({ backgroundColor: bgColor }));
        row.on('pointerdown', () => action.onDo());
      }
       container.add(row);
      yOffset += 52;
    }
  }
  // ── スマホのサブメニュー ──────────────────────────
  private showPhoneMenu() {
    const { width, height } = this.scale;
    const ap = getState().actionPoints;
    const container = this.add.container(0, 0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
      .setInteractive();
    overlay.on('pointerdown', () => { container.destroy(); this.showActionMenu(); }); // 戻る
    container.add(overlay);
    const panelH = 260;
    container.add(this.add.rectangle(width / 2, height - panelH / 2, width, panelH, 0x1e1e3a));
    container.add(this.add.text(width / 2, height - panelH + 16, `スマホで何をする？　残り行動力: ${ap}`, {
      fontSize: '17px', color: '#8888aa',
    }).setOrigin(0.5, 0));
    const subActions: { label: string; cost: number; onDo: () => boolean }[] = [
      { label: `フリマ         ${PHONE_SUB_COSTS.fleaMarket}AP`,     cost: PHONE_SUB_COSTS.fleaMarket,     onDo: doPhoneFleaMarket },
      { label: `ネットショッピング  ${PHONE_SUB_COSTS.onlineShopping}AP`, cost: PHONE_SUB_COSTS.onlineShopping, onDo: doPhoneOnlineShopping },
      { label: `ネットサーフィン  ${PHONE_SUB_COSTS.surfing}AP`,      cost: PHONE_SUB_COSTS.surfing,        onDo: doPhoneSurfing },
    ];
    let yOffset = height - panelH + 60;
    for (const sub of subActions) {
      const affordable = canAfford(sub.cost);
      const color = affordable ? '#ffffff' : '#555577';
      const bgColor = affordable ? '#33335a' : '#1a1a2e';
      const row = this.add.text(width / 2, yOffset, sub.label, {
        fontSize: '21px', color, backgroundColor: bgColor,
        padding: { x: 30, y: 8 },
      }).setOrigin(0.5);
      if (affordable) {
        row.setInteractive({ useHandCursor: true });
        row.on('pointerover', () => row.setStyle({ backgroundColor: '#55558a' }));
        row.on('pointerout',  () => row.setStyle({ backgroundColor: bgColor }));
        row.on('pointerdown', () => {
          const success = sub.onDo();
          if (success) { container.destroy(); this.renderArea(); }
        });
      }
      container.add(row);
      yOffset += 52;
    }
  }
  private onSleep() {
    const result = advanceDay();
    this.scene.start('MorningScene', result);
  }
}