"use client";

import { create } from "zustand";
import type { ColumnId } from "./types";

/** Ephemeral UI state (not persisted): command palette + cross-page intents. */
interface UIState {
  paletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;

  taskIntent?: { column: ColumnId };
  requestTask: (column?: ColumnId) => void;
  consumeTask: () => void;

  clientIntent: boolean;
  requestClient: () => void;
  consumeClient: () => void;
}

export const useUI = create<UIState>((set) => ({
  paletteOpen: false,
  openPalette: () => set({ paletteOpen: true }),
  closePalette: () => set({ paletteOpen: false }),
  togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),

  taskIntent: undefined,
  requestTask: (column = "backlog") => set({ taskIntent: { column }, paletteOpen: false }),
  consumeTask: () => set({ taskIntent: undefined }),

  clientIntent: false,
  requestClient: () => set({ clientIntent: true, paletteOpen: false }),
  consumeClient: () => set({ clientIntent: false }),
}));
