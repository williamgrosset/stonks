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
  quantity: number
}

export default function ShareCard({ id, name, quantity }: Props) {
  const [open, setOpen] = useState(false)
  const [sellQuantity, setSellQuantity] = useState<number>(1)
  const [price, setPrice] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  const handleSell = async () => {
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
          is_buy: false,
          order_type: 'LIMIT',
          quantity: sellQuantity,
          price
        })
      })

      if (!response.ok) {
        throw new Error('Failed to place sell order')
      }

      setOpen(false)
    } catch (error) {
      console.error('Error placing sell order:', error)
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
          <div>
            <Subtitle>Quantity</Subtitle>
            <p className="text-3xl">{quantity}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setOpen(true)}>Sell</Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sell Order</DialogTitle>
          </DialogHeader>
          <div>
            <Subtitle>Quantity</Subtitle>
            <Input
              type="number"
              value={sellQuantity}
              onChange={e => setSellQuantity(Number(e.target.value))}
              min={1}
              max={quantity}
            />
          </div>
          <div>
            <Subtitle>Price (USD)</Subtitle>
            <Input
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              min={1}
              step={1}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSell} disabled={loading}>
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
