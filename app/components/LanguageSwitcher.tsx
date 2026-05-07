'use client'

import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: '#F3F4F6',
      padding: '0.25rem',
      borderRadius: '8px',
    }}>
      <button
        onClick={() => setLanguage('vi')}
        style={{
          padding: '0.375rem 0.75rem',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: language === 'vi' ? 'white' : 'transparent',
          color: language === 'vi' ? '#E30613' : '#6B7280',
          fontSize: '0.75rem',
          fontWeight: language === 'vi' ? 700 : 400,
          cursor: 'pointer',
          boxShadow: language === 'vi' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.15s',
        }}
      >
        VI
      </button>
      <span style={{ color: '#9CA3AF', fontSize: '0.7rem' }}>|</span>
      <button
        onClick={() => setLanguage('en')}
        style={{
          padding: '0.375rem 0.75rem',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: language === 'en' ? 'white' : 'transparent',
          color: language === 'en' ? '#E30613' : '#6B7280',
          fontSize: '0.75rem',
          fontWeight: language === 'en' ? 700 : 400,
          cursor: 'pointer',
          boxShadow: language === 'en' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.15s',
        }}
      >
        EN
      </button>
    </div>
  )
}
