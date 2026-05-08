'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'vi' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  vi: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.operator': 'Nhật Ký Vận Hành',
    'nav.manager': 'Đánh Giá Tháng',
    'nav.reports': 'Báo Cáo & Lịch Sử',
    'nav.logout': 'Đăng xuất',

    // Dashboard
    'dashboard.welcome': 'VICC Group',
    'dashboard.subtitle': 'WWT Dashboard',
    'dashboard.compliance': 'Tuân thủ',
    'dashboard.complianceShort': 'Tuân thủ',
    'dashboard.openCapas': 'CAPAs mở',
    'dashboard.sites': 'Nhà máy',
    'dashboard.viewDetails': 'Xem chi tiết',
    'dashboard.dailyLog': 'Nhật ký',
    'dashboard.averageScore': 'điểm TB',
    'dashboard.thisMonth': 'Tháng này',
    'dashboard.needImprovement': 'Cần cải thiện',
    'dashboard.notPass': 'Không đạt',
    'dashboard.passed': 'Đạt',
    'dashboard.progress': 'Tỉ lệ nộp nhật ký tháng này',
    'dashboard.submit': 'Nộp Nhật Ký',
    'dashboard.itemsCompleted': 'hạng mục đã trả lời',
    'dashboard.recentSubmit': 'Nộp gần nhất:',
    'dashboard.noLogsThisMonth': 'Chưa có nhật ký tháng này',
    'dashboard.watching': 'Đang theo dõi',
    'dashboard.submitted': 'Đã nộp',

    // Operator
    'operator.title': 'Nhật Ký Vận Hành',
    'operator.checklist': '📋 Kiểm tra',
    'operator.params': '📊 Thông số',
    'operator.yes': '✓ ĐẠT',
    'operator.no': '✕ KHÔNG',
    'operator.na': 'N/A',
    'operator.submitDaily': '📤 Nộp Nhật Ký',
    'operator.cancel': 'Hủy',
    'operator.itemsAnswered': 'hạng mục đã trả lời',
    'operator.filledParams': 'thông số đã điền',
    'operator.outOfRangeCount': 'thông số ngoài tiêu chuẩn',
    'operator.checkReport': 'cần kiểm tra!',
    'operator.successSubmit': 'Đã nộp thành công!',
    'operator.redirecting': 'Đang chuyển về Dashboard...',
    'operator.alreadySubmitted': 'Đã nộp báo cáo hôm nay',
    'operator.submittedToday': 'Nhật ký vận hành ngày',
    'operator.goToDashboard': 'Xem Dashboard',
    'operator.noteAction': '⚠️ Ghi chú / Hành động khắc phục',
    'operator.describeProblem': 'Mô tả vấn đề và cách khắc phục...',
    'operator.weeklyNote': 'Đo ít nhất 1 lần/tuần — ghi khi có kết quả',

    // Manager
    'manager.title': 'Đánh Giá Tháng — Manager/HSE',
    'manager.monthlyAssessment': '📊 Tháng',
    'manager.items': 'hạng mục',
    'manager.complete': '✓ Xong',
    'manager.notDone': 'Chưa làm',
    'manager.score': 'Điểm',
    'manager.commentTitle': '📝 Nhận xét tổng quan của Manager',
    'manager.commentPlaceholder': 'Nhận xét tình hình vận hành tháng này, định hướng cải tiến...',
    'manager.submitAssessment': '📤 Nộp Đánh Giá Tháng',
    'manager.successSubmit': 'Đã nộp thành công!',
    'manager.monthlyScore': 'Điểm tháng',

    // Reports page
    'reports.title': 'Báo cáo & Lịch sử',
    'reports.last30Days': '30 ngày gần nhất',
    'reports.dailyLog': 'Nhật ký',
    'reports.monthly': '📊 Tháng',
    'reports.parameters': '🔬 Thông số',
    'reports.noDaily': 'Chưa có nhật ký nào trong 30 ngày qua',
    'reports.noMonthly': 'Chưa có đánh giá tháng nào',
    'reports.startAssessment': 'Bắt đầu đánh giá tháng',
    'reports.noParams': 'Chưa có nhật ký thông số nào',
    'reports.standard': '— Tiêu chuẩn',
    'reports.outOfRange': '⚠️ Ngoài tiêu chuẩn',

    // Login page
    'login.title': 'VICC WWT',
    'login.subtitle': 'Hệ thống quản lý xử lý nước thải',
    'login.header': 'Đăng nhập',
    'login.email': 'Email',
    'login.password': 'Mật khẩu',
    'login.button': 'Đăng nhập',
    'login.loading': '⏳ Đang đăng nhập...',
    'login.error': 'Email hoặc mật khẩu không đúng',
    'login.connectionError': 'Lỗi kết nối. Vui lòng thử lại.',
    'login.footer': 'VICC Group · WWT Management System · ISO 14001',
    'login.emailPlaceholder': 'nhanvien@vicc.com',
    'login.passwordPlaceholder': '••••••••',

    // Common
    'common.loading': 'Đang tải...',
    'common.cancel': 'Hủy',
    'common.submit': 'Nộp',
    'common.save': 'Lưu',
    'common.delete': 'Xóa',
    'common.edit': 'Sửa',
    'common.view': 'Xem',
    'common.close': 'Đóng',
    'common.confirm': 'Xác nhận',
    'common.back': '←',
    'common.noData': 'Không có dữ liệu',
    'common.error': 'Lỗi',
    'common.success': 'Thành công',
    'common.watching': 'Đang theo dõi',
    'common.needImprovement': 'Cần xử lý',

    // Params labels
    'params.phIn': 'Influent pH',
    'params.phOut': 'Effluent pH',
    'params.doMBBR': 'MBBR DO',
    'params.sv30': 'SV30',
    'params.svi': 'SVI',
    'params.mlss': 'MLSS',
    'params.codOut': 'Effluent COD',
    'params.nh4Out': 'Effluent NH₄⁺',
    'params.flowOut': 'Effluent Flow',
    'params.electricity': 'Electricity meter',
    'params.notes': 'Incident notes',
    'params.notesPlaceholder': 'Record abnormal incidents, equipment conditions, or operational notes...',
    'params.standard': 'Standard',
    'params.unitPh': '',
    'params.unitMgL': 'mg/L',
    'params.unitM3Day': 'm³/day',
    'params.unitKwh': 'kWh',
    'params.standardPh': '5.5–9.0',
    'params.standardDo': '1.5–2.5',
    'params.standardSv30': '300–700',
    'params.standardSvi': '≤150',
    'params.standardMlss': '2500–3500',
    'params.standardCod': '≤150',
    'params.standardNh4': '≤10',
    'params.standardFlow': '≤70',

    // Status labels
    'status.draft': 'Nháp',
    'status.submitted': 'Đã nộp',
    'status.approved': 'Đã duyệt',
    'status.completed': '✓ Xong',

    // Guidelines
    'guideline.standard': 'Tiêu chuẩn QCVN 40:2011/Cột B',
    'guideline.violation': '🚨 Cảnh báo vượt tiêu chuẩn',
    'guideline.reportHSE': '→ Báo cáo ngay cho HSE và lập biên bản trong vòng 2 giờ!',

    // Maintenance banner
    'maintenance.title': 'Thông báo bảo trì',
    'maintenance.message': 'Hệ thống đang được nâng cấp. Một số tính năng có thể không hoạt động. Xin lỗi vì sự bất tiện này.',
    'maintenance.close': 'Đóng',

    // Demo mode
    'demo.button': 'Test Demo',
    'demo.title': 'Chế độ Demo',
    'demo.message': 'Bạn đang ở chế độ Demo. Dữ liệu chỉ mang tính minh họa.',

    // Site names
    'site.longAn': 'Long An',
    'site.tayNinh': 'Tây Ninh',
    'site.phanThiet': 'Phan Thiết',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.operator': 'Daily Log',
    'nav.manager': 'Monthly Assessment',
    'nav.reports': 'Reports & History',
    'nav.logout': 'Logout',

    // Dashboard
    'dashboard.welcome': 'VICC Group',
    'dashboard.subtitle': 'WWT Dashboard',
    'dashboard.compliance': 'Compliance',
    'dashboard.complianceShort': 'Comp',
    'dashboard.openCapas': 'Open CAPAs',
    'dashboard.sites': 'Sites',
    'dashboard.viewDetails': 'View Details',
    'dashboard.dailyLog': 'Daily Log',
    'dashboard.averageScore': 'avg score',
    'dashboard.thisMonth': 'This month',
    'dashboard.needImprovement': 'Needs improvement',
    'dashboard.notPass': 'Not passed',
    'dashboard.passed': 'Passed',
    'dashboard.progress': 'Monthly log submission rate',
    'dashboard.submit': 'Submit Daily Log',
    'dashboard.itemsCompleted': 'items answered',
    'dashboard.recentSubmit': 'Last submitted:',
    'dashboard.noLogsThisMonth': 'No logs this month',
    'dashboard.watching': 'Watching',
    'dashboard.submitted': 'Submitted',

    // Operator
    'operator.title': 'Daily Operating Log',
    'operator.checklist': '📋 Checklist',
    'operator.params': '📊 Parameters',
    'operator.yes': '✓ PASS',
    'operator.no': '✕ FAIL',
    'operator.na': 'N/A',
    'operator.submitDaily': '📤 Submit Daily Log',
    'operator.cancel': 'Cancel',
    'operator.itemsAnswered': 'items answered',
    'operator.filledParams': 'params filled',
    'operator.outOfRangeCount': 'parameters out of standard',
    'operator.checkReport': 'check required!',
    'operator.successSubmit': 'Submitted successfully!',
    'operator.redirecting': 'Redirecting to Dashboard...',
    'operator.alreadySubmitted': 'Daily report already submitted',
    'operator.submittedToday': 'Daily operating log for',
    'operator.goToDashboard': 'Go to Dashboard',
    'operator.noteAction': '⚠️ Notes / Corrective Action',
    'operator.describeProblem': 'Describe the issue and how to fix it...',
    'operator.weeklyNote': 'Measure at least once per week — enter when available',

    // Manager
    'manager.title': 'Monthly Assessment — Manager/HSE',
    'manager.monthlyAssessment': '📊 Monthly',
    'manager.items': 'items',
    'manager.complete': '✓ Done',
    'manager.notDone': 'Not done',
    'manager.score': 'Score',
    'manager.commentTitle': '📝 Manager\'s Overall Comments',
    'manager.commentPlaceholder': 'Overall comments on this month\'s operations, improvement directions...',
    'manager.submitAssessment': '📤 Submit Monthly Assessment',
    'manager.successSubmit': 'Submitted successfully!',
    'manager.monthlyScore': 'Monthly score',

    // Reports page
    'reports.title': 'Reports & History',
    'reports.last30Days': 'Last 30 days',
    'reports.dailyLog': 'Daily Logs',
    'reports.monthly': '📊 Monthly',
    'reports.parameters': '🔬 Parameters',
    'reports.noDaily': 'No daily logs in the last 30 days',
    'reports.noMonthly': 'No monthly assessments yet',
    'reports.startAssessment': 'Start Monthly Assessment',
    'reports.noParams': 'No parameter logs yet',
    'reports.standard': '— Standard',
    'reports.outOfRange': '⚠️ Out of standard',

    // Login page
    'login.title': 'VICC WWT',
    'login.subtitle': 'Wastewater Treatment Management System',
    'login.header': 'Login',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.loading': '⏳ Logging in...',
    'login.error': 'Invalid email or password',
    'login.connectionError': 'Connection error. Please try again.',
    'login.footer': 'VICC Group · WWT Management System · ISO 14001',
    'login.emailPlaceholder': 'employee@vicc.com',
    'login.passwordPlaceholder': '••••••••',

    // Common
    'common.loading': 'Loading...',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.back': '←',
    'common.noData': 'No data',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.watching': 'Watching',
    'common.needImprovement': 'Needs attention',

    // Params labels
    'params.phIn': 'Influent pH',
    'params.phOut': 'Effluent pH',
    'params.doMBBR': 'MBBR DO',
    'params.sv30': 'SV30',
    'params.svi': 'SVI',
    'params.mlss': 'MLSS',
    'params.codOut': 'Effluent COD',
    'params.nh4Out': 'Effluent NH₄⁺',
    'params.flowOut': 'Effluent Flow',
    'params.electricity': 'Electricity meter',
    'params.notes': 'Incident notes',
    'params.notesPlaceholder': 'Record abnormal incidents, equipment conditions, or operational notes...',
    'params.standard': 'Standard',
    'params.unitPh': '',
    'params.unitMgL': 'mg/L',
    'params.unitM3Day': 'm³/day',
    'params.unitKwh': 'kWh',
    'params.standardPh': '5.5–9.0',
    'params.standardDo': '1.5–2.5',
    'params.standardSv30': '300–700',
    'params.standardSvi': '≤150',
    'params.standardMlss': '2500–3500',
    'params.standardCod': '≤150',
    'params.standardNh4': '≤10',
    'params.standardFlow': '≤70',

    // Status labels
    'status.draft': 'Draft',
    'status.submitted': 'Submitted',
    'status.approved': 'Approved',
    'status.completed': '✓ Done',

    // Guidelines
    'guideline.standard': 'QCVN 40:2011/Column B Standard',
    'guideline.violation': '🚨 Standard violation',
    'guideline.reportHSE': '→ Report to HSE immediately and document within 2 hours!',

    // Maintenance banner
    'maintenance.title': 'Maintenance Notice',
    'maintenance.message': 'The system is currently being upgraded. Some features may be unavailable. We apologize for the inconvenience.',
    'maintenance.close': 'Close',

    // Demo mode
    'demo.button': 'Test Demo',
    'demo.title': 'Demo Mode',
    'demo.message': 'You are in Demo Mode. Data is for illustration purposes only.',

    // Site names
    'site.longAn': 'Long An',
    'site.tayNinh': 'Tây Ninh',
    'site.phanThiet': 'Phan Thiết',
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'vi' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.vi] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
