"use client"
import { create } from "zustand";
import { Product } from "@/types";
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from "react-hot-toast";


interface CartProduct extends Product {
    quantity: number
}
interface CartStore {
    items: CartProduct[];
    addItem: (data: CartProduct) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeAll: () => void;
}

const useCart = create(persist<CartStore>((set, get) => ({
    items: [],
    addItem: (data: CartProduct) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === data.id);

        if (existingItem) {
            return toast("This item is already in your cart.");
        }

        set({ items: [...get().items, data] })
        toast.success("Item added to cart.")
    },
    updateQuantity: (id: string, quantity: number) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === id);

        if (existingItem) {
            if (quantity > 0) {
                set({
                    items: currentItems.map((item) => ({
                        ...item,
                        quantity: item.id === id ? quantity : item.quantity
                    }))
                });
            } else {
                set({ items: currentItems.filter(item => item.id !== id) })
            }
        }
    },
    removeItem: (id: string) => {
        set({ items: get().items.filter(item => item.id !== id) });
    },
    removeAll: () => set({ items: [] }),
}), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage)
}))

export default useCart;