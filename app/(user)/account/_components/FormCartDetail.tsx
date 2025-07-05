import { Input } from '@/components/ui/input'
import { getCart } from '@/network/server/carts'

export default async function FormCartDetail({ params }: { params: { slug: string } }) {
  const { slug } = params
  const cart = await getCart(Number(slug))
  const cartData = cart.data

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="font-[family-name:var(--font-coiny)] font-bold text-3xl mb-2">Thông tin vận chuyển</div>
      <Input value={cartData.user_name} disabled className="mb-2" />
      <Input value={cartData.telephone_number} disabled className="mb-2" />
      <Input value={cartData.city} disabled className="mb-2" />
      <Input value={cartData.address} disabled className="mb-2" />
      <Input value={cartData.notes} disabled className="mb-2" />
    </div>
  )
}
