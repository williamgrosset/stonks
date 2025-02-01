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
  quantity: string
}

export default function ShareCard({ name, quantity }: Props) {
  return (
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
        <Button>Sell</Button>
      </CardFooter>
    </Card>
  )
}

const Subtitle = ({ children }: { children: string} ) => (
  <p className="font-[family-name:var(--font-geist-mono)] uppercase tracking-wider opacity-60">{children}</p>
)
