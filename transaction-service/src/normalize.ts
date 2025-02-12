export function normalizeStockTransaction(tx: any) {
  const { id, user_id, ...rest } = tx

  return {
    ...rest,
    stock_tx_id: tx.id,
    parent_tx_id: tx.parent_stock_transaction_id ?? null,
    wallet_tx_id: tx.wallet_transaction_id ?? null,
    stock_price: Math.round(parseFloat(tx.price))
  }
}

export function normalizeWalletTransaction(tx: any) {
  const { id, user_id, ...rest } = tx

  return {
    ...rest,
    wallet_tx_id: tx.id,
    stock_tx_id: tx.stock_transaction ? tx.stock_transaction_id : null,
    amount: Math.round(parseFloat(tx.amount))
  }
}
