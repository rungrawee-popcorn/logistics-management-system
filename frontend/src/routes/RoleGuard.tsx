import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

type Role = 'ADMIN' | 'RIDER' | 'CUSTOMER'

type Props = {
  children: React.ReactNode
  allowedRoles: Role[]
}

const RoleGuard = ({ children, allowedRoles }: Props) => {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const hydrated = useAuthStore((state) => state.hydrated)

  // IMPORTANT: wait until zustand restore state
  if (!hydrated) {
    return <div>Loading...</div>
  }

  // not logged in
  if (!token || !user) {
    return <Navigate to="/" replace />
  }

  // wrong role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

export default RoleGuard
