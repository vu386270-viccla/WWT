// ==========================================
// VICC WWT App — TypeScript Types
// ==========================================

export type SiteCode = 'long-an' | 'tay-ninh' | 'phan-thiet'
export type UserRole = 'operator' | 'manager' | 'admin'
export type AssessmentType = 'daily' | 'monthly'
export type AssessmentStatus = 'draft' | 'submitted' | 'approved'
export type Answer = 'yes' | 'no' | 'na'
export type Frequency = 'daily' | 'monthly' | 'both'
export type Shift = '1' | '2' | '3'

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
    // joined
    kea?: KeaCategory
}

export interface Assessment {
    id: string
    site_id: string
    assessor_id: string
    assessment_date: string
    assessment_type: AssessmentType
    shift: Shift | null
    status: AssessmentStatus
    overall_score: number | null
    manager_comment: string | null
    approved_by: string | null
    approved_at: string | null
    created_at: string
    // joined
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
    // joined
    item?: ChecklistItem
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
    shift: Shift | null
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

// Site config
export const SITES: Record<SiteCode, { name: string; color: string; distance: string }> = {
    'long-an': { name: 'Long An', color: '#E30613', distance: '67 km từ HCM' },
    'tay-ninh': { name: 'Tây Ninh', color: '#F39200', distance: '99 km từ HCM' },
    'phan-thiet': { name: 'Phan Thiết', color: '#0072B5', distance: '200 km từ HCM' },
}

export const SHIFTS: Record<Shift, string> = {
    '1': 'Ca 1 (6:00 – 14:00)',
    '2': 'Ca 2 (14:00 – 22:00)',
    '3': 'Ca 3 (22:00 – 6:00)',
}
