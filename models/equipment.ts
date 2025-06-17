type Equipment = {
  id: string // expected: number
  name: string
  image: string
  created_at: string
  updated_at: string
}

type EquipmentPayload = Omit<Equipment, 'id' | 'created_at' | 'updated_at'>

export type { Equipment, EquipmentPayload }
