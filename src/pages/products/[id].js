import Image from "next/image";
import { CheckIcon } from "@heroicons/react/24/solid";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";
import { stripe } from "src/utils/stripe";
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart";

export default function ProductPage({ product }) {
    const [count, setCount] = useState(1)
    const { addItem, removeItem, cartDetails } = useShoppingCart();

    const onAddToCart = (event) => {
        event.preventDefault();
        const id = toast.loading(`Adding ${count} items${count > 1 ? "s" : ""}`)
        addItem(product, { count });
        toast.success(`${count} ${product.name} added to cart`, {id})
    }

    const onRemoveFromCart = (event) => {
        event.preventDefault();
        const id = toast.loading(`Removing ${count} items${count > 1 ? "s" : ""}`, {id})
        removeItem(product, { count });
        toast.success(`${count} ${product.name} removed from cart`, {id})
    }

    return (
        <div className="container lg:max-w-screen-lg mx-auto py-12 px-6">
            <div className="flex flex-col md:flex-row justify-between items-center
            space-y-8 md:space-y-0 md:space-x-12">
                <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                    <Image
                      priority
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="100%"
                      style={{
                        objectFit: 'contain'
                      }}
                    />
                </div>

                <div className="w-full flex-1 max-w-md border border-opacity-50 rounded-md shadow-lg p-6 bg-white">
                    <h2 className="text-3xl font-semibold">{product.name}</h2>
                    <p className="pt-2 flex items-center space-x-2">
                      <CheckIcon className="text-lime-500 w-5 h-5" />
                      <span className="font-semibold">In Stock</span>
                    </p>

                    <div className="mt-4 border-t pt-4">
                        <p className="text-gray-500">Price:</p>
                        <p className="text-xl font-semibold">
                        {formatCurrencyString({value: product.price, currency: product.currency})}
                        </p>
                    </div>
                    <div className="mt-4 border-t pt-4">
                        <p className="text-gray-500">Quantity:</p>
                        <div className="mt-1 flex items-center space-x-3">
                            <button
                            disabled={count <= 1}
                            onClick={() => setCount(count - 1)}
                            className="p-1 rounded-md hover:bg-rose-100 hover:text-rose-500">
                                <MinusSmallIcon className="w-6 h-6 flex-shrink-0" />
                            </button>
                            <p className="font-semibold text-xl">{count}</p>
                            <button
                            onClick={() => setCount(count +  1)}
                            className="p-1 rounded-md hover:bg-green-100 hover:text-green-500">
                                <PlusSmallIcon className="w-6 h-6 flex-shrink-0" />
                            </button>
                        </div>
                    </div>

                    <button
                    onClick={onAddToCart}
                    className="w-full mt-4 border border-lime-500 py-2 px-6
                     bg-lime-500 hover:bg-lime-600 
                     hover:border-lime-600 focus:ring-4 focus:ring-opacity-50 
                     focus:ring-lime-500 text-white disabled:opacity-50 
                     disabled:cursor-not-allowed rounded-md">
                        Add to Cart
                    </button>
                    {/* {!cartDetails.find(item => item.id === product.id)? 
                    :
                    <button
                    onClick={(event) => removeFromCart(product, event, quantity)}
                    className="w-full mt-4 border border-rose-500 py-2 px-6
                     bg-rose-500 hover:bg-rose-600 
                     hover:border-rose-600 focus:ring-4 focus:ring-opacity-50 
                     focus:ring-rose-500 text-white disabled:opacity-50 
                     disabled:cursor-not-allowed rounded-md">
                        Remove from Cart
                    </button>
                    } */}
                </div>
            </div>
        </div>
    )
}

export async function getStaticPaths() {
    const inventory = await stripe.products.list();
    const paths = inventory.data.map((product) => ({
        params: {
            id: product.id,
        },
    }));

    return {
        paths,
        fallback: "blocking",
    }
}

export async function getStaticProps({ params }) {
    const inventory = await stripe.products.list({
        expand: ["data.default_price"],
      })
    const products = inventory.data.map(product => {
        const price = product.default_price
        return {
          currency: price.currency,
          id: product.id,
          name: product.name,
          price: price.unit_amount,
          image: product.images[0],
        }
      })

    const product = products.find((product) => product.id === params.id)

    return {
        props: {
            product,
        },
        revalidate: 60*60,
    }
}