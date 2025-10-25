export function cartReducer(state, action) {
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
