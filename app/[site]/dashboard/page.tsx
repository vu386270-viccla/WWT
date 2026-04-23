'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const SITES = [
    { id: 'long-an', label: 'Long An', color: '#E30613' },
    { id: 'tay-ninh', label: 'Tây Ninh', color: '#F39200' },
    { id: 'phan-thiet', label: 'Phan Thiết', color: '#0072B5' },
]

type KEA = { id: string; label: string; score: number; yes: number; total: number; freq: 'daily' | 'monthly' }

const SITE_DATA: Record<string, { score: number; capa: number; keas: KEA[] }> = {
    'long-an': {
        score: 87, capa: 2,
        keas: [
            { id: 'I', label: 'Hệ thống quản lý', score: 86, yes: 6, total: 7, freq: 'monthly' },
            { id: 'II', label: 'Thiết bị & Hoá chất', score: 100, yes: 8, total: 8, freq: 'daily' },
            { id: 'III', label: 'An toàn & PPE', score: 100, yes: 9, total: 9, freq: 'daily' },
            { id: 'IV', label: 'Giám sát chỉ tiêu', score: 78, yes: 7, total: 9, freq: 'daily' },
            { id: 'V', label: 'Hồ sơ & Đào tạo', score: 86, yes: 6, total: 7, freq: 'monthly' },
            { id: 'VI', label: 'KPI & Cải tiến', score: 100, yes: 9, total: 9, freq: 'monthly' },
        ],
    },
    'tay-ninh': {
        score: 79, capa: 4,
        keas: [
            { id: 'I', label: 'Hệ thống quản lý', score: 71, yes: 5, total: 7, freq: 'monthly' },
            { id: 'II', label: 'Thiết bị & Hoá chất', score: 88, yes: 7, total: 8, freq: 'daily' },
            { id: 'III', label: 'An toàn & PPE', score: 89, yes: 8, total: 9, freq: 'daily' },
            { id: 'IV', label: 'Giám sát chỉ tiêu', score: 67, yes: 6, total: 9, freq: 'daily' },
            { id: 'V', label: 'Hồ sơ & Đào tạo', score: 71, yes: 5, total: 7, freq: 'monthly' },
            { id: 'VI', label: 'KPI & Cải tiến', score: 78, yes: 7, total: 9, freq: 'monthly' },
        ],
    },
    'phan-thiet': {
        score: 93, capa: 1,
        keas: [
            { id: 'I', label: 'Hệ thống quản lý', score: 100, yes: 7, total: 7, freq: 'monthly' },
            { id: 'II', label: 'Thiết bị & Hoá chất', score: 100, yes: 8, total: 8, freq: 'daily' },
            { id: 'III', label: 'An toàn & PPE', score: 89, yes: 8, total: 9, freq: 'daily' },
            { id: 'IV', label: 'Giám sát chỉ tiêu', score: 89, yes: 8, total: 9, freq: 'daily' },
            { id: 'V', label: 'Hồ sơ & Đào tạo', score: 86, yes: 6, total: 7, freq: 'monthly' },
            { id: 'VI', label: 'KPI & Cải tiến', score: 89, yes: 8, total: 9, freq: 'monthly' },
        ],
    },
}

function scoreColor(s: number) {
    return s >= 85 ? '#16A34A' : s >= 70 ? '#D97706' : '#DC2626'
}
function scoreBg(s: number) {
    return s >= 85 ? '#F0FDF4' : s >= 70 ? '#FFFBEB' : '#FEF2F2'
}

export default function SiteDashboard() {
    const params = useParams()
    const router = useRouter()
    const siteId = (params?.site as string) ?? 'long-an'
    const site = SITES.find(s => s.id === siteId) ?? SITES[0]
    const data = SITE_DATA[siteId] ?? SITE_DATA['long-an']
    const [expanded, setExpanded] = useState<string | null>(null)

    const NAV = [
        { label: 'Dashboard', path: `/${siteId}/dashboard`, active: true },
        { label: 'Operator', path: `/${siteId}/operator`, active: false },
        { label: 'Manager', path: `/${siteId}/manager`, active: false },
        { label: 'Reports', path: `/${siteId}/reports`, active: false },
    ]

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}>

            {/* ── Sticky Header ── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 30,
                backgroundColor: 'white', borderBottom: '1px solid #E5E7EB',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.7rem 1.25rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                        onClick={() => router.push('/dashboard')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '1.25rem', padding: '0.25rem' }}
                    >←</button>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>VICC Group</div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>WWT Self-Assessment · Tháng 4/2026</div>
                    </div>
                </div>
                <div style={{
                    backgroundColor: site.color, color: 'white',
                    padding: '0.3rem 0.9rem', borderRadius: '999px',
                    fontSize: '0.8rem', fontWeight: 700,
                }}>
                    {site.label}
                </div>
            </header>

            {/* ── Site Switcher Tabs ── */}
            <div style={{
                position: 'sticky', top: '53px', zIndex: 20,
                backgroundColor: 'white', borderBottom: '1px solid #E5E7EB',
                display: 'flex', overflowX: 'auto',
            }}>
                {SITES.map(s => {
                    const active = s.id === siteId
                    return (
                        <button
                            key={s.id}
                            onClick={() => router.push(`/${s.id}/dashboard`)}
                            style={{
                                padding: '0.75rem 1.25rem', fontWeight: 700, fontSize: '0.875rem',
                                border: 'none', borderBottom: active ? `3px solid ${s.color}` : '3px solid transparent',
                                backgroundColor: 'transparent', color: active ? s.color : '#6B7280',
                                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s',
                            }}
                        >
                            <span style={{
                                display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                                backgroundColor: s.color, marginRight: '0.5rem', verticalAlign: 'middle',
                            }} />
                            {s.label}
                        </button>
                    )
                })}
                <button
                    onClick={() => router.push('/dashboard')}
                    style={{
                        marginLeft: 'auto', padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.8rem',
                        border: 'none', backgroundColor: 'transparent', color: '#9CA3AF', cursor: 'pointer',
                    }}
                >
                    Tổng hợp →
                </button>
            </div>

            {/* ── Main Content ── */}
            <main style={{ padding: '1.25rem', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Score Hero Banner */}
                <div style={{
                    background: `linear-gradient(135deg, ${site.color} 0%, ${site.color}CC 100%)`,
                    borderRadius: '20px', padding: '1.5rem',
                    color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <div>
                        <p style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Điểm Tuân Thủ Tháng 4/2026
                        </p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                            <span style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>{data.score}</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 600, opacity: 0.75 }}>/100</span>
                        </div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}>
                            {data.score >= 85 ? '✅ Đạt tiêu chuẩn vận hành' : data.score >= 70 ? '⚠️ Cần cải thiện' : '❌ Không đạt — Cần hành động ngay'}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            border: '6px solid rgba(255,255,255,0.3)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                        }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{data.score}%</span>
                        </div>
                        <p style={{ marginTop: '0.4rem', fontSize: '0.7rem', opacity: 0.75 }}>49 hạng mục</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '1rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16A34A' }}>
                            {data.keas.filter(k => k.score >= 85).length}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600, marginTop: '0.2rem' }}>KEA ĐẠT</div>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '1rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626' }}>{data.capa}</div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600, marginTop: '0.2rem' }}>CAPA MỞ</div>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '1rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: site.color }}>6</div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600, marginTop: '0.2rem' }}>TỔNG KEA</div>
                    </div>
                </div>

                {/* KEA Cards */}
                <div>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#374151' }}>
                        Kết quả theo KEA
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {data.keas.map(kea => {
                            const isOpen = expanded === kea.id
                            const color = scoreColor(kea.score)
                            const bg = scoreBg(kea.score)
                            return (
                                <div
                                    key={kea.id}
                                    onClick={() => setExpanded(isOpen ? null : kea.id)}
                                    style={{
                                        backgroundColor: 'white', borderRadius: '14px', border: '1px solid #E5E7EB',
                                        overflow: 'hidden', cursor: 'pointer',
                                        boxShadow: isOpen ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    {/* Header */}
                                    <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                        <div style={{
                                            minWidth: '40px', height: '40px', borderRadius: '10px',
                                            backgroundColor: site.color, color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 900, fontSize: '0.85rem',
                                        }}>
                                            {kea.id}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                                <span style={{ fontWeight: 600, fontSize: '0.875rem', flex: 1 }}>{kea.label}</span>
                                                <span style={{ fontWeight: 800, fontSize: '1rem', color, marginLeft: '0.75rem' }}>{kea.score}%</span>
                                            </div>
                                            <div style={{ height: '5px', backgroundColor: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${kea.score}%`, backgroundColor: color, borderRadius: '999px', transition: 'width 0.6s' }} />
                                            </div>
                                        </div>
                                        <span style={{ color: '#9CA3AF', fontSize: '0.75rem', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                                    </div>

                                    {/* Expanded */}
                                    {isOpen && (
                                        <div style={{ backgroundColor: bg, padding: '1rem', borderTop: `1px solid ${color}33` }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{kea.yes}</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 700 }}>ĐẠT</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6B7280' }}>{kea.total - kea.yes}</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 700 }}>KHÔNG ĐẠT</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C2026' }}>{kea.total}</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 700 }}>TỔNG</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{
                                                    fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600,
                                                    backgroundColor: kea.freq === 'daily' ? '#EDE9FE' : '#DBEAFE',
                                                    color: kea.freq === 'daily' ? '#7C3AED' : '#1D4ED8',
                                                }}>
                                                    {kea.freq === 'daily' ? '🔄 Hàng ngày' : '📅 Hàng tháng'}
                                                </span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>
                                                    {kea.score >= 85 ? '✅ Đạt' : kea.score >= 70 ? '⚠️ Cần cải thiện' : '❌ Không đạt'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <button
                        onClick={() => router.push(`/${siteId}/operator`)}
                        style={{
                            padding: '1rem', borderRadius: '14px',
                            backgroundColor: site.color, color: 'white', border: 'none', cursor: 'pointer',
                            fontWeight: 700, fontSize: '0.875rem',
                        }}
                    >
                        📋 Đánh giá ca hôm nay
                    </button>
                    <button
                        onClick={() => router.push(`/${siteId}/manager`)}
                        style={{
                            padding: '1rem', borderRadius: '14px',
                            backgroundColor: 'white', color: site.color,
                            border: `2px solid ${site.color}`, cursor: 'pointer',
                            fontWeight: 700, fontSize: '0.875rem',
                        }}
                    >
                        📊 Manager Review
                    </button>
                </div>

            </main>

            {/* ── Bottom Nav ── */}
            <nav style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                backgroundColor: 'white', borderTop: '1px solid #E5E7EB',
                display: 'flex', justifyContent: 'space-around', padding: '0.5rem 0',
                zIndex: 30,
            }}>
                {NAV.map(n => (
                    <button
                        key={n.label}
                        onClick={() => router.push(n.path)}
                        style={{
                            background: 'none', border: 'none', padding: '0.4rem 1rem',
                            color: n.active ? site.color : '#6B7280',
                            fontWeight: n.active ? 700 : 500, fontSize: '0.8rem', cursor: 'pointer',
                        }}
                    >
                        {n.label}
                    </button>
                ))}
            </nav>

            {/* Bottom padding for fixed nav */}
            <div style={{ height: '4rem' }} />
        </div>
    )
}
