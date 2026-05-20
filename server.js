import express from 'express'
import cors from 'cors'
import mercadopago from 'mercadopago'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())

app.use(express.json())

/* =========================
   MERCADO PAGO
========================= */

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
})

/* =========================
   CRIAR PIX
========================= */

app.post('/create-pix', async (req, res) => {
  try {
    const { total } = req.body

    const payment = await mercadopago.payment.create({
      transaction_amount: Number(total),

      description: 'Pedido Rota do Burger',

      payment_method_id: 'pix',

      payer: {
        email: 'playbr24@gmail.com',
      },
    })

    return res.json({
      qr_code:
        payment.body.point_of_interaction
          .transaction_data.qr_code,

      qr_code_base64:
        payment.body.point_of_interaction
          .transaction_data.qr_code_base64,

      pixUrl:
        payment.body.point_of_interaction
          .transaction_data.ticket_url,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao gerar PIX',
    })
  }
})

/* =========================
   START SERVER
========================= */

app.listen(3001, () => {
  console.log(
    'SERVIDOR PIX ONLINE -> http://localhost:3001'
  )
})
