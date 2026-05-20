import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import {
  MercadoPagoConfig,
  Payment,
} from 'mercadopago'

dotenv.config()

const app = express()

/* =========================
   CONFIG
========================= */

app.use(cors())

app.use(express.json())

/* =========================
   MERCADO PAGO
========================= */

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
})

const payment = new Payment(client)

/* =========================
   TESTE SERVIDOR
========================= */

app.get('/', (req, res) => {
  res.send(
    'SERVIDOR PIX ONLINE'
  )
})

/* =========================
   CRIAR PIX
========================= */

app.post('/create-pix', async (req, res) => {
  try {
    const { total, items } = req.body

    /* =========================
       VALIDAR TOTAL
    ========================= */

    if (!total || Number(total) <= 0) {
      return res.status(400).json({
        error: 'Total inválido',
      })
    }

    /* =========================
       CRIAR PAGAMENTO PIX
    ========================= */

    const response = await payment.create({
      body: {
        transaction_amount: Number(total),

        description:
          'Pedido Rota do Burger',

        payment_method_id: 'pix',

        payer: {
          email:
            'cliente@email.com',
        },

        additional_info: {
          items:
            items?.map((item) => ({
              id: String(item.id),

              title: item.name,

              quantity:
                Number(item.quantity),

              unit_price:
                Number(item.price),
            })) || [],
        },
      },
    })

    console.log(
      'PIX GERADO:',
      response.id
    )

    /* =========================
       RETORNAR PIX
    ========================= */

    return res.json({
      success: true,

      payment_id: response.id,

      qr_code:
        response.point_of_interaction
          .transaction_data.qr_code,

      qr_code_base64:
        response.point_of_interaction
          .transaction_data
          .qr_code_base64,

      ticket_url:
        response.point_of_interaction
          .transaction_data
          .ticket_url,
    })
  } catch (error) {
    console.log(
      'ERRO PIX:',
      error
    )

    return res.status(500).json({
      success: false,

      error:
        'Erro ao gerar PIX',

      details:
        error.message ||
        'Erro interno',
    })
  }
})

/* =========================
   START SERVER
========================= */

const PORT = 3001

app.listen(PORT, () => {
  console.log(`
===================================
 SERVIDOR PIX ONLINE
===================================

URL:
http://localhost:${PORT}

===================================
`)
})
