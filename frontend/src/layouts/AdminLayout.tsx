import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function AdminLayout() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>

        <button onClick={() => navigate('/dashboard')} className="block">
          Dashboard
        </button>

        <button onClick={() => navigate('/orders')} className="block">
          Orders
        </button>

        <button onClick={() => navigate('/tracking')} className="block">
          Tracking
        </button>

        <button onClick={handleLogout} className="block text-red-400">
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-6">
        <div className="mb-4 text-sm text-gray-600">
          Logged in as: {user?.name}
        </div>

        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout