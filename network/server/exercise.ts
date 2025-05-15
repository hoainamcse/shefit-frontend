'use server'

import { ListResponse } from "@/models/response"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { Exercise } from "@/models/exercies"


export async function getExercises(): Promise<ListResponse<Exercise>> {
    const response = await fetchDataServer(`/v1/exercises/`, {
      cache: 'force-cache',
      next: {
        revalidate: false,
        tags: [`exercises`],
      },
    })
    return await response.json()
  }