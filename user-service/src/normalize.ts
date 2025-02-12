export function normalizeShare(share: any) {
  return {
    stock_id: share.id,
    stock_name: share.stock.stock_name,
    quantity_owned: Math.round(share.quantity)
  }
}
