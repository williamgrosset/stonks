'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { FilterButton } from '../components/filter-button'
import { Button } from '@/components/ui/button'

interface StockTransaction {
  order_status: string
  order_type: string
  quantity: number
  time_stamp: string
  stock_tx_id: string
  parent_stock_tx_id: string | null
  wallet_tx_id: string | null
  stock_id: string
  stock_price: number
  is_buy: boolean
}

interface WalletTransaction {
  is_debit: boolean
  amount: number
  time_stamp: string
  wallet_tx_id: string
  stock_tx_id: string | null
}

export default function Page() {
  const [value, setValue] = useState<string>('stocks')
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>([])
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = Cookies.get('authToken')

      if (!token) {
        console.error('Token not found')
        setLoading(false)
        return
      }

      try {
        const [stockResponse, walletResponse] = await Promise.all([
          fetch('http://localhost:5001/transaction/getStockTransactions', {
            headers: { token }
          }),
          fetch('http://localhost:5001/transaction/getWalletTransactions', {
            headers: { token }
          })
        ])

        if (!stockResponse.ok || !walletResponse.ok) {
          throw new Error('Failed to fetch transactions')
        }

        const stockData = await stockResponse.json()
        const walletData = await walletResponse.json()

        setStockTransactions(stockData.data)
        setWalletTransactions(walletData.data)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const handleCancel = async (stock_tx_id: string) => {
    const token = Cookies.get('authToken')
    if (!token) {
      console.error('Token not found')
      return
    }

    try {
      const response = await fetch('http://localhost:5001/engine/cancelStockTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({ stock_tx_id })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel transaction')
      }

      setStockTransactions(prev => prev.filter(tx => tx.stock_tx_id !== stock_tx_id))
    } catch (error) {
      console.error('Error cancelling transaction:', error)
    }
  }

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-5xl space-y-16">
        <div className="w-full space-y-4">
          <h1 className="text-4xl font-semibold">Transactions</h1>
          <div className="flex flex-row items-center justify-between w-full">
            <Tabs value={value} onValueChange={setValue}>
              <TabsList className="w-full flex justify-center gap-4">
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-row space-x-2">
              <FilterButton />
              <Input type="text" placeholder="Search..." />
            </div>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : value === 'stocks' ? (
            <Table className="border rounded-xl">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Parent TX ID</TableHead>
                  <TableHead>Wallet TX ID</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price (USD)</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date (PST)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockTransactions.map(tx => (
                  <TableRow key={tx.stock_tx_id}>
                    <TableCell>{tx.stock_tx_id}</TableCell>
                    <TableCell>{tx.parent_stock_tx_id || '-'}</TableCell>
                    <TableCell>{tx.wallet_tx_id || '-'}</TableCell>
                    <TableCell>{tx.stock_id}</TableCell>
                    <TableCell>{tx.order_status}</TableCell>
                    <TableCell>{tx.order_type}</TableCell>
                    <TableCell>${tx.stock_price}</TableCell>
                    <TableCell>{tx.quantity}</TableCell>
                    <TableCell>{new Date(tx.time_stamp).toLocaleString()}</TableCell>
                    <TableCell>
                      {(tx.order_status === 'IN_PROGRESS' ||
                        tx.order_status === 'PARTIALLY_COMPLETE') && (
                        <Button variant="destructive" onClick={() => handleCancel(tx.stock_tx_id)}>
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table className="border rounded-xl">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Stock TX ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount (USD)</TableHead>
                  <TableHead>Date (PST)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletTransactions.map(tx => (
                  <TableRow key={tx.wallet_tx_id}>
                    <TableCell>{tx.wallet_tx_id}</TableCell>
                    <TableCell>{tx.stock_tx_id || '-'}</TableCell>
                    <TableCell>{tx.is_debit ? 'Debit' : 'Credit'}</TableCell>
                    <TableCell>${tx.amount}</TableCell>
                    <TableCell>{new Date(tx.time_stamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
