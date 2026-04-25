'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/client'

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

type KeaCategory = {
    id: number
    code: string
    name_vi: string
    name_en: string
}

type ChecklistItem = {
    id: number
    kea_id: number
    code: string
    question_vi: string
    guideline_vi: string | null
    frequency: 'daily' | 'monthly' | 'both'
    sort_order: number
}

const FREQ_LABELS: Record<string, { label: string; bg: string; color: string }> = {
    daily:   { label: 'Hàng ngày', bg: '#E0E7FF', color: '#4338CA' },
    monthly: { label: 'Hàng tháng', bg: '#FEF9C3', color: '#854D0E' },
    both:    { label: 'Ngày & Tháng', bg: '#DCFCE7', color: '#166534' },
}

export default function KeaDetailPage() {
    const params = useParams()
    const router = useRouter()
    const site = params.site as string
    const keaId = params.keaId as string

    const siteColor = SITE_COLORS[site] ?? '#E30613'
    const siteName = SITE_NAMES[site] ?? 'Site'

    const [kea, setKea] = useState<KeaCategory | null>(null)
    const [items, setItems] = useState<ChecklistItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            setLoading(true)
            setError(null)
            const supabase = createClient()

            const { data: keaData, error: keaErr } = await supabase
                .from('kea_categories')
                .select('id, code, name_vi, name_en')
                .eq('id', keaId)
                .single()

            if (keaErr || !keaData) {
                setError('Không tìm thấy KEA.')
                setLoading(false)
                return
            }
            setKea(keaData)

            const { data: itemsData, error: itemsErr } = await supabase
                .from('checklist_items')
                .select('id, kea_id, code, question_vi, guideline_vi, frequency, sort_order')
                .eq('kea_id', keaData.id)
                .order('sort_order')

            if (itemsErr) {
                setError('Không tải được danh sách câu hỏi.')
            } else {
                setItems(itemsData ?? [])
            }
            setLoading(false)
        }
        load()
    }, [keaId])

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', fontFamily: 'Inter, sans-serif', paddingBottom: '2rem' }}>

            {/* Header */}
            <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '0.875rem 1.25rem', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '700px', margin: '0 auto' }}>
                    <button
                        onClick={() => router.back()}
                        style={{ border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#6B7280', lineHeight: 1, padding: '0.25rem' }}
                    >
                        ←
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h1 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {kea ? `KEA ${kea.code} — ${kea.name_vi}` : `KEA #${keaId}`}
                        </h1>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>{siteName} Factory</p>
                    </div>
                    <div style={{ backgroundColor: siteColor, color: 'white', padding: '0.3rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                        {siteName}
                    </div>
                </div>
            </header>

            <main style={{ padding: '1rem', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                        <div style={{ fontSize: '2rem' }}>⏳</div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Đang tải...</p>
                    </div>
                )}

                {!loading && error && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', color: '#DC2626' }}>
                        {error}
                    </div>
                )}

                {!loading && kea && (
                    <>
                        {/* KEA Summary Card */}
                        <div style={{ backgroundColor: siteColor, color: 'white', borderRadius: '16px', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 800, backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '8px' }}>
                                    KEA {kea.code}
                                </span>
                                <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 600 }}>
                                    {items.length} hạng mục
                                </span>
                            </div>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{kea.name_vi}</h2>
                            {kea.name_en && (
                                <p style={{ fontSize: '0.8rem', opacity: 0.75, margin: 0 }}>{kea.name_en}</p>
                            )}
                        </div>

                        {/* Items */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6B7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Danh sách câu hỏi
                            </h3>

                            {items.length === 0 ? (
                                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#9CA3AF', border: '1px solid #E5E7EB' }}>
                                    Chưa có câu hỏi nào cho KEA này.
                                </div>
                            ) : (
                                items.map((item) => {
                                    const freq = FREQ_LABELS[item.frequency] ?? FREQ_LABELS.daily
                                    return (
                                        <div
                                            key={item.id}
                                            style={{ backgroundColor: 'white', borderRadius: '14px', padding: '1rem', border: '1px solid #E5E7EB', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}
                                        >
                                            {/* Code badge */}
                                            <div style={{ backgroundColor: '#F3F4F6', padding: '0.4rem 0.6rem', borderRadius: '8px', minWidth: '44px', textAlign: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#374151', flexShrink: 0, lineHeight: 1.2 }}>
                                                {item.code}
                                            </div>

                                            {/* Content */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', margin: '0 0 0.4rem', lineHeight: 1.4 }}>
                                                    {item.question_vi}
                                                </p>

                                                {item.guideline_vi && (
                                                    <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 0.5rem', lineHeight: 1.5 }}>
                                                        {item.guideline_vi}
                                                    </p>
                                                )}

                                                <span style={{ display: 'inline-block', fontSize: '0.7rem', backgroundColor: freq.bg, color: freq.color, padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                                                    {freq.label}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    )
}
