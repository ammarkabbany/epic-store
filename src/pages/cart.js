import axios from "axios";
import Link from "next/link";
import CartProduct from "src/components/CartProduct";
import { useShoppingCart } from "use-shopping-cart";
import { useState } from "react";

export default function CartPage() {
    const { cartCount, cartDetails, clearCart, redirectToCheckout, formattedTotalPrice } = useShoppingCart();
    const [isRedirecting, setRedirecting] = useState(false)

    async function onCheckout() {
        if (cartCount > 0) {
            try {
                setRedirecting(true)
                const { id } = await axios.post("/api/checkout-sessions", cartDetails)
                .then(res => res.data);
                const result = await redirectToCheckout(id)
                if (result?.error) {
                    console.log("Error in result:", result)
                }
            } catch (error) {
                console.log("Error: ", error)
            } finally {
                setRedirecting(false)
            }
        }
    }

    return (
        <div className="container xl:max-w-screen-xl mx-auto py-12 px-6">
           {cartCount > 0 ? (
            <>
                <h2 className="text-4xl font-semibold">
                    Your shopping cart
                </h2>
                <p className="mt-1 text-xl">
                    {cartCount} items{" "}
                    <button
                    onClick={clearCart}
                    className="opacity-50 hover:opacity-100 text-base capitalize">(Clear all)
                    </button>
                </p>
            </>
           ) : (
            <>
                <h2 className="text-4xl font-semibold">
                    Your shopping cart is empty.
                </h2>
                <p className="mt-1 text-xl">
                    Check out our awesome products{" "}
                    <Link href="/" className="text-red-500 underline">
                        here!
                    </Link>
                </p>
            </>
           )}

           {cartCount > 0 && <div className="mt-12 space-y-4">
            {Object.entries(cartDetails).map(([key, value]) => {
                return(
                    <CartProduct key={key} product={value} />
                )
            })}
                <div className="flex flex-col items-end border-t py-4 mt-8">
                    <p className="text-xl">
                        Total:{" "}
                        <span className="font-semibold">{formattedTotalPrice}{" "}</span>
                    </p>
                    <button
                    disabled={isRedirecting}
                    onClick={onCheckout} 
                    className="border rounded py-2 px-6 bg-yellow-500
                    hover:bg-yellow-600 border-yellow-500 hover:border-yellow-600
                    focus:ring-4 focus:ring-opacity-50 focus:ring-yellow-500 text-white
                    tranisition-colors disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:bg-yellow-500 mt-4 max-w-max
                    ">
                        {isRedirecting ? "Redirecting..." : "Go to Checkout"}
                    </button>
                </div>
            </div>
           }
        </div>
    )
}
