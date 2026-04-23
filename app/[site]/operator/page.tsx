'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────
type ChecklistItem = {
    id: number
    code: string
    question_vi: string
    guideline_vi: string | null
    kea_id: number
    sort_order: number
}
type KEAGroup = {
    id: number
    code: string
    name_vi: string
    items: ChecklistItem[]
}
type Answers = Record<number, 'yes' | 'no' | 'na' | null>
type Comments = Record<number, string>

const SITE_COLORS: Record<string, string> = {
    'long-an': '#E30613',
    'tay-ninh': '#F39200',
    'phan-thiet': '#0072B5',
}
const SITE_NAMES: Record<string, string> = {
    'long-an': 'Long An',
    'tay-ninh': 'Tây Ninh',
    'phan-thiet': 'Phan Thiết',
}

export default function OperatorChecklistPage() {
    const params = useParams()
    const router = useRouter()
    const siteId = params.site as string
    const siteColor = SITE_COLORS[siteId] ?? '#E30613'
    const siteName = SITE_NAMES[siteId] ?? 'Site'

    const [shift, setShift] = useState('1')
    const [keaGroups, setKeaGroups] = useState<KEAGroup[]>([])
    const [answers, setAnswers] = useState<Answers>({})
    const [comments, setComments] = useState<Comments>({})
    const [expandedKea, setExpandedKea] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const supabase = createClient()

    // ── Load checklist + check auth ──
    useEffect(() => {
        async function load() {
            setLoading(true)

            // Check auth
            const { data: { user } } = await supabase.auth.getUser()
            setIsLoggedIn(!!user)

            const { data: keas } = await supabase
                .from('kea_categories')
                .select('id, code, name_vi')
                .order('id')

            const { data: items } = await supabase
                .from('checklist_items')
                .select('id, code, question_vi, guideline_vi, kea_id, sort_order')
                .in('frequency', ['daily', 'both'])
                .eq('is_active', true)
                .order('sort_order')

            if (keas && items) {
                const groups: KEAGroup[] = keas
                    .map(k => ({
                        ...k,
                        items: items.filter(i => i.kea_id === k.id),
                    }))
                    .filter(g => g.items.length > 0)
                setKeaGroups(groups)
                if (groups.length > 0) setExpandedKea(groups[0].id)
            }
            setLoading(false)
        }
        load()
    }, [])

    // ── Stats ──
    const allItems = keaGroups.flatMap(g => g.items)
    const answered = allItems.filter(i => answers[i.id] != null).length
    const total = allItems.length
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0

    function setAnswer(itemId: number, val: 'yes' | 'no' | 'na') {
        setAnswers(prev => ({ ...prev, [itemId]: val }))
    }
    function setComment(itemId: number, val: string) {
        setComments(prev => ({ ...prev, [itemId]: val }))
    }

    // ── Submit to Supabase ──
    async function handleSubmit() {
        setSubmitting(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { alert('Bạn chưa đăng nhập!'); setSubmitting(false); return }

        // Get site_id
        const { data: siteRow } = await supabase
            .from('sites').select('id').eq('code', siteId).single()
        if (!siteRow) { alert('Không tìm thấy nhà máy!'); setSubmitting(false); return }

        // Create assessment
        const yesCount = Object.values(answers).filter(v => v === 'yes').length
        const noCount = Object.values(answers).filter(v => v === 'no').length
        const scorePct = (yesCount + noCount) > 0 ? Math.round(yesCount / (yesCount + noCount) * 100) : 0

        const { data: assessment, error: aErr } = await supabase
            .from('assessments')
            .insert({
                site_id: siteRow.id,
                assessor_id: user.id,
                assessment_date: new Date().toISOString().split('T')[0],
                assessment_type: 'daily',
                shift,
                status: 'submitted',
                overall_score: scorePct,
            })
            .select('id')
            .single()

        if (aErr || !assessment) {
            alert('Lỗi lưu đánh giá: ' + aErr?.message)
            setSubmitting(false)
            return
        }

        // Insert responses
        const responses = allItems
            .filter(i => answers[i.id] != null)
            .map(i => ({
                assessment_id: assessment.id,
                item_id: i.id,
                answer: answers[i.id],
                comment: comments[i.id] || null,
            }))

        await supabase.from('assessment_responses').insert(responses)
        setSubmitting(false)
        setSubmitted(true)
        setTimeout(() => router.push(`/${siteId}/dashboard`), 2000)
    }

    // ── UI ──
    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0FDF4', gap: '1rem', padding: '2rem' }}>
                <div style={{ fontSize: '4rem' }}>✅</div>
                <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#16A34A' }}>Đã nộp thành công!</h1>
                <p style={{ color: '#6B7280' }}>Đang chuyển về Dashboard...</p>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif', paddingBottom: '6rem' }}>

            {/* ── Read-only Banner ── */}
            {!isLoggedIn && !loading && (
                <div style={{
                    backgroundColor: '#FEF3C7', borderBottom: '1px solid #FCD34D',
                    padding: '0.6rem 1rem', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: '0.75rem',
                }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#92400E' }}>
                        👁️ Chế độ xem — Đăng nhập để đánh giá
                    </span>
                    <button
                        onClick={() => router.push('/login')}
                        style={{
                            padding: '0.3rem 0.9rem', borderRadius: '8px', border: 'none',
                            backgroundColor: '#D97706', color: 'white',
                            fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                        }}
                    >
                        Đăng nhập
                    </button>
                </div>
            )}

            {/* ── Header ── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'white',
                borderBottom: '1px solid #E5E7EB', padding: '0.875rem 1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6B7280' }}>←</button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Đánh Giá Hàng Ngày</h1>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                            {siteName} · {new Date().toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                    <span style={{
                        backgroundColor: siteColor, color: 'white',
                        padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                    }}>{siteName}</span>
                </div>

                {/* Shift Selector */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {[['1', 'Ca 1 (6h–14h)'], ['2', 'Ca 2 (14h–22h)'], ['3', 'Ca 3 (22h–6h)']].map(([val, label]) => (
                        <button key={val} onClick={() => setShift(val)} style={{
                            flex: 1, padding: '0.4rem 0', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
                            border: `1px solid ${shift === val ? siteColor : '#E5E7EB'}`,
                            backgroundColor: shift === val ? siteColor : 'white',
                            color: shift === val ? 'white' : '#6B7280', cursor: 'pointer',
                        }}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Progress Bar */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.3rem', color: '#374151' }}>
                        <span>{answered}/{total} câu đã trả lời</span>
                        <span style={{ color: siteColor }}>{pct}%</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#E5E7EB', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: siteColor, borderRadius: '999px', transition: 'width 0.4s' }} />
                    </div>
                </div>
            </header>

            {/* ── Content ── */}
            <main style={{ padding: '1rem', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                        <p>Đang tải danh sách câu hỏi...</p>
                    </div>
                ) : keaGroups.map(kea => {
                    const isOpen = expandedKea === kea.id
                    const keaAnswered = kea.items.filter(i => answers[i.id] != null).length
                    const keaTotal = kea.items.length
                    const allGood = keaAnswered === keaTotal
                    return (
                        <div key={kea.id} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                            {/* KEA Header */}
                            <div
                                onClick={() => setExpandedKea(isOpen ? null : kea.id)}
                                style={{
                                    padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem',
                                    backgroundColor: isOpen ? '#FAFAFA' : 'white',
                                    borderBottom: isOpen ? '1px solid #E5E7EB' : 'none',
                                }}
                            >
                                <div style={{
                                    minWidth: '38px', height: '38px', borderRadius: '10px',
                                    backgroundColor: siteColor, color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 900, fontSize: '0.8rem',
                                }}>
                                    {kea.code}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{kea.name_vi}</p>
                                    <p style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '0.1rem' }}>{keaAnswered}/{keaTotal} câu</p>
                                </div>
                                <span style={{
                                    padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
                                    backgroundColor: allGood ? '#D1FAE5' : keaAnswered > 0 ? '#FEF3C7' : '#F3F4F6',
                                    color: allGood ? '#065F46' : keaAnswered > 0 ? '#B45309' : '#9CA3AF',
                                }}>
                                    {allGood ? '✓ Xong' : keaAnswered > 0 ? `${keaAnswered}/${keaTotal}` : 'Chưa làm'}
                                </span>
                                <span style={{ color: '#9CA3AF', fontSize: '0.75rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                            </div>

                            {/* Items */}
                            {isOpen && (
                                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {kea.items.map((item, idx) => {
                                        const ans = answers[item.id]
                                        return (
                                            <div key={item.id} style={{
                                                padding: '0.875rem', borderRadius: '12px',
                                                backgroundColor: ans === 'yes' ? '#F0FDF4' : ans === 'no' ? '#FEF2F2' : '#F9FAFB',
                                                border: `1px solid ${ans === 'yes' ? '#BBF7D0' : ans === 'no' ? '#FECACA' : '#E5E7EB'}`,
                                            }}>
                                                {/* Question */}
                                                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, marginBottom: '0.3rem' }}>{item.code}</p>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.625rem', lineHeight: 1.5 }}>{item.question_vi}</p>

                                                {/* Guideline (collapsible) */}
                                                {item.guideline_vi && (
                                                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.625rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                                                        💡 {item.guideline_vi}
                                                    </p>
                                                )}

                                                {/* Answer Buttons */}
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {[
                                                        { val: 'yes', label: '✓ YES', bg: '#16A34A' },
                                                        { val: 'no', label: '✕ NO', bg: '#DC2626' },
                                                        { val: 'na', label: 'N/A', bg: '#6B7280' },
                                                    ].map(btn => (
                                                        <button
                                                            key={btn.val}
                                                            onClick={() => isLoggedIn && setAnswer(item.id, btn.val as 'yes' | 'no' | 'na')}
                                                            disabled={!isLoggedIn}
                                                            style={{
                                                                flex: btn.val === 'na' ? '0 0 60px' : 1,
                                                                padding: '0.5rem 0', borderRadius: '8px',
                                                                fontWeight: 700, fontSize: '0.8rem',
                                                                cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                                                                border: `2px solid ${ans === btn.val ? btn.bg : '#E5E7EB'}`,
                                                                backgroundColor: ans === btn.val ? btn.bg : isLoggedIn ? 'white' : '#F9FAFB',
                                                                color: ans === btn.val ? 'white' : isLoggedIn ? '#6B7280' : '#D1D5DB',
                                                                transition: 'all 0.15s',
                                                                opacity: isLoggedIn ? 1 : 0.6,
                                                            }}
                                                        >
                                                            {btn.label}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Comment box when NO */}
                                                {ans === 'no' && (
                                                    <div style={{ marginTop: '0.75rem', backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #DC2626' }}>
                                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#DC2626', marginBottom: '0.4rem' }}>
                                                            ⚠️ Ghi chú / Hành động khắc phục *
                                                        </label>
                                                        <textarea
                                                            value={comments[item.id] || ''}
                                                            onChange={e => setComment(item.id, e.target.value)}
                                                            placeholder="Mô tả vấn đề và cách khắc phục..."
                                                            style={{
                                                                width: '100%', padding: '0.5rem', borderRadius: '6px',
                                                                border: '1px solid #FCA5A5', minHeight: '60px',
                                                                fontSize: '0.8rem', resize: 'vertical', boxSizing: 'border-box',
                                                            }}
                                                        />
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
            </main>

            {/* ── Bottom Action Bar ── */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
                backgroundColor: 'white', padding: '0.875rem 1rem', borderTop: '1px solid #E5E7EB',
                display: 'flex', gap: '0.75rem',
            }}>
                {isLoggedIn ? (
                    <>
                        <button
                            onClick={() => router.push(`/${siteId}/dashboard`)}
                            style={{
                                flex: '0 0 auto', padding: '0.75rem 1rem', borderRadius: '10px',
                                border: '1px solid #E5E7EB', backgroundColor: 'white',
                                fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#6B7280',
                            }}
                        >
                            💾 Lưu nháp
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || answered === 0}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none',
                                backgroundColor: answered === 0 ? '#E5E7EB' : siteColor,
                                color: answered === 0 ? '#9CA3AF' : 'white',
                                fontWeight: 700, fontSize: '0.875rem', cursor: answered === 0 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {submitting ? '⏳ Đang nộp...' : `📤 Nộp Báo Cáo (${answered}/${total})`}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => router.push('/login')}
                        style={{
                            flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none',
                            backgroundColor: '#D97706', color: 'white',
                            fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                        }}
                    >
                        🔐 Đăng nhập để đánh giá
                    </button>
                )}
            </div>
        </div>
    )
}
