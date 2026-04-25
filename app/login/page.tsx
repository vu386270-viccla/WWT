'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })

            if (error) {
                setError('Email hoặc mật khẩu không đúng')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role, site_id')
                .eq('id', data.user.id)
                .single()

            if (profile?.role === 'admin' || profile?.role === 'manager') {
                router.push('/dashboard')
            } else if (profile?.site_id) {
                const { data: site } = await supabase
                    .from('sites')
                    .select('code')
                    .eq('id', profile.site_id)
                    .single()
                router.push(`/${site?.code ?? 'long-an'}/dashboard`)
            } else {
                router.push('/dashboard')
            }
        } catch (err) {
            setError('Lỗi kết nối. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F7FA',
            padding: '1.5rem',
        }}>
            <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Logo */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '56px', height: '56px',
                        backgroundColor: '#E30613', borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 900, fontSize: '1.5rem',
                        margin: '0 auto 1rem',
                        boxShadow: '0 4px 14px rgba(227,6,19,0.35)',
                    }}>V</div>
                    <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1C2026' }}>VICC WWT</h1>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Hệ thống quản lý xử lý nước thải
                    </p>
                </div>

                {/* Form */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    border: '1px solid #E5E7EB',
                }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1.5rem' }}>Đăng nhập</h2>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="nhanvien@vicc.com"
                                required
                                style={{
                                    width: '100%', padding: '0.75rem 1rem',
                                    borderRadius: '10px', border: '1.5px solid #E5E7EB',
                                    fontSize: '0.9rem', outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderColor = '#E30613'}
                                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: '#374151' }}>
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%', padding: '0.75rem 1rem',
                                    borderRadius: '10px', border: '1.5px solid #E5E7EB',
                                    fontSize: '0.9rem', outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderColor = '#E30613'}
                                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                backgroundColor: '#FEF2F2',
                                border: '1px solid #FECACA',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                color: '#DC2626',
                                fontWeight: 500,
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.875rem',
                                backgroundColor: loading ? '#9CA3AF' : '#E30613',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                        >
                            {loading ? '⏳ Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF' }}>
                    VICC Group · WWT Management System · ISO 14001
                </p>
            </div>
        </div>
    )
}
