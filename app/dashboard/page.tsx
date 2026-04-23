'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    ResponsiveContainer, Legend, Tooltip,
} from 'recharts'

// ─── Mock Data ──────────────────────────────────────────────────────────────
const SITES = [
    { id: 'all', label: 'Tổng hợp', color: '#1C2026' },
    { id: 'long-an', label: 'Long An', color: '#E30613' },
    { id: 'tay-ninh', label: 'Tây Ninh', color: '#F39200' },
    { id: 'phan-thiet', label: 'Phan Thiết', color: '#0072B5' },
]

const SITE_DATA: Record<string, { score: number; keas: KEA[]; missing: string; capa: number }> = {
    'long-an': {
        score: 87,
        missing: 'Ca 2 hôm nay',
        capa: 2,
        keas: [
            { id: 'I', name: 'Hệ thống quản lý', score: 86, yes: 6, total: 7, freq: 'monthly' },
            { id: 'II', name: 'Thiết bị & Hoá chất', score: 100, yes: 8, total: 8, freq: 'daily' },
            { id: 'III', name: 'An toàn & PPE', score: 100, yes: 9, total: 9, freq: 'daily' },
            { id: 'IV', name: 'Giám sát chỉ tiêu', score: 78, yes: 7, total: 9, freq: 'daily' },
            { id: 'V', name: 'Hồ sơ & Đào tạo', score: 86, yes: 6, total: 7, freq: 'monthly' },
            { id: 'VI', name: 'KPI & Cải tiến', score: 89, yes: 8, total: 9, freq: 'monthly' },
        ],
    },
    'tay-ninh': {
        score: 79,
        missing: 'Ca 2 + Ca 3',
        capa: 4,
        keas: [
            { id: 'I', name: 'Hệ thống quản lý', score: 71, yes: 5, total: 7, freq: 'monthly' },
            { id: 'II', name: 'Thiết bị & Hoá chất', score: 88, yes: 7, total: 8, freq: 'daily' },
            { id: 'III', name: 'An toàn & PPE', score: 89, yes: 8, total: 9, freq: 'daily' },
            { id: 'IV', name: 'Giám sát chỉ tiêu', score: 67, yes: 6, total: 9, freq: 'daily' },
            { id: 'V', name: 'Hồ sơ & Đào tạo', score: 71, yes: 5, total: 7, freq: 'monthly' },
            { id: 'VI', name: 'KPI & Cải tiến', score: 78, yes: 7, total: 9, freq: 'monthly' },
        ],
    },
    'phan-thiet': {
        score: 93,
        missing: 'Không',
        capa: 1,
        keas: [
            { id: 'I', name: 'Hệ thống quản lý', score: 100, yes: 7, total: 7, freq: 'monthly' },
            { id: 'II', name: 'Thiết bị & Hoá chất', score: 100, yes: 8, total: 8, freq: 'daily' },
            { id: 'III', name: 'An toàn & PPE', score: 89, yes: 8, total: 9, freq: 'daily' },
            { id: 'IV', name: 'Giám sát chỉ tiêu', score: 89, yes: 8, total: 9, freq: 'daily' },
            { id: 'V', name: 'Hồ sơ & Đào tạo', score: 86, yes: 6, total: 7, freq: 'monthly' },
            { id: 'VI', name: 'KPI & Cải tiến', score: 89, yes: 8, total: 9, freq: 'monthly' },
        ],
    },
}
type KEA = { id: string; name: string; score: number; yes: number; total: number; freq: string }

function scoreColor(score: number) {
    if (score >= 85) return '#16A34A'
    if (score >= 70) return '#D97706'
    return '#DC2626'
}
function scoreBg(score: number) {
    if (score >= 85) return '#F0FDF4'
    if (score >= 70) return '#FFFBEB'
    return '#FEF2F2'
}
function scoreLabel(score: number) {
    if (score >= 85) return '✅ Đạt'
    if (score >= 70) return '⚠️ Cần cải thiện'
    return '❌ Không đạt'
}

// ─── Single Site Radar Chart ────────────────────────────────────────────────
function SiteRadarChart({ keas, color }: { keas: KEA[]; color: string }) {
    const data = keas.map(k => ({
        subject: `KEA ${k.id}`,
        score: k.score,
        fullMark: 100,
    }))
    return (
        <div style={{
            backgroundColor: 'white', borderRadius: '20px',
            border: '1px solid #E5E7EB', padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#374151' }}>Bản đồ KEA</h2>
                <span style={{
                    fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                    borderRadius: '999px', backgroundColor: `${color}15`, color,
                }}>Radar Chart</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={data} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 11, fontWeight: 700, fill: '#6B7280' }}
                    />
                    <Radar
                        name="Điểm" dataKey="score"
                        stroke={color} strokeWidth={2.5}
                        fill={color} fillOpacity={0.20}
                        dot={{ r: 4, fill: color, strokeWidth: 0 }}
                    />
                    <Tooltip
                        formatter={(v: number) => [`${v}%`, 'Điểm']}
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', fontSize: '0.8rem' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
            {/* Legend dots */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginTop: '0.25rem', justifyContent: 'center' }}>
                {keas.map(k => (
                    <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: '#6B7280' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: k.score >= 85 ? '#16A34A' : k.score >= 70 ? '#D97706' : '#DC2626', display: 'inline-block' }} />
                        <span>{k.name}</span>
                        <span style={{ fontWeight: 700, color: k.score >= 85 ? '#16A34A' : k.score >= 70 ? '#D97706' : '#DC2626' }}>{k.score}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── All-Sites Radar Chart ────────────────────────────────────────────────────
const KEA_LABELS = ['Hệ thống\nQL', 'Thiết bị &\nHoá chất', 'An toàn\n& PPE', 'Giám sát\nchỉ tiêu', 'Hồ sơ &\nĐào tạo', 'KPI &\nCải tiến']

function AllSitesRadarChart() {
    const keaCount = SITE_DATA['long-an'].keas.length
    const data = Array.from({ length: keaCount }, (_, i) => ({
        subject: `KEA ${ROMAN[i]}`,
        label: KEA_LABELS[i],
        'Long An': SITE_DATA['long-an'].keas[i].score,
        'Tây Ninh': SITE_DATA['tay-ninh'].keas[i].score,
        'Phan Thiết': SITE_DATA['phan-thiet'].keas[i].score,
        fullMark: 100,
    }))
    return (
        <div style={{
            backgroundColor: 'white', borderRadius: '20px',
            border: '1px solid #E5E7EB', padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#374151' }}>So sánh KEA — 3 nhà máy</h2>
                <span style={{
                    fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                    borderRadius: '999px', backgroundColor: '#F3F4F6', color: '#374151',
                }}>Radar Overlay</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 11, fontWeight: 700, fill: '#374151' }}
                    />
                    <Radar name="Long An" dataKey="Long An"
                        stroke="#E30613" strokeWidth={2} fill="#E30613" fillOpacity={0.10}
                        dot={{ r: 3.5, fill: '#E30613', strokeWidth: 0 }} />
                    <Radar name="Tây Ninh" dataKey="Tây Ninh"
                        stroke="#F39200" strokeWidth={2} fill="#F39200" fillOpacity={0.10}
                        dot={{ r: 3.5, fill: '#F39200', strokeWidth: 0 }} />
                    <Radar name="Phan Thiết" dataKey="Phan Thiết"
                        stroke="#0072B5" strokeWidth={2} fill="#0072B5" fillOpacity={0.10}
                        dot={{ r: 3.5, fill: '#0072B5', strokeWidth: 0 }} />
                    <Legend
                        wrapperStyle={{ fontSize: '0.8rem', fontWeight: 600, paddingTop: '8px' }}
                        formatter={(value, entry: any) => (
                            <span style={{ color: entry.color }}>{value}</span>
                        )}
                    />
                    <Tooltip
                        formatter={(v: number, name: string) => [`${v}%`, name]}
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', fontSize: '0.8rem' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI']

// ─── KEA Card Component ───────────────────────────────────────────────────────
function KeaCard({ kea, siteColor }: { kea: KEA; siteColor: string }) {
    const [open, setOpen] = useState(false)
    const pct = kea.score
    const color = scoreColor(pct)
    const bg = scoreBg(pct)
    return (
        <div onClick={() => setOpen(!open)} style={{
            backgroundColor: 'white', borderRadius: '16px', border: `1px solid #E5E7EB`,
            overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s',
            boxShadow: open ? '0 4px 20px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.06)',
        }}>
            {/* Card Header */}
            <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* KEA Badge */}
                <div style={{
                    minWidth: '44px', height: '44px', borderRadius: '12px',
                    backgroundColor: siteColor, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.875rem',
                }}>
                    {kea.id}
                </div>

                {/* Name & Progress */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {kea.name}
                        </p>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color, marginLeft: '1rem' }}>{pct}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
                    </div>
                </div>

                {/* Chevron */}
                <span style={{ color: '#9CA3AF', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
            </div>

            {/* Expanded Detail */}
            {open && (
                <div style={{ backgroundColor: bg, padding: '1rem 1.25rem', borderTop: `1px solid ${color}33` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{kea.yes}</div>
                            <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600 }}>ĐẠT</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6B7280' }}>{kea.total - kea.yes}</div>
                            <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600 }}>KHÔNG ĐẠT</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C2026' }}>{kea.total}</div>
                            <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600 }}>TỔNG</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', backgroundColor: kea.freq === 'daily' ? '#EDE9FE' : '#DBEAFE', color: kea.freq === 'daily' ? '#7C3AED' : '#1D4ED8', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                            {kea.freq === 'daily' ? '🔄 Hàng ngày' : '📅 Hàng tháng'}
                        </span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color }}>{scoreLabel(pct)}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Single Site View ─────────────────────────────────────────────────────────
function SiteView({ siteId }: { siteId: string }) {
    const site = SITES.find(s => s.id === siteId)!
    const data = SITE_DATA[siteId]
    const color = site.color
    const avg = data.score

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Score Hero */}
            <div style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                borderRadius: '20px', padding: '2rem',
                color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div>
                    <p style={{ fontSize: '0.875rem', opacity: 0.85, fontWeight: 600, marginBottom: '0.5rem' }}>
                        ĐIỂM TUÂN THỦ THÁNG 4/2026
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>{avg}</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 600, opacity: 0.8 }}>/100</span>
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.9 }}>
                        {avg >= 85 ? '✅ Đạt tiêu chuẩn vận hành' : avg >= 70 ? '⚠️ Cần cải thiện' : '❌ Không đạt — Cần hành động ngay'}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    {/* Circular indicator */}
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        border: '8px solid rgba(255,255,255,0.3)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                    }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: 900 }}>{avg}%</span>
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.8 }}>49 hạng mục</p>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16A34A' }}>
                        {data.keas.filter(k => k.score >= 85).length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>KEA Đạt</div>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626' }}>{data.capa}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>CAPAs mở</div>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: data.missing === 'Không' ? '#16A34A' : '#D97706' }}>
                        {data.missing === 'Không' ? '✓' : '!'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>
                        {data.missing === 'Không' ? 'Đủ báo cáo' : 'Missing ca'}
                    </div>
                </div>
            </div>

            {/* Radar Chart */}
            <SiteRadarChart keas={data.keas} color={color} />

            {/* KEA List */}
            <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem', color: '#374151' }}>
                    Kết quả theo KEA (Key Evaluation Area)
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {data.keas.map(kea => (
                        <KeaCard key={kea.id} kea={kea} siteColor={color} />
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── All Sites Overview ───────────────────────────────────────────────────────
function AllSitesView({ onSelect }: { onSelect: (id: string) => void }) {
    type SiteId = 'long-an' | 'tay-ninh' | 'phan-thiet'
    const activeSites: SiteId[] = ['long-an', 'tay-ninh', 'phan-thiet']
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top bar: 3 sites */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {activeSites.map(sid => {
                    const site = SITES.find(s => s.id === sid)!
                    const data = SITE_DATA[sid]
                    const color = site.color
                    return (
                        <div key={sid} onClick={() => onSelect(sid)} style={{
                            backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem',
                            borderTop: `6px solid ${color}`, cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                        }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {site.label}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '0.5rem 0' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 900, color: scoreColor(data.score) }}>{data.score}</span>
                                <span style={{ fontSize: '1.25rem', color: '#9CA3AF' }}>%</span>
                            </div>
                            {/* mini bar */}
                            <div style={{ height: '8px', backgroundColor: '#F3F4F6', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                <div style={{ height: '100%', width: `${data.score}%`, backgroundColor: scoreColor(data.score), borderRadius: '999px' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B7280' }}>
                                <span>{data.keas.filter(k => k.score >= 85).length}/6 KEA đạt</span>
                                <span style={{ color: scoreColor(data.score), fontWeight: 600 }}>{scoreLabel(data.score)}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* All-Sites Radar Chart */}
            <AllSitesRadarChart />

            {/* Summary Table: KEA by Site */}
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>
                    So sánh KEA giữa 3 nhà máy
                </h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#F9FAFB' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700, whiteSpace: 'nowrap' }}>KEA</th>
                                {activeSites.map(sid => (
                                    <th key={sid} style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700, color: SITES.find(s => s.id === sid)!.color }}>
                                        {SITES.find(s => s.id === sid)!.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {SITE_DATA['long-an'].keas.map((kea, i) => (
                                <tr key={kea.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                                        <span style={{ display: 'inline-block', minWidth: '26px', fontWeight: 700, color: '#6B7280' }}>{kea.id}</span>
                                        {' '}{kea.name}
                                    </td>
                                    {activeSites.map(sid => {
                                        const s = SITE_DATA[sid as SiteId].keas[i].score
                                        return (
                                            <td key={sid} style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block', minWidth: '52px',
                                                    padding: '0.25rem 0.6rem', borderRadius: '8px',
                                                    backgroundColor: scoreBg(s), color: scoreColor(s), fontWeight: 700,
                                                }}>
                                                    {s}%
                                                </span>
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                            {/* Average row */}
                            <tr style={{ borderTop: '2px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                                <td style={{ padding: '0.75rem', fontWeight: 800, color: '#1C2026' }}>TỔNG</td>
                                {activeSites.map(sid => {
                                    const s = SITE_DATA[sid as SiteId].score
                                    return (
                                        <td key={sid} style={{ padding: '0.75rem', textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-block', minWidth: '52px',
                                                padding: '0.25rem 0.6rem', borderRadius: '8px',
                                                backgroundColor: scoreBg(s), color: scoreColor(s), fontWeight: 800, fontSize: '1rem',
                                            }}>
                                                {s}%
                                            </span>
                                        </td>
                                    )
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CombinedDashboard() {
    const [activeSite, setActiveSite] = useState('all')
    const router = useRouter()
    const currentSite = SITES.find(s => s.id === activeSite)!

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
            {/* ── Top Header ── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 20,
                backgroundColor: 'white', borderBottom: '1px solid #E5E7EB',
                padding: '0.75rem 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '36px', height: '36px', backgroundColor: '#E30613', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 900, fontSize: '1.1rem',
                    }}>V</div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.1 }}>VICC Group</div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600 }}>WWT Self-Assessment · Tháng 4/2026</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                        onClick={() => router.push('/long-an/operator')}
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', cursor: 'pointer', fontWeight: 600 }}
                    >
                        + Đánh giá mới
                    </button>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>👤</div>
                </div>
            </header>

            {/* ── Site Switcher Tabs ── */}
            <div style={{
                position: 'sticky', top: '61px', zIndex: 10,
                backgroundColor: 'white', borderBottom: '1px solid #E5E7EB',
                padding: '0 1.5rem',
                display: 'flex', gap: '0', overflowX: 'auto',
            }}>
                {SITES.map(site => {
                    const active = activeSite === site.id
                    return (
                        <button
                            key={site.id}
                            onClick={() => setActiveSite(site.id)}
                            style={{
                                padding: '0.875rem 1.25rem',
                                fontWeight: 700, fontSize: '0.875rem',
                                border: 'none', borderBottom: active ? `3px solid ${site.color}` : '3px solid transparent',
                                backgroundColor: 'transparent',
                                color: active ? site.color : '#6B7280',
                                cursor: 'pointer', whiteSpace: 'nowrap',
                                transition: 'color 0.2s, border-color 0.2s',
                            }}
                        >
                            {site.id !== 'all' && (
                                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: site.color, marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            )}
                            {site.label}
                        </button>
                    )
                })}
            </div>

            {/* ── Content ── */}
            <main style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
                {activeSite === 'all'
                    ? <AllSitesView onSelect={setActiveSite} />
                    : <SiteView siteId={activeSite} />
                }
            </main>
        </div>
    )
}
