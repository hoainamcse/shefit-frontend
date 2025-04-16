import CreateProductForm from '@/components/forms/create-product-form'

// Mock data for testing update form
const mockProductData = {
  name: 'Áo thể thao nữ SheActive',
  description: 'Áo thể thao nữ chất liệu co giãn 4 chiều, thoáng mát, thấm hút mồ hôi tốt.',
  price: '450000',
  images: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1920',
  ],
  features: [
    {
      name: 'Chất liệu co giãn',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1920',
    },
    {
      name: 'Thấm hút mồ hôi',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1920',
    },
  ],
  sizes: ['s', 'm', 'l', 'xl'],
  colors: ['black', 'white', 'blue', 'pink'],
  outOfStock: [
    { size: 's', color: 'black', isOutOfStock: false },
    { size: 'm', color: 'black', isOutOfStock: true },
    { size: 'm', color: 'white', isOutOfStock: true },
    { size: 'l', color: 'blue', isOutOfStock: true },
    { size: 'l', color: 'pink', isOutOfStock: false },
  ],
}

export default async function EditProductPage({ params }: { params: Promise<{ product_id: string }> }) {
  const { product_id } = await params
  return <CreateProductForm isEdit={true} data={mockProductData} />
}
