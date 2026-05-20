import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { MercadoPagoConfig, Payment } from 'mercadopago'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
})

const payment = new Payment(client)

app.post('/create-pix', async (req, res) => {
  try {

    const { total } = req.body

    const result = await payment.create({
      body: {
        transaction_amount: Number(total),

        description: 'Pedido Rota do Burger',

        payment_method_id: 'pix',

        payer: {
          email: 'playbr24@gmail.com',
        },
      },
    })

    res.json({
      pixCode:
        result.point_of_interaction.transaction_data.qr_code,

      pixQrCode:
        result.point_of_interaction.transaction_data.qr_code_base64,

      pixUrl:
        result.point_of_interaction.transaction_data.ticket_url,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao gerar PIX',
    })
  }
})

app.listen(3001, () => {
  console.log('PIX SERVER ONLINE')
})