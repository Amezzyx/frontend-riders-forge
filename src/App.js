import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Newsletter from './pages/Newsletter';
import Refund from './pages/Refund';
import Payment from './pages/Payment';
import Returns from './pages/Returns';
import Shipping from './pages/Shipping';
import SearchPage from './pages/SearchPage';
import Menu from './pages/Menu';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetail from './pages/OrderDetail';
import api from './services/api';
import './App.css';

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: 'Windbreaker Charcoal Grey',
    price: 99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: null,
    category: 'Men',
    quantity: 15, // 3 per size * 5 sizes
    sizeQuantities: { 'S': 3, 'M': 3, 'L': 3, 'XL': 3, 'XXL': 3 }
  },
  {
    id: 2,
    name: 'Skull Hoodie Men Black',
    price: 70,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    image: null,
    category: 'Men',
    isNew: true,
    quantity: 18, // 3 per size * 6 sizes
    sizeQuantities: { 'S': 3, 'M': 3, 'L': 3, 'XL': 3, 'XXL': 3, '3XL': 3 }
  },
  {
    id: 3,
    name: '6er Pack Boxershorts',
    price: 34.99,
    regularPrice: 60,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: null,
    category: 'Men',
    quantity: 15, // 3 per size * 5 sizes
    sizeQuantities: { 'S': 3, 'M': 3, 'L': 3, 'XL': 3, 'XXL': 3 }
  },
  {
    id: 4,
    name: 'Socks (12 pairs) Deep Black',
    price: 34.99,
    regularPrice: 75,
    sizes: ['39-42', '43-46'],
    image: null,
    category: 'Accessories',
    quantity: 6, // 3 per size * 2 sizes
    sizeQuantities: { '39-42': 3, '43-46': 3 }
  },
  {
    id: 5,
    name: 'Skull Tee Men Black',
    price: 35,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    image: null,
    category: 'Men',
    quantity: 18, // 3 per size * 6 sizes
    sizeQuantities: { 'S': 3, 'M': 3, 'L': 3, 'XL': 3, 'XXL': 3, '3XL': 3 }
  },
  {
    id: 6,
    name: 'MX Gloves',
    price: 45,
    sizes: ['S', 'M', 'L', 'XL'],
    image: null,
    category: 'MX Gear',
    quantity: 12, // 3 per size * 4 sizes
    sizeQuantities: { 'S': 3, 'M': 3, 'L': 3, 'XL': 3 }
  },
  {
    id: 7,
    name: '3er Pack Sports Bra',
    price: 24.99,
    regularPrice: 105,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: null,
    category: 'Women',
    quantity: 15, // 3 per size * 5 sizes
    sizeQuantities: { 'XS': 3, 'S': 3, 'M': 3, 'L': 3, 'XL': 3 }
  },
  {
    id: 8,
    name: '3er Pack Leggings',
    price: 39.99,
    regularPrice: 135,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: null,
    category: 'Women',
    quantity: 15, // 3 per size * 5 sizes
    sizeQuantities: { 'XS': 3, 'S': 3, 'M': 3, 'L': 3, 'XL': 3 }
  },
  {
    id: 9,
    name: 'Black Bundle Women',
    price: 89.99,
    regularPrice: 210,
    sizes: ['XS/XS', 'S/S', 'M/M', 'L/L', 'XL/XL'],
    image: null,
    category: 'Women',
    quantity: 15, // 3 per size * 5 sizes
    sizeQuantities: { 'XS/XS': 3, 'S/S': 3, 'M/M': 3, 'L/L': 3, 'XL/XL': 3 }
  },
  {
    id: 10,
    name: 'Box Sweatpants Women Black',
    price: 19.99,
    regularPrice: 60,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: null,
    category: 'Women',
    quantity: 15, // 3 per size * 5 sizes
    sizeQuantities: { 'XS': 3, 'S': 3, 'M': 3, 'L': 3, 'XL': 3 }
  },
  {
    id: 11,
    name: 'MX Goggles',
    price: 65,
    sizes: ['One Size'],
    image: null,
    category: 'MX Gear',
    quantity: 3, // 3 per size * 1 size
    sizeQuantities: { 'One Size': 3 }
  },
  {
    id: 12,
    name: 'MX Helmet',
    price: 149,
    sizes: ['S', 'M', 'L', 'XL'],
    image: null,
    category: 'MX Gear',
    quantity: 4, // 1 per size * 4 sizes
    sizeQuantities: { 'S': 1, 'M': 1, 'L': 1, 'XL': 1 },
    isNew: true
  }
];

function App() {
  const [cart, setCart] = useState([]);
  const [, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);

  // Load products from backend on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await api.getProducts();
        setProducts(productsData);
      } catch (error) {
        console.warn('Failed to load products from backend, using sample products:', error);
        setProducts(sampleProducts);
      }
    };
    loadProducts();
  }, []);

  const getStockForProductSize = (productId, size) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    if (product.sizeQuantities && typeof product.sizeQuantities === 'object' && size != null) {
      return Number(product.sizeQuantities[size]) || 0;
    }
    return Number(product.quantity) || 0;
  };

  const getCartQuantityForProductSize = (productId, size) => {
    return cart.reduce(
      (sum, item) => (item.id === productId && item.size === size ? sum + (item.quantity || 0) : sum),
      0
    );
  };

  const handleAddToCart = (product, size) => {
    const stock = getStockForProductSize(product.id, size);
    const inCart = getCartQuantityForProductSize(product.id, size);
    const available = stock - inCart;
    if (available <= 0) {
      alert('No more in stock for this size.');
      return;
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        const newQty = Math.min(newCart[existingItemIndex].quantity + 1, stock);
        newCart[existingItemIndex].quantity = newQty;
        return newCart;
      }
      return [...prevCart, { ...product, size, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const handleRemoveItem = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    const item = cart[index];
    if (!item) return;
    const maxStock = getStockForProductSize(item.id, item.size);
    const capped = Math.min(newQuantity, maxStock);

    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index].quantity = capped;
      return newCart;
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrderPlaced = async () => {
    // Refresh products after order to show updated quantities
    try {
      const productsData = await api.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.warn('Failed to refresh products:', error);
    }
    // Clear cart after successful order
    setCart([]);
  };

  return (
    <Router>
      <div className="App">
        <Header 
          cartCount={cartCount}
          onCartClick={() => setIsCartOpen(true)}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={<Home products={products} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/category/:category/:subcategory" 
            element={<CategoryPage products={products} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/category/:category" 
            element={<CategoryPage products={products} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/product/:id" 
            element={
              <ProductDetail
                products={products}
                cart={cart}
                onAddToCart={handleAddToCart}
              />
            } 
          />
          <Route 
            path="/cart" 
            element={
              <Cart 
                cart={cart}
                products={products}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            } 
          />
          <Route 
            path="/checkout" 
            element={<Checkout cart={cart} onOrderPlaced={handleOrderPlaced} />} 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/search" element={<SearchPage products={products} onAddToCart={handleAddToCart} />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>

        <Footer />

        <ShoppingCart
          cart={cart}
          products={products}
          onClose={() => setIsCartOpen(false)}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </div>
    </Router>
  );
}

export default App;
