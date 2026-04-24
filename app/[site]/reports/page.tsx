'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import { PARAM_THRESHOLDS } from '../../../lib/types'

const SITE_COLORS: Record<string, string> = {
    'long-an': '#E30613', 'tay-ninh': '#F39200', 'phan-thiet': '#0072B5',
}
const SITE_NAMES: Record<string, string> = {
    'long-an': 'Long An', 'tay-ninh': 'Tây Ninh', 'phan-thiet': 'Phan Thiết',
}

type AssessmentRow = {
    id: string
    assessment_date: string
    assessment_type: 'daily' | 'monthly'
    status: string
    overall_score: number | null
    assessor_name: string
}
type ParamLog = {
    log_date: string
    ph_in: number | null; ph_out: number | null; do_mbbr: number | null
    sv30_ml: number | null; mlss_mg_l: number | null
    flow_out_m3: number | null; electricity_kwh: number | null
    notes: string | null
}

function isOut(key: keyof typeof PARAM_THRESHOLDS, val: number | null) {
    if (val === null) return false
    return val < PARAM_THRESHOLDS[key].min || val > PARAM_THRESHOLDS[key].max
}
function ParamCell({ label, value, unit, fieldKey }: {
    label: string; value: number | null; unit: string
    fieldKey: keyof typeof PARAM_THRESHOLDS
}) {
    const out = isOut(fieldKey, value)
    return (
        <div style={{ padding: '0.625rem 0.875rem', borderRadius: '10px', backgroundColor: value === null ? '#F9FAFB' : out ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${value === null ? '#E5E7EB' : out ? '#FECACA' : '#BBF7D0'}` }}>
            <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 600, marginBottom: '0.15rem' }}>{label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: value === null ? '#D1D5DB' : out ? '#DC2626' : '#16A34A' }}>
                {value !== null ? `${value} ${unit}` : '—'}
            </div>
            {out && <div style={{ fontSize: '0.6rem', color: '#DC2626', fontWeight: 700 }}>⚠️ Ngoài tiêu chuẩn</div>}
        </div>
    )
}

export default function ReportsPage() {
    const params = useParams()
    const router = useRouter()
    const siteId = params.site as string
    const siteColor = SITE_COLORS[siteId] ?? '#E30613'
    const siteName = SITE_NAMES[siteId] ?? 'Site'

    const [assessments, setAssessments] = useState<AssessmentRow[]>([])
    const [paramLogs, setParamLogs] = useState<ParamLog[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'params'>('daily')

    const supabase = createClient()
    const now = new Date()

    useEffect(() => {
        async function load() {
            setLoading(true)
            const { data: siteRow } = await supabase.from('sites').select('id').eq('code', siteId).single()
            if (!siteRow) { setLoading(false); return }

            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

            // Assessments
            const { data: asmts } = await supabase
                .from('assessment_scores')
                .select('id, assessment_date, assessment_type, status, assessor_name, score_pct')
                .eq('site_id', siteRow.id)
                .gte('assessment_date', thirtyDaysAgo)
                .order('assessment_date', { ascending: false })

            if (asmts) {
                setAssessments(asmts.map((a: any) => ({
                    id: a.id,
                    assessment_date: a.assessment_date,
                    assessment_type: a.assessment_type,
                    status: a.status,
                    overall_score: a.score_pct,
                    assessor_name: a.assessor_name,
                })))
            }

            // Parameter logs
            const { data: plogs } = await supabase
                .from('parameter_logs')
                .select('log_date, ph_in, ph_out, do_mbbr, sv30_ml, mlss_mg_l, flow_out_m3, electricity_kwh, notes')
                .eq('site_id', siteRow.id)
                .gte('log_date', thirtyDaysAgo)
                .order('log_date', { ascending: false })
            if (plogs) setParamLogs(plogs)

            setLoading(false)
        }
        load()
    }, [siteId])

    const dailyAssessments = assessments.filter(a => a.assessment_type === 'daily')
    const monthlyAssessments = assessments.filter(a => a.assessment_type === 'monthly')

    function scoreColor(s: number | null) {
        if (s === null) return '#9CA3AF'
        return s >= 85 ? '#16A34A' : s >= 70 ? '#D97706' : '#DC2626'
    }
    function scoreBg(s: number | null) {
        if (s === null) return '#F9FAFB'
        return s >= 85 ? '#F0FDF4' : s >= 70 ? '#FFFBEB' : '#FEF2F2'
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif', paddingBottom: '2rem' }}>

            <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.875rem' }}>
                    <button onClick={() => router.back()} style={{ border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#6B7280' }}>←</button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Báo cáo & Lịch sử</h1>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{siteName} · 30 ngày gần nhất</p>
                    </div>
                    <span style={{ backgroundColor: siteColor, color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>{siteName}</span>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {([
                        ['daily', `📋 Nhật ký (${dailyAssessments.length})`],
                        ['monthly', `📊 Tháng (${monthlyAssessments.length})`],
                        ['params', `🔬 Thông số (${paramLogs.length})`],
                    ] as const).map(([tab, label]) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            flex: 1, padding: '0.45rem 0.25rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600,
                            border: `1.5px solid ${activeTab === tab ? siteColor : '#E5E7EB'}`,
                            backgroundColor: activeTab === tab ? siteColor : 'white',
                            color: activeTab === tab ? 'white' : '#6B7280', cursor: 'pointer',
                        }}>
                            {label}
                        </button>
                    ))}
                </div>
            </header>

            <main style={{ padding: '1rem', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>⏳ Đang tải...</div>
                ) : activeTab === 'daily' ? (
                    dailyAssessments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                            <div style={{ fontSize: '2rem' }}>📋</div>
                            <p style={{ marginTop: '0.5rem' }}>Chưa có nhật ký nào trong 30 ngày qua</p>
                        </div>
                    ) : dailyAssessments.map(a => (
                        <div key={a.id} style={{ backgroundColor: scoreBg(a.overall_score), borderRadius: '12px', padding: '1rem', border: `1px solid ${a.overall_score !== null && a.overall_score < 70 ? '#FECACA' : '#E5E7EB'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                                    Nhật ký vận hành
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.15rem' }}>
                                    {new Date(a.assessment_date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    {' · '}{a.assessor_name}
                                </p>
                                <span style={{ fontSize: '0.65rem', backgroundColor: a.status === 'approved' ? '#D1FAE5' : '#E0E7FF', color: a.status === 'approved' ? '#065F46' : '#3730A3', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600, marginTop: '0.25rem', display: 'inline-block' }}>
                                    {a.status === 'approved' ? 'Đã duyệt' : a.status === 'submitted' ? 'Đã nộp' : 'Nháp'}
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: scoreColor(a.overall_score) }}>
                                    {a.overall_score !== null ? `${a.overall_score}%` : '—'}
                                </span>
                            </div>
                        </div>
                    ))
                ) : activeTab === 'monthly' ? (
                    monthlyAssessments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                            <div style={{ fontSize: '2rem' }}>📊</div>
                            <p style={{ marginTop: '0.5rem' }}>Chưa có đánh giá tháng nào</p>
                            <button onClick={() => router.push(`/${siteId}/manager`)} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: siteColor, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                                Bắt đầu đánh giá tháng
                            </button>
                        </div>
                    ) : monthlyAssessments.map(a => (
                        <div key={a.id} style={{ backgroundColor: scoreBg(a.overall_score), borderRadius: '12px', padding: '1rem', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>Đánh giá tháng</p>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.15rem' }}>
                                    {new Date(a.assessment_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    {' · '}{a.assessor_name}
                                </p>
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: scoreColor(a.overall_score) }}>
                                {a.overall_score !== null ? `${a.overall_score}%` : '—'}
                            </span>
                        </div>
                    ))
                ) : (
                    /* PARAMS TAB */
                    paramLogs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                            <div style={{ fontSize: '2rem' }}>🔬</div>
                            <p style={{ marginTop: '0.5rem' }}>Chưa có nhật ký thông số nào</p>
                        </div>
                    ) : paramLogs.map(log => {
                        const hasOutOfRange = (
                            isOut('ph_out', log.ph_out) || isOut('do_mbbr', log.do_mbbr) ||
                            isOut('sv30_ml', log.sv30_ml) || isOut('flow_out_m3', log.flow_out_m3)
                        )
                        return (
                            <div key={log.log_date} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '1rem', border: hasOutOfRange ? '1px solid #FECACA' : '1px solid #E5E7EB' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                                        {new Date(log.log_date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </p>
                                    {hasOutOfRange && (
                                        <span style={{ fontSize: '0.7rem', backgroundColor: '#FEF2F2', color: '#DC2626', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
                                            ⚠️ Ngoài tiêu chuẩn
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    <ParamCell label="pH đầu ra" value={log.ph_out} unit="" fieldKey="ph_out" />
                                    <ParamCell label="DO MBBR" value={log.do_mbbr} unit="mg/L" fieldKey="do_mbbr" />
                                    <ParamCell label="SV30" value={log.sv30_ml} unit="ml/L" fieldKey="sv30_ml" />
                                    <ParamCell label="MLSS" value={log.mlss_mg_l} unit="mg/L" fieldKey="mlss_mg_l" />
                                    <ParamCell label="Lưu lượng" value={log.flow_out_m3} unit="m³" fieldKey="flow_out_m3" />
                                    <ParamCell label="Điện kế" value={log.electricity_kwh} unit="kWh" fieldKey="electricity_kwh" />
                                </div>
                                {log.notes && (
                                    <div style={{ marginTop: '0.625rem', padding: '0.5rem 0.75rem', backgroundColor: '#FFFBEB', borderRadius: '8px', fontSize: '0.78rem', color: '#B45309' }}>
                                        📝 {log.notes}
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </main>
        </div>
    )
}
