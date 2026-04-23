'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ManagerMonthlyPage() {
    const params = useParams()
    const router = useRouter()
    const site = params.site as string
    const siteNames: Record<string, string> = { 'long-an': 'Long An', 'tay-ninh': 'Tây Ninh', 'phan-thiet': 'Phan Thiết' }
    const siteName = siteNames[site] || 'Site'

    const [q3, setQ3] = useState<string | null>('no')

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', paddingBottom: '6rem' }}>

            {/* Header */}
            <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', padding: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={() => router.back()} style={{ border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>←</button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Đánh Giá Tháng 4/2026</h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{siteName} Factory | Quản lý / HSE</p>
                    </div>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        <span>Tiến độ đánh giá: 3/6 KEA đã review</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '50%', height: '100%', backgroundColor: 'var(--sustainability-green)' }}></div>
                    </div>
                </div>
            </header>

            <main style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>

                {/* Top Summary Card */}
                <div className="card" style={{ borderLeft: '4px solid var(--primary-red)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>ĐIỂM THÁNG NÀY</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-red)' }}>87</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>/ 100</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.5rem' }}>
                                🟡 Cần cải thiện
                            </span>
                            <p style={{ fontSize: '0.75rem', color: 'var(--sustainability-green)', fontWeight: 600 }}>↑ 3% so với tháng 3</p>
                        </div>
                    </div>
                </div>

                {/* KEA 1 Card */}
                <section className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>KEA 1 – Hệ thống quản lý</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>6/7 ⚠</span>
                            <span style={{ transform: 'rotate(180deg)' }}>▼</span>
                        </div>
                    </div>

                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Readonly answers for context */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <div style={{ color: 'var(--sustainability-green)' }}>✅</div>
                            <p style={{ fontSize: '0.875rem' }}><span style={{ fontWeight: 600, marginRight: '0.25rem' }}>I.1</span> Hướng dẫn vận hành SOP-18 được niêm yết?</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <div style={{ color: 'var(--sustainability-green)' }}>✅</div>
                            <p style={{ fontSize: '0.875rem' }}><span style={{ fontWeight: 600, marginRight: '0.25rem' }}>I.2</span> Nhân viên mặc đồng phục đầy đủ?</p>
                        </div>

                        {/* NO answer block for review/edit */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <div style={{ color: 'var(--primary-red)' }}>❌</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.875rem' }}><span style={{ fontWeight: 600, marginRight: '0.25rem' }}>I.3</span> Sơ đồ bể hiển thị tại khu vực vận hành?</p>
                                <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#FEF2F2', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-red)', marginBottom: '0.5rem' }}>Hành động khắc phục (Quản lý) *</label>
                                    <textarea placeholder="Yêu cầu cụ thể..." defaultValue="Cần in và laminate lại sơ đồ mới do cái cũ đã hỏng..." style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', minHeight: '60px', fontSize: '0.875rem', marginBottom: '0.5rem' }}></textarea>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Deadline:</label>
                                        <input type="date" defaultValue="2026-04-30" style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.875rem' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Collapsed KEA 5 */}
                <section className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>KEA 5 – Hồ sơ & Đào tạo</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>6/7 ⚠</span>
                        <span>▼</span>
                    </div>
                </section>

                {/* Manager Signature & Final Comments */}
                <section className="card">
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Nhận xét Quản lý</h2>
                    <textarea placeholder="Nhận xét tổng quan tình hình vận hành tháng này..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '100px', fontSize: '0.875rem', marginBottom: '1rem' }}></textarea>

                    <div style={{ padding: '1rem', backgroundColor: '#F3F4F6', borderRadius: '8px', border: '1px dashed var(--text-secondary)', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Ký tên điện tử xác nhận</p>
                        <h3 className="title-script" style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--primary-red)' }}>Le Van C</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Approved at: 23/04/2026 15:45</p>
                    </div>
                </section>

            </main>

            {/* Bottom Sticky Action Bar */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Lưu nháp</button>
                <button className="btn-primary" style={{ flex: 2 }}>Phê duyệt & Nộp</button>
            </div>

        </div>
    )
}
