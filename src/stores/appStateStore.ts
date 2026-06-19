import { create } from 'zustand';

export interface MemoryShard {
  id: string;
  x: number;
  y: number;
  content: string;
  collectedAt: number;
}

export interface PalaceFilterState {
  searchQuery: string;
  selectedTag: string | null;
  previousPage: string;
}

interface AppState {
  currentPage: string;
  isGazeTrackerActive: boolean;
  isBreathDetectorActive: boolean;
  isVoiceRecognitionActive: boolean;
  collectedShards: MemoryShard[];
  showRestReminder: boolean;
  palaceFilter: PalaceFilterState;
  setCurrentPage: (page: string) => void;
  setIsGazeTrackerActive: (active: boolean) => void;
  setIsBreathDetectorActive: (active: boolean) => void;
  setIsVoiceRecognitionActive: (active: boolean) => void;
  addShard: (shard: Omit<MemoryShard, 'id' | 'collectedAt'>) => void;
  removeShard: (id: string) => void;
  clearShards: () => void;
  setShowRestReminder: (show: boolean) => void;
  setPalaceSearchQuery: (query: string) => void;
  setPalaceSelectedTag: (tag: string | null) => void;
  setPalacePreviousPage: (page: string) => void;
  clearPalaceFilters: () => void;
  resetPalaceFiltersIfNeeded: (currentPath: string) => void;
}

export const useAppStateStore = create<AppState>((set, get) => ({
  currentPage: 'home',
  isGazeTrackerActive: false,
  isBreathDetectorActive: false,
  isVoiceRecognitionActive: false,
  collectedShards: [],
  showRestReminder: false,
  palaceFilter: {
    searchQuery: '',
    selectedTag: null,
    previousPage: '',
  },
  setCurrentPage: (page) => set({ currentPage: page }),
  setIsGazeTrackerActive: (active) => set({ isGazeTrackerActive: active }),
  setIsBreathDetectorActive: (active) => set({ isBreathDetectorActive: active }),
  setIsVoiceRecognitionActive: (active) => set({ isVoiceRecognitionActive: active }),
  addShard: (shard) =>
    set((state) => ({
      collectedShards: [
        ...state.collectedShards,
        {
          ...shard,
          id: `shard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          collectedAt: Date.now(),
        },
      ],
    })),
  removeShard: (id) =>
    set((state) => ({
      collectedShards: state.collectedShards.filter((s) => s.id !== id),
    })),
  clearShards: () => set({ collectedShards: [] }),
  setShowRestReminder: (show) => set({ showRestReminder: show }),
  setPalaceSearchQuery: (query) =>
    set((state) => ({
      palaceFilter: { ...state.palaceFilter, searchQuery: query },
    })),
  setPalaceSelectedTag: (tag) =>
    set((state) => ({
      palaceFilter: { ...state.palaceFilter, selectedTag: tag },
    })),
  setPalacePreviousPage: (page) =>
    set((state) => ({
      palaceFilter: { ...state.palaceFilter, previousPage: page },
    })),
  clearPalaceFilters: () =>
    set((state) => ({
      palaceFilter: { ...state.palaceFilter, searchQuery: '', selectedTag: null },
    })),
  resetPalaceFiltersIfNeeded: (currentPath) => {
    const state = get();
    const prevPage = state.palaceFilter.previousPage;
    const isFromPalaceExplore = prevPage.startsWith('/memory-palace/') && currentPath === '/memory-palace';
    if (!isFromPalaceExplore) {
      set({
        palaceFilter: {
          ...state.palaceFilter,
          searchQuery: '',
          selectedTag: null,
        },
      });
    }
  },
}));
