'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string // compound id: `${productId}-${color}`
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  color: string
}

interface CartContextType {
  cartItems: CartItem[]
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addToCart: (product: any, quantity: number, color: string) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('hakai_cart')
    if (stored) {
      try {
        setCartItems(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse cart items', e)
      }
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('hakai_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: any, quantity: number, color: string) => {
    const productId = product.id || product._id
    const compoundId = `${productId}-${color}`

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === compoundId)
      if (existing) {
        return prev.map((item) =>
          item.id === compoundId ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      
      const imageUrl = typeof product.image === 'object' && product.image !== null
        ? product.image.url
        : product.image

      return [
        ...prev,
        {
          id: compoundId,
          productId,
          name: `${product.name} (${color})`,
          price: product.price,
          image: imageUrl || '',
          quantity,
          color,
        },
      ]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      )
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
