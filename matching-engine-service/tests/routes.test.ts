import Fastify from 'fastify'
import Redis from 'ioredis-mock'
import ky from 'ky'
import routes from '../src/routes.js'

jest.mock('../src/redis.js', () => ({
  __esModule: true,
  default: new Redis()
}))

jest.mock('ky', () => ({
  __esModule: true,
  default: {
    post: jest.fn()
  }
}))

const mockedKy = jest.mocked(ky)

describe('Orders Routes', () => {
  let fastify: any
  let redis: any

  beforeAll(async () => {
    redis = new Redis()
    fastify = Fastify()

    await fastify.register(routes)
    await fastify.ready()
  })

  afterAll(async () => {
    await fastify.close()
    redis.quit()
  })

  beforeEach(async () => {
    await redis.flushall()
    jest.clearAllMocks()
  })

  it('should process a sell order successfully', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/orders/sell',
      payload: {
        stock_transaction_id: 'txn123',
        stock_id: 'stock123',
        stock_name: 'Test Stock',
        user_id: 'user123',
        quantity: 10,
        price: 100
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ success: true, data: null })

    expect(await redis.smembers('stocks')).toContain('stock123')
    expect((await redis.zrange('sell_orders:stock123', 0, -1)).length).toBe(1)
  })

  it('should process a buy order with a partial sell order successfully', async () => {
    await redis.zadd(
      'sell_orders:stock123',
      100,
      JSON.stringify({
        stock_transaction_id: 'txn123',
        stock_id: 'stock123',
        stock_name: 'Test Stock',
        user_id: 'seller123',
        quantity: 10,
        price: 100
      })
    )

    const response = await fastify.inject({
      method: 'POST',
      url: '/orders/buy',
      payload: {
        stock_id: 'stock123',
        stock_name: 'Test Stock',
        user_id: 'buyer123',
        quantity: 5,
        deduction: 500
      }
    })

    const orders = await redis.zrange('sell_orders:stock123', 0, 0)
    const order = JSON.parse(orders[0])

    expect(order.quantity).toBe(5)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ success: true, data: null })

    expect(mockedKy.post).toHaveBeenCalledWith(
      'http://transaction-service:3001/orders/complete',
      expect.objectContaining({
        json: {
          buyer_id: 'buyer123',
          seller_id: 'seller123',
          stock_transaction_id: 'txn123',
          stock_id: 'stock123',
          stock_name: 'Test Stock',
          quantity: 5,
          price: 100,
          is_partial: true
        }
      })
    )
  })

  it('should process a buy order with a complete sell order successfully', async () => {
    await redis.zadd(
      'sell_orders:stock123',
      100,
      JSON.stringify({
        stock_transaction_id: 'txn123',
        stock_id: 'stock123',
        stock_name: 'Test Stock',
        user_id: 'seller123',
        quantity: 10,
        price: 100
      })
    )

    const response = await fastify.inject({
      method: 'POST',
      url: '/orders/buy',
      payload: {
        stock_id: 'stock123',
        stock_name: 'Test Stock',
        user_id: 'buyer123',
        quantity: 10,
        deduction: 1000
      }
    })

    expect((await redis.zrange('sell_orders:stock123', 0, -1)).length).toBe(0)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ success: true, data: null })

    expect(mockedKy.post).toHaveBeenCalledWith(
      'http://transaction-service:3001/orders/complete',
      expect.objectContaining({
        json: {
          buyer_id: 'buyer123',
          seller_id: 'seller123',
          stock_transaction_id: 'txn123',
          stock_id: 'stock123',
          stock_name: 'Test Stock',
          quantity: 10,
          price: 100,
          is_partial: false
        }
      })
    )
  })

  it('should return 400 if no sell orders exist', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/orders/buy',
      payload: {
        stock_id: 'stock123',
        stock_name: 'Test Stock',
        user_id: 'buyer123',
        quantity: 5,
        deduction: 500
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({
      success: false,
      data: null,
      message: 'No matching sell orders found'
    })

    expect(mockedKy.post).toHaveBeenCalledWith(
      'http://transaction-service:3001/orders/refund',
      expect.objectContaining({ json: { user_id: 'buyer123', amount: 500 } })
    )
  })

  it('should return 400 if user tries to buy their own sell order', async () => {
    await redis.zadd(
      'sell_orders:stock123',
      100,
      JSON.stringify({
        stock_transaction_id: 'txn123',
        stock_id: 'stock123',
        stock_name: 'Test Stock',
        user_id: 'buyer123',
        quantity: 10,
        price: 100
      })
    )

    const response = await fastify.inject({
      method: 'POST',
      url: '/orders/buy',
      payload: {
        stock_id: 'stock123',
        stock_name: 'Test Stock',
        user_id: 'buyer123',
        quantity: 5,
        deduction: 500
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({
      success: false,
      data: null,
      message: 'User cannot buy their own sell order'
    })

    expect(mockedKy.post).toHaveBeenCalledWith(
      'http://transaction-service:3001/orders/refund',
      expect.objectContaining({ json: { user_id: 'buyer123', amount: 500 } })
    )
  })

  it('should cancel a sell order successfully', async () => {
    await redis.hset('sell_orders_index', 'txn123', 'stock123')
    await redis.zadd(
      'sell_orders:stock123',
      100,
      JSON.stringify({
        stock_transaction_id: 'txn123',
        stock_id: 'stock123',
        user_id: 'user123'
      })
    )

    const response = await fastify.inject({
      method: 'POST',
      url: '/orders/cancel',
      payload: {
        stock_transaction_id: 'txn123',
        user_id: 'user123'
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ success: true, data: null })

    expect(await redis.zrange('sell_orders:stock123', 0, -1)).toHaveLength(0)
    expect(await redis.hget('sell_orders_index', 'txn123')).toBeNull()

    expect(mockedKy.post).toHaveBeenCalledWith(
      'http://transaction-service:3001/orders/cancel',
      expect.objectContaining({ json: { stock_transaction_id: 'txn123' } })
    )
  })

  it('should return 404 if order does not exist', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/orders/cancel',
      payload: {
        stock_transaction_id: 'txn999',
        user_id: 'user123'
      }
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      success: false,
      data: { error: 'Order not found or already executed' }
    })
  })
})
