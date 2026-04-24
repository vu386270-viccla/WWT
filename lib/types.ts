// ==========================================
// VICC WWT App — TypeScript Types
// ==========================================

export type SiteCode = 'long-an' | 'tay-ninh' | 'phan-thiet'
export type UserRole = 'operator' | 'manager' | 'admin'
export type AssessmentType = 'daily' | 'monthly'
export type AssessmentStatus = 'draft' | 'submitted' | 'approved'
export type Answer = 'yes' | 'no' | 'na'
export type Frequency = 'daily' | 'monthly' | 'both'

export interface Site {
    id: string
    name: string
    code: SiteCode
    color_hex: string
}

export interface Profile {
    id: string
    full_name: string
    role: UserRole
    site_id: string | null
}

export interface KeaCategory {
    id: number
    code: string
    name_vi: string
    name_en: string
    weight: number
}

export interface ChecklistItem {
    id: number
    kea_id: number
    code: string
    question_vi: string
    question_en: string | null
    guideline_vi: string | null
    frequency: Frequency
    is_active: boolean
    sort_order: number
    kea?: KeaCategory
}

export interface Assessment {
    id: string
    site_id: string
    assessor_id: string
    assessment_date: string
    assessment_type: AssessmentType
    status: AssessmentStatus
    overall_score: number | null
    manager_comment: string | null
    approved_by: string | null
    approved_at: string | null
    created_at: string
    site?: Site
    assessor?: Profile
}

export interface AssessmentResponse {
    id: string
    assessment_id: string
    item_id: number
    answer: Answer | null
    comment: string | null
    required_action: string | null
    deadline: string | null
    item?: ChecklistItem
}

export interface ParameterLog {
    id: string
    site_id: string
    log_date: string
    logged_by: string
    // Thông số đo hàng ngày
    ph_in: number | null          // pH đầu vào
    ph_out: number | null         // pH đầu ra (5.5–9.0)
    do_mbbr: number | null        // DO bể MBBR mg/L (1.5–2.5)
    sv30_ml: number | null        // SV30 ml/L (300–700)
    svi_ml_g: number | null       // SVI ml/g (≤150)
    mlss_mg_l: number | null      // MLSS mg/L (2500–3500)
    cod_out: number | null        // COD đầu ra mg/L (≤150)
    nh4_out: number | null        // NH4+ đầu ra mg/L (≤10)
    flow_out_m3: number | null    // Lưu lượng đầu ra m³/ngày (≤70)
    electricity_kwh: number | null // Chỉ số điện kế kWh
    notes: string | null
    created_at: string
}

// View types
export interface AssessmentScore {
    id: string
    site_id: string
    site_name: string
    site_code: SiteCode
    color_hex: string
    assessment_date: string
    assessment_type: AssessmentType
    status: AssessmentStatus
    assessor_name: string
    yes_count: number
    no_count: number
    total_answered: number
    score_pct: number
}

export interface OpenCapa {
    id: string
    site_id: string
    site_name: string
    color_hex: string
    item_code: string
    question_vi: string
    required_action: string
    deadline: string
    assessment_date: string
    assessor_name: string
}

// Parameter thresholds (QCVN 40:2011 Cột B + vận hành)
export const PARAM_THRESHOLDS = {
    ph_in:         { min: 4, max: 12, label: 'pH đầu vào', unit: '' },
    ph_out:        { min: 5.5, max: 9.0, label: 'pH đầu ra', unit: '' },
    do_mbbr:       { min: 1.5, max: 2.5, label: 'DO bể MBBR', unit: 'mg/L' },
    sv30_ml:       { min: 300, max: 700, label: 'SV30', unit: 'ml/L' },
    svi_ml_g:      { min: 0, max: 150, label: 'SVI', unit: 'ml/g' },
    mlss_mg_l:     { min: 2500, max: 3500, label: 'MLSS', unit: 'mg/L' },
    cod_out:       { min: 0, max: 150, label: 'COD đầu ra', unit: 'mg/L' },
    nh4_out:       { min: 0, max: 10, label: 'NH₄⁺ đầu ra', unit: 'mg/L' },
    flow_out_m3:   { min: 0, max: 70, label: 'Lưu lượng đầu ra', unit: 'm³/ngày' },
    electricity_kwh: { min: 0, max: 99999, label: 'Chỉ số điện kế', unit: 'kWh' },
}

// Site config
export const SITES: Record<SiteCode, { name: string; color: string; distance: string }> = {
    'long-an':    { name: 'Long An',    color: '#E30613', distance: '67 km từ HCM' },
    'tay-ninh':   { name: 'Tây Ninh',   color: '#F39200', distance: '99 km từ HCM' },
    'phan-thiet': { name: 'Phan Thiết', color: '#0072B5', distance: '200 km từ HCM' },
}
