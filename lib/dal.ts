'use server'

import { cache } from 'react'

import { getSession } from './session'

export const verifySession = cache(async () => {
  const session = await getSession()
  return session || null
})
