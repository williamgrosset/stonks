export function normalizeStockTransaction(tx: any) {
  const { id, user_id, price, ...rest } = tx

  return {
    ...rest,
    stock_tx_id: tx.id,
    parent_tx_id: tx.parent_stock_transaction_id ?? null,
    wallet_tx_id: tx.wallet_transaction_id ?? null,
    stock_price: tx.price,
    is_buy: tx.order_type === 'LIMIT' ? true : false
  }
}

export function normalizeWalletTransaction(tx: any) {
  const { id, user_id, ...rest } = tx

  return {
    ...rest,
    wallet_tx_id: tx.id,
    stock_tx_id: tx.stock_transaction ? tx.stock_transaction.id : null
  }
}
