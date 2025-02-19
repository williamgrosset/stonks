import { useState } from 'react'
import Cookies from 'js-cookie'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface Props {
  id: string
  name: string
  price: number
}

export default function StockCard({ id, name, price }: Props) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  const handleBuy = async () => {
    setLoading(true)
    const token = Cookies.get('authToken')

    if (!token) {
      console.error('Token not found')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5001/engine/placeStockOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({
          stock_id: id,
          is_buy: true,
          order_type: 'MARKET',
          quantity
        })
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      setOpen(false)
    } catch (error) {
      console.error('Error placing order:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Subtitle>Stock</Subtitle>
          <p className="text-5xl font-semibold uppercase">{name}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2">
            <div>
              <Subtitle>Price (USD)</Subtitle>
              <p className="text-3xl">{`$${price}`}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button onClick={() => setOpen(true)}>Buy</Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Order</DialogTitle>
          </DialogHeader>
          <div>
            <Subtitle>Quantity</Subtitle>
            <Input
              type="number"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              min={1}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBuy} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

const Subtitle = ({ children }: { children: string }) => (
  <p className="font-[family-name:var(--font-geist-mono)] uppercase tracking-wider opacity-60">
    {children}
  </p>
)
