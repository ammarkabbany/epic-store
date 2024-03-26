import React, { createContext, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

export function CartProvider(props) {
    const [cartDetails, setCartDetails] = useState([]);
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)

    const clearCart = (event) => {
        event.preventDefault()
        setCartDetails([])
        setCount(0)
        setTotal(0)
    }

    const addToCart = (product, event, quantity) => {
        event.preventDefault();
        // axios.post('/api/cart', {
        //     productId: product.id,
        //     quantity: 1
        // })
        const id = toast.loading("Adding to cart...")
        if (quantity > 1) {
            toast.success(`${quantity} ${product.name} added to cart`, {id})
            setCount(count + quantity)
            setCartDetails([...cartDetails, product])
            setTotal(total + product.price*quantity)
            product.quantity = quantity;
        } else {
            toast.success(`${product.name} added to cart`, {id})
            setCount(count + 1)
            setCartDetails([...cartDetails, product])
            setTotal(total + product.price)
            product.quantity = 1;
        }
    }

    const removeFromCart = (product, event, quantity) => {
        event.preventDefault();
        // axios.post('/api/cart', {
        //     productId: product.id,
        //     quantity: 1
        // })
        const id = toast.loading("Removing from cart...")
        toast.error(`${product.name} removed from cart`, {id})
        const currentQuantity = cartDetails.find(item => item.id === product.id).quantity
        setCount(count - currentQuantity)
        setCartDetails(cartDetails.filter(item => item.id!== product.id))
        setTotal(total - product.price*currentQuantity)
    }

    return (
        <CartContext.Provider value={{ count, setCount, cartDetails, setCartDetails, addToCart, removeFromCart, total, setTotal, clearCart }}>
            {props.children}
        </CartContext.Provider>
    );
}