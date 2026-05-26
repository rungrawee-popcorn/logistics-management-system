import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'ADMIN' | 'RIDER' | 'CUSTOMER'

export type User = {
  id: number
  name: string
  role: UserRole
}

type AuthState = {
  user: User | null
  token: string | null
  hydrated: boolean

  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  setHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      logout: () => set({ user: null, token: null }),

      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: 'auth-storage',

      // FIX: safer hydration handling
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)