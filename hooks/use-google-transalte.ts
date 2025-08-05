import { useState, useEffect, useCallback, useRef } from 'react'

// Type definitions
export type LanguageCode = 'en' | 'vi' | 'ko' | 'ja' | 'th'

export interface LanguageInfo {
  code: LanguageCode
  name: string
  isActive?: boolean
  isOriginal?: boolean
}

export interface GoogleTranslateOptions {
  /** Default language code */
  defaultLang?: LanguageCode
  /** Source page language */
  pageLanguage?: LanguageCode
  /** Array of supported language codes */
  includedLanguages?: LanguageCode[]
  /** Whether to auto-detect user's preferred language */
  autoDetect?: boolean
  /** Callback when language changes */
  onLanguageChange?: (newLang: LanguageCode, oldLang: LanguageCode) => void
  /** Callback when translation starts */
  onTranslationStart?: (targetLang: LanguageCode) => void
  /** Callback when translation completes */
  onTranslationComplete?: () => void
  /** Callback for error handling */
  onError?: (error: Error) => void
}

export interface ChangeLanguageOptions {
  /** Whether to force page reload after language change */
  forceReload?: boolean
  /** Whether to use smooth transition */
  smooth?: boolean
}

export interface GoogleTranslateHookReturn {
  // State
  currentLang: LanguageCode
  isLoading: boolean
  isTranslating: boolean
  error: Error | null
  isInitialized: boolean

  // Actions
  changeLanguage: (targetLang: LanguageCode, options?: ChangeLanguageOptions) => boolean
  resetToOriginal: () => void

  // Getters
  getCurrentLanguageInfo: () => LanguageInfo
  getAvailableLanguages: () => LanguageInfo[]

  // Utils
  languageNames: Record<LanguageCode, string>
  includedLanguages: LanguageCode[]
}

// Google Translate API declarations
declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: {
          new (options: GoogleTranslateElementOptions, elementId: string): void
          InlineLayout?: {
            SIMPLE: number
          }
        }
      }
    }
    googleTranslateElementInit?: () => void
  }
}

interface GoogleTranslateElementOptions {
  pageLanguage: string
  includedLanguages: string
  layout?: number
  autoDisplay?: boolean
  multilanguagePage?: boolean
}

/**
 * Enhanced Google Translate Hook with TypeScript support
 */
export const useGoogleTranslate = (options: GoogleTranslateOptions = {}): GoogleTranslateHookReturn => {
  const {
    defaultLang = 'vi' as LanguageCode,
    pageLanguage = 'vi' as LanguageCode,
    includedLanguages = ['en', 'vi', 'ko', 'es', 'de', 'ja', 'zh'] as LanguageCode[],
    autoDetect = false,
    onLanguageChange,
    onTranslationStart,
    onTranslationComplete,
    onError,
  } = options

  const [currentLang, setCurrentLang] = useState<LanguageCode>(defaultLang)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isTranslating, setIsTranslating] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Language names mapping
  const languageNames: Record<LanguageCode, string> = {
    en: 'English',
    vi: 'Tiếng Việt',
    ko: '한국어',
    ja: '日本語',
    th: 'ไทย',
  }

  // Get browser's preferred language
  const getBrowserLanguage = useCallback((): LanguageCode => {
    const browserLang = navigator.language || (navigator as any).userLanguage
    const langCode = browserLang.split('-')[0] as LanguageCode
    return includedLanguages.includes(langCode) ? langCode : defaultLang
  }, [includedLanguages, defaultLang])

  // Parse Google Translate cookie
  const parseGoogleTranslateCookie = useCallback((): LanguageCode | null => {
    try {
      const cookie = document.cookie.split('; ').find((row) => row.startsWith('googtrans='))

      if (cookie) {
        const cookieValue = cookie.split('=')[1]
        const langCode = cookieValue.split('/')[2] as LanguageCode
        return langCode && includedLanguages.includes(langCode) ? langCode : 'vi'
      }
    } catch (err) {
      console.warn('Failed to parse Google Translate cookie:', err)
    }
    return 'vi'
  }, [includedLanguages])

  // Set Google Translate cookie
  const setGoogleTranslateCookie = useCallback(
    (targetLang: LanguageCode): boolean => {
      try {
        const cookieValue = `googtrans=/${pageLanguage}/${targetLang}`
        document.cookie = `${cookieValue}; path=/; max-age=31536000; SameSite=Lax`
        return true
      } catch (err) {
        console.error('Failed to set Google Translate cookie:', err)
        return false
      }
    },
    [pageLanguage]
  )

  // Clear Google Translate cookie
  const clearGoogleTranslateCookie = useCallback((): boolean => {
    try {
      document.cookie = 'googtrans=; path=/; max-age=0'
      return true
    } catch (err) {
      console.error('Failed to clear Google Translate cookie:', err)
      return false
    }
  }, [])

  // Hide Google Translate UI elements
  const hideGoogleTranslateUI = useCallback((): void => {
    const style = document.createElement('style')
    style.id = 'google-translate-styles'
    style.textContent = `
      .goog-te-banner-frame,
      .goog-te-menu-frame,
      .goog-te-combo,
      .goog-te-gadget,
      .goog-te-balloon-frame,
      .goog-tooltip {
        display: none !important;
        visibility: hidden !important;
      }
      body {
        top: 0 !important;
        position: static !important;
      }
      .skiptranslate {
        display: none !important;
      }
      #google_translate_element {
        display: none !important;
      }
    `

    // Remove existing styles first
    const existingStyle = document.getElementById('google-translate-styles')
    if (existingStyle) {
      existingStyle.remove()
    }

    document.head.appendChild(style)
  }, [])

  // Load Google Translate script
  const loadGoogleTranslateScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google?.translate?.TranslateElement) {
        resolve()
        return
      }

      // Remove existing script if any
      const existingScript = document.querySelector('script[src*="translate.google.com"]')
      if (existingScript) {
        existingScript.remove()
      }

      const script = document.createElement('script')
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true

      script.onload = () => {
        setIsLoading(false)
        resolve()
      }

      script.onerror = () => {
        setIsLoading(false)
        const error = new Error('Failed to load Google Translate script')
        setError(error)
        onError?.(error)
        reject(error)
      }

      document.head.appendChild(script)
    })
  }, [onError])

  // Initialize Google Translate
  const initializeGoogleTranslate = useCallback((): void => {
    if (typeof window === 'undefined') return

    setIsLoading(true)
    setError(null)

    // Create translate element container if it doesn't exist
    let translateElement = document.getElementById('google_translate_element')
    if (!translateElement) {
      translateElement = document.createElement('div')
      translateElement.id = 'google_translate_element'
      translateElement.style.display = 'none'
      document.body.appendChild(translateElement)
    }

    // Global callback for Google Translate initialization
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: pageLanguage,
              includedLanguages: includedLanguages.join(','),
              layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true,
            },
            'google_translate_element'
          )

          setIsInitialized(true)
          hideGoogleTranslateUI()

          // Set up translation complete listener
          const checkTranslationComplete = (): void => {
            const translatedElements = document.querySelectorAll('.goog-te-combo')
            if (translatedElements.length > 0) {
              setIsTranslating(false)
              onTranslationComplete?.()
            }
          }

          // Clear existing timeout
          if (translationTimeoutRef.current) {
            clearTimeout(translationTimeoutRef.current)
          }

          translationTimeoutRef.current = setTimeout(checkTranslationComplete, 1000)
        }
      } catch (err) {
        console.error('Google Translate initialization failed:', err)
        const error = err instanceof Error ? err : new Error('Google Translate initialization failed')
        setError(error)
        onError?.(error)
      }
    }

    loadGoogleTranslateScript().catch(console.error)
  }, [
    pageLanguage,
    includedLanguages,
    hideGoogleTranslateUI,
    onTranslationComplete,
    onError,
    loadGoogleTranslateScript,
  ])

  // Change language
  const changeLanguage = useCallback(
    (targetLang: LanguageCode, options: ChangeLanguageOptions = {}): boolean => {
      const { forceReload = true, smooth = true } = options

      if (!includedLanguages.includes(targetLang)) {
        const error = new Error(`Language '${targetLang}' is not supported`)
        setError(error)
        onError?.(error)
        return false
      }

      if (currentLang === targetLang) {
        return true // Already in target language
      }

      try {
        setIsTranslating(true)
        setError(null)
        onTranslationStart?.(targetLang)

        // If target language is the same as page language, reset to original
        if (targetLang === pageLanguage) {
          // Clear translation cookie to show original content
          clearGoogleTranslateCookie()

          // Update state
          setCurrentLang(targetLang)
          setIsTranslating(false)
          onLanguageChange?.(targetLang, currentLang)

          if (forceReload) {
            // Clear any stored translation state
            sessionStorage.removeItem('isTranslating')
            sessionStorage.removeItem('targetLanguage')

            if (smooth) {
              setTimeout(() => {
                window.location.reload()
              }, 100)
            } else {
              window.location.reload()
            }
          }

          return true
        }

        // For non-page languages, use Google Translate service
        if (!setGoogleTranslateCookie(targetLang)) {
          throw new Error('Failed to set translation cookie')
        }

        // Update state
        setCurrentLang(targetLang)
        onLanguageChange?.(targetLang, currentLang)

        if (forceReload) {
          // Store translation state
          sessionStorage.setItem('isTranslating', 'true')
          sessionStorage.setItem('targetLanguage', targetLang)

          if (smooth) {
            // Smooth transition
            setTimeout(() => {
              window.location.reload()
            }, 100)
          } else {
            window.location.reload()
          }
        }

        return true
      } catch (err) {
        console.error('Language change failed:', err)
        setIsTranslating(false)
        const error = err instanceof Error ? err : new Error('Language change failed')
        setError(error)
        onError?.(error)
        return false
      }
    },
    [
      currentLang,
      includedLanguages,
      pageLanguage,
      setGoogleTranslateCookie,
      clearGoogleTranslateCookie,
      onTranslationStart,
      onLanguageChange,
      onError,
    ]
  )

  // Reset to original language
  const resetToOriginal = useCallback((): void => {
    clearGoogleTranslateCookie()
    changeLanguage(pageLanguage)
  }, [clearGoogleTranslateCookie, changeLanguage, pageLanguage])

  // Get current language info
  const getCurrentLanguageInfo = useCallback((): LanguageInfo => {
    return {
      code: currentLang,
      name: languageNames[currentLang] || currentLang,
      isOriginal: currentLang === pageLanguage,
    }
  }, [currentLang, pageLanguage, languageNames])

  // Get available languages
  const getAvailableLanguages = useCallback((): LanguageInfo[] => {
    return includedLanguages.map((code) => ({
      code,
      name: languageNames[code] || code,
      isActive: code === currentLang,
    }))
  }, [includedLanguages, currentLang, languageNames])

  // Initialize on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check for stored translation state
    const isTranslating = sessionStorage.getItem('isTranslating') === 'true'
    const storedTargetLang = sessionStorage.getItem('targetLanguage') as LanguageCode | null

    if (isTranslating) {
      setIsTranslating(true)
      if (storedTargetLang && includedLanguages.includes(storedTargetLang)) {
        setCurrentLang(storedTargetLang)
      }
    }

    // Detect current language from cookie or browser
    let detectedLang: LanguageCode | null = parseGoogleTranslateCookie()

    if (!detectedLang && autoDetect) {
      detectedLang = getBrowserLanguage()
    }

    if (!detectedLang) {
      detectedLang = defaultLang
    }

    setCurrentLang(detectedLang)

    // Clear timeout if component unmounts during initialization
    initTimeoutRef.current = setTimeout(() => {
      initializeGoogleTranslate()
    }, 100)

    // Clean up translation state
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current)
      }
      sessionStorage.removeItem('isTranslating')
      sessionStorage.removeItem('targetLanguage')
    }
  }, [
    parseGoogleTranslateCookie,
    autoDetect,
    getBrowserLanguage,
    defaultLang,
    includedLanguages,
    initializeGoogleTranslate,
  ])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clean up Google Translate elements
      const translateElement = document.getElementById('google_translate_element')
      if (translateElement) {
        translateElement.remove()
      }

      const styleElement = document.getElementById('google-translate-styles')
      if (styleElement) {
        styleElement.remove()
      }

      // Clean up global callback
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit
      }
    }
  }, [])

  return {
    // State
    currentLang,
    isLoading,
    isTranslating,
    error,
    isInitialized,

    // Actions
    changeLanguage,
    resetToOriginal,

    // Getters
    getCurrentLanguageInfo,
    getAvailableLanguages,

    // Utils
    languageNames,
    includedLanguages,
  }
}
