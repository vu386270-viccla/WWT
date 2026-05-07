'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { PARAM_THRESHOLDS } from '../../../lib/types'


type ChecklistItem = {
    id: number
    code: string
    question_vi: string
    question_en: string
    guideline_vi: string | null
    guideline_en: string | null
    kea_id: number
    sort_order: number
}
type KEAGroup = { id: number; code: string; name_vi: string; name_en: string; items: ChecklistItem[] }
type Answers = Record<number, 'yes' | 'no' | 'na' | null>
type Comments = Record<number, string>

type ParamValues = {
    ph_in: string; ph_out: string; do_mbbr: string
    sv30_ml: string; svi_ml_g: string; mlss_mg_l: string
    cod_out: string; nh4_out: string; flow_out_m3: string; electricity_kwh: string
    notes: string
}

const SITE_COLORS: Record<string, string> = {
    'long-an': '#E30613', 'tay-ninh': '#F39200', 'phan-thiet': '#0072B5',
}
const SITE_NAMES: Record<string, string> = {
    'long-an': 'Long An', 'tay-ninh': 'Tây Ninh', 'phan-thiet': 'Phan Thiết',
}

function isOutOfRange(key: keyof typeof PARAM_THRESHOLDS, value: string): boolean {
    const v = parseFloat(value)
    if (isNaN(v)) return false
    const t = PARAM_THRESHOLDS[key]
    return v < t.min || v > t.max
}

const EMPTY_PARAMS: ParamValues = {
    ph_in: '', ph_out: '', do_mbbr: '',
    sv30_ml: '', svi_ml_g: '', mlss_mg_l: '',
    cod_out: '', nh4_out: '', flow_out_m3: '', electricity_kwh: '',
    notes: '',
}

export default function OperatorDailyClient() {
    const params = useParams()
    const router = useRouter()
    const { t, language } = useLanguage()
    const siteId = params.site as string
    const siteColor = SITE_COLORS[siteId] ?? '#E30613'
    const [siteName, setSiteName] = useState('Site')

    const [keaGroups, setKeaGroups] = useState<KEAGroup[]>([])
    const [answers, setAnswers] = useState<Answers>({})
    const [comments, setComments] = useState<Comments>({})
    const [expandedKea, setExpandedKea] = useState<number | null>(null)
    const [paramValues, setParamValues] = useState<ParamValues>(EMPTY_PARAMS)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [activeTab, setActiveTab] = useState<'checklist' | 'params'>('checklist')

    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]

    useEffect(() => {
        async function load() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            // Lấy site_id và name
            const { data: siteRow } = await supabase.from('sites').select('id, name, name_en').eq('code', siteId).single()
            if (!siteRow) { setLoading(false); return }
            setSiteName(language === 'vi' ? siteRow.name : siteRow.name_en)

            // Kiểm tra đã nộp hôm nay chưa
            const { data: existing } = await supabase
                .from('assessments')
                .select('id, overall_score, status')
                .eq('site_id', siteRow.id)
                .eq('assessment_date', today)
                .eq('assessment_type', 'daily')
                .single()
            if (existing) { setAlreadySubmitted(true); setLoading(false); return }

            // Load checklist items (daily) với dynamic language fields
            const { data: keas } = await supabase
                .from('kea_categories').select('id, code, name_vi, name_en').order('id')
            const { data: items } = await supabase
                .from('checklist_items')
                .select('id, code, question_vi, question_en, guideline_vi, guideline_en, kea_id, sort_order')
                .in('frequency', ['daily', 'both'])
                .eq('is_active', true)
                .order('sort_order')

            if (keas && items) {
                const groups: KEAGroup[] = keas
                    .map(k => ({
                        ...k,
                        name_vi: k.name_vi,
                        name_en: k.name_en,
                        items: items.filter(i => i.kea_id === k.id)
                    }))
                    .filter(g => g.items.length > 0)
                setKeaGroups(groups)
                if (groups.length > 0) setExpandedKea(groups[0].id)
            }
            setLoading(false)
        }
        load()
    }, [siteId, language])

    const allItems = keaGroups.flatMap(g => g.items)
    const answered = allItems.filter(i => answers[i.id] != null).length
    const total = allItems.length
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0

    // Đếm params đã điền
    const paramKeys = Object.keys(PARAM_THRESHOLDS) as (keyof typeof PARAM_THRESHOLDS)[]
    const paramFilled = paramKeys.filter(k => paramValues[k as keyof ParamValues] !== '').length
    const outOfRange = paramKeys.filter(k => isOutOfRange(k, paramValues[k as keyof ParamValues]))

    async function handleSubmit() {
        setSubmitting(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { alert('Phiên đăng nhập hết hạn!'); router.push('/login'); return }

        const { data: siteRow } = await supabase.from('sites').select('id').eq('code', siteId).single()
        if (!siteRow) { alert('Không tìm thấy nhà máy!'); setSubmitting(false); return }

        const yesCount = Object.values(answers).filter(v => v === 'yes').length
        const noCount = Object.values(answers).filter(v => v === 'no').length
        const scorePct = (yesCount + noCount) > 0 ? Math.round(yesCount / (yesCount + noCount) * 100) : 0

        // Tạo assessment
        const { data: assessment, error: aErr } = await supabase
            .from('assessments')
            .insert({
                site_id: siteRow.id,
                assessor_id: user.id,
                assessment_date: today,
                assessment_type: 'daily',
                status: 'submitted',
                overall_score: scorePct,
            })
            .select('id').single()

        if (aErr || !assessment) {
            alert('Lỗi lưu đánh giá: ' + aErr?.message)
            setSubmitting(false); return
        }

        // Lưu responses
        const responses = allItems
            .filter(i => answers[i.id] != null)
            .map(i => ({
                assessment_id: assessment.id,
                item_id: i.id,
                answer: answers[i.id],
                comment: comments[i.id] || null,
            }))
        await supabase.from('assessment_responses').insert(responses)

        // Lưu parameter log (nếu có điền)
        if (paramFilled > 0) {
            const toNum = (v: string) => v === '' ? null : parseFloat(v)
            await supabase.from('parameter_logs').upsert({
                site_id: siteRow.id,
                log_date: today,
                logged_by: user.id,
                ph_in: toNum(paramValues.ph_in),
                ph_out: toNum(paramValues.ph_out),
                do_mbbr: toNum(paramValues.do_mbbr),
                sv30_ml: toNum(paramValues.sv30_ml),
                svi_ml_g: toNum(paramValues.svi_ml_g),
                mlss_mg_l: toNum(paramValues.mlss_mg_l),
                cod_out: toNum(paramValues.cod_out),
                nh4_out: toNum(paramValues.nh4_out),
                flow_out_m3: toNum(paramValues.flow_out_m3),
                electricity_kwh: toNum(paramValues.electricity_kwh),
                notes: paramValues.notes || null,
            }, { onConflict: 'site_id,log_date' })
        }

        setSubmitting(false)
        setSubmitted(true)
        setTimeout(() => router.push(`/${siteId}/dashboard`), 2000)
    }

    // ── Submitted ────────────────────────────────────────────────────
    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0FDF4', gap: '1rem', padding: '2rem' }}>
                <div style={{ fontSize: '4rem' }}>✅</div>
                <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#16A34A' }}>{t('operator.successSubmit')}</h1>
                <p style={{ color: '#6B7280' }}>{t('operator.redirecting')}</p>
            </div>
        )
    }

    // ── Already submitted ────────────────────────────────────────────
    if (alreadySubmitted) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}>
                <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6B7280' }}>←</button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t('operator.title')}</h1>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{siteName} · {new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    </div>
                    <LanguageSwitcher />
                </header>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem' }}>✅</div>
                    <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#16A34A' }}>{t('operator.alreadySubmitted')}</h2>
                    <p style={{ color: '#6B7280', textAlign: 'center' }}>{t('operator.submittedToday')} {new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    <button
                        onClick={() => router.push(`/${siteId}/dashboard`)}
                        style={{ marginTop: '1rem', padding: '0.75rem 2rem', backgroundColor: siteColor, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                    >
                        {t('operator.goToDashboard')}
                    </button>
                </div>
            </div>
        )
    }

    // ── Param input helper ──
    function ParamInput({ label, unit, fieldKey, placeholder, stdText }: {
        label: string; unit: string; fieldKey: keyof ParamValues
        placeholder?: string; stdText?: string
    }) {
        const val = paramValues[fieldKey]
        const out = fieldKey in PARAM_THRESHOLDS
            ? isOutOfRange(fieldKey as keyof typeof PARAM_THRESHOLDS, val) : false
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>
                    {label} {unit && <span style={{ color: '#9CA3AF', fontWeight: 400 }}>({unit})</span>}
                    {stdText && <span style={{ color: '#9CA3AF', fontWeight: 400 }}> — {t('params.standard')}: {stdText}</span>}
                </label>
                <input
                    type="number"
                    step="0.01"
                    value={val}
                    onChange={e => setParamValues(p => ({ ...p, [fieldKey]: e.target.value }))}
                    placeholder={placeholder ?? '—'}
                    style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: `1.5px solid ${out ? '#FCA5A5' : val !== '' ? '#BBF7D0' : '#E5E7EB'}`,
                        backgroundColor: out ? '#FEF2F2' : val !== '' ? '#F0FDF4' : 'white',
                        fontSize: '0.9rem',
                        width: '100%',
                        boxSizing: 'border-box' as const,
                        color: out ? '#DC2626' : '#1C2026',
                    }}
                />
                {out && (
                    <span style={{ fontSize: '0.7rem', color: '#DC2626', fontWeight: 600 }}>
                        ⚠️ {t('operator.outOfRangeWarning')}
                    </span>
                )}
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif', paddingBottom: '5rem' }}>

            {/* Header */}
            <header style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '0.875rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6B7280' }}>←</button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t('operator.title')}</h1>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{siteName} · {new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    </div>
                    <span style={{ backgroundColor: siteColor, color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {siteName}
                    </span>
                    <LanguageSwitcher />
                </div>

                {/* Tab Switcher */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {([
                        ['checklist', `${t('operator.checklist')} (${answered}/${total})`],
                        ['params', `${t('operator.params')} (${paramFilled}/${paramKeys.length})`]
                    ] as const).map(([tab, label]) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                            border: `1.5px solid ${activeTab === tab ? siteColor : '#E5E7EB'}`,
                            backgroundColor: activeTab === tab ? siteColor : 'white',
                            color: activeTab === tab ? 'white' : '#6B7280', cursor: 'pointer',
                        }}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Progress Bar */}
                {activeTab === 'checklist' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.3rem', color: '#374151' }}>
                            <span>{t('operator.itemsAnswered')}: {answered}/{total}</span>
                            <span style={{ color: siteColor }}>{pct}%</span>
                        </div>
                        <div style={{ height: '5px', backgroundColor: '#E5E7EB', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, backgroundColor: siteColor, borderRadius: '999px', transition: 'width 0.4s' }} />
                        </div>
                    </div>
                )}
                {activeTab === 'params' && outOfRange.length > 0 && (
                    <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#FEF3C7', borderRadius: '8px', fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>
                        ⚠️ {outOfRange.length} {t('operator.outOfRangeCount')} — {t('operator.checkReport')}
                    </div>
                )}
            </header>

            <main style={{ padding: '1rem', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                        <p>{t('common.loading')}</p>
                    </div>
                ) : activeTab === 'checklist' ? (
                    /* ── CHECKLIST TAB ── */
                    keaGroups.map(kea => {
                        const isOpen = expandedKea === kea.id
                        const keaAnswered = kea.items.filter(i => answers[i.id] != null).length
                        const keaTotal = kea.items.length
                        const allDone = keaAnswered === keaTotal
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
                                        <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{language === 'vi' ? kea.name_vi : kea.name_en}</p>
                                        <p style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '0.1rem' }}>{keaAnswered}/{keaTotal} hạng mục</p>
                                    </div>
                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: allDone ? '#D1FAE5' : keaAnswered > 0 ? '#FEF3C7' : '#F3F4F6', color: allDone ? '#065F46' : keaAnswered > 0 ? '#B45309' : '#9CA3AF' }}>
                                        {allDone ? t('status.completed') : keaAnswered > 0 ? `${keaAnswered}/${keaTotal}` : t('manager.notDone')}
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
                                                    <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.5 }}>
                                                        {language === 'vi' ? item.question_vi : item.question_en}
                                                    </p>
                                                    {(language === 'vi' ? item.guideline_vi : item.guideline_en) && (
                                                        <p style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: '0.5rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                                                            💡 {language === 'vi' ? item.guideline_vi : item.guideline_en}
                                                        </p>
                                                    )}
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {([
                                                            { val: 'yes', label: t('operator.yes'), bg: '#16A34A' },
                                                            { val: 'no', label: t('operator.no'), bg: '#DC2626' },
                                                            { val: 'na', label: t('operator.na'), bg: '#6B7280' },
                                                        ] as const).map(btn => (
                                                            <button
                                                                key={btn.val}
                                                                onClick={() => setAnswers(p => ({ ...p, [item.id]: btn.val }))}
                                                                style={{
                                                                    flex: btn.val === 'na' ? '0 0 60px' : 1,
                                                                    padding: '0.5rem 0', borderRadius: '8px',
                                                                    fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                                                                    border: `2px solid ${ans === btn.val ? btn.bg : '#E5E7EB'}`,
                                                                    backgroundColor: ans === btn.val ? btn.bg : 'white',
                                                                    color: ans === btn.val ? 'white' : '#6B7280',
                                                                    transition: 'all 0.15s',
                                                                }}
                                                            >
                                                                {btn.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {ans === 'no' && (
                                                        <div style={{ marginTop: '0.625rem', backgroundColor: '#FEF2F2', padding: '0.625rem', borderRadius: '8px', borderLeft: '3px solid #DC2626' }}>
                                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#DC2626', marginBottom: '0.35rem' }}>
                                                                {t('operator.noteAction')}
                                                            </label>
                                                            <textarea
                                                                value={comments[item.id] || ''}
                                                                onChange={e => setComments(p => ({ ...p, [item.id]: e.target.value }))}
                                                                placeholder={t('operator.describeProblem')}
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #FCA5A5', minHeight: '56px', fontSize: '0.8rem', resize: 'vertical', boxSizing: 'border-box' }}
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
                    })
                ) : (
                    /* ── PARAMS TAB ── */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Cảnh báo QCVN */}
                        {outOfRange.length > 0 && (
                            <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA' }}>
                                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#DC2626', marginBottom: '0.5rem' }}>
                                    🚨 {t('guideline.violation')}
                                </p>
                                {outOfRange.map(k => (
                                    <p key={k} style={{ fontSize: '0.8rem', color: '#B91C1C', marginBottom: '0.2rem' }}>
                                        • {PARAM_THRESHOLDS[k].label}: {paramValues[k as keyof ParamValues]} {PARAM_THRESHOLDS[k].unit}
                                    </p>
                                ))}
                                <p style={{ fontSize: '0.75rem', color: '#B91C1C', marginTop: '0.5rem', fontWeight: 600 }}>
                                    → {t('guideline.reportHSE')}
                                </p>
                            </div>
                        )}

                        {/* pH */}
                        <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #E5E7EB' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', color: '#374151' }}>⚗️ {t('params.phIn')}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                <ParamInput label={t('params.phIn')} unit={t('params.unitPh')} fieldKey="ph_in" placeholder="vd: 7.2" />
                                <ParamInput label={t('params.phOut')} unit={t('params.unitPh')} fieldKey="ph_out" placeholder="vd: 7.5" stdText={t('params.standardPh')} />
                            </div>
                        </div>

                        {/* DO + Bùn */}
                        <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #E5E7EB' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', color: '#374151' }}>🔬 {t('params.doMBBR')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                <ParamInput label={t('params.doMBBR')} unit={t('params.unitMgL')} fieldKey="do_mbbr" placeholder="vd: 2.0" stdText={t('params.standardDo')} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <ParamInput label={t('params.sv30')} unit={t('params.unitMgL')} fieldKey="sv30_ml" placeholder="vd: 400" stdText={t('params.standardSv30')} />
                                    <ParamInput label={t('params.svi')} unit="ml/g" fieldKey="svi_ml_g" placeholder="vd: 100" stdText={t('params.standardSvi')} />
                                </div>
                                <ParamInput label={t('params.mlss')} unit={t('params.unitMgL')} fieldKey="mlss_mg_l" placeholder="vd: 3000" stdText={t('params.standardMlss')} />
                            </div>
                        </div>

                        {/* COD + NH4 (weekly, nhưng ghi khi đo) */}
                        <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #E5E7EB' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.25rem', color: '#374151' }}>🧪 {t('params.codOut')}</h3>
                            <p style={{ fontSize: '0.7rem', color: '#9CA3AF', marginBottom: '1rem' }}>{t('operator.weeklyNote')}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                <ParamInput label={t('params.codOut')} unit={t('params.unitMgL')} fieldKey="cod_out" placeholder="vd: 80" stdText={t('params.standardCod')} />
                                <ParamInput label={t('params.nh4Out')} unit={t('params.unitMgL')} fieldKey="nh4_out" placeholder="vd: 5" stdText={t('params.standardNh4')} />
                            </div>
                        </div>

                        {/* Lưu lượng + Điện */}
                        <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #E5E7EB' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', color: '#374151' }}>📏 {t('params.flowOut')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                <ParamInput label={t('params.flowOut')} unit={t('params.unitM3Day')} fieldKey="flow_out_m3" placeholder="vd: 45" stdText={t('params.standardFlow')} />
                                <ParamInput label={t('params.electricity')} unit={t('params.unitKwh')} fieldKey="electricity_kwh" placeholder="vd: 12450" />
                            </div>
                        </div>

                        {/* Ghi chú */}
                        <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #E5E7EB' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: '#374151' }}>📝 {t('params.notes')}</h3>
                            <textarea
                                value={paramValues.notes}
                                onChange={e => setParamValues(p => ({ ...p, notes: e.target.value }))}
                                placeholder={t('params.notesPlaceholder')}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', minHeight: '80px', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Action */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30, backgroundColor: 'white', padding: '0.875rem 1rem', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '0.75rem' }}>
                <button
                    onClick={() => router.back()}
                    style={{ flex: '0 0 auto', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#6B7280' }}
                >
                    {t('common.cancel')}
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitting || answered === 0}
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none',
                        backgroundColor: answered === 0 ? '#E5E7EB' : siteColor,
                        color: answered === 0 ? '#9CA3AF' : 'white',
                        fontWeight: 700, fontSize: '0.875rem',
                        cursor: answered === 0 ? 'not-allowed' : 'pointer',
                    }}
                >
                    {submitting ? t('common.loading') : `${t('operator.submitDaily')} (${answered}/${total} hạng mục)`}
                </button>
            </div>
        </div>
    )
}
