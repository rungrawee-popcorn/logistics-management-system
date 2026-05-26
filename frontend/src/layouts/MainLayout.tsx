import { Outlet } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">ADMIN</h1>

        <nav className="space-y-2">
          <a
            href="/admin/dashboard"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Dashboard
          </a>
          <a
            href="/admin/orders"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Orders
          </a>
          <a
            href="/admin/tracking"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Tracking
          </a>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export function RiderLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">RIDER</h1>

        <nav className="space-y-2">
          <a
            href="/rider/orders"
            className="block hover:bg-blue-700 p-2 rounded"
          >
            My Orders
          </a>
          <a
            href="/rider/tracking"
            className="block hover:bg-blue-700 p-2 rounded"
          >
            Tracking
          </a>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export function CustomerLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-green-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">CUSTOMER</h1>

        <nav className="space-y-2">
          <a
            href="/customer/orders"
            className="block hover:bg-green-700 p-2 rounded"
          >
            Orders
          </a>
          <a
            href="/customer/tracking"
            className="block hover:bg-green-700 p-2 rounded"
          >
            Tracking
          </a>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  )
}