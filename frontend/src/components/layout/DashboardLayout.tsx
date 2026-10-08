import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  header: ReactNode
  children: ReactNode
}

function DashboardLayout({ header, children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-shell">
      {header}
      <main className="dashboard-content">{children}</main>
    </div>
  )
}

export default DashboardLayout