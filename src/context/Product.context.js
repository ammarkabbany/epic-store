import React, { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";
import { CartContext } from "./Cart.context";

export const ProdcutContext = createContext();

export function ProductProvider(props) {
    const { cartDetails, setCartDetails, total, setTotal, count, setCount } = useContext(CartContext);

    const incrementProduct = (product, event) => {
        event.preventDefault();
        const updatedCartDetails = cartDetails.map(item => {
            if (item.id === product.id) {
                // Increment the quantity of the targeted product
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });

        // Update the cart details with the updated product quantity
        setCartDetails(updatedCartDetails);

        // Update the total price
        setTotal(total + product.price);

        // Update the product count
        setCount(count + 1)

        // Show toast notification
        const id = toast.loading("Incrementing product...");
        toast.success(`${product.name} incremented`, { id });
    }
    const decrementProduct = (product, event) => {
        event.preventDefault();
        const updatedCartDetails = cartDetails.map(item => {
            if (item.id === product.id) {
                // Increment the quantity of the targeted product
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });

        // Update the cart details with the updated product quantity
        setCartDetails(updatedCartDetails);

        // Update the total price
        setTotal(total - product.price);

        // Update the product count
        setCount(count - 1)

        // Show toast notification
        const id = toast.loading("Decrementing product...");
        toast.success(`${product.name} decremented`, { id });
    }

    return (
        <ProdcutContext.Provider value={{ incrementProduct, decrementProduct }}>
            {props.children}
        </ProdcutContext.Provider>
    );
}