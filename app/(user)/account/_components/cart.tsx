import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CurrentCart from "./current-cart"
import PurchasedOrder from "./purchased-order"
export default function Cart() {
    return (
        <div className="max-w-screen-3xl mx-auto px-14">
            <Tabs defaultValue="current-cart">
                <TabsList className="w-full bg-background gap-x-20 mb-10">
                    <TabsTrigger value="current-cart" className="w-1/2 !shadow-none text-2xl text-text">Giỏ hàng</TabsTrigger>
                    <TabsTrigger value="purchased-order" className="w-1/2 !shadow-none text-2xl text-text">Đơn hàng đã mua</TabsTrigger>
                </TabsList>
                <TabsContent value="current-cart">
                    <CurrentCart />
                </TabsContent>
                <TabsContent value="purchased-order">
                    <PurchasedOrder />
                </TabsContent>
            </Tabs>
        </div>
    )
}
