import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
    title: 'VICC WWT Self-Assessment',
    description: 'Hệ thống đánh giá vận hành nước thải cho 3 nhà máy VICC',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi">
            <head>
                {/* Inter font for body text */}
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                {/* Caveat font for Intersnack style script text */}
                <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet" />
            </head>
            <body>{children}</body>
        </html>
    )
}
