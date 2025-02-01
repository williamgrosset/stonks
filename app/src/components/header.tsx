import NavTabs from "@/components/nav-tabs"
import { UserDropdown } from "@/components/user-dropdown"
import { Wallet } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b shadow-md">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">🤑 stonks</h1>
      </div>
      <NavTabs />
      <div className="flex flex-row space-x-6">
        <div className="flex flex-row items-center space-x-1.5 opacity-80">
          <Wallet size={16} />
          <p className="text-sm">$5000</p>
        </div>
        <UserDropdown />
      </div>
    </header>
  )
}
