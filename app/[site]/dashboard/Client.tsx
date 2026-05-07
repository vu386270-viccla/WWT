'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'


const SITES = [
    { id: 'long-an', label: 'Long An', color: '#E30613' },
    { id: 'tay-ninh', label: 'Tây Ninh', color: '#F39200' },
    { id: 'phan-thiet', label: 'Phan Thiết', color: '#0072B5' },
]

type DailyStatus = { date: string; submitted: boolean; score: number | null }
type KeaSummary = { code: string; name_vi: string; yes: number; no: number; na: number; total: number }

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year: number, month: number) {
    // 0=Sun, 1=Mon... → convert to Mon=0
    const d = new Date(year, month, 1).getDay()
    return d === 0 ? 6 : d - 1
}

export default function SiteDashboard() {
    const params = useParams()
    const router = useRouter()
    const siteId = (params?.site as string) ?? 'long-an'
    const site = SITES.find(s => s.id === siteId) ?? SITES[0]

    const now = new Date()
    const [viewYear, setViewYear] = useState(now.getFullYear())
    const [viewMonth, setViewMonth] = useState(now.getMonth())

    const [dailyStatuses, setDailyStatuses] = useState<DailyStatus[]>([])
    const [keaSummary, setKeaSummary] = useState<KeaSummary[]>([])
    const [monthScore, setMonthScore] = useState<number | null>(null)
    const [totalSubmitted, setTotalSubmitted] = useState(0)
    const [openCapas, setOpenCapas] = useState(0)
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState('')

    const supabase = createClient()

    useEffect(() => {
        async function load() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            // Lấy profile
            const { data: profile } = await supabase
                .from('profiles').select('full_name').eq('id', user.id).single()
            if (profile) setUserName(profile.full_name ?? '')

            // Lấy site_id
            const { data: siteRow } = await supabase.from('sites').select('id').eq('code', siteId).single()
            if (!siteRow) { setLoading(false); return }

            const monthStart = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-01`
            const daysInMonth = getDaysInMonth(viewYear, viewMonth)
            const monthEnd = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`

            // Daily assessments trong tháng
            const { data: assessments } = await supabase
                .from('assessments')
                .select('id, assessment_date, overall_score, status')
                .eq('site_id', siteRow.id)
                .eq('assessment_type', 'daily')
                .gte('assessment_date', monthStart)
                .lte('assessment_date', monthEnd)
                .order('assessment_date')

            if (assessments) {
                const submittedDates = new Set(assessments.map(a => a.assessment_date))
                const todayStr = now.toISOString().split('T')[0]
                const statuses: DailyStatus[] = []
                for (let d = 1; d <= daysInMonth; d++) {
                    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                    const assessment = assessments.find(a => a.assessment_date === dateStr)
                    statuses.push({
                        date: dateStr,
                        submitted: submittedDates.has(dateStr),
                        score: assessment?.overall_score ?? null,
                    })
                }
                setDailyStatuses(statuses)
                setTotalSubmitted(assessments.length)

                // Tính score tháng (trung bình)
                const scores = assessments.filter(a => a.overall_score !== null).map(a => a.overall_score as number)
                setMonthScore(scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null)
            }

            // KEA Summary từ responses tháng này (daily assessments)
            const { data: responses } = await supabase
                .from('assessment_responses')
                .select('answer, checklist_items(kea_id, kea_categories(code, name_vi))')
                .in('assessment_id', (assessments ?? []).map(a => a.id))

            if (responses) {
                const keaMap: Record<string, KeaSummary> = {}
                responses.forEach((r: any) => {
                    const kea = r.checklist_items?.kea_categories
                    if (!kea) return
                    if (!keaMap[kea.code]) {
                        keaMap[kea.code] = { code: kea.code, name_vi: kea.name_vi, yes: 0, no: 0, na: 0, total: 0 }
                    }
                    keaMap[kea.code].total++
                    if (r.answer === 'yes') keaMap[kea.code].yes++
                    else if (r.answer === 'no') keaMap[kea.code].no++
                    else if (r.answer === 'na') keaMap[kea.code].na++
                })
                setKeaSummary(Object.values(keaMap).sort((a, b) => a.code.localeCompare(b.code)))
            }

            // Open CAPAs
            const { count } = await supabase
                .from('open_capas')
                .select('id', { count: 'exact', head: true })
                .eq('site_id', siteRow.id)
            setOpenCapas(count ?? 0)

            setLoading(false)
        }
        load()
    }, [siteId, viewYear, viewMonth])

    // Tính tỉ lệ nộp trong tháng đến hôm nay
    const todayStr = now.toISOString().split('T')[0]
    const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()
    const daysInMonth = getDaysInMonth(viewYear, viewMonth)
    const daysPassed = isCurrentMonth ? now.getDate() : daysInMonth
    const compliance = daysPassed > 0 ? Math.round((totalSubmitted / daysPassed) * 100) : 0

    function scoreColor(s: number | null) {
        if (s === null) return '#9CA3AF'
        return s >= 85 ? '#16A34A' : s >= 70 ? '#D97706' : '#DC2626'
    }

    const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
    const firstDow = getFirstDayOfWeek(viewYear, viewMonth)

    const NAV = [
        { label: '📊 Dashboard', path: `/${siteId}/dashboard`, active: true },
        { label: '📋 Nhật ký', path: `/${siteId}/operator`, active: false },
        { label: '📄 Reports', path: `/${siteId}/reports`, active: false },
    ]

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}>

            {/* Header */}
            <header style={{ position: 'sticky', top: 0, zIndex: 30, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '1.25rem', padding: '0.25rem' }}>←</button>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>VICC Group</div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>WWT · {new Date(viewYear, viewMonth).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ backgroundColor: site.color, color: 'white', padding: '0.3rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>{site.label}</div>
                    <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#6B7280', cursor: 'pointer' }}>
                        Đăng xuất
                    </button>
                </div>
            </header>

            {/* Site Switcher */}
            <div style={{ position: 'sticky', top: '53px', zIndex: 20, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', overflowX: 'auto' }}>
                {SITES.map(s => {
                    const active = s.id === siteId
                    return (
                        <button key={s.id} onClick={() => router.push(`/${s.id}/dashboard`)} style={{ padding: '0.75rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', border: 'none', borderBottom: active ? `3px solid ${s.color}` : '3px solid transparent', backgroundColor: 'transparent', color: active ? s.color : '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color, marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            {s.label}
                        </button>
                    )
                })}
                <button onClick={() => router.push('/dashboard')} style={{ marginLeft: 'auto', padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.8rem', border: 'none', backgroundColor: 'transparent', color: '#9CA3AF', cursor: 'pointer' }}>
                    Tổng hợp →
                </button>
            </div>

            <main style={{ padding: '1rem', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '5rem' }}>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                        <div style={{ fontSize: '2rem' }}>⏳</div><p style={{ marginTop: '0.5rem' }}>Đang tải...</p>
                    </div>
                ) : (<>

                    {/* Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                        {[
                            {
                                label: 'Tuân thủ tháng', value: compliance + '%',
                                sub: `${totalSubmitted}/${daysPassed} ngày`,
                                color: compliance >= 90 ? '#16A34A' : compliance >= 70 ? '#D97706' : '#DC2626',
                                bg: compliance >= 90 ? '#F0FDF4' : compliance >= 70 ? '#FFFBEB' : '#FEF2F2',
                            },
                            {
                                label: 'Điểm trung bình', value: monthScore !== null ? monthScore + '%' : '—',
                                sub: 'Daily checks',
                                color: scoreColor(monthScore),
                                bg: '#F9FAFB',
                            },
                            {
                                label: 'CAPAs mở', value: openCapas.toString(),
                                sub: openCapas === 0 ? 'Tốt!' : 'Cần xử lý',
                                color: openCapas === 0 ? '#16A34A' : '#DC2626',
                                bg: openCapas === 0 ? '#F0FDF4' : '#FEF2F2',
                            },
                        ].map((stat, i) => (
                            <div key={i} style={{ backgroundColor: stat.bg, borderRadius: '14px', padding: '1rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                                <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 600, marginTop: '0.15rem', lineHeight: 1.3 }}>{stat.label}</div>
                                <div style={{ fontSize: '0.6rem', color: '#9CA3AF', marginTop: '0.1rem' }}>{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Calendar */}
                    <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.25rem', border: '1px solid #E5E7EB' }}>
                        {/* Month nav */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <button
                                onClick={() => {
                                    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
                                    else setViewMonth(m => m - 1)
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#6B7280', padding: '0.25rem 0.5rem' }}
                            >‹</button>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                                    {new Date(viewYear, viewMonth).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Lịch nộp nhật ký hàng ngày</div>
                            </div>
                            <button
                                onClick={() => {
                                    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
                                    else setViewMonth(m => m + 1)
                                }}
                                disabled={isCurrentMonth}
                                style={{ background: 'none', border: 'none', cursor: isCurrentMonth ? 'not-allowed' : 'pointer', fontSize: '1.2rem', color: isCurrentMonth ? '#D1D5DB' : '#6B7280', padding: '0.25rem 0.5rem' }}
                            >›</button>
                        </div>

                        {/* Weekday headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                            {WEEKDAYS.map(d => (
                                <div key={d} style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, color: d === 'CN' ? '#EF4444' : '#9CA3AF', paddingBottom: '4px' }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
                            {/* Empty cells for first week */}
                            {Array.from({ length: firstDow }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {dailyStatuses.map((s, idx) => {
                                const dayNum = idx + 1
                                const dateStr = s.date
                                const isToday = dateStr === todayStr
                                const isFuture = isCurrentMonth && dayNum > now.getDate()
                                const isWeekend = ((firstDow + idx) % 7) >= 5 // Sat or Sun

                                let bg = '#F3F4F6'
                                let textColor = '#9CA3AF'
                                let emoji = ''

                                if (isFuture) {
                                    bg = '#F9FAFB'; textColor = '#D1D5DB'
                                } else if (s.submitted) {
                                    bg = '#DCFCE7'; textColor = '#16A34A'
                                    emoji = s.score !== null ? '' : '✓'
                                } else {
                                    bg = '#FEE2E2'; textColor = '#DC2626'
                                    emoji = '✗'
                                }

                                return (
                                    <div
                                        key={dateStr}
                                        onClick={() => s.submitted && router.push(`/${siteId}/reports?date=${dateStr}`)}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '8px',
                                            backgroundColor: bg,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: s.submitted ? 'pointer' : 'default',
                                            border: isToday ? `2px solid ${site.color}` : '2px solid transparent',
                                            transition: 'transform 0.1s',
                                        }}
                                    >
                                        <span style={{ fontSize: '0.7rem', fontWeight: isToday ? 800 : 600, color: textColor, lineHeight: 1 }}>
                                            {dayNum}
                                        </span>
                                        {!isFuture && (
                                            <span style={{ fontSize: '0.55rem', fontWeight: 700, color: textColor }}>
                                                {s.submitted ? (s.score !== null ? `${s.score}%` : '✓') : '✗'}
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.875rem' }}>
                            {[
                                { color: '#DCFCE7', text: 'Đã nộp', textColor: '#16A34A' },
                                { color: '#FEE2E2', text: 'Chưa nộp', textColor: '#DC2626' },
                                { color: '#F3F4F6', text: 'Tương lai', textColor: '#9CA3AF' },
                            ].map(l => (
                                <div key={l.text} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: l.color }} />
                                    <span style={{ fontSize: '0.65rem', color: l.textColor, fontWeight: 600 }}>{l.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* KEA Summary */}
                    {keaSummary.length > 0 && (
                        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.25rem', border: '1px solid #E5E7EB' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#374151' }}>
                                Tổng hợp theo KEA — Tháng này
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                {keaSummary.map(kea => {
                                    const scoreable = kea.yes + kea.no
                                    const score = scoreable > 0 ? Math.round((kea.yes / scoreable) * 100) : null
                                    const color = scoreColor(score)
                                    return (
                                        <div key={kea.code}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: site.color, color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{kea.code}</span>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{kea.name_vi}</span>
                                                </div>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color }}>{score !== null ? `${score}%` : '—'}</span>
                                            </div>
                                            <div style={{ height: '5px', backgroundColor: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${score ?? 0}%`, backgroundColor: color, borderRadius: '999px', transition: 'width 0.6s' }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <button
                            onClick={() => router.push(`/${siteId}/operator`)}
                            style={{ padding: '1rem', borderRadius: '14px', backgroundColor: site.color, color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', textAlign: 'left' }}
                        >
                            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>📋</div>
                            Nhật ký hôm nay
                        </button>
                        <button
                            onClick={() => router.push(`/${siteId}/manager`)}
                            style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'white', color: site.color, border: `2px solid ${site.color}`, cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', textAlign: 'left' }}
                        >
                            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>📊</div>
                            Đánh giá tháng
                        </button>
                    </div>

                </>)}
            </main>

            {/* Bottom Nav */}
            <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-around', padding: '0.5rem 0', zIndex: 30 }}>
                {NAV.map(n => (
                    <button key={n.label} onClick={() => router.push(n.path)} style={{ background: 'none', border: 'none', padding: '0.4rem 1rem', color: n.active ? site.color : '#6B7280', fontWeight: n.active ? 700 : 500, fontSize: '0.78rem', cursor: 'pointer' }}>
                        {n.label}
                    </button>
                ))}
            </nav>
        </div>
    )
}
