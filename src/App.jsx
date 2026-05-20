import { useState, useEffect } from 'react'

import {
  Menu,
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
} from 'lucide-react'

import axios from 'axios'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const [loadingPix, setLoadingPix] =
    useState(false)

  const [pixData, setPixData] =
    useState(null)

  const [cartOpen, setCartOpen] =
    useState(false)

  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart =
        localStorage.getItem('rota-cart')

      return savedCart
        ? JSON.parse(savedCart)
        : []
    }

    return []
  })

  const products = [
    {
      id: 1,
      name: 'ROTA BURGER',
      description:
        'Pão brioche, hambúrguer artesanal, queijo cheddar e molho especial.',
      price: 20,
      image:
        'https://6a0cd282970fabf91b286dc7.imgix.net/1.png?auto=format,compress&fit=max&w=3200&q=100&sharp=120&dpr=2',
    },

    {
      id: 2,
      name: 'ROTA BACON',
      description:
        'Hambúrguer artesanal com bacon crocante e cheddar duplo.',
      price: 34.9,
      image:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?q=100&w=2400&auto=format&fit=crop',
    },

    {
      id: 3,
      name: 'ROTA MONSTER',
      description:
        'Burger gigante com onion rings e molho barbecue.',
      price: 39.9,
      image:
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=100&w=2400&auto=format&fit=crop',
    },
  ]

  /* =========================
     SALVAR CARRINHO
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      'rota-cart',
      JSON.stringify(cart)
    )
  }, [cart])

  /* =========================
     ADICIONAR
  ========================= */

  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    )

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ])
    }

    setCartOpen(true)
  }

  /* =========================
     REMOVER
  ========================= */

  const removeFromCart = (id) => {
    setCart(
      cart.filter((item) => item.id !== id)
    )
  }

  /* =========================
     AUMENTAR
  ========================= */

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  /* =========================
     DIMINUIR
  ========================= */

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  /* =========================
     TOTAL ITENS
  ========================= */

  const cartCount = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  )

  /* =========================
     TOTAL
  ========================= */

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  )

  /* =========================
     GERAR PIX
  ========================= */

  const handlePixPayment = async () => {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio')
      return
    }

    try {
      setLoadingPix(true)

      const response = await axios.post(
        'http://localhost:3001/create-pix',
        {
          items: cart,
          total,
        }
      )

      console.log(response.data)

      setPixData(response.data)

      if (response.data.ticket_url) {
        window.open(
          response.data.ticket_url,
          '_blank'
        )
      }
    } catch (error) {
      console.log(error)

      alert(
        'Erro ao gerar PIX. Verifique o backend.'
      )
    } finally {
      setLoadingPix(false)
    }
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-zinc-800">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <h1 className="text-3xl md:text-4xl font-black text-orange-400">
            ROTA DO BURGER
          </h1>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex gap-8 text-zinc-300 font-semibold">

            <a href="#home">
              Início
            </a>

            <a href="#produtos">
              Produtos
            </a>

            <a href="#carrinho">
              Carrinho
            </a>

          </nav>

          {/* CARRINHO */}
          <button
            onClick={() =>
              setCartOpen(!cartOpen)
            }
            className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-800 hover:border-orange-400 transition-all"
          >

            <ShoppingCart className="text-orange-400" />

            <span className="font-bold">
              {cartCount}
            </span>

          </button>

          {/* MOBILE */}
          <button
            className="md:hidden"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            {menuOpen ? (
              <X
                size={32}
                className="text-orange-400"
              />
            ) : (
              <Menu
                size={32}
                className="text-orange-400"
              />
            )}
          </button>

        </div>

        {/* MENU MOBILE */}
        {menuOpen && (
          <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-6 py-6 flex flex-col gap-6">

            <a
              href="#home"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Início
            </a>

            <a
              href="#produtos"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Produtos
            </a>

            <a
              href="#carrinho"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Carrinho
            </a>

          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center text-center px-6 bg-cover bg-center relative"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1508737027454-e6454ef45afd?q=100&w=2600&auto=format&fit=crop)',
        }}
      >

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 max-w-4xl">

          <h2 className="text-5xl md:text-7xl font-black">
            O MELHOR
            <span className="text-orange-400 block">
              HAMBÚRGUER
            </span>
            DA CIDADE
          </h2>

          <p className="text-zinc-300 mt-6 text-lg">
            Hambúrguer artesanal premium.
          </p>

        </div>
      </section>

      {/* PRODUTOS */}
      <section
        id="produtos"
        className="py-24 px-6 bg-zinc-950"
      >

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          {products.map((product) => (

            <div
              key={product.id}
              className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800"
            >

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 object-cover"
                loading="lazy"
                fetchPriority="high"
              />

              <div className="p-6">

                <h3 className="text-2xl font-bold">
                  {product.name}
                </h3>

                <p className="text-zinc-400 mt-3">
                  {product.description}
                </p>

                <p className="text-orange-400 text-3xl font-black mt-5">
                  R$ {product.price.toFixed(2)}
                </p>

                <button
                  onClick={() =>
                    addToCart(product)
                  }
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-400 text-black py-4 rounded-2xl font-black"
                >
                  ADICIONAR AO CARRINHO
                </button>

              </div>

            </div>

          ))}

        </div>
      </section>

      {/* CARRINHO */}
      {cartOpen && (
        <section
          id="carrinho"
          className="py-24 px-6 bg-black"
        >

          <div className="max-w-4xl mx-auto">

            <h2 className="text-5xl font-black mb-10">
              SEU CARRINHO
            </h2>

            {cart.length === 0 ? (
              <div className="bg-zinc-900 rounded-3xl p-10 text-center text-zinc-400 text-xl">
                Seu carrinho está vazio.
              </div>
            ) : (
              <div className="space-y-6">

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="bg-zinc-900 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >

                    <div>

                      <h3 className="text-2xl font-black text-orange-400">
                        {item.name}
                      </h3>

                      <p className="text-zinc-400 mt-2">
                        Quantidade:
                        {' '}
                        {item.quantity}
                      </p>

                    </div>

                    <div className="flex items-center gap-3 flex-wrap">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        className="bg-zinc-800 p-3 rounded-xl"
                      >
                        <Minus size={18} />
                      </button>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                        className="bg-zinc-800 p-3 rounded-xl"
                      >
                        <Plus size={18} />
                      </button>

                      <button
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        className="bg-red-600 p-3 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>

                      <span className="text-2xl font-black ml-4">
                        R$
                        {' '}
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </span>

                    </div>

                  </div>

                ))}

                {/* TOTAL */}
                <div className="bg-zinc-900 border border-green-500 rounded-3xl p-8 text-center">

                  <h3 className="text-4xl font-black text-green-400">
                    TOTAL: R$ {total.toFixed(2)}
                  </h3>

                  <button
                    onClick={handlePixPayment}
                    disabled={loadingPix}
                    className="mt-8 bg-green-500 hover:bg-green-400 text-black px-10 py-5 rounded-2xl font-black text-xl disabled:opacity-50"
                  >
                    {loadingPix
                      ? 'GERANDO PIX...'
                      : 'PAGAR VIA PIX'}
                  </button>

                </div>

                {/* PIX */}
                {pixData?.qr_code_base64 && (
                  <div className="bg-zinc-900 border border-green-500 rounded-3xl p-10 text-center mt-10">

                    <h2 className="text-4xl font-black text-green-400">
                      PIX GERADO
                    </h2>

                    <img
                      src={`data:image/png;base64,${pixData.qr_code_base64}`}
                      alt="PIX"
                      className="w-72 mx-auto mt-8 rounded-2xl"
                    />

                    <textarea
                      readOnly
                      value={pixData.qr_code}
                      className="w-full bg-zinc-800 text-white p-4 rounded-2xl mt-8 h-32"
                    />

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          pixData.qr_code
                        )

                        alert('PIX copiado')
                      }}
                      className="mt-6 bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-2xl font-black"
                    >
                      COPIAR PIX
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>

        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-10 text-center text-zinc-500 bg-black">
        © 2026 - ROTA DO BURGER
      </footer>

    </div>
  )
}
