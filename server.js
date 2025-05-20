import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// 🔧 Configurar handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// 🌐 Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 🛠 Ruta vista home
import ProductManager from './src/managers/ProductManager.js';
const productManager = new ProductManager();
app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

// ✨ Vista realtimeproducts
app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

const server = app.listen(PORT, () =>
  console.log(`Servidor en http://localhost:${PORT}`)
);

// 🔌 Socket.io
const io = new Server(server);

io.on('connection', async (socket) => {
  console.log('Cliente conectado');

  socket.emit('update-products', await productManager.getProducts());

  socket.on('new-product', async (data) => {
    await productManager.addProduct(data);
    const products = await productManager.getProducts();
    io.emit('update-products', products);
  });

  socket.on('delete-product', async (id) => {
    await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    io.emit('update-products', products);
  });
});