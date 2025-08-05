'use client';
import Image from 'next/image';
import { DisplayedCartItem } from '@/types/cart'; 

interface CartItemComponentProps {
    item: DisplayedCartItem;
    onIncrementAction: (item: DisplayedCartItem) => void;
    onDecrementAction: (item: DisplayedCartItem) => void;
    onRemoveAction: (productId: number) => void;
}

export default function CartItemComponent({ item, onIncrementAction, onDecrementAction, onRemoveAction }: CartItemComponentProps) {
    return (
        <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
            <div className="w-20 h-20 relative">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                />
            </div>
            <div className="flex-1">
                <p className="font-bold text-black">{item.name}</p>
                <p className="text-gray-600">Stock: {item.stock}</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onDecrementAction(item)}
                    className="w-8 h-8 rounded-full border text-black border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                >
                    ◀
                </button>
                <span className="px-3 py-1 text-black bg-gray-100 rounded">{item.quantity}</span>
                <button
                    onClick={() => onIncrementAction(item)}
                    className="w-8 h-8 rounded-full border text-black border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    disabled={item.quantity >= item.stock}
                >
                    ▶
                </button>
            </div>
            <div className="text-right flex items-center gap-4">
                <div>
                    <p className="text-black text-sm">S/. {item.price.toFixed(2)}</p>
                    <p className="text-red-500 font-semibold text-lg">
                        S/. {(item.price * item.quantity).toFixed(2)}
                    </p>
                </div>
                <button
                    onClick={() => onRemoveAction(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                    aria-label="Eliminar producto"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}