import { Input } from '@/components/ui/input'
import { getCart } from '@/network/server/carts'

export default async function FormCartDetail({ params }: { params: { slug: string } }) {
  const { slug } = params
  const cart = await getCart(Number(slug))
  const cartData = cart.data

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl mb-2">
        Thông tin vận chuyển
      </div>
      <Input value={cartData.user_name} className="mb-2" readOnly />
      <Input value={cartData.telephone_number} className="mb-2" readOnly />
      <Input value={cartData.city} className="mb-2" readOnly />
      <Input value={cartData.address} className="mb-2" readOnly />
      {cartData.notes && <Input value={cartData.notes} className="mb-2" readOnly />}
    </div>
  )
}
