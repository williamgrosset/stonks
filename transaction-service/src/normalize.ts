import { StockTransaction, WalletTransaction } from 'prisma-client'

type WalletTxWithStockTx = WalletTransaction<{ stock_transaction: { select: { id: true } } }>

interface NormalizedStockTransaction {
  order_status: string
  order_type: string
  quantity: number
  time_stamp: Date
  stock_tx_id: string
  parent_stock_tx_id: string | null
  wallet_tx_id: string | null
  stock_id: string
  stock_price: number
  is_buy: boolean
}

interface NormalizedWalletTransaction {
  is_debit: boolean
  amount: number
  time_stamp: Date
  wallet_tx_id: string
  stock_tx_id: string | null
}

export function normalizeStockTransaction(tx: StockTransaction): NormalizedStockTransaction {
  const { id, user_id, price, stock_id, ...rest } = tx

  return {
    ...rest,
    stock_tx_id: tx.id.toString(),
    parent_stock_tx_id: tx.parent_stock_transaction_id
      ? tx.parent_stock_transaction_id.toString()
      : null,
    wallet_tx_id: tx.wallet_transaction_id ? tx.wallet_transaction_id.toString() : null,
    stock_id: tx.stock_id.toString(),
    stock_price: tx.price,
    is_buy: tx.order_type === 'MARKET' ? true : false
  }
}

export function normalizeWalletTransaction(tx: WalletTxWithStockTx): NormalizedWalletTransaction {
  const { id, user_id, stock_transaction, ...rest } = tx

  return {
    ...rest,
    wallet_tx_id: tx.id.toString(),
    stock_tx_id: tx.stock_transaction ? tx.stock_transaction.id.toString() : null
  }
}
