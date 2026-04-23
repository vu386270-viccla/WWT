'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function SiteDashboardPage() {
    const params = useParams()
    const router = useRouter()
    const site = params.site as string

    const siteNames: Record<string, string> = {
        'long-an': 'Long An',
        'tay-ninh': 'Tây Ninh',
        'phan-thiet': 'Phan Thiết'
    }
    const siteColors: Record<string, string> = {
        'long-an': 'var(--site-longan)',
        'tay-ninh': 'var(--site-tayninh)',
        'phan-thiet': 'var(--site-phanthiet)'
    }

    const siteName = siteNames[site] || 'Site'
    const siteColor = siteColors[site] || 'var(--primary-red)'

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', paddingBottom: '4rem' }}>
            {/* Header */}
            <header style={{ backgroundColor: 'white', borderBottom: `4px solid ${siteColor}`, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
                <button onClick={() => router.back()} style={{ border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>←</button>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{siteName} Factory</h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>HTXLNT Dashboard | Tháng 4/2026</p>
                </div>
            </header>

            <main style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>

                {/* Overall Score */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ backgroundColor: siteColor, color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {siteName.toUpperCase()} 🔴
                    </span>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: siteColor }}>87%</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tháng này</div>
                    </div>
                </div>

                {/* KEA Summary Cards Grid */}
                <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                        { id: '1', title: 'Hệ thống quản lý', score: '86%', status: '🟡' },
                        { id: '2', title: 'Thiết bị & Hoá chất', score: '90%', status: '🟢' },
                        { id: '3', title: 'An toàn & PPE', score: '100%', status: '🟢' },
                        { id: '4', title: 'Giám sát chỉ tiêu', score: '78%', status: '🔴' },
                        { id: '5', title: 'Hồ sơ & Đào tạo', score: '86%', status: '🟡' },
                        { id: '6', title: 'KPI & Cải tiến', score: '100%', status: '🟢' },
                    ].map(kea => (
                        <div key={kea.id} className="card" onClick={() => router.push(`/${site}/kea/${kea.id}`)} style={{ padding: '1rem', cursor: 'pointer' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>KEA {kea.id}</div>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0.25rem 0 0.5rem 0', height: '40px' }}>{kea.title}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700 }}>{kea.score}</span>
                                <span>{kea.status}</span>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Action Required */}
                <section>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-red)', marginBottom: '0.75rem' }}>Action Required</h2>
                    <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--primary-red)', marginBottom: '0.5rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>IV.7 — Báo cáo sự cố QCVN 40:2011</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--primary-red)', marginTop: '0.25rem' }}>Due 30/04</p>
                    </div>
                    <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--site-tayninh)' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>V.6 — Internal audit checklist</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--site-tayninh)', marginTop: '0.25rem' }}>Due 25/04</p>
                    </div>
                </section>

                {/* Today's Status */}
                <section className="card">
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Hôm nay</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span>Ca 1 (6:00 - 14:00)</span>
                            <span style={{ color: 'var(--sustainability-green)', fontWeight: 600 }}>✅ Đã nộp</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span>Ca 2 (14:00 - 22:00)</span>
                            <span style={{ color: 'var(--site-tayninh)', fontWeight: 600 }}>⏳ Chưa nộp</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <span>Ca 3 (22:00 - 6:00)</span>
                            <span>Chưa bắt đầu</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Nav */}
            <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', borderTop: '1px solid var(--border-color)', height: '60px', opacity: 0.98 }}>
                {['Dashboard', 'Operator', 'Manager', 'Reports'].map(tab => (
                    <button key={tab} onClick={() => router.push(`/${site}/${tab.toLowerCase()}`)} style={{ flex: 1, backgroundColor: 'transparent', border: 'none', fontSize: '0.75rem', fontWeight: 600, color: tab === 'Dashboard' ? siteColor : 'var(--text-secondary)', cursor: 'pointer' }}>
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    )
}
