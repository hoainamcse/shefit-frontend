type Equipment = {
  id: string
  name: string
  image: string | null
  created_at: string
  updated_at: string
}

type EquipmentPayload = Pick<Equipment, 'name' | 'image'>

export type { Equipment, EquipmentPayload }
