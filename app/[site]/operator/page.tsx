'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function OperatorChecklistPage() {
    const params = useParams()
    const router = useRouter()
    const site = params.site as string
    const [shift, setShift] = useState('1')

    const siteNames: Record<string, string> = { 'long-an': 'Long An', 'tay-ninh': 'Tây Ninh', 'phan-thiet': 'Phan Thiết' }
    const siteName = siteNames[site] || 'Site'

    // MOCK DATA for KEA 2 check
    const [q1, setQ1] = useState<string | null>('yes')
    const [q2, setQ2] = useState<string | null>('yes')
    const [q3, setQ3] = useState<string | null>('no')

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', paddingBottom: '6rem' }}>

            {/* Header */}
            <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', padding: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={() => router.back()} style={{ border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>←</button>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Đánh Giá Hàng Ngày</h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ca {shift} | 23/04/2026</p>
                    </div>
                    <span style={{ marginLeft: 'auto', backgroundColor: 'var(--primary-red)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {siteName} 🔴
                    </span>
                </div>

                {/* Shift Selector */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {['1', '2', '3'].map(s => (
                        <button key={s} onClick={() => setShift(s)} style={{
                            flex: '0 0 auto', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid',
                            backgroundColor: shift === s ? 'var(--primary-red)' : 'transparent',
                            color: shift === s ? 'white' : 'var(--text-secondary)',
                            borderColor: shift === s ? 'var(--primary-red)' : 'var(--border-color)',
                            cursor: 'pointer'
                        }}>
                            Ca {s} {s === '1' ? '(6h-14h)' : ''}
                        </button>
                    ))}
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        <span>36/41 hạng mục</span>
                        <span>87%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '87%', height: '100%', backgroundColor: 'var(--primary-red)' }}></div>
                    </div>
                </div>
            </header>

            <main style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>

                {/* KEA 2 Card */}
                <section className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>KEA 2 – Thiết bị & Hoá chất</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>9/10 ✓</span>
                            <span style={{ transform: 'rotate(180deg)' }}>▼</span>
                        </div>
                    </div>

                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Question II.1 */}
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}><span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>II.1</span> Bơm nước thải đầu vào hoạt động bình thường?</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setQ1('yes')} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid', backgroundColor: q1 === 'yes' ? 'var(--sustainability-green)' : 'white', color: q1 === 'yes' ? 'white' : 'var(--text-secondary)', borderColor: q1 === 'yes' ? 'var(--sustainability-green)' : 'var(--border-color)', cursor: 'pointer' }}>✓ YES</button>
                                <button onClick={() => setQ1('no')} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid', backgroundColor: q1 === 'no' ? 'var(--primary-red)' : 'white', color: q1 === 'no' ? 'white' : 'var(--text-secondary)', borderColor: q1 === 'no' ? 'var(--primary-red)' : 'var(--border-color)', cursor: 'pointer' }}>✕ NO</button>
                            </div>
                        </div>

                        {/* Question II.2 */}
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}><span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>II.2</span> Bể điều hoà không có mùi hôi bất thường?</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setQ2('yes')} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid', backgroundColor: q2 === 'yes' ? 'var(--sustainability-green)' : 'white', color: q2 === 'yes' ? 'white' : 'var(--text-secondary)', borderColor: q2 === 'yes' ? 'var(--sustainability-green)' : 'var(--border-color)', cursor: 'pointer' }}>✓ YES</button>
                                <button onClick={() => setQ2('no')} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid', backgroundColor: q2 === 'no' ? 'var(--primary-red)' : 'white', color: q2 === 'no' ? 'white' : 'var(--text-secondary)', borderColor: q2 === 'no' ? 'var(--primary-red)' : 'var(--border-color)', cursor: 'pointer' }}>✕ NO</button>
                            </div>
                        </div>

                        {/* Question II.3 */}
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}><span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>II.3</span> Hoá chất PAC còn đủ cho 7 ngày vận hành?</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setQ3('yes')} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid', backgroundColor: q3 === 'yes' ? 'var(--sustainability-green)' : 'white', color: q3 === 'yes' ? 'white' : 'var(--text-secondary)', borderColor: q3 === 'yes' ? 'var(--sustainability-green)' : 'var(--border-color)', cursor: 'pointer' }}>✓ YES</button>
                                <button onClick={() => setQ3('no')} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid', backgroundColor: q3 === 'no' ? 'var(--primary-red)' : 'white', color: q3 === 'no' ? 'white' : 'var(--text-secondary)', borderColor: q3 === 'no' ? 'var(--primary-red)' : 'var(--border-color)', cursor: 'pointer' }}>✕ NO</button>
                            </div>

                            {/* Conditional Comment Field for NO answer */}
                            {q3 === 'no' && (
                                <div style={{ marginTop: '1rem', backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-red)' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-red)', marginBottom: '0.5rem' }}>Ghi chú / Hành động bắt buộc *</label>
                                    <textarea placeholder="Giải thích vấn đề và cách khắc phục..." defaultValue="Đã đặt thêm, giao ngày 25/04..." style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #FCA5A5', minHeight: '60px', fontSize: '0.875rem' }}></textarea>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* KEA 4 Collapsed Card */}
                <section className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>KEA 4 – Giám sát chỉ tiêu</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>7/9 ⚠</span>
                        <span>▼</span>
                    </div>
                </section>

            </main>

            {/* Bottom Sticky Action Bar */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>💾 Lưu nháp</button>
                <button className="btn-primary" style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>📤 Nộp Báo Cáo</button>
            </div>

        </div>
    )
}
