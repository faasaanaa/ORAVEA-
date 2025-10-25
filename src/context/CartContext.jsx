import React, { createContext, useContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'

const CartStateContext = createContext()
const CartDispatchContext = createContext()

const initialState = {
  items: [],
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE':
      return action.payload
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + action.payload.qty } : i)
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i) }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const raw = localStorage.getItem('cart')
    if (raw) {
      try {
        dispatch({ type: 'INITIALIZE', payload: JSON.parse(raw) })
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
    </CartDispatchContext.Provider>
  )
}

CartProvider.propTypes = { children: PropTypes.node }

export function useCartState() {
  return useContext(CartStateContext)
}

export function useCartDispatch() {
  return useContext(CartDispatchContext)
}
