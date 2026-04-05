// src/scenes/RoomItemRenderer.ts
// アイテムの描画とコンテキストメニューをRoomSceneから分離

import Phaser from 'phaser';
import { getState } from '../store/gameStore';
import { getItemColor, getItemDisplayName, tidyItem, listItemForFlea } from '../logic/itemHelpers';
import type { AreaId } from '../types/area';
import type { ItemInstance } from '../types/item';

// ── エリアのアイテムを描画 ───────────────────────────
export function renderItems(
  scene: Phaser.Scene,
  areaId: AreaId,
  onRefresh: () => void
) {
  const state = getState();
  const areaItems = state.items.filter(
    i => i.areaId === areaId && !i.isListed
  );

  const { width, height } = scene.scale;
  const itemW = 80;
  const itemH = 44;
  const cols  = 5;
  const gapX  = 12;
  const gapY  = 12;
  const startX = width / 2 - ((itemW + gapX) * Math.min(cols, areaItems.length) - gapX) / 2;
  const startY = height / 2 + 60;

  areaItems.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = startX + col * (itemW + gapX) + itemW / 2;
    const y = startY + row * (itemH + gapY) + itemH / 2;

    const color = getItemColor(item.variantId);
    const rect = scene.add.rectangle(x, y, itemW, itemH, color)
      .setInteractive({ useHandCursor: true });

    scene.add.text(x, y, getItemDisplayName(item.variantId), {
      fontSize: '11px',
      color: '#ffffff',
      wordWrap: { width: itemW - 4 },
      align: 'center',
    }).setOrigin(0.5);

    rect.on('pointerdown', () => showItemContextMenu(scene, item, x, y, onRefresh));
  });
}

// ── アイテムのコンテキストメニュー（内部関数）──────────
function showItemContextMenu(
  scene: Phaser.Scene,
  item: ItemInstance,
  itemX: number,
  itemY: number,
  onRefresh: () => void
) {
  const { width, height } = scene.scale;
  const container = scene.add.container(0, 0);

  const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4)
    .setInteractive();
  overlay.on('pointerdown', () => container.destroy());
  container.add(overlay);

  const panelW = 220;
  const panelH = 160;
  const panelX = Math.min(Math.max(itemX, panelW / 2 + 10), width - panelW / 2 - 10);
  const panelY = Math.min(itemY + 90, height - panelH / 2 - 20);

  container.add(
    scene.add.rectangle(panelX, panelY, panelW, panelH, 0x1e1e3a)
      .setStrokeStyle(1, 0x5555aa)
  );
  container.add(
    scene.add.text(panelX, panelY - panelH / 2 + 16, getItemDisplayName(item.variantId), {
      fontSize: '14px', color: '#aaaacc',
    }).setOrigin(0.5, 0)
  );

  const menuItems: { label: string; action: () => void }[] = [];
  if (item.areaId !== 'closet') {
    menuItems.push({
      label: '片づける',
      action: () => { tidyItem(item.instanceId); container.destroy(); onRefresh(); },
    });
  }
  menuItems.push({
    label: 'フリマに出す',
    action: () => { listItemForFlea(item.instanceId); container.destroy(); onRefresh(); },
  });

  let menuY = panelY - 10;
  for (const mi of menuItems) {
    const btn = scene.add.text(panelX, menuY, mi.label, {
      fontSize: '20px', color: '#ffffff',
      backgroundColor: '#33335a', padding: { x: 24, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#55558a' }));
    btn.on('pointerout',  () => btn.setStyle({ backgroundColor: '#33335a' }));
    btn.on('pointerdown', () => mi.action());
    container.add(btn);
    menuY += 48;
  }
}