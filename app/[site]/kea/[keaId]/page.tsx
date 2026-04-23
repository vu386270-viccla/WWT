'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function KeaDetailPage() {
    const params = useParams()
    const router = useRouter()
    const site = params.site as string
    const keaId = params.keaId as string

    const siteNames: Record<string, string> = { 'long-an': 'Long An', 'tay-ninh': 'Tây Ninh', 'phan-thiet': 'Phan Thiết' }
    const siteName = siteNames[site] || 'Site'

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', paddingBottom: '2rem' }}>

            {/* Header */}
            <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', padding: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => router.back()} style={{ border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>←</button>
                    <div>
                        <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>KEA {keaId} - Thiết bị & Hoá chất</h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{siteName} Factory</p>
                    </div>
                </div>
            </header>

            <main style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                <div className="card" style={{ backgroundColor: 'var(--primary-red)', color: 'white', border: 'none' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Guideline KEA {keaId}</h2>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Bao gồm các hạng mục kiểm tra tình trạng máy bơm, máy khuấy, lưới chắn rác và số lượng hoá chất tiêu thụ trong ca làm việc. Đảm bảo HTXLNT hoạt động liên tục không bị gián đoạn thiết bị.</p>
                </div>

                <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Tất cả các câu hỏi ({keaId === '2' ? '10' : '5'} hạng mục)</h3>

                    {[
                        { q: 'Bơm nước thải đầu vào hoạt động?', code: 'II.1', freq: 'Daily' },
                        { q: 'Bể điều hoà không có mùi hôi?', code: 'II.2', freq: 'Daily' },
                        { q: 'Hoá chất PAC còn đủ dùng 7 ngày?', code: 'II.3', freq: 'Daily' },
                        { q: 'Máy ép bùn hoạt động không rung lắc lớn?', code: 'II.4', freq: 'Daily' },
                        { q: 'Bơm hoá chất châm định lượng chính xác?', code: 'II.5', freq: 'Daily' },
                    ].map((item, idx) => (
                        <div key={idx} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ backgroundColor: '#F3F4F6', padding: '0.5rem', borderRadius: '8px', minWidth: '40px', textAlign: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                                {item.code}
                            </div>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{item.q}</p>
                                <span style={{ fontSize: '0.75rem', backgroundColor: '#E0E7FF', color: '#4338CA', padding: '0.125rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{item.freq}</span>
                            </div>
                        </div>
                    ))}
                </section>

            </main>
        </div>
    )
}
