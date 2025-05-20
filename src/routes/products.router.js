import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', async (req, res) => {
  const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Campo requerido faltante: ${field}` });
    }
  }

  const existingProducts = await productManager.getProducts();
  const duplicate = existingProducts.find(p => p.title === req.body.title);
  if (duplicate) {
    return res.status(400).json({ error: 'Ya existe un producto con ese título' });
  }

  const product = await productManager.addProduct(req.body);
  res.status(201).json(product);
});

router.put('/:pid', async (req, res) => {
  if (req.body.id) {
    return res.status(400).json({ error: 'No se puede modificar el ID del producto' });
  }

  const updated = await productManager.updateProduct(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(updated);
});

router.delete('/:pid', async (req, res) => {
  await productManager.deleteProduct(req.params.pid);
  res.json({ message: 'Producto eliminado' });
});

export default router;