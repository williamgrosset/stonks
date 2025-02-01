import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
 
export function FilterButton() {
  return (
    <Button variant="outline" className="rounded-full">
      <Plus /> Filter
    </Button>
  )
}
