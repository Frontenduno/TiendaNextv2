// store/favoriteProduc/favoritesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: Set<number>;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  getFavoritesCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: new Set<number>(),
      _hasHydrated: false,
      
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      
      addFavorite: (productId) =>
        set((state) => ({
          favorites: new Set(state.favorites).add(productId),
        })),
      
      removeFavorite: (productId) =>
        set((state) => {
          const newFavorites = new Set(state.favorites);
          newFavorites.delete(productId);
          return { favorites: newFavorites };
        }),
      
      toggleFavorite: (productId) => {
        const { favorites, addFavorite, removeFavorite } = get();
        if (favorites.has(productId)) {
          removeFavorite(productId);
        } else {
          addFavorite(productId);
        }
      },
      
      isFavorite: (productId) => get().favorites.has(productId),
      
      getFavoritesCount: () => get().favorites.size,
    }),
    {
      name: 'favorites-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              favorites: new Set(state.favorites || []),
            },
          };
        },
        setItem: (name, value) => {
          const str = JSON.stringify({
            state: {
              ...value.state,
              favorites: Array.from(value.state.favorites),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);