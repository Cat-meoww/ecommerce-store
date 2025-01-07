"use client"

import Button from '@/components/ui/button';
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';


function loadScript(src: string) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

async function handlePayment<T>(payload: T) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment`, payload);
    if (response.data?.status ?? false) {
        toast.success("Payment completed.");
    } else {
        toast.error("Payment Failed to verify.");
    }

}

const Summary = () => {




    const searchParams = useSearchParams();
    const items = useCart(state => state.items);
    const removeAll = useCart(state => state.removeAll);
    const totalPrice = items.reduce((total, item) => total + Number(item.price) * item.quantity, 0)

    useEffect(() => {
        if (searchParams.get('success')) {

            removeAll();
        }
        if (searchParams.get("canceled")) {
            toast.error("Something went wrong.")
        }
    }, [searchParams, removeAll])

    const onCheckout = async () => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }



        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, items.map(item => ({ id: item.id, quantity: item.quantity })));

        if (response.data.payment ?? false) {
            const options = {
                key: process.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: response.data.payment.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: "INR",
                name: "Store",
                description: "Test Transaction",
                order_id: response.data.payment.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                callback_url: "/",
                theme: {
                    color: "#3399cc"
                },
                handler: function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
                    // console.log(response);
                    handlePayment(response)

                    removeAll();
                },

            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const paymentObject = new window.Razorpay(options);

            paymentObject.on('payment.failed', function (response: { error: { code: string; description: string; source: string; step: string; reason: string; metadata: { order_id: string; payment_id: string; }; }; }) {
                console.log(response);
                toast.error("Something went wrong.")

            });
            paymentObject.open();
        }





        console.log(response)
    }




    return (
        <div className='px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
            <h2 className='text-lg font-medium text-gray-900'>Order Summary</h2>
            <div className='mt-6 space-y-4'>
                <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                    <div className='text-base font-medium text-gray-400'>
                        Order Total
                    </div>
                    <Currency value={totalPrice} />
                </div>
            </div>
            <Button disabled={items.length === 0} className='w-full mt-6' onClick={onCheckout}>
                Checkout
            </Button>
        </div>
    );
}

export default Summary;