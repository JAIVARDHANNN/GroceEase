import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(true);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // Fetch Seller Status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success === true);
    } catch (error) {
      setIsSeller(false);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch user and clean cartItems to only valid products
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        // Clean cart items to only include products that exist in products list
        const validCartItems = {};
        if (data.user.cartItems && products.length > 0) {
          Object.entries(data.user.cartItems).forEach(([key, qty]) => {
            if (products.find((p) => p._id === key)) {
              validCartItems[key] = qty;
            }
          });
        }
        setCartItems(validCartItems);
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      setUser(null);
      setCartItems({});
    }
  };

  // Add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity > 0) {
      cartData[itemId] = quantity;
    } else {
      delete cartData[itemId];
    }
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  // Remove product from cart (reduce quantity by 1 or remove)
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] = cartData[itemId] - 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }
      setCartItems(cartData);
      toast.success("Removed From Cart");
    }
  };

  // Get total cart item count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // Get total cart amount (only for valid products)
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product && cartItems[itemId] > 0 && product.offerPrice != null) {
        totalAmount += product.offerPrice * cartItems[itemId];
      }
    }
    // round to 2 decimals
    return Math.floor(totalAmount * 100) / 100;
  };

  // Load data in sequence to avoid timing issues
  useEffect(() => {
    const fetchAll = async () => {
      await fetchProducts();
      await fetchSeller();
      await fetchUser();
    };
    fetchAll();
  }, []);

  // Update cart items in backend whenever cartItems changes and user is logged in
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (user) {
      updateCart();
    }
  }, [cartItems]);

  const value = {
    navigate,
    user,
    setUser,
    setIsSeller,
    isSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
