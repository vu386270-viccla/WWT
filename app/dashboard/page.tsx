'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function CombinedDashboardPage() {
    const router = useRouter()

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', paddingBottom: '2rem' }}>
            {/* Header Sticky */}
            <header style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-red)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>V</div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>WWT Self-Assessment</h1>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h2 className="title-script" style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>Dashboard Tổng hợp</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>April 2026</span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E5E7EB', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>👤</div>
                </div>
            </header>

            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* TOP KPI STRIP */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {/* Long An */}
                    <div className="card" onClick={() => router.push('/long-an/dashboard')} style={{ borderTop: '6px solid var(--site-longan)', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Long An</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--site-longan)' }}>87%</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>55 hạng mục | 48 đạt</span>
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--sustainability-green)' }}>✓ Daily: Đã nộp hôm nay</p>
                    </div>

                    {/* Tây Ninh */}
                    <div className="card" onClick={() => router.push('/tay-ninh/dashboard')} style={{ borderTop: '6px solid var(--site-tayninh)', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tây Ninh</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--site-tayninh)' }}>79%</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>55 hạng mục | 43 đạt</span>
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--site-tayninh)' }}>⚠ Daily: Chưa nộp ca 2</p>
                    </div>

                    {/* Phan Thiết */}
                    <div className="card" onClick={() => router.push('/phan-thiet/dashboard')} style={{ borderTop: '6px solid var(--site-phanthiet)', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Phan Thiết</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--site-phanthiet)' }}>91%</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>55 hạng mục | 50 đạt</span>
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--sustainability-green)' }}>✓ Daily: Đã nộp hôm nay</p>
                    </div>
                </section>

                {/* MAIN CONTENT (3 Columns) */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>

                    {/* LEFT: Monthly Progress */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Tiến độ Tháng Này</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                            {/* Mock Donut Chart */}
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '16px solid var(--sustainability-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>86%</span>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                            Monthly assessment: 2/3 sites submitted
                        </div>
                    </div>

                    {/* MIDDLE: Recent Activity */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Hoạt động gần đây</h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>10:30am</span>
                                <span style={{ color: 'var(--site-longan)', fontWeight: 600 }}>[Long An]</span> Ca 1 Submitted by Nguyen Van A
                            </li>
                            <li style={{ fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>09:15am</span>
                                <span style={{ color: 'var(--site-tayninh)', fontWeight: 600 }}>[Tây Ninh]</span> Non-conformity: IV.7
                            </li>
                            <li style={{ fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Yesterday</span>
                                <span style={{ color: 'var(--site-phanthiet)', fontWeight: 600 }}>[Phan Thiết]</span> Monthly review completed
                            </li>
                        </ul>
                    </div>

                    {/* RIGHT: Action Required */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>Hạng mục cần chú ý</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: '#FEF2F2', borderLeft: '4px solid var(--primary-red)', borderRadius: '4px' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>IV.7 (Tây Ninh)</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Báo cáo sự cố QCVN 40</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--primary-red)', marginTop: '0.25rem' }}>Due: 30/04</p>
                            </div>
                            <div style={{ padding: '0.75rem', backgroundColor: '#FFFBEB', borderLeft: '4px solid var(--site-tayninh)', borderRadius: '4px' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>V.6 (Long An)</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Internal audit checklist</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--site-tayninh)', marginTop: '0.25rem' }}>Due: 25/04</p>
                            </div>
                        </div>
                    </div>

                </section>

            </main>
        </div>
    )
}
