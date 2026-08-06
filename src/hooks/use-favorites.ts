import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (id: string) => {
        const { favorites } = get();
        const isFav = favorites.includes(id);
        if (isFav) {
          set({ favorites: favorites.filter((favId) => favId !== id) });
        } else {
          set({ favorites: [...favorites, id] });
        }
      },
      isFavorite: (id: string) => get().favorites.includes(id),
    }),
    {
      name: 'pagou-morou-favorites',
    }
  )
);
