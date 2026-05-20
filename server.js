import express from 'express'
import cors from 'cors'

import mercadopago from 'mercadopago'

const app = express()

app.use(cors())

app.use(express.json())

/* =========================
   MERCADO PAGO
========================= */

mercadopago.configure({
  access_token:
    'APP_USR-6549580196272623-052002-015c76633dd8043e01d4d604c793b816-3415580190',
})

/* =========================
   GERAR PIX
========================= */

app.post('/create-pix', async (req, res) => {
  try {
    const { total } = req.body

    const payment =
      await mercadopago.payment.create({
        transaction_amount: Number(total),

        description:
          'Pedido Rota do Burger',

        payment_method_id: 'pix',

        payer: {
          email:
            'playbr24@gmail.com',
        },
      })

    const data =
      payment.body.point_of_interaction
        .transaction_data

    res.json({
      qr_code: data.qr_code,

      qr_code_base64:
        data.qr_code_base64,

      pixUrl: data.ticket_url,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Erro ao gerar PIX',
    })
  }
})

/* =========================
   SERVER
========================= */

app.listen(3001, () => {
  console.log(
    'SERVIDOR PIX ONLINE NA PORTA 3001'
  )
})
