import Cookies from 'js-cookie'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown, User } from 'lucide-react'

export function UserDropdown() {
  const logout = () => {
    Cookies.remove('authToken')
    window.location.href = '/login'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row items-center">
        <User size={20} className="mr-1.5" />
        <ChevronDown size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Shares</DropdownMenuItem>
        <DropdownMenuItem>Transactions</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
