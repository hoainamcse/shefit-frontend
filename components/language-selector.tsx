import React, { useState } from 'react'
import { ChevronDown, Globe, Loader2, Check, X } from 'lucide-react'
import { LanguageCode, useGoogleTranslate } from '@/hooks/use-google-transalte'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'

interface LanguageSelectorProps {
  className?: string
  disabled?: boolean
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '', disabled = false }) => {
  const {
    currentLang,
    isLoading,
    isTranslating,
    error,
    changeLanguage,
    getAvailableLanguages,
    getCurrentLanguageInfo,
  } = useGoogleTranslate({
    defaultLang: 'vi',
    pageLanguage: 'vi',
    includedLanguages: ['en', 'vi', 'ko', 'ja', 'th'],
    autoDetect: true,
    onLanguageChange: (newLang, oldLang) => {
      console.log(`Language changed from ${oldLang} to ${newLang}`)
    },
    onTranslationStart: (targetLang) => {
      console.log(`Starting translation to ${targetLang}`)
    },
    onTranslationComplete: () => {
      console.log('Translation completed')
    },
    onError: (error) => {
      console.error('Translation error:', error)
    },
  })

  const [isOpen, setIsOpen] = useState(false)
  const availableLanguages = getAvailableLanguages()

  const handleLanguageSelect = (langCode: LanguageCode): void => {
    if (!disabled) {
      changeLanguage(langCode)
      setIsOpen(false)
    }
  }

  const getFlagComponent = (langCode: LanguageCode) => {
    const flagComponents = {
      en: <UnitedStatesFlag />,
      vi: <VietnamFlag />,
      ko: <SouthKoreaFlag />,
      ja: <JapanFlag />,
      th: <ThailandFlag />,
    }
    return flagComponents[langCode] || <Globe className="h-6 w-6" />
  }

  return (
    <div className="relative inline-block text-left">
      {/* Translation Status Indicator */}
      {isTranslating && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Translating page...</span>
          </div>
        </div>
      )}

      {/* Error Indicator */}
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
            <X className="h-4 w-4" />
            <span className="text-sm">Translation failed</span>
          </div>
        </div>
      )}

      {/* Language Selector Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" disabled={isTranslating || disabled} className={`gap-2 w-10 h-10 [&_svg]:size-6 ${className}`} size="icon">
            {getFlagComponent(currentLang)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          {availableLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              disabled={language.isActive || isTranslating || disabled}
              className="justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-sm overflow-hidden">{getFlagComponent(language.code)}</div>
                <div>
                  <span className="text-sm font-medium">{language.name}</span>
                </div>
              </div>
              {language.isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function UnitedStatesFlag() {
  return (
    <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_4_7323)">
        <path
          d="M256 511.999C397.385 511.999 512 397.384 512 255.999C512 114.614 397.385 -0.000976562 256 -0.000976562C114.615 -0.000976562 0 114.614 0 255.999C0 397.384 114.615 511.999 256 511.999Z"
          fill="#F0F0F0"
        />
        <path d="M244.87 255.999H512C512 232.893 508.92 210.509 503.181 189.216H244.87V255.999Z" fill="#D80027" />
        <path
          d="M244.87 122.434H474.426C458.755 96.8619 438.718 74.2589 415.356 55.6509H244.87V122.434Z"
          fill="#D80027"
        />
        <path
          d="M256 511.999C316.249 511.999 371.626 491.175 415.356 456.347H96.644C140.374 491.175 195.751 511.999 256 511.999Z"
          fill="#D80027"
        />
        <path
          d="M37.5738 389.564H474.426C487.007 369.035 496.764 346.595 503.181 322.781H8.81885C15.2358 346.595 24.9928 369.035 37.5738 389.564Z"
          fill="#D80027"
        />
        <path
          d="M118.584 39.977H141.913L120.213 55.742L128.502 81.251L106.803 65.486L85.104 81.251L92.264 59.214C73.158 75.129 56.412 93.775 42.612 114.551H50.087L36.274 124.586C34.122 128.176 32.058 131.823 30.08 135.524L36.676 155.825L24.37 146.884C21.311 153.365 18.513 159.992 15.998 166.757L23.265 189.125H50.087L28.387 204.89L36.676 230.399L14.977 214.634L1.979 224.078C0.678 234.536 0 245.188 0 255.999H256C256 114.615 256 97.947 256 -0.000976562C205.428 -0.000976562 158.285 14.669 118.584 39.977ZM128.502 230.399L106.803 214.634L85.104 230.399L93.393 204.89L71.693 189.125H98.515L106.803 163.616L115.091 189.125H141.913L120.213 204.89L128.502 230.399ZM120.213 130.316L128.502 155.825L106.803 140.06L85.104 155.825L93.393 130.316L71.693 114.551H98.515L106.803 89.042L115.091 114.551H141.913L120.213 130.316ZM220.328 230.399L198.629 214.634L176.93 230.399L185.219 204.89L163.519 189.125H190.341L198.629 163.616L206.917 189.125H233.739L212.039 204.89L220.328 230.399ZM212.039 130.316L220.328 155.825L198.629 140.06L176.93 155.825L185.219 130.316L163.519 114.551H190.341L198.629 89.042L206.917 114.551H233.739L212.039 130.316ZM212.039 55.742L220.328 81.251L198.629 65.486L176.93 81.251L185.219 55.742L163.519 39.977H190.341L198.629 14.468L206.917 39.977H233.739L212.039 55.742Z"
          fill="#0052B4"
        />
      </g>
      <defs>
        <clipPath id="clip0_4_7323">
          <rect width="512" height="512" fill="white" transform="translate(0 -0.000976562)" />
        </clipPath>
      </defs>
    </svg>
  )
}

function VietnamFlag() {
  return (
    <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_4_7329)">
        <path
          d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
          fill="#D80027"
        />
        <path
          d="M256 133.565L283.628 218.594H373.033L300.702 271.144L328.33 356.174L256 303.623L183.67 356.174L211.298 271.144L138.968 218.594H228.372L256 133.565Z"
          fill="#FFDA44"
        />
      </g>
      <defs>
        <clipPath id="clip0_4_7329">
          <rect width="512" height="512" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function SouthKoreaFlag() {
  return (
    <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_4_7290)">
        <path
          d="M256 511.999C397.385 511.999 512 397.384 512 255.999C512 114.614 397.385 -0.000976562 256 -0.000976562C114.615 -0.000976562 0 114.614 0 255.999C0 397.384 114.615 511.999 256 511.999Z"
          fill="#F0F0F0"
        />
        <path
          d="M345.043 255.999C345.043 278.26 305.177 333.912 256 333.912C206.823 333.912 166.957 278.26 166.957 255.999C166.957 206.821 206.823 166.956 256 166.956C305.177 166.956 345.043 206.821 345.043 255.999Z"
          fill="#D80027"
        />
        <path
          d="M345.043 255.999C345.043 305.177 305.177 345.042 256 345.042C206.823 345.042 166.957 305.177 166.957 255.999"
          fill="#0052B4"
        />
        <path d="M350.375 334.707L373.982 311.099L389.721 326.838L366.113 350.445L350.375 334.707Z" fill="black" />
        <path d="M311.017 374.054L334.625 350.447L350.363 366.185L326.756 389.793L311.017 374.054Z" fill="black" />
        <path d="M397.593 381.92L421.201 358.312L436.939 374.051L413.332 397.658L397.593 381.92Z" fill="black" />
        <path d="M358.237 421.273L381.844 397.666L397.583 413.404L373.976 437.012L358.237 421.273Z" fill="black" />
        <path d="M373.983 358.315L397.59 334.708L413.329 350.447L389.721 374.054L373.983 358.315Z" fill="black" />
        <path d="M334.636 397.662L358.244 374.055L373.982 389.793L350.375 413.401L334.636 397.662Z" fill="black" />
        <path d="M397.698 177.334L334.744 114.381L350.483 98.6423L413.436 161.596L397.698 177.334Z" fill="black" />
        <path d="M334.732 161.602L311.125 137.995L326.863 122.257L350.47 145.864L334.732 161.602Z" fill="black" />
        <path d="M374.078 200.958L350.471 177.35L366.209 161.613L389.816 185.22L374.078 200.958Z" fill="black" />
        <path d="M381.943 114.379L358.335 90.7714L374.074 75.0328L397.681 98.6403L381.943 114.379Z" fill="black" />
        <path d="M421.31 153.739L397.703 130.132L413.441 114.393L437.049 138.001L421.31 153.739Z" fill="black" />
        <path d="M90.7545 358.271L153.708 421.224L137.969 436.963L75.0159 374.009L90.7545 358.271Z" fill="black" />
        <path d="M153.705 373.997L177.312 397.604L161.574 413.342L137.967 389.735L153.705 373.997Z" fill="black" />
        <path d="M114.355 334.658L137.963 358.266L122.224 374.004L98.6166 350.397L114.355 334.658Z" fill="black" />
        <path d="M137.965 311.044L200.919 373.998L185.18 389.736L122.227 326.783L137.965 311.044Z" fill="black" />
        <path d="M153.701 90.7226L90.7478 153.676L75.0093 137.937L137.963 74.9841L153.701 90.7226Z" fill="black" />
        <path d="M177.309 114.328L114.355 177.281L98.6169 161.542L161.57 98.589L177.309 114.328Z" fill="black" />
        <path d="M200.939 137.949L137.985 200.903L122.247 185.165L185.201 122.212L200.939 137.949Z" fill="black" />
      </g>
      <defs>
        <clipPath id="clip0_4_7290">
          <rect width="512" height="512" fill="white" transform="translate(0 -0.000976562)" />
        </clipPath>
      </defs>
    </svg>
  )
}

function JapanFlag() {
  return (
    <svg width="24" height="24" viewBox="0 0 512 513" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_4_7189)">
        <path
          d="M256 512.989C397.385 512.989 512 398.374 512 256.989C512 115.604 397.385 0.989258 256 0.989258C114.615 0.989258 0 115.604 0 256.989C0 398.374 114.615 512.989 256 512.989Z"
          fill="#F0F0F0"
        />
        <path
          d="M256 368.293C317.472 368.293 367.304 318.461 367.304 256.989C367.304 195.518 317.472 145.685 256 145.685C194.529 145.685 144.696 195.518 144.696 256.989C144.696 318.461 194.529 368.293 256 368.293Z"
          fill="#D80027"
        />
      </g>
      <defs>
        <clipPath id="clip0_4_7189">
          <rect width="512" height="512" fill="white" transform="translate(0 0.989258)" />
        </clipPath>
      </defs>
    </svg>
  )
}

function ThailandFlag() {
  return (
    <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_4_7306)">
        <path
          d="M256 512.001C397.385 512.001 512 397.386 512 256.001C512 114.616 397.385 0.000976562 256 0.000976562C114.615 0.000976562 0 114.616 0 256.001C0 397.386 114.615 512.001 256 512.001Z"
          fill="#F0F0F0"
        />
        <path
          d="M496.077 166.958H15.923C5.632 194.691 0 224.687 0 256.001C0 287.315 5.632 317.311 15.923 345.044H496.078C506.368 317.311 512 287.315 512 256.001C512 224.687 506.368 194.691 496.077 166.958Z"
          fill="#0052B4"
        />
        <path
          d="M256 0.000976562C178.409 0.000976562 108.886 34.525 61.939 89.044H450.06C403.114 34.525 333.591 0.000976562 256 0.000976562Z"
          fill="#D80027"
        />
        <path
          d="M450.061 422.958H61.939C108.886 477.477 178.409 512.001 256 512.001C333.591 512.001 403.114 477.477 450.061 422.958Z"
          fill="#D80027"
        />
      </g>
      <defs>
        <clipPath id="clip0_4_7306">
          <rect width="512" height="512" fill="white" transform="translate(0 0.000976562)" />
        </clipPath>
      </defs>
    </svg>
  )
}
