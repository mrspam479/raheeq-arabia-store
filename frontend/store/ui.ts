/**
 * Global UI state — cookie banner, announcement bar, etc.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UiState {
  cookieBannerDismissed: boolean;
  announcementDismissed: boolean;
  dismissCookieBanner: () => void;
  dismissAnnouncement: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      cookieBannerDismissed: false,
      announcementDismissed: false,
      dismissCookieBanner: () => set({ cookieBannerDismissed: true }),
      dismissAnnouncement: () => set({ announcementDismissed: true }),
    }),
    {
      name: 'raheeq-ui',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
