'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'

const SITE_COLORS: Record<string, string> = {
    'long-an': '#E30613', 'tay-ninh': '#F39200', 'phan-thiet': '#0072B5',
}
const SITE_NAMES: Record<string, string> = {
    'long-an': 'Long An', 'tay-ninh': 'Tây Ninh', 'phan-thiet': 'Phan Thiết',
}

type ChecklistItem = {
    id: number; code: string; question_vi: string; guideline_vi: string | null; kea_id: number; sort_order: number
}
type KEAGroup = { id: number; code: string; name_vi: string; items: ChecklistItem[] }
type Answers = Record<number, 'yes' | 'no' | 'na' | null>
type Comments = Record<number, string>
type Actions = Record<number, string>
type Deadlines = Record<number, string>

export default function ManagerMonthlyPage() {
    const params = useParams()
    const router = useRouter()
    const siteId = params.site as string
    const siteColor = SITE_COLORS[siteId] ?? '#E30613'
    const siteName = SITE_NAMES[siteId] ?? 'Site'

    const [keaGroups, setKeaGroups] = useState<KEAGroup[]>([])
    const [answers, setAnswers] = useState<Answers>({})
    const [comments, setComments] = useState<Comments>({})
    const [actions, setActions] = useState<Actions>({})
    const [deadlines, setDeadlines] = useState<Deadlines>({})
    const [expandedKea, setExpandedKea] = useState<number | null>(null)
    const [managerComment, setManagerComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [alreadySubmitted, setAlreadySubmitted] = useState(false)

    const supabase = createClient()
    const now = new Date()
    const monthLabel = now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

    useEffect(() => {
        async function load() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            const { data: siteRow } = await supabase.from('sites').select('id').eq('code', siteId).single()
            if (!siteRow) { setLoading(false); return }

            // Kiểm tra đã nộp tháng này chưa
            const { data: existing } = await supabase
                .from('assessments')
                .select('id')
                .eq('site_id', siteRow.id)
                .eq('assessment_type', 'monthly')
                .gte('assessment_date', monthStart)
                .single()
            if (existing) { setAlreadySubmitted(true); setLoading(false); return }

            // Load all items (monthly + both)
            const { data: keas } = await supabase.from('kea_categories').select('id, code, name_vi').order('id')
            const { data: items } = await supabase
                .from('checklist_items')
                .select('id, code, question_vi, guideline_vi, kea_id, sort_order')
                .in('frequency', ['monthly', 'both'])
                .eq('is_active', true)
                .order('sort_order')

            if (keas && items) {
                const groups: KEAGroup[] = keas
                    .map(k => ({ ...k, items: items.filter(i => i.kea_id === k.id) }))
                    .filter(g => g.items.length > 0)
                setKeaGroups(groups)
                if (groups.length > 0) setExpandedKea(groups[0].id)
            }
            setLoading(false)
        }
        load()
    }, [siteId])

    const allItems = keaGroups.flatMap(g => g.items)
    const answered = allItems.filter(i => answers[i.id] != null).length
    const total = allItems.length
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0

    const yesCount = Object.values(answers).filter(v => v === 'yes').length
    const noCount = Object.values(answers).filter(v => v === 'no').length
    const scorePct = (yesCount + noCount) > 0 ? Math.round(yesCount / (yesCount + noCount) * 100) : 0

    async function handleSubmit() {
        setSubmitting(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }

        const { data: siteRow } = await supabase.from('sites').select('id').eq('code', siteId).single()
        if (!siteRow) { setSubmitting(false); return }

        const today = new Date().toISOString().split('T')[0]

        const { data: assessment, error } = await supabase
            .from('assessments')
            .insert({
                site_id: siteRow.id,
                assessor_id: user.id,
                assessment_date: today,
                assessment_type: 'monthly',
                status: 'submitted',
                overall_score: scorePct,
                manager_comment: managerComment || null,
            })
            .select('id').single()

        if (error || !assessment) {
            alert('Lỗi: ' + error?.message)
            setSubmitting(false); return
        }

        const responses = allItems
            .filter(i => answers[i.id] != null)
            .map(i => ({
                assessment_id: assessment.id,
                item_id: i.id,
                answer: answers[i.id],
                comment: comments[i.id] || null,
                required_action: actions[i.id] || null,
                deadline: deadlines[i.id] || null,
            }))

        await supabase.from('assessment_responses').insert(responses)
        setSubmitting(false)
        setSubmitted(true)
        setTimeout(() => router.push(`/${siteId}/dashboard`), 2000)
    }

    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0FDF4', gap: '1rem', padding: '2rem' }}>
                <div style={{ fontSize: '4rem' }}>✅</div>
                <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#16A34A' }}>Đã nộp thành công!</h1>
                <p style={{ color: '#6B7280' }}>Điểm tháng: <strong>{scorePct}%</strong></p>
            </div>
        )
    }

    if (alreadySubmitted) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}>
                <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6B7280' }}>←</button>
                    <div><h1 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Đánh Giá Tháng</h1><p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{siteName} · {monthLabel}</p></div>
                </header>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem' }}>✅</div>
                    <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#16A34A' }}>Đã nộp đánh giá tháng này</h2>
                    <p style={{ color: '#6B7280', textAlign: 'center' }}>Đánh giá tháng {monthLabel} đã hoàn thành.</p>
                    <button onClick={() => router.push(`/${siteId}/dashboard`)} style={{ marginTop: '1rem', padding: '0.75rem 2rem', backgroundColor: siteColor, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                        Xem Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif', paddingBottom: '5rem' }}>

            <header style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '0.875rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6B7280' }}>←</button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Đánh Giá Tháng — Manager/HSE</h1>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{siteName} · {monthLabel}</p>
                    </div>
                    <span style={{ backgroundColor: siteColor, color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>{siteName}</span>
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.3rem', color: '#374151' }}>
                        <span>{answered}/{total} hạng mục</span>
                        <span style={{ color: siteColor }}>{pct}% hoàn thành · Điểm: {scorePct > 0 ? scorePct + '%' : '—'}</span>
                    </div>
                    <div style={{ height: '5px', backgroundColor: '#E5E7EB', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: siteColor, borderRadius: '999px', transition: 'width 0.4s' }} />
                    </div>
                </div>
            </header>

            <main style={{ padding: '1rem', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>⏳ Đang tải...</div>
                ) : keaGroups.map(kea => {
                    const isOpen = expandedKea === kea.id
                    const keaAnswered = kea.items.filter(i => answers[i.id] != null).length
                    const keaYes = kea.items.filter(i => answers[i.id] === 'yes').length
                    const keaScoreable = kea.items.filter(i => answers[i.id] === 'yes' || answers[i.id] === 'no').length
                    const keaScore = keaScoreable > 0 ? Math.round(keaYes / keaScoreable * 100) : null
                    const allDone = keaAnswered === kea.items.length

                    return (
                        <div key={kea.id} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                            <div
                                onClick={() => setExpandedKea(isOpen ? null : kea.id)}
                                style={{ padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem', backgroundColor: isOpen ? '#FAFAFA' : 'white', borderBottom: isOpen ? '1px solid #E5E7EB' : 'none' }}
                            >
                                <div style={{ minWidth: '38px', height: '38px', borderRadius: '10px', backgroundColor: siteColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>
                                    {kea.code}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{kea.name_vi}</p>
                                    <p style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '0.1rem' }}>
                                        {keaAnswered}/{kea.items.length} hạng mục
                                        {keaScore !== null && ` · Điểm: ${keaScore}%`}
                                    </p>
                                </div>
                                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: allDone ? '#D1FAE5' : keaAnswered > 0 ? '#FEF3C7' : '#F3F4F6', color: allDone ? '#065F46' : keaAnswered > 0 ? '#B45309' : '#9CA3AF' }}>
                                    {allDone ? '✓ Xong' : keaAnswered > 0 ? `${keaAnswered}/${kea.items.length}` : 'Chưa làm'}
                                </span>
                                <span style={{ color: '#9CA3AF', fontSize: '0.75rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                            </div>

                            {isOpen && (
                                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {kea.items.map(item => {
                                        const ans = answers[item.id]
                                        return (
                                            <div key={item.id} style={{ padding: '0.875rem', borderRadius: '12px', backgroundColor: ans === 'yes' ? '#F0FDF4' : ans === 'no' ? '#FEF2F2' : '#F9FAFB', border: `1px solid ${ans === 'yes' ? '#BBF7D0' : ans === 'no' ? '#FECACA' : '#E5E7EB'}` }}>
                                                <p style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 700, marginBottom: '0.25rem' }}>{item.code}</p>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.5 }}>{item.question_vi}</p>
                                                {item.guideline_vi && (
                                                    <p style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: '0.5rem', fontStyle: 'italic' }}>💡 {item.guideline_vi}</p>
                                                )}
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {([
                                                        { val: 'yes', label: '✓ ĐẠT', bg: '#16A34A' },
                                                        { val: 'no', label: '✕ KHÔNG', bg: '#DC2626' },
                                                        { val: 'na', label: 'N/A', bg: '#6B7280' },
                                                    ] as const).map(btn => (
                                                        <button key={btn.val}
                                                            onClick={() => setAnswers(p => ({ ...p, [item.id]: btn.val }))}
                                                            style={{
                                                                flex: btn.val === 'na' ? '0 0 60px' : 1,
                                                                padding: '0.5rem 0', borderRadius: '8px',
                                                                fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                                                                border: `2px solid ${ans === btn.val ? btn.bg : '#E5E7EB'}`,
                                                                backgroundColor: ans === btn.val ? btn.bg : 'white',
                                                                color: ans === btn.val ? 'white' : '#6B7280',
                                                            }}
                                                        >{btn.label}</button>
                                                    ))}
                                                </div>
                                                {ans === 'no' && (
                                                    <div style={{ marginTop: '0.625rem', backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #DC2626', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#DC2626' }}>⚠️ Ghi chú</label>
                                                        <textarea
                                                            value={comments[item.id] || ''}
                                                            onChange={e => setComments(p => ({ ...p, [item.id]: e.target.value }))}
                                                            placeholder="Mô tả vấn đề..."
                                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #FCA5A5', minHeight: '48px', fontSize: '0.8rem', resize: 'vertical', boxSizing: 'border-box' }}
                                                        />
                                                        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#DC2626' }}>🔧 Hành động khắc phục (CAPA)</label>
                                                        <textarea
                                                            value={actions[item.id] || ''}
                                                            onChange={e => setActions(p => ({ ...p, [item.id]: e.target.value }))}
                                                            placeholder="Hành động cần thực hiện..."
                                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #FCA5A5', minHeight: '48px', fontSize: '0.8rem', resize: 'vertical', boxSizing: 'border-box' }}
                                                        />
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#DC2626', whiteSpace: 'nowrap' }}>📅 Deadline:</label>
                                                            <input
                                                                type="date"
                                                                value={deadlines[item.id] || ''}
                                                                onChange={e => setDeadlines(p => ({ ...p, [item.id]: e.target.value }))}
                                                                style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: '1px solid #FCA5A5', fontSize: '0.8rem' }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Manager Comment */}
                {!loading && (
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #E5E7EB' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>📝 Nhận xét tổng quan của Manager</h3>
                        <textarea
                            value={managerComment}
                            onChange={e => setManagerComment(e.target.value)}
                            placeholder="Nhận xét tình hình vận hành tháng này, định hướng cải tiến..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', minHeight: '80px', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                    </div>
                )}
            </main>

            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30, backgroundColor: 'white', padding: '0.875rem 1rem', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => router.back()} style={{ flex: '0 0 auto', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#6B7280' }}>
                    Hủy
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitting || answered === 0}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', backgroundColor: answered === 0 ? '#E5E7EB' : siteColor, color: answered === 0 ? '#9CA3AF' : 'white', fontWeight: 700, fontSize: '0.875rem', cursor: answered === 0 ? 'not-allowed' : 'pointer' }}
                >
                    {submitting ? '⏳ Đang lưu...' : `📤 Nộp Đánh Giá Tháng (Điểm: ${scorePct}%)`}
                </button>
            </div>
        </div>
    )
}
