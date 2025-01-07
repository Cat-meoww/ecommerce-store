"use client"
import Currency from '@/components/ui/currency';
import IconButton from '@/components/ui/icon-button';
import useCart from '@/hooks/use-cart';
import { MinusIcon, PlusIcon, X } from 'lucide-react';
import Image from 'next/image';
// import { toast } from 'react-hot-toast';
import { Product } from '@/types';

interface CartItemProps {
    data: Product & { quantity: number };
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {

    const cart = useCart();
    console.log(data)
    const onRemove = () => {
        cart.removeItem(data.id);
    }

    const onIncrease = () => {
        cart.updateQuantity(data.id, data.quantity + 1);
    }

    const onDecrease = () => {
        if (data.quantity > 1) {
            cart.updateQuantity(data.id, data.quantity - 1);
        }
    }

    return (
        <li className='flex py-6 border-b'>
            <div className='relative w-24 h-24 overflow-hidden rounded-md sm:h-48 sm:w-48'>
                <Image
                    fill
                    src={data.images[0].url}
                    alt=""
                    className='object-cover object-center'
                />
            </div>
            <div className='relative flex flex-col justify-between flex-1 ml-4 sm:ml-6'>
                <div className='absolute top-0 right-0 z-10'>
                    <IconButton onClick={onRemove} icon={<X size={15} />} />
                </div>
                <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                    <div className='flex justify-between'>
                        <p className='text-lg font-semibold text-black'>
                            {data.name}
                        </p>
                    </div>
                    <div className='flex mt-1 text-sm'>
                        <p className='text-gray-500'>{data.color.name}</p>
                        <p className='pl-4 ml-4 text-gray-500 border-l border-gray-200'>{data.size.name}</p>
                    </div>
                    <Currency value={data.price} />
                    <div className='flex items-center mt-2'>
                        
                        <button onClick={onDecrease} className='flex px-2 py-1 text-white border-transparent bg-black disabled:cursor-not-allowed disabled:opacity-50 font-semibold hover:opacity-75 transition  rounded-full w-8 h-8'> <MinusIcon/> </button>
                        <span className='px-4'>{data.quantity}</span>
                        <button onClick={onIncrease} className='flex px-2 py-1 text-white border-transparent bg-black disabled:cursor-not-allowed disabled:opacity-50 font-semibold hover:opacity-75 transition  rounded-full w-8 h-8'> <PlusIcon/> </button>
                    </div>
                </div>
            </div>
        </li>
    )
}

export default CartItem;