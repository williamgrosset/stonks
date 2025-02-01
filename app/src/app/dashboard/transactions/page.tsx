"use client"

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FilterButton } from "../components/filter-button"

export default function Page() {
  const [value, setValue] = useState<string>('stocks')

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
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>ghd862</TableCell>
                <TableCell>-</TableCell>
                <TableCell>vhs364</TableCell>
                <TableCell>NVDA</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-700 ring-inset">COMPLETED</span>
                </TableCell>
                <TableCell className="">MARKET</TableCell>
                <TableCell>$60</TableCell>
                <TableCell>35</TableCell>
                <TableCell>07:37 PM 31/01/25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>abc123</TableCell>
                <TableCell>-</TableCell>
                <TableCell>def456</TableCell>
                <TableCell>GOOG</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-700 ring-inset">COMPLETED</span>
                </TableCell>
                <TableCell className="">LIMIT</TableCell>
                <TableCell>$80</TableCell>
                <TableCell>20</TableCell>
                <TableCell>07:34 PM 31/01/25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>hgi819</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>AAPL</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700 ring-inset">PARTIALLY COMPLETE</span>
                </TableCell>
                <TableCell className="">LIMIT</TableCell>
                <TableCell>$100</TableCell>
                <TableCell>30</TableCell>
                <TableCell>06:58 PM 31/01/25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>isa821</TableCell>
                <TableCell>hgi819</TableCell>
                <TableCell>jsi244</TableCell>
                <TableCell>AAPL</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-700 ring-inset">COMPLETED</span>
                </TableCell>
                <TableCell className="">LIMIT</TableCell>
                <TableCell>$100</TableCell>
                <TableCell>5</TableCell>
                <TableCell>05:32 PM 30/01/25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>sdj928</TableCell>
                <TableCell>hgi819</TableCell>
                <TableCell>bnv832</TableCell>
                <TableCell>AAPL</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-700 ring-inset">COMPLETED</span>
                </TableCell>
                <TableCell className="">LIMIT</TableCell>
                <TableCell>$100</TableCell>
                <TableCell>8</TableCell>
                <TableCell>05:30 PM 30/01/25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>aih289</TableCell>
                <TableCell>-</TableCell>
                <TableCell>dhu280</TableCell>
                <TableCell>TSLA</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-yellow-500 ring-inset">IN PROGRESS</span>
                </TableCell>
                <TableCell className="">LIMIT</TableCell>
                <TableCell>$80</TableCell>
                <TableCell>14</TableCell>
                <TableCell>10:11 PM 30/01/25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>vxm031</TableCell>
                <TableCell>-</TableCell>
                <TableCell>nfj282</TableCell>
                <TableCell>MSFT</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-yellow-500 ring-inset">IN PROGRESS</span>
                </TableCell>
                <TableCell className="">LIMIT</TableCell>
                <TableCell>$60</TableCell>
                <TableCell>15</TableCell>
                <TableCell>11:18 PM 29/01/25</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
