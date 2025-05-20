import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager('./src/data/carts.json');

router.post('/', async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: 'No se pudo agregar el producto al carrito' });
  res.json(cart);
});

export default router; 