// hooks/useAuthRedirect.ts
'use client'

import { useCallback } from 'react'

export const useAuthRedirect = () => {
  // Lưu URL hiện tại
  const saveCurrentUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.pathname + window.location.search
      sessionStorage.setItem('redirectAfterLogin', currentUrl)
    }
  }, [])

  // Redirect đến login với current URL
  const redirectToLogin = useCallback(() => {
    if (typeof window !== 'undefined') {
      saveCurrentUrl()
      const currentUrl = window.location.pathname + window.location.search
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentUrl)}`
      window.location.href = loginUrl
    }
  }, [saveCurrentUrl])

  // Redirect đến account page với current URL
  const redirectToAccount = useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      saveCurrentUrl()
      const currentUrl = window.location.pathname + window.location.search
      let accountUrl = `/account`

      const params = new URLSearchParams()
      params.set('redirect', currentUrl)

      accountUrl += `/${path}`
      window.location.href = accountUrl
    }
  }, [saveCurrentUrl])

  // Generic redirect với save current URL
  const redirectWithSave = useCallback((targetUrl: string) => {
    if (typeof window !== 'undefined') {
      saveCurrentUrl()
      window.location.href = targetUrl
    }
  }, [saveCurrentUrl])

  return {
    saveCurrentUrl,
    redirectToLogin,
    redirectToAccount,
    redirectWithSave
  }
}

// Sử dụng trong component:
// const { redirectToLogin, redirectToAccount } = useAuthRedirect()
//
// onClick={() => redirectToLogin()}
// onClick={() => redirectToAccount('buy-package')}