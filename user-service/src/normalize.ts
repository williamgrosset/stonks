interface NormalizedShare {
  stock_id: string
  stock_name: string
  quantity_owned: number
}

export function normalizeShare(share: any): NormalizedShare {
  return {
    stock_id: share.stock_id,
    stock_name: share.stock.stock_name,
    quantity_owned: share.quantity
  }
}
