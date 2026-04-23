# VICC WWT Self-Assessment App

Ứng dụng đánh giá tự vận hành hệ thống xử lý nước thải (HTXLNT) cho 3 nhà máy VICC.

## 🏭 3 Sites
| Site | Màu | Khoảng cách |
|------|-----|-------------|
| Long An | 🔴 `#E30613` | 67 km từ HCM |
| Tây Ninh | 🟠 `#F39200` | 99 km từ HCM |
| Phan Thiết | 🔵 `#0072B5` | 200 km từ HCM |

## 👥 Roles
- **Operator (Nhân viên vận hành):** Đánh giá KEA 2, 3, 4 mỗi ca (6h-14h, 14h-22h, 22h-6h)
- **Manager / HSE:** Review KEA 1, 5, 6 hàng tháng + xem dashboard tổng hợp

## 🚀 Setup

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_ORG/vicc-wwt-app.git
cd vicc-wwt-app
npm install
```

### 2. Supabase Setup
1. Tạo project mới tại [supabase.com](https://supabase.com)
2. Chạy SQL files theo thứ tự:
   ```
   supabase/schema.sql       ← Tables, RLS, Views
   supabase/seed_checklist.sql  ← 49 câu hỏi checklist
   ```
3. Copy URL và anon key vào `.env.local`:
   ```bash
   cp .env.example .env.local
   # Điền NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

### 3. Tạo user accounts trong Supabase Auth
Vào **Authentication > Users**, tạo user rồi insert vào bảng `profiles`:
```sql
insert into public.profiles (id, full_name, role, site_id)
values (
  'USER_UUID_FROM_AUTH',
  'Nguyễn Văn A',
  'operator',
  (select id from sites where code = 'long-an')
);
```

### 4. Run local
```bash
npm run dev
# → http://localhost:3000
```

### 5. Deploy lên Vercel
```bash
# Kết nối GitHub repo với Vercel
# Thêm env vars trong Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 📁 Cấu trúc thư mục
```
vicc-wwt-app/
├── app/
│   ├── login/               # Đăng nhập + chọn site
│   ├── dashboard/           # Combined dashboard (3 sites, manager only)
│   ├── [site]/
│   │   ├── dashboard/       # Site dashboard
│   │   ├── operator/        # Daily checklist (nhân viên)
│   │   │   └── [shift]/     # Ca 1, 2, 3
│   │   ├── manager/         # Monthly assessment (quản lý)
│   │   └── reports/         # Lịch sử đánh giá
│   └── layout.tsx
├── lib/
│   ├── types.ts             # TypeScript types
│   └── supabase/
│       ├── client.ts        # Browser client
│       └── server.ts        # Server client (SSR)
├── supabase/
│   ├── schema.sql           # DB schema + RLS
│   └── seed_checklist.sql   # 49 checklist items
└── components/              # UI components
```

## 🎨 Design
Stitch MCP Project: [VICC WWT Self-Assessment App](https://stitch.withgoogle.com/projects/16604611130837087790)
- Style: Intersnack Group (white, bold typography, rounded 20px cards)
- 7 screens: Login, Combined Dashboard, Site Dashboard, Operator Checklist, Manager Monthly, KEA Detail, Reports

## 📊 Stitch MCP Project
Project ID: `16604611130837087790`
