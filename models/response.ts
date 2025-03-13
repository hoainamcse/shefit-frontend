type ApiResponse<T> = {
  status: string
  data: T
}

type ListResponse<T> = {
  status: string
  data: T[]
  paging: {
    page: number
    per_page: number
    total: number
  }
}

export type { ApiResponse, ListResponse }
