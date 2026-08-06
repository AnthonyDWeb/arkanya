import type { Metadata } from "next"
import { MaintenancePanel } from "@/components/maintenance-panel"

export const metadata: Metadata = { title: "Maintenance" }

export default function MaintenancePage() {
  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Maintenance</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Worker · raccourcis opérationnels</p>
      </div>
      <div className="p-4 lg:p-6">
        <MaintenancePanel />
      </div>
    </div>
  )
}
