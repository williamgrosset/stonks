'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import NavTabs from '@/components/nav-tabs'
import { UserDropdown } from '@/components/user-dropdown'
import { Wallet } from 'lucide-react'

export function Header() {
  const [balance, setBalance] = useState(-1)

  useEffect(() => {
    const fetchWalletBalance = async () => {
      const token = Cookies.get('authToken')

      if (!token) {
        console.error('Auth token not found')
        return
      }

      try {
        const response = await fetch('http://localhost:5001/transaction/getWalletBalance', {
          headers: {
            token
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch wallet balance')
        }

        const { data } = await response.json()

        setBalance(data.balance)
      } catch (error) {
        console.error('Error fetching wallet balance:', error)
      }
    }

    fetchWalletBalance()
  }, [])

  return (
    <header className="flex items-center justify-between p-4 border-b shadow-md">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">🤑 stonks</h1>
      </div>
      <NavTabs />
      <div className="flex flex-row space-x-6">
        <div className="flex flex-row items-center space-x-1.5 opacity-80">
          <Wallet size={16} />
          <p className="text-sm">${balance}</p>
        </div>
        <UserDropdown />
      </div>
    </header>
  )
}
