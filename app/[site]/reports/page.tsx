'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ReportsHistoryPage() {
    const params = useParams()
    const router = useRouter()
    const site = params.site as string
    const siteNames: Record<string, string> = { 'long-an': 'Long An', 'tay-ninh': 'Tây Ninh', 'phan-thiet': 'Phan Thiết' }
    const siteName = siteNames[site] || 'Site'

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', paddingBottom: '2rem' }}>

            {/* Header */}
            <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', padding: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => router.back()} style={{ border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>←</button>
                    <div>
                        <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Báo cáo & Lịch sử</h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{siteName} Factory</p>
                    </div>
                </div>
            </header>

            <main style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Export Card */}
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                    <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0369A1' }}>Export Data</h2>
                        <p style={{ fontSize: '0.75rem', color: '#0284C7' }}>Tải kết quả đánh giá 30 ngày qua (Excel/PDF)</p>
                    </div>
                    <button className="btn-primary" style={{ backgroundColor: '#0284C7', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Tải xuống</button>
                </div>

                {/* History List */}
                <section>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Lịch sử Đánh Giá (T4/2026)</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Daily Checklist — Ca 1</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>23/04/2026 • by Nguyen Van A</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--sustainability-green)' }}>100%</span>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-red)' }}>Missing: Daily Checklist — Ca 3</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--primary-red)' }}>22/04/2026</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--primary-red)', color: 'white', padding: '0.125rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Bị nhỡ</span>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Monthly Assessment</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>31/03/2026 • by Le Van C</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--site-tayninh)' }}>84%</span>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    )
}
