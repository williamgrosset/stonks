import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FilterButton } from "../components/filter-button"
import ShareCard from "./components/share-card"

export default function Page() {
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
            <ShareCard name="aapl" quantity="50" />
            <ShareCard name="msft" quantity="80" />
            <ShareCard name="nvda" quantity="60" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="text-4xl font-semibold">Pending Orders</h1>
            <div className="flex flex-row space-x-2">
              <FilterButton />
              <Input type="text" placeholder="Search..." />
            </div>
          </div>
          <Table className="border rounded-xl">
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead>Price (USD)</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">GOOG</TableCell>
                <TableCell>$80</TableCell>
                <TableCell>50</TableCell>
                <TableCell>
                  <Button variant="destructive">Cancel</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">AAPL</TableCell>
                <TableCell>$60</TableCell>
                <TableCell>40</TableCell>
                <TableCell>
                  <Button variant="destructive">Cancel</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
