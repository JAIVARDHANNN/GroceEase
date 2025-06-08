import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {dummyProducts} from "../assets/assets";
import  { toast, Toaster } from "react-hot-toast";
import axios from "axios"


axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user , setUser] = useState(null);
    const [isSeller , setIsSeller] = useState(true);    
    const [showUserLogin , setShowUserLogin] = useState(false); 
    const [ products  , setProducts] = useState([]); 

    const [ cartItems  , setCartItems] = useState({}); 
    const [ searchQuery  , setSearchQuery] = useState({}); 

    //Fetch Seller Status
    const fetchSeller = async()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
            }
        } catch (error) {
             setIsSeller(false)
        }
    }

    // Fetch all objects
    const fetchProducts = async () => {
        setProducts(dummyProducts); 
    }
    // Add product to cart
    const addToCart = (itemId) =>{
            let cartData = structuredClone(cartItems);
            if(cartData[itemId]){
                cartData[itemId] += 1;

            }else{
                cartData[itemId] = 1;
            }
            setCartItems(cartData);
            toast.success("Added to cart")
    }

    //Update cart item quantity 
    const updateCartItem = (itemId , quantity) =>{
          let cartData = structuredClone(cartItems);
           cartData[itemId] = quantity;

           setCartItems(cartData)
           toast.success("Cart Updated")
    }

    //Remove Product from cart
    const removeFromCart = (itemId) =>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;
        }
        if(cartData[itemId] === 0){
            delete cartData[itemId];
        }
    toast.success("Removed From Cart");
    setCartItems(cartData);
    }

    //Get Cart Item Count
    const getCartCount = ()=>{
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item];

        }
        return totalCount;
    }

    //Get Cart Total amount
    const getCartAmount = ()=>{

        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((prodcut)=>prodcut._id === items);
            if(cartItems[items] > 0 ){
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalAmount*100)/ 100;
    }



    useEffect(()=>{
        fetchSeller();
        fetchProducts();
    } ,[])

    const value ={navigate , user , setUser , setIsSeller , isSeller ,
        showUserLogin , setShowUserLogin , products  , currency , addToCart , updateCartItem , removeFromCart ,
        cartItems , searchQuery , setSearchQuery , getCartAmount , getCartCount , axios
    }
        return <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}

//1:49:39