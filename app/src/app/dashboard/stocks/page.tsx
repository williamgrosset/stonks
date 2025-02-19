'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Input } from '@/components/ui/input'
import { FilterButton } from '../components/filter-button'
import StockCard from './components/stock-card'

interface Stock {
  stock_id: string
  stock_name: string
  current_price: number
}

export default function Page() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStockPrices = async () => {
      const token = Cookies.get('authToken')

      if (!token) {
        console.error('Token not found')
        setLoading(false)
        return
      }

      try {
        const response = await fetch('http://localhost:5001/transaction/getStockPrices', {
          headers: {
            token
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch stock prices')
        }

        const { data } = await response.json()
        setStocks(data)
      } catch (error) {
        console.error('Error fetching stock prices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStockPrices()
  }, [])

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-5xl space-y-4">
        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="text-4xl font-semibold">Stocks</h1>
          <div className="flex flex-row items-center space-x-2">
            <FilterButton />
            <Input type="text" placeholder="Search..." />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            stocks.map(stock => (
              <StockCard
                key={stock.stock_id}
                id={stock.stock_id}
                name={stock.stock_name}
                price={stock.current_price}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
