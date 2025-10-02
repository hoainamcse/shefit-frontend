'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: string
}

export default function SessionDebugPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [browserInfo, setBrowserInfo] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get browser info
    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua)
    const isChrome = /CriOS/.test(ua)
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua)

    setBrowserInfo(`
      User Agent: ${ua}
      iOS: ${isIOS}
      Chrome on iOS: ${isChrome}
      Safari: ${isSafari}
    `)
  }, [])

  const runTests = async () => {
    setIsLoading(true)
    const results: TestResult[] = []

    // Test 1: Check if localStorage is available
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        results.push({
          name: 'localStorage Available',
          status: 'success',
          message: 'localStorage is available'
        })
      } else {
        results.push({
          name: 'localStorage Available',
          status: 'error',
          message: 'localStorage is NOT available'
        })
      }
    } catch (error) {
      results.push({
        name: 'localStorage Available',
        status: 'error',
        message: 'Error checking localStorage',
        details: error instanceof Error ? error.message : String(error)
      })
    }

    // Test 2: Try to write to localStorage
    try {
      const testKey = 'shefit_test_' + Date.now()
      const testValue = JSON.stringify({ test: 'data', timestamp: Date.now() })

      localStorage.setItem(testKey, testValue)

      // Try to read it back
      const readValue = localStorage.getItem(testKey)

      if (readValue === testValue) {
        results.push({
          name: 'localStorage Write/Read',
          status: 'success',
          message: 'Successfully wrote and read from localStorage'
        })

        // Clean up
        localStorage.removeItem(testKey)
      } else {
        results.push({
          name: 'localStorage Write/Read',
          status: 'error',
          message: 'Data mismatch when reading from localStorage',
          details: `Written: ${testValue}, Read: ${readValue}`
        })
      }
    } catch (error) {
      results.push({
        name: 'localStorage Write/Read',
        status: 'error',
        message: 'Error writing to localStorage',
        details: error instanceof Error ? error.message : String(error)
      })
    }

    // Test 3: Test cookies
    try {
      const testCookie = 'shefit_test_cookie=' + Date.now()
      document.cookie = testCookie + '; path=/; max-age=60; SameSite=Lax'

      const cookies = document.cookie
      if (cookies.includes('shefit_test_cookie')) {
        results.push({
          name: 'Cookie Write',
          status: 'success',
          message: 'Successfully wrote cookie'
        })

        // Clean up
        document.cookie = 'shefit_test_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      } else {
        results.push({
          name: 'Cookie Write',
          status: 'error',
          message: 'Failed to write cookie'
        })
      }
    } catch (error) {
      results.push({
        name: 'Cookie Write',
        status: 'error',
        message: 'Error writing cookie',
        details: error instanceof Error ? error.message : String(error)
      })
    }

    // Test 4: Test sessionStorage.set simulation
    try {
      const SESSION_STORAGE_KEY = 'shefit_session'
      const mockSession = {
        userId: 999,
        role: 'normal_user' as const,
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now()
      }

      // Simulate what our code does
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mockSession))

      // Try to set cookie
      const cookieValue = JSON.stringify(mockSession)
      document.cookie = `${SESSION_STORAGE_KEY}=${cookieValue}; path=/; max-age=${3 * 24 * 60 * 60}; SameSite=Lax`

      // Try to read back
      const readSession = localStorage.getItem(SESSION_STORAGE_KEY)

      if (readSession) {
        const parsedSession = JSON.parse(readSession)
        if (parsedSession.userId === 999) {
          results.push({
            name: 'Session Storage Simulation',
            status: 'success',
            message: 'Successfully simulated sessionStorage.set',
            details: `Session: ${JSON.stringify(parsedSession, null, 2)}`
          })
        } else {
          results.push({
            name: 'Session Storage Simulation',
            status: 'error',
            message: 'Session data corrupted'
          })
        }
      } else {
        results.push({
          name: 'Session Storage Simulation',
          status: 'error',
          message: 'Failed to read session from localStorage'
        })
      }
    } catch (error) {
      results.push({
        name: 'Session Storage Simulation',
        status: 'error',
        message: 'Error simulating sessionStorage.set',
        details: error instanceof Error ? error.message : String(error)
      })
    }

    // Test 5: Test large data (simulating real JWT tokens)
    try {
      const SESSION_STORAGE_KEY = 'shefit_session_large'

      // Create a mock JWT-like token (large string)
      const mockJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify({
        sub: '999',
        exp: Math.floor(Date.now() / 1000) + 86400,
        scopes: ['user'],
        data: 'A'.repeat(1000) // Add some padding
      })) + '.mock_signature_' + 'x'.repeat(100)

      const largeSession = {
        userId: 999,
        role: 'normal_user' as const,
        accessToken: mockJWT,
        refreshToken: mockJWT + '_refresh'
      }

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(largeSession))

      const readLarge = localStorage.getItem(SESSION_STORAGE_KEY)
      if (readLarge && JSON.parse(readLarge).accessToken === mockJWT) {
        results.push({
          name: 'Large Data Storage',
          status: 'success',
          message: 'Successfully stored and retrieved large data (JWT simulation)',
          details: `Data size: ~${JSON.stringify(largeSession).length} bytes`
        })
        localStorage.removeItem(SESSION_STORAGE_KEY)
      } else {
        results.push({
          name: 'Large Data Storage',
          status: 'error',
          message: 'Failed to store/retrieve large data'
        })
      }
    } catch (error) {
      results.push({
        name: 'Large Data Storage',
        status: 'error',
        message: 'Error with large data storage',
        details: error instanceof Error ? error.message : String(error)
      })
    }

    // Test 6: Private browsing detection
    try {
      const isPrivate = await detectPrivateBrowsing()
      results.push({
        name: 'Private Browsing Detection',
        status: isPrivate ? 'warning' : 'success',
        message: isPrivate ? 'Private/Incognito mode detected' : 'Normal browsing mode',
        details: isPrivate ? 'localStorage may have limited functionality in private mode' : undefined
      })
    } catch (error) {
      results.push({
        name: 'Private Browsing Detection',
        status: 'warning',
        message: 'Could not detect private browsing mode'
      })
    }

    setTestResults(results)
    setIsLoading(false)
  }

  const detectPrivateBrowsing = async (): Promise<boolean> => {
    try {
      // Try to use IndexedDB
      const db = await new Promise<boolean>((resolve) => {
        const request = indexedDB.open('test')
        request.onsuccess = () => {
          resolve(false)
          indexedDB.deleteDatabase('test')
        }
        request.onerror = () => resolve(true)
      })
      return db
    } catch {
      return true
    }
  }

  const simulateLogin = () => {
    try {
      const SESSION_STORAGE_KEY = 'shefit_session'
      const mockSession = {
        userId: 999,
        role: 'normal_user' as const,
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify({
          sub: '999',
          exp: Math.floor(Date.now() / 1000) + 86400,
          scopes: ['user']
        })) + '.mock_signature',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify({
          sub: '999',
          exp: Math.floor(Date.now() / 1000) + (3 * 86400)
        })) + '.mock_signature_refresh'
      }

      // Method 1: Direct localStorage
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mockSession))

      // Method 2: Cookie
      document.cookie = `${SESSION_STORAGE_KEY}=${encodeURIComponent(JSON.stringify(mockSession))}; path=/; max-age=${3 * 24 * 60 * 60}; SameSite=Lax`

      alert('Mock login successful! Session stored. Check the test results below.')
      runTests()
    } catch (error) {
      alert('Mock login failed: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const clearSession = () => {
    try {
      localStorage.removeItem('shefit_session')
      document.cookie = 'shefit_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      alert('Session cleared!')
      runTests()
    } catch (error) {
      alert('Failed to clear session: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Session Storage Debug Tool</CardTitle>
          <CardDescription>
            Test localStorage and cookie functionality on iOS devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Browser Info */}
          <div>
            <h3 className="font-semibold mb-2">Browser Information</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
              {browserInfo}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={runTests} disabled={isLoading}>
              {isLoading ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button onClick={simulateLogin} variant="secondary">
              Simulate Login
            </Button>
            <Button onClick={clearSession} variant="outline">
              Clear Session
            </Button>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Test Results</h3>
              {testResults.map((result, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-gray-600">{result.message}</div>
                        {result.details && (
                          <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
                            {result.details}
                          </pre>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Instructions for iOS Testing</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open this page on your iOS device (Chrome or Safari)</li>
              <li>Click "Run All Tests" to check browser capabilities</li>
              <li>Click "Simulate Login" to test actual session storage</li>
              <li>Check if all tests pass (green checkmarks)</li>
              <li>If any tests fail, note the error messages</li>
              <li>Try in both normal and private/incognito mode</li>
            </ol>
          </div>

          {/* Known Issues */}
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Known iOS Issues</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Private/Incognito mode may have limited localStorage</li>
              <li>Some iOS versions may block 3rd-party cookies</li>
              <li>Safari may clear localStorage when storage is full</li>
              <li>Cross-site tracking prevention may affect cookies</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
