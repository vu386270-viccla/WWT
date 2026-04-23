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

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        // Lấy thông tin profile để biết user ở site nào, role gì
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, sites(code)')
            .eq('id', data.user.id)
            .single()

        setLoading(false)

        const sitesObj: any = profile?.sites
        const siteCode = Array.isArray(sitesObj) ? sitesObj[0]?.code : sitesObj?.code

        if (profile?.role === 'manager' || profile?.role === 'admin') {
            router.push('/dashboard') // Combined dashboard
        } else if (siteCode) {
            router.push(`/${siteCode}/operator`)
        } else {
            router.push('/long-an/operator') // Fallback
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Header */}
            <header style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-red)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        V
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>VICC</h1>
                </div>
                <h2 className="title-script" style={{ color: 'var(--primary-red)', marginBottom: '0.5rem' }}>WWT Self-Assessment</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Hệ thống đánh giá vận hành nước thải</p>
            </header>

            {/* Login Card */}
            <section className="card">
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email / Tên đăng nhập</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nhanvien@vicc.com"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'var(--primary-red)', fontSize: '0.875rem' }}>{error}</p>}
                    <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </section>

            {/* Site Selector Preview (For Manager / Admin visual representation) */}
            <section>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>Chọn Nhà Máy / Select Site</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="card" onClick={() => router.push('/long-an/dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1rem', borderLeft: '6px solid var(--site-longan)' }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Long An</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>67 km từ HCM</p>
                        </div>
                        <div style={{ color: 'var(--site-longan)' }}>→</div>
                    </div>

                    <div className="card" onClick={() => router.push('/tay-ninh/dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1rem', borderLeft: '6px solid var(--site-tayninh)' }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Tây Ninh</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>99 km từ HCM</p>
                        </div>
                        <div style={{ color: 'var(--site-tayninh)' }}>→</div>
                    </div>

                    <div className="card" onClick={() => router.push('/phan-thiet/dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1rem', borderLeft: '6px solid var(--site-phanthiet)' }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Phan Thiết</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>200 km từ HCM</p>
                        </div>
                        <div style={{ color: 'var(--site-phanthiet)' }}>→</div>
                    </div>
                </div>
            </section>

        </div>
    )
}
