import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()

  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)

  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const hydrated = useAuthStore((state) => state.hydrated)
  const setHydrated = useAuthStore((state) => state.setHydrated)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Force hydration state to avoid stuck loading when persist is empty or cleared
  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [setHydrated])

  const handleLogin = async () => {
    try {
      const res = await authService.login({ email, password })

      setUser(res.user)
      setToken(res.token)

      const role = res.user.role

      if (role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (role === 'RIDER') {
        navigate('/rider/orders')
      } else if (role === 'CUSTOMER') {
        navigate('/customer/orders')
      } else {
        navigate('/unauthorized')
      }

      alert(`Welcome ${res.user.name}`)
    } catch (err) {
      console.error(err)
      alert('Login failed')
    }
  }

  // Show loading screen while auth store is being hydrated
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Redirect user if already authenticated
  if (token && user) {
    const role = user.role

    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (role === 'RIDER') return <Navigate to="/rider/orders" replace />
    if (role === 'CUSTOMER') return <Navigate to="/customer/orders" replace />

    return <Navigate to="/unauthorized" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          className="w-full px-4 py-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full px-4 py-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default LoginPage