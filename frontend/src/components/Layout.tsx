import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <div className="mx-auto flex max-w-6xl">
        <Sidebar />
        <div className="min-w-0 flex-1 px-4 py-8 md:px-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout