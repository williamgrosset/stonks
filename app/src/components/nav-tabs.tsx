"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from "next/navigation"

const NavTabs = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Tabs value={pathname} onValueChange={(value) => router.push(value)}>
      <TabsList className="w-full flex justify-center gap-4">
        <TabsTrigger value="/dashboard/stocks">Stocks</TabsTrigger>
        <TabsTrigger value="/dashboard/shares">Shares</TabsTrigger>
        <TabsTrigger value="/dashboard/transactions">Transactions</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default NavTabs
