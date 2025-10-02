/**
 * Test utilities for session management
 * Use these in browser console to test session functionality
 */

// Test 1: Check if session exists
export function testHasSession() {
  const session = localStorage.getItem('shefit_session')
  console.log('Session exists:', !!session)
  if (session) {
    console.log('Session data:', JSON.parse(session))
  }
  return !!session
}

// Test 2: Check access token expiration
export function testAccessTokenExpiration() {
  const session = localStorage.getItem('shefit_session')
  if (!session) {
    console.log('No session found')
    return
  }

  const { accessToken } = JSON.parse(session)
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    const expiresAt = payload.exp * 1000
    const now = Date.now()
    const buffer = 5 * 60 * 1000 // 5 minutes buffer
    const isExpired = expiresAt - buffer <= now

    console.log('=== Access Token Info ===')
    console.log('Expires at:', new Date(expiresAt).toISOString())
    console.log('Current time:', new Date(now).toISOString())
    console.log('Is expired (with 5min buffer):', isExpired)
    console.log('Time until expiry:', Math.floor((expiresAt - now) / 1000 / 60), 'minutes')
    console.log('Expected expiry: 1 day from creation')
  } catch (error) {
    console.error('Failed to parse access token:', error)
  }
}

// Test 3: Check refresh token expiration
export function testRefreshTokenExpiration() {
  const session = localStorage.getItem('shefit_session')
  if (!session) {
    console.log('No session found')
    return
  }

  const { refreshToken } = JSON.parse(session)
  try {
    const payload = JSON.parse(atob(refreshToken.split('.')[1]))
    const expiresAt = payload.exp * 1000
    const now = Date.now()
    const isExpired = expiresAt <= now

    console.log('=== Refresh Token Info ===')
    console.log('Expires at:', new Date(expiresAt).toISOString())
    console.log('Current time:', new Date(now).toISOString())
    console.log('Is expired:', isExpired)
    console.log('Time until expiry:', Math.floor((expiresAt - now) / 1000 / 60 / 60), 'hours')
    console.log('Expected expiry: 3 days from creation')
  } catch (error) {
    console.error('Failed to parse refresh token:', error)
  }
}

// Test 4: Check both tokens
export function testBothTokens() {
  const session = localStorage.getItem('shefit_session')
  if (!session) {
    console.log('No session found')
    return
  }

  const { accessToken, refreshToken } = JSON.parse(session)

  try {
    const accessPayload = JSON.parse(atob(accessToken.split('.')[1]))
    const refreshPayload = JSON.parse(atob(refreshToken.split('.')[1]))

    const accessExpiresAt = accessPayload.exp * 1000
    const refreshExpiresAt = refreshPayload.exp * 1000
    const now = Date.now()

    const accessBuffer = 5 * 60 * 1000
    const isAccessExpired = accessExpiresAt - accessBuffer <= now
    const isRefreshExpired = refreshExpiresAt <= now

    console.log('=== Token Status ===')
    console.log('Access Token:')
    console.log('  - Expires:', new Date(accessExpiresAt).toISOString())
    console.log('  - Expired (with buffer):', isAccessExpired)
    console.log('  - Time left:', Math.floor((accessExpiresAt - now) / 1000 / 60), 'minutes')
    console.log('')
    console.log('Refresh Token:')
    console.log('  - Expires:', new Date(refreshExpiresAt).toISOString())
    console.log('  - Expired:', isRefreshExpired)
    console.log('  - Time left:', Math.floor((refreshExpiresAt - now) / 1000 / 60 / 60), 'hours')
    console.log('')
    console.log('Session Status:')
    if (isRefreshExpired) {
      console.log('  ❌ Session expired - need to re-login')
    } else if (isAccessExpired) {
      console.log('  ⚠️  Access token expired - will auto-refresh')
    } else {
      console.log('  ✅ Session valid')
    }
  } catch (error) {
    console.error('Failed to parse tokens:', error)
  }
}

// Test 5: Check cookie
export function testCookie() {
  const cookies = document.cookie.split(';')
  const sessionCookie = cookies.find((c) => c.trim().startsWith('shefit_session='))
  console.log('Session cookie exists:', !!sessionCookie)
  if (sessionCookie) {
    console.log('Cookie value length:', sessionCookie.length)
  }
  return !!sessionCookie
}

// Test 6: Clear session (logout test)
export function testClearSession() {
  localStorage.removeItem('shefit_session')
  document.cookie = 'shefit_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  console.log('Session cleared. Reload page to see effect.')
}

// Test 7: Mock session with expired access token
export function testMockExpiredAccessToken() {
  const now = Math.floor(Date.now() / 1000)
  const expiredTime = now - 3600 // 1 hour ago
  const validTime = now + 3 * 24 * 60 * 60 // 3 days from now

  // Create mock JWT tokens
  const expiredAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ sub: '999', exp: expiredTime, scopes: ['user'] })
  )}.mock_signature`
  const validRefreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ sub: '999', exp: validTime })
  )}.mock_signature`

  const mockSession = {
    userId: 999,
    role: 'normal_user',
    accessToken: expiredAccessToken,
    refreshToken: validRefreshToken,
  }

  localStorage.setItem('shefit_session', JSON.stringify(mockSession))
  document.cookie = `shefit_session=${JSON.stringify(mockSession)}; path=/; max-age=${3 * 24 * 60 * 60}`
  console.log('Mock session with expired access token created.')
  console.log('This should trigger automatic token refresh on next useSession() hook.')
  console.log('Reload page to see the refresh in action.')
}

// Test 8: Mock session with both tokens expired
export function testMockAllTokensExpired() {
  const now = Math.floor(Date.now() / 1000)
  const expiredTime = now - 3600 // 1 hour ago

  const expiredAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ sub: '999', exp: expiredTime, scopes: ['user'] })
  )}.mock_signature`
  const expiredRefreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ sub: '999', exp: expiredTime })
  )}.mock_signature`

  const mockSession = {
    userId: 999,
    role: 'normal_user',
    accessToken: expiredAccessToken,
    refreshToken: expiredRefreshToken,
  }

  localStorage.setItem('shefit_session', JSON.stringify(mockSession))
  document.cookie = `shefit_session=${JSON.stringify(mockSession)}; path=/; max-age=${3 * 24 * 60 * 60}`
  console.log('Mock session with all tokens expired created.')
  console.log('This should trigger automatic session clearing on next useSession() hook.')
  console.log('Reload page to see the session being cleared.')
}

// Run all tests
export function testAll() {
  console.log('=== Session Management Tests ===')
  console.log('\n1. Session exists:')
  testHasSession()
  console.log('\n2. Both tokens status:')
  testBothTokens()
  console.log('\n3. Cookie:')
  testCookie()
  console.log('\n=== Tests Complete ===')
  console.log('\nAvailable test functions:')
  console.log('- testHasSession()')
  console.log('- testAccessTokenExpiration()')
  console.log('- testRefreshTokenExpiration()')
  console.log('- testBothTokens()')
  console.log('- testCookie()')
  console.log('- testClearSession()')
  console.log('- testMockExpiredAccessToken()')
  console.log('- testMockAllTokensExpired()')
}

// Browser console usage:
if (typeof window !== 'undefined') {
  ;(window as any).sessionTests = {
    testHasSession,
    testAccessTokenExpiration,
    testRefreshTokenExpiration,
    testBothTokens,
    testCookie,
    testClearSession,
    testMockExpiredAccessToken,
    testMockAllTokensExpired,
    testAll,
  }
  console.log('✅ Session tests loaded. Use window.sessionTests.testAll() to run all tests.')
}