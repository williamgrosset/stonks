import { Input } from "@/components/ui/input"
import { FilterButton } from "../components/filter-button"
import StockCard from "./components/stock-card"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-5xl space-y-4">
        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="text-4xl font-semibold">Stocks</h1>
          <div className="flex flex-row items-center space-x-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
            </span>
            <p className="text-sm text-green-500 pr-2">Live</p>
            <FilterButton />
            <Input type="text" placeholder="Search..." />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StockCard name="aapl" price="85" quantity="40" />
          <StockCard name="amzn" price="80" quantity="30" />
          <StockCard name="goog" price="60" quantity="25" />
          <StockCard name="intc" price="75" quantity="50" />
          <StockCard name="meta" price="90" quantity="60" />
          <StockCard name="msft" price="95" quantity="55" />
          <StockCard name="nvda" price="80" quantity="35" />
          <StockCard name="nflx" price="90" quantity="30" />
          <StockCard name="tsla" price="65" quantity="50" />
        </div>
      </div>
    </div>
  )
}
