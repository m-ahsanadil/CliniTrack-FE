
import { ReactNode } from "react"
import DashboardShell from "@/src/modules/Dashboard/layout"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {

  return (
    <>
      <DashboardShell>
        {children}
      </DashboardShell>
    </>
  )
}