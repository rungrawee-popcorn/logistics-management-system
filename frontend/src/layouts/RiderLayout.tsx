import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function RiderLayout() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="min-h-screen flex">
      <div className="w-64 bg-blue-900 text-white p-4 space-y-4">
        <h1 className="text-xl font-bold">Rider Panel</h1>

        <button onClick={() => navigate('/orders')}>My Jobs</button>
        <button onClick={() => navigate('/tracking')}>Tracking</button>

        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="text-red-300"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-4 text-sm text-gray-600">Rider: {user?.name}</div>

        <Outlet />
      </div>
    </div>
  )
}

export default RiderLayout