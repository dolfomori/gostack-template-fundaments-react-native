import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
    }

    loadProducts();
  }, [products]);

  const increment = useCallback(
    async id => {
      const newProducts = products;

      const productToIncrementIndex = products.findIndex(
        item => item.id === id,
      );

      const newProduct = {
        ...products[productToIncrementIndex],
        quantity: products[productToIncrementIndex].quantity + 1,
      };

      newProducts.splice(productToIncrementIndex, 1, newProduct);

      setProducts([...newProducts]);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const newProducts = products;

      const productToIncrementIndex = products.findIndex(
        item => item.id === id,
      );

      if (products[productToIncrementIndex].quantity <= 1) {
        return;
      }

      const newProduct = {
        ...products[productToIncrementIndex],
        quantity: products[productToIncrementIndex].quantity - 1,
      };

      newProducts.splice(productToIncrementIndex, 1, newProduct);

      setProducts([...newProducts]);
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      const productExistInCart = products.filter(
        item => item.id === product.id,
      );

      if (productExistInCart.length > 0) {
        increment(productExistInCart[0].id);
        return;
      }
      const productQuantity = { ...product, quantity: 1 };

      setProducts([...products, productQuantity]);
    },
    [products, increment],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
