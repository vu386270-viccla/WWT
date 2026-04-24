'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

const SITES = [
    { id: 'long-an', label: 'Long An', color: '#E30613' },
    { id: 'tay-ninh', label: 'Tây Ninh', color: '#F39200' },
    { id: 'phan-thiet', label: 'Phan Thiết', color: '#0072B5' },
]

type SiteSummary = {
    siteId: string
    label: string
    color: string
    monthScore: number | null
    compliance: number
    submitted: number
    daysPassed: number
    openCapas: number
    lastSubmit: string | null
}

function scoreColor(s: number | null) {
    if (s === null) return '#9CA3AF'
    return s >= 85 ? '#16A34A' : s >= 70 ? '#D97706' : '#DC2626'
}
function scoreBg(s: number | null) {
    if (s === null) return '#F9FAFB'
    return s >= 85 ? '#F0FDF4' : s >= 70 ? '#FFFBEB' : '#FEF2F2'
}
function scoreLabel(s: number | null) {
    if (s === null) return '—'
    return s >= 85 ? '✅ Đạt' : s >= 70 ? '⚠️ Cần cải thiện' : '❌ Không đạt'
}

export default function CombinedDashboard() {
    const router = useRouter()
    const [summaries, setSummaries] = useState<SiteSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState('')

    const supabase = createClient()
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const daysPassed = now.getDate()

    useEffect(() => {
        async function load() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
            if (profile) setUserName(profile.full_name ?? '')

            // Lấy tất cả sites
            const { data: sites } = await supabase.from('sites').select('id, code, name, color_hex').order('name')
            if (!sites) { setLoading(false); return }

            const results: SiteSummary[] = []

            for (const site of sites) {
                const siteInfo = SITES.find(s => s.id === site.code) ?? { label: site.name, color: site.color_hex }

                // Daily assessments tháng này
                const { data: asmts } = await supabase
                    .from('assessments')
                    .select('assessment_date, overall_score')
                    .eq('site_id', site.id)
                    .eq('assessment_type', 'daily')
                    .gte('assessment_date', monthStart)
                    .lte('assessment_date', today)
                    .order('assessment_date', { ascending: false })

                const submitted = asmts?.length ?? 0
                const scores = (asmts ?? []).filter(a => a.overall_score !== null).map(a => a.overall_score as number)
                const monthScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
                const compliance = daysPassed > 0 ? Math.round((submitted / daysPassed) * 100) : 0
                const lastSubmit = asmts && asmts.length > 0 ? asmts[0].assessment_date : null

                // Open CAPAs
                const { count: capas } = await supabase
                    .from('open_capas')
                    .select('id', { count: 'exact', head: true })
                    .eq('site_id', site.id)

                results.push({
                    siteId: site.code,
                    label: siteInfo.label,
                    color: siteInfo.color,
                    monthScore,
                    compliance,
                    submitted,
                    daysPassed,
                    openCapas: capas ?? 0,
                    lastSubmit,
                })
            }

            setSummaries(results)
            setLoading(false)
        }
        load()
    }, [])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const totalCapas = summaries.reduce((a, s) => a + s.openCapas, 0)
    const avgCompliance = summaries.length > 0
        ? Math.round(summaries.reduce((a, s) => a + s.compliance, 0) / summaries.length) : 0

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}>

            {/* Header */}
            <header style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', backgroundColor: '#E30613', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>V</div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.1 }}>VICC Group</div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600 }}>
                            WWT Dashboard · {now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {userName && <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>👤 {userName}</span>}
                    <button onClick={handleLogout} style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', cursor: 'pointer', fontWeight: 600, color: '#6B7280' }}>
                        Đăng xuất
                    </button>
                </div>
            </header>

            <main style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>
                        <div style={{ fontSize: '2rem' }}>⏳</div>
                        <p style={{ marginTop: '0.5rem' }}>Đang tải dữ liệu...</p>
                    </div>
                ) : (<>

                    {/* Tổng hợp */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {[
                            { label: 'Tuân thủ TB', value: avgCompliance + '%', sub: 'Tháng này', color: avgCompliance >= 90 ? '#16A34A' : '#D97706' },
                            { label: 'CAPAs mở', value: totalCapas.toString(), sub: 'Cần xử lý', color: totalCapas === 0 ? '#16A34A' : '#DC2626' },
                            { label: 'Nhà máy', value: summaries.length.toString(), sub: 'Đang theo dõi', color: '#1C2026' },
                        ].map((stat, i) => (
                            <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.25rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>{stat.label}</div>
                                <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '0.1rem' }}>{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Site Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        {summaries.map(site => (
                            <div
                                key={site.siteId}
                                onClick={() => router.push(`/${site.siteId}/dashboard`)}
                                style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E5E7EB', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.15s, box-shadow 0.15s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)' }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
                            >
                                {/* Site Header */}
                                <div style={{ height: '6px', backgroundColor: site.color }} />
                                <div style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: site.color }}>{site.label}</h3>
                                            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.15rem' }}>
                                                {site.lastSubmit
                                                    ? `Nộp gần nhất: ${new Date(site.lastSubmit).toLocaleDateString('vi-VN')}`
                                                    : 'Chưa có nhật ký tháng này'
                                                }
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '2rem', fontWeight: 900, color: scoreColor(site.monthScore) }}>
                                                {site.monthScore !== null ? site.monthScore + '%' : '—'}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>điểm TB</div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.875rem' }}>
                                        {[
                                            { label: 'Tuân thủ', value: site.compliance + '%', color: site.compliance >= 90 ? '#16A34A' : site.compliance >= 70 ? '#D97706' : '#DC2626' },
                                            { label: 'Đã nộp', value: `${site.submitted}/${site.daysPassed}`, color: '#1C2026' },
                                            { label: 'CAPA', value: site.openCapas.toString(), color: site.openCapas === 0 ? '#16A34A' : '#DC2626' },
                                        ].map((s, i) => (
                                            <div key={i} style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: s.color }}>{s.value}</div>
                                                <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 600 }}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Compliance bar */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                                            <span>Tỉ lệ nộp nhật ký tháng này</span>
                                            <span style={{ fontWeight: 700 }}>{site.compliance}%</span>
                                        </div>
                                        <div style={{ height: '6px', backgroundColor: '#E5E7EB', borderRadius: '999px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${site.compliance}%`, backgroundColor: site.compliance >= 90 ? '#16A34A' : site.compliance >= 70 ? '#D97706' : '#DC2626', borderRadius: '999px', transition: 'width 0.8s ease' }} />
                                        </div>
                                    </div>

                                    {/* Status + CTA */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.875rem' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: scoreColor(site.monthScore) }}>
                                            {scoreLabel(site.monthScore)}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: site.color, fontWeight: 700 }}>
                                            Xem chi tiết →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Nav */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                        {summaries.map(site => (
                            <button
                                key={site.siteId}
                                onClick={() => router.push(`/${site.siteId}/operator`)}
                                style={{ padding: '0.875rem', borderRadius: '12px', backgroundColor: site.color + '15', color: site.color, border: `1.5px solid ${site.color}33`, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}
                            >
                                📋 Nhật ký {site.label}
                            </button>
                        ))}
                    </div>

                </>)}
            </main>
        </div>
    )
}
