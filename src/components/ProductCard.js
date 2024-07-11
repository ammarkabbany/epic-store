import Image from "next/image";
import Link from "next/link";
import Rating from "./Rating";
import toast from "react-hot-toast";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart";

export default function ProductCard({ product, index }) {
    const { addItem, removeItem, cartDetails } = useShoppingCart();

    const onAddToCart = (event) => {
        event.preventDefault();
        addItem(product);
        const id = toast.loading(`Adding ${product.name} to cart`)
        toast.success(`${product.name} added to cart`, {id})
    }

    const onRemoveFromCart = (event) => {
        event.preventDefault();
        removeItem(product.id);
        const id = toast.loading(`Removing ${product.name} from cart`)
        toast.success(`${product.name} removed from cart`, {id})
    }

    return (
        <Link href={`/products/${product.id}`} className="border-2 rounded-md group">
           <div className="relative w-full h-64">
                <Image
                    priority={index === 0}
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="100%"
                    style={{
                        objectFit: 'contain'
                    }}
                />
            </div> 

            <div className="p-6 bg-white">
                <p className="font-semibold text-lg">{product.name}</p>
                <Rating />
                <div className="mt-4 flex items-center justify-between space-x-2">
                    <div>
                        <p className="text-gray-500">
                            Price
                        </p>
                        <p className="text-lg font-semibold">
                        {formatCurrencyString({value: product.price, currency: product.currency})}
                        </p>
                    </div>
                    <button onClick={onAddToCart} className="border rounded-lg py-1 px-4 hover:opacity-75 hover:text-white transition-all">
                        <ShoppingCartIcon className="w-6 h-6 flex-shrink-0 opacity-100 hover:opacity text-lime-500" />
                    </button>
                </div>
            </div>
        </Link>
    )
}
