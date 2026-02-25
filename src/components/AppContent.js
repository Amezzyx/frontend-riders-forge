import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import ShoppingCart from './ShoppingCart';
import Chatbot from './Chatbot';
import ChatbotButton from './ChatbotButton';
import Home from '../pages/Home';
import CategoryPage from '../pages/CategoryPage';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Account from '../pages/Account';
import AdminDashboard from '../pages/AdminDashboard';
import FAQ from '../pages/FAQ';
import Contact from '../pages/Contact';
import About from '../pages/About';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import OrderSuccess from '../pages/OrderSuccess';
import api from '../services/api';

// Helper function to generate product-specific image URLs using Picsum Photos
const getPlaceholderImage = (productName, category) => {
  // Map products to specific image IDs for consistent images
  const imageMap = {
    'Windbreaker Charcoal Grey': 'https://picsum.photos/600/600?random=1',
    'Skull Hoodie Men Black': 'https://picsum.photos/600/600?random=2',
    '6er Pack Boxershorts': 'https://picsum.photos/600/600?random=3',
    'Socks (12 pairs) Deep Black': 'https://picsum.photos/600/600?random=4',
    'Skull Tee Men Black': 'https://picsum.photos/600/600?random=5',
    'MX Gloves': 'https://picsum.photos/600/600?random=6',
    '3er Pack Sports Bra': 'https://picsum.photos/600/600?random=7',
    '3er Pack Leggings': 'https://picsum.photos/600/600?random=8',
    'Black Bundle Women': 'https://picsum.photos/600/600?random=9',
    'Box Sweatpants Women Black': 'https://picsum.photos/600/600?random=10',
    'MX Goggles': 'https://picsum.photos/600/600?random=11',
    'MX Helmet': 'https://picsum.photos/600/600?random=12'
  };
  
  return imageMap[productName] || `https://picsum.photos/600/600?random=${Math.floor(Math.random() * 1000)}`;
};

// Sample product data as fallback
const sampleProducts = [
  {
    id: 1,
    name: 'Windbreaker Charcoal Grey',
    price: 99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: getPlaceholderImage('Windbreaker Charcoal Grey', 'Men'),
    category: 'Men'
  },
  {
    id: 2,
    name: 'Skull Hoodie Men Black',
    price: 70,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: getPlaceholderImage('Skull Hoodie Men Black', 'Men'),
    category: 'Men',
    isNew: true
  },
  {
    id: 3,
    name: '6er Pack Boxershorts',
    price: 34.99,
    regularPrice: 60,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: getPlaceholderImage('6er Pack Boxershorts', 'Men'),
    category: 'Men'
  },
  {
    id: 4,
    name: 'Socks (12 pairs) Deep Black',
    price: 34.99,
    regularPrice: 75,
    sizes: ['39-42', '43-46'],
    image: getPlaceholderImage('Socks Deep Black', 'Accessories'),
    category: 'Accessories'
  },
  {
    id: 5,
    name: 'Skull Tee Men Black',
    price: 35,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: getPlaceholderImage('Skull Tee Men Black', 'Men'),
    category: 'Men'
  },
  {
    id: 6,
    name: 'MX Gloves',
    price: 45,
    sizes: ['S', 'M', 'L', 'XL'],
    image: getPlaceholderImage('MX Gloves', 'MX Gear'),
    category: 'MX Gear'
  },
  {
    id: 7,
    name: '3er Pack Sports Bra',
    price: 24.99,
    regularPrice: 105,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: getPlaceholderImage('3er Pack Sports Bra', 'Women'),
    category: 'Women'
  },
  {
    id: 8,
    name: '3er Pack Leggings',
    price: 39.99,
    regularPrice: 135,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: getPlaceholderImage('3er Pack Leggings', 'Women'),
    category: 'Women'
  },
  {
    id: 9,
    name: 'Black Bundle Women',
    price: 89.99,
    regularPrice: 210,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image: getPlaceholderImage('Black Bundle Women', 'Women'),
    category: 'Women'
  },
  {
    id: 10,
    name: 'Box Sweatpants Women Black',
    price: 19.99,
    regularPrice: 60,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: getPlaceholderImage('Box Sweatpants Women Black', 'Women'),
    category: 'Women'
  },
  {
    id: 11,
    name: 'MX Goggles',
    price: 65,
    sizes: ['One Size'],
    image: getPlaceholderImage('MX Goggles', 'MX Gear'),
    category: 'MX Gear'
  },
  {
    id: 12,
    name: 'MX Helmet',
    price: 149,
    sizes: ['S', 'M', 'L', 'XL'],
    image: getPlaceholderImage('MX Helmet', 'MX Gear'),
    category: 'MX Gear',
    isNew: true
  }
];

const AppContent = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(true);

  // Load user's saved cart from localStorage
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to load saved cart:', error);
        }
      }
    } else {
      // Load guest cart
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        try {
          setCart(JSON.parse(guestCart));
        } catch (error) {
          console.error('Failed to load guest cart:', error);
        }
      }
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    } else {
      localStorage.setItem('guest_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        // Backend not available - use sample products
        console.warn('Backend not available, using sample products:', error.message);
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product, size) => {
    const cartItem = {
      ...product,
      size: size,
      quantity: 1
    };

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, cartItem];
      }
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

    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index].quantity = newQuantity;
      return newCart;
    });
  };

  const handleOrderComplete = () => {
    setCart([]); // Clear cart after order
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    } else {
      localStorage.removeItem('guest_cart');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
            path="/category/:category" 
            element={<CategoryPage products={products} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/category/:category/:subcategory" 
            element={<CategoryPage products={products} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/product/:id" 
            element={<ProductDetail products={products} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/cart" 
            element={
              <Cart 
                cart={cart}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            } 
          />
          <Route 
            path="/checkout" 
            element={<Checkout cart={cart} onOrderComplete={handleOrderComplete} />} 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>

        <Footer />

        <ShoppingCart
          cart={cart}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
        />

        <ChatbotButton onClick={() => setIsChatbotOpen(true)} />
        <Chatbot
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
      </div>
    </Router>
  );
};

export default AppContent;

