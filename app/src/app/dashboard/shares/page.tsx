'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Input } from '@/components/ui/input'
import { FilterButton } from '../components/filter-button'
import ShareCard from './components/share-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface Share {
  stock_id: string
  stock_name: string
  quantity_owned: number
}

export default function Page() {
  const [shares, setShares] = useState<Share[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStockPortfolio = async () => {
      const token = Cookies.get('authToken')

      if (!token) {
        console.error('Token not found')
        setLoading(false)
        return
      }

      try {
        const response = await fetch('http://localhost:5001/transaction/getStockPortfolio', {
          headers: {
            token
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch stock portfolio')
        }

        const { data } = await response.json()
        setShares(data)
      } catch (error) {
        console.error('Error fetching stock portfolio:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStockPortfolio()
  }, [])

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-5xl space-y-16">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="text-4xl font-semibold">Shares</h1>
            <div className="flex flex-row space-x-2">
              <FilterButton />
              <Input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              shares.map(share => (
                <ShareCard
                  key={share.stock_id}
                  id={share.stock_id}
                  name={share.stock_name}
                  quantity={share.quantity_owned}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
