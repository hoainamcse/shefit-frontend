'use client'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { parseCookies, setCookie } from 'nookies'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// The following cookie name is important because it's Google-predefined for the translation engine purpose
const COOKIE_NAME = 'googtrans'

// We should know a predefined nickname of a language and provide its title (the name for displaying)
interface LanguageDescriptor {
  name: string
  title: string
}

// Types for JS-based declarations in public/assets/scripts/lang-config.js
declare global {
  namespace globalThis {
    var __GOOGLE_TRANSLATION_CONFIG__: {
      languages: LanguageDescriptor[]
      defaultLanguage: string
    }
  }
}

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>()
  const [languageConfig, setLanguageConfig] = useState<any>()

  // Initialize translation engine
  useEffect(() => {
    // 1. Read the cookie
    const cookies = parseCookies()
    const existingLanguageCookieValue = cookies[COOKIE_NAME]

    let languageValue
    if (existingLanguageCookieValue) {
      // 2. If the cookie is defined, extract a language nickname from there.
      const sp = existingLanguageCookieValue.split('/')
      if (sp.length > 2) {
        languageValue = sp[2]
      }
    }
    // 3. If __GOOGLE_TRANSLATION_CONFIG__ is defined and we still not decided about languageValue - use default one
    if (global.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
      languageValue = global.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage
    }
    if (languageValue) {
      // 4. Set the current language if we have a related decision.
      setCurrentLanguage(languageValue)
    }
    // 5. Set the language config.
    if (global.__GOOGLE_TRANSLATION_CONFIG__) {
      setLanguageConfig(global.__GOOGLE_TRANSLATION_CONFIG__)
    }
  }, [])

  // Don't display anything if current language information is unavailable.
  if (!currentLanguage || !languageConfig) {
    return null
  }

  // The following function switches the current language
  const switchLanguage = (lang: string) => () => {
    // We just need to set the related cookie and reload the page
    // "/auto/" prefix is Google's definition as far as a cookie name
    setCookie(null, COOKIE_NAME, '/auto/' + lang)
    window.location.reload()
  }

  const currentName = languageConfig.languages.find((ld: LanguageDescriptor) =>
    currentLanguage === ld.name || (currentLanguage === 'auto' && languageConfig.defaultLanguage === ld.name)
  )?.name

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="notranslate [&_svg]:size-7" size="icon">
          {currentName === 'vi' && <VietnamFlag />}
          {currentName === 'en' && <UnitedStatesFlag />}
          {currentName === 'ko' && <SouthKoreaFlag />}
          {currentName === 'ja' && <JapanFlag />}
          {currentName === 'zh-CN' && <ChinaFlag />}
          <span className="sr-only">Language switcher</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="notranslate">
        {languageConfig.languages.map((ld: LanguageDescriptor) => (
          <DropdownMenuItem
            key={`l_s_${ld.name}`}
            onClick={switchLanguage(ld.name)}
            className={
              currentLanguage === ld.name || (currentLanguage === 'auto' && languageConfig.defaultLanguage === ld.name)
                ? 'bg-accent'
                : ''
            }
          >
            {ld.name === 'vi' && <VietnamFlag />}
            {ld.name === 'en' && <UnitedStatesFlag />}
            {ld.name === 'ko' && <SouthKoreaFlag />}
            {ld.name === 'ja' && <JapanFlag />}
            {ld.name === 'zh-CN' && <ChinaFlag />}
            {ld.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { LanguageSwitcher, COOKIE_NAME }

function VietnamFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#c93728"></rect>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
      <path
        fill="#ff5"
        d="M18.008 16.366L21.257 14.006 17.241 14.006 16 10.186 14.759 14.006 10.743 14.006 13.992 16.366 12.751 20.186 16 17.825 19.249 20.186 18.008 16.366z"
      ></path>
    </svg>
  )
}

function UnitedStatesFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#fff"></rect>
      <path
        d="M1.638,5.846H30.362c-.711-1.108-1.947-1.846-3.362-1.846H5c-1.414,0-2.65,.738-3.362,1.846Z"
        fill="#a62842"
      ></path>
      <path
        d="M2.03,7.692c-.008,.103-.03,.202-.03,.308v1.539H31v-1.539c0-.105-.022-.204-.03-.308H2.03Z"
        fill="#a62842"
      ></path>
      <path fill="#a62842" d="M2 11.385H31V13.231H2z"></path>
      <path fill="#a62842" d="M2 15.077H31V16.923000000000002H2z"></path>
      <path fill="#a62842" d="M1 18.769H31V20.615H1z"></path>
      <path
        d="M1,24c0,.105,.023,.204,.031,.308H30.969c.008-.103,.031-.202,.031-.308v-1.539H1v1.539Z"
        fill="#a62842"
      ></path>
      <path
        d="M30.362,26.154H1.638c.711,1.108,1.947,1.846,3.362,1.846H27c1.414,0,2.65-.738,3.362-1.846Z"
        fill="#a62842"
      ></path>
      <path d="M5,4h11v12.923H1V8c0-2.208,1.792-4,4-4Z" fill="#102d5e"></path>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
      <path
        fill="#fff"
        d="M4.601 7.463L5.193 7.033 4.462 7.033 4.236 6.338 4.01 7.033 3.279 7.033 3.87 7.463 3.644 8.158 4.236 7.729 4.827 8.158 4.601 7.463z"
      ></path>
      <path
        fill="#fff"
        d="M7.58 7.463L8.172 7.033 7.441 7.033 7.215 6.338 6.989 7.033 6.258 7.033 6.849 7.463 6.623 8.158 7.215 7.729 7.806 8.158 7.58 7.463z"
      ></path>
      <path
        fill="#fff"
        d="M10.56 7.463L11.151 7.033 10.42 7.033 10.194 6.338 9.968 7.033 9.237 7.033 9.828 7.463 9.603 8.158 10.194 7.729 10.785 8.158 10.56 7.463z"
      ></path>
      <path
        fill="#fff"
        d="M6.066 9.283L6.658 8.854 5.927 8.854 5.701 8.158 5.475 8.854 4.744 8.854 5.335 9.283 5.109 9.979 5.701 9.549 6.292 9.979 6.066 9.283z"
      ></path>
      <path
        fill="#fff"
        d="M9.046 9.283L9.637 8.854 8.906 8.854 8.68 8.158 8.454 8.854 7.723 8.854 8.314 9.283 8.089 9.979 8.68 9.549 9.271 9.979 9.046 9.283z"
      ></path>
      <path
        fill="#fff"
        d="M12.025 9.283L12.616 8.854 11.885 8.854 11.659 8.158 11.433 8.854 10.702 8.854 11.294 9.283 11.068 9.979 11.659 9.549 12.251 9.979 12.025 9.283z"
      ></path>
      <path
        fill="#fff"
        d="M6.066 12.924L6.658 12.494 5.927 12.494 5.701 11.799 5.475 12.494 4.744 12.494 5.335 12.924 5.109 13.619 5.701 13.19 6.292 13.619 6.066 12.924z"
      ></path>
      <path
        fill="#fff"
        d="M9.046 12.924L9.637 12.494 8.906 12.494 8.68 11.799 8.454 12.494 7.723 12.494 8.314 12.924 8.089 13.619 8.68 13.19 9.271 13.619 9.046 12.924z"
      ></path>
      <path
        fill="#fff"
        d="M12.025 12.924L12.616 12.494 11.885 12.494 11.659 11.799 11.433 12.494 10.702 12.494 11.294 12.924 11.068 13.619 11.659 13.19 12.251 13.619 12.025 12.924z"
      ></path>
      <path
        fill="#fff"
        d="M13.539 7.463L14.13 7.033 13.399 7.033 13.173 6.338 12.947 7.033 12.216 7.033 12.808 7.463 12.582 8.158 13.173 7.729 13.765 8.158 13.539 7.463z"
      ></path>
      <path
        fill="#fff"
        d="M4.601 11.104L5.193 10.674 4.462 10.674 4.236 9.979 4.01 10.674 3.279 10.674 3.87 11.104 3.644 11.799 4.236 11.369 4.827 11.799 4.601 11.104z"
      ></path>
      <path
        fill="#fff"
        d="M7.58 11.104L8.172 10.674 7.441 10.674 7.215 9.979 6.989 10.674 6.258 10.674 6.849 11.104 6.623 11.799 7.215 11.369 7.806 11.799 7.58 11.104z"
      ></path>
      <path
        fill="#fff"
        d="M10.56 11.104L11.151 10.674 10.42 10.674 10.194 9.979 9.968 10.674 9.237 10.674 9.828 11.104 9.603 11.799 10.194 11.369 10.785 11.799 10.56 11.104z"
      ></path>
      <path
        fill="#fff"
        d="M13.539 11.104L14.13 10.674 13.399 10.674 13.173 9.979 12.947 10.674 12.216 10.674 12.808 11.104 12.582 11.799 13.173 11.369 13.765 11.799 13.539 11.104z"
      ></path>
      <path
        fill="#fff"
        d="M4.601 14.744L5.193 14.315 4.462 14.315 4.236 13.619 4.01 14.315 3.279 14.315 3.87 14.744 3.644 15.44 4.236 15.01 4.827 15.44 4.601 14.744z"
      ></path>
      <path
        fill="#fff"
        d="M7.58 14.744L8.172 14.315 7.441 14.315 7.215 13.619 6.989 14.315 6.258 14.315 6.849 14.744 6.623 15.44 7.215 15.01 7.806 15.44 7.58 14.744z"
      ></path>
      <path
        fill="#fff"
        d="M10.56 14.744L11.151 14.315 10.42 14.315 10.194 13.619 9.968 14.315 9.237 14.315 9.828 14.744 9.603 15.44 10.194 15.01 10.785 15.44 10.56 14.744z"
      ></path>
      <path
        fill="#fff"
        d="M13.539 14.744L14.13 14.315 13.399 14.315 13.173 13.619 12.947 14.315 12.216 14.315 12.808 14.744 12.582 15.44 13.173 15.01 13.765 15.44 13.539 14.744z"
      ></path>
    </svg>
  )
}

function SouthKoreaFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#fff"></rect>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path transform="rotate(-56.31 8.143 10.762)" d="M5.877 10.384H10.41V11.139000000000001H5.877z"></path>
      <path transform="rotate(-56.31 9.086 11.39)" d="M6.819 11.013H11.352V11.768H6.819z"></path>
      <path transform="rotate(-56.31 10.028 12.02)" d="M7.762 11.641H12.295V12.396H7.762z"></path>
      <path transform="rotate(-56.31 24.538 20.216)" d="M23.499 19.839H25.576V20.593999999999998H23.499z"></path>
      <path transform="rotate(-56.31 23.176 22.26)" d="M22.137 21.882H24.215V22.637H22.137z"></path>
      <path transform="rotate(-56.31 23.595 19.588)" d="M22.556 19.21H24.633000000000003V19.965H22.556z"></path>
      <path transform="rotate(-56.31 22.234 21.632)" d="M21.195 21.253H23.272V22.008H21.195z"></path>
      <path transform="rotate(-56.31 22.653 18.96)" d="M21.614 18.582H23.691000000000003V19.337H21.614z"></path>
      <path transform="rotate(-56.31 21.29 21.002)" d="M20.252 20.625H22.329V21.38H20.252z"></path>
      <path
        d="M12.229,13.486c1.389-2.083,4.203-2.646,6.286-1.257s2.646,4.203,1.257,6.286l-7.543-5.029Z"
        fill="#be3b3e"
      ></path>
      <path
        d="M12.229,13.486c-1.389,2.083-.826,4.897,1.257,6.286s4.897,.826,6.286-1.257c.694-1.041,.413-2.449-.629-3.143s-2.449-.413-3.143,.629l-3.771-2.514Z"
        fill="#1c449c"
      ></path>
      <circle cx="14.114" cy="14.743" r="2.266" fill="#be3b3e"></circle>
      <path transform="rotate(-33.69 8.143 21.238)" d="M7.765 18.972H8.52V23.505000000000003H7.765z"></path>
      <path transform="rotate(-33.69 10.03 19.98)" d="M9.651 17.715H10.406V22.248H9.651z"></path>
      <path transform="rotate(-33.69 22.915 11.39)" d="M22.537 9.124H23.291999999999998V13.657H22.537z"></path>
      <path transform="rotate(-33.69 8.405 19.588)" d="M8.027 18.549H8.782V20.625999999999998H8.027z"></path>
      <path transform="rotate(-33.691 9.767 21.632)" d="M9.389 20.592H10.144V22.668999999999997H9.389z"></path>
      <path transform="rotate(-33.69 21.29 10.998)" d="M20.913 9.959H21.668V12.036H20.913z"></path>
      <path transform="rotate(-33.69 22.652 13.04)" d="M22.275 12.002H23.029999999999998V14.079H22.275z"></path>
      <path transform="rotate(-33.69 23.176 9.741)" d="M22.798 8.702H23.552999999999997V10.779H22.798z"></path>
      <path transform="rotate(-33.691 24.539 11.783)" d="M24.16 10.745H24.915V12.822H24.16z"></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
    </svg>
  )
}

function JapanFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#fff"></rect>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <circle cx="16" cy="16" r="6" fill="#ae232f"></circle>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
    </svg>
  )
}

function ChinaFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#db362f"></rect>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        fill="#ff0"
        d="M7.958 10.152L7.19 7.786 6.421 10.152 3.934 10.152 5.946 11.614 5.177 13.979 7.19 12.517 9.202 13.979 8.433 11.614 10.446 10.152 7.958 10.152z"
      ></path>
      <path
        fill="#ff0"
        d="M12.725 8.187L13.152 8.898 13.224 8.072 14.032 7.886 13.269 7.562 13.342 6.736 12.798 7.361 12.035 7.037 12.461 7.748 11.917 8.373 12.725 8.187z"
      ></path>
      <path
        fill="#ff0"
        d="M14.865 10.372L14.982 11.193 15.37 10.46 16.187 10.602 15.61 10.007 15.997 9.274 15.253 9.639 14.675 9.044 14.793 9.865 14.048 10.23 14.865 10.372z"
      ></path>
      <path
        fill="#ff0"
        d="M15.597 13.612L16.25 13.101 15.421 13.13 15.137 12.352 14.909 13.149 14.081 13.179 14.769 13.642 14.541 14.439 15.194 13.928 15.881 14.391 15.597 13.612z"
      ></path>
      <path
        fill="#ff0"
        d="M13.26 15.535L13.298 14.707 12.78 15.354 12.005 15.062 12.46 15.754 11.942 16.402 12.742 16.182 13.198 16.875 13.236 16.047 14.036 15.827 13.26 15.535z"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
    </svg>
  )
}
