import { Share } from 'prisma-client'

type ShareWithStock = Share<{ stock: { select: { stock_name: true } } }>

interface NormalizedShare {
  stock_id: string
  stock_name: string
  quantity_owned: string
}

export function normalizeShare(share: ShareWithStock): NormalizedShare {
  return {
    stock_id: share.stock_id.toString(),
    stock_name: share.stock.stock_name,
    quantity_owned: share.quantity.toString()
  }
}
