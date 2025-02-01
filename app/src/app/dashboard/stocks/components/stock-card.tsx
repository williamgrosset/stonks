import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Props {
  name: string
  price: string
  quantity: string
}

export default function StockCard({ name, price, quantity }: Props) {
  return (
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
          <div>
            <Subtitle>Quantity</Subtitle>
            <p className="text-3xl">{quantity}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button>Buy</Button>
        <div className="flex flex-row items-center space-x-1.5 opacity-80">
          <p>View orders</p>
          <ArrowRight size={18} />
        </div>
      </CardFooter>
    </Card>
  )
}

const Subtitle = ({ children }: { children: string} ) => (
  <p className="font-[family-name:var(--font-geist-mono)] uppercase tracking-wider opacity-60">{children}</p>
)
