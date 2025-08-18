export type CartItem = { id:number; name:string; price:number; qty:number; modifiers?: { id:number; name:string; priceDelta:number; qty:number }[] };
const KEY = 'ab_cart_v1';

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); }catch{ return []; }
}
export function saveCart(items: CartItem[]){
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(items));
}
export function addToCart(item: CartItem){
  const cart = loadCart();
  const idx = cart.findIndex(i => i.id === item.id && JSON.stringify(i.modifiers||[])===JSON.stringify(item.modifiers||[]));
  if (idx >= 0) cart[idx].qty += item.qty;
  else cart.push(item);
  saveCart(cart);
  return cart;
}
export function clearCart(){ saveCart([]); }
