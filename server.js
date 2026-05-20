import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MercadoPagoConfig, Payment } from 'mercadopago'

dotenv.config()

console.log('TOKEN:', process.env.MP_ACCESS_TOKEN)

const app = express()

app.use(cors())
app.use(express.json())

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
})

const payment = new Payment(client)

app.get('/', (req, res) => {
  res.send('PIX SERVER ONLINE')
})

app.post('/create-pix', async (req, res) => {
  try {
    const { total, items } = req.body

    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' })
    }

    const response = await payment.create({
      body: {
        transaction_amount: Number(total),
        description: 'Pedido Rota do Burger',
        payment_method_id: 'pix',

        payer: {
          email: 'playbr24@gmail.com',
        },

        additional_info: {
          items: items?.map(i => ({
            id: String(i.id),
            title: i.name,
            quantity: Number(i.quantity),
            unit_price: Number(i.price),
          })) || [],
        },
      },
    })

    const tx = response?.point_of_interaction?.transaction_data

    if (!tx) {
      return res.status(500).json({
        error: 'PIX não gerado pela API',
      })
    }

    return res.json({
      success: true,
      payment_id: response.id,
      qr_code: tx.qr_code || null,
      qr_code_base64: tx.qr_code_base64 || null,
      ticket_url: tx.ticket_url || null,
    })

  } catch (error) {
    console.log('ERRO PIX:', error)

    return res.status(500).json({
      error: 'Erro ao gerar PIX',
      details: error.message,
    })
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`PIX SERVER ONLINE -> http://localhost:${PORT}`)
})
