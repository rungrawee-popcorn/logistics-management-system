import { loginApi } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { setUser, setToken, logout } = useAuthStore()

  const login = async (email: string, password: string) => {
    const res = await loginApi({ email, password })

    setUser(res.user)
    setToken(res.token)

    return res.user
  }

  return {
    login,
    logout,
  }
}