import { ReactNode } from "react"
import { Header } from "@/components/header"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4">{children}</main>
    </div>
  )
}

export default Layout
