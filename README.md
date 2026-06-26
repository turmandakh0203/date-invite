# 💌 Date Invite — Болзооны урилга

Ягаан, анимейштэй болзооны урилгын Next.js апп.

---

## Эхлүүлэх

### 1. Суулгах
```bash
cd date-invite
npm install
```

### 2. Хөгжүүлэлтийн горимд ажиллуулах
```bash
npm run dev
```
Browser дээр **http://localhost:3000** нээнэ.

### 3. Production build
```bash
npm run build
npm start
```

---

## Vercel дээр deploy хийх (үнэгүй)

1. [vercel.com](https://vercel.com) дээр бүртгүүл
2. GitHub дээр оруул → Vercel дээр import хий
3. **Deploy** дар → URL авна → найздаа явуул 💕

```bash
# Эсвэл Vercel CLI-ээр
npm i -g vercel
vercel
```

---

## Файлын бүтэц

```
date-invite/
├── src/
│   ├── app/
│   │   ├── layout.tsx        ← Google Fonts, metadata
│   │   ├── page.tsx          ← Root page
│   │   └── globals.css       ← Animations, custom CSS
│   ├── components/
│   │   ├── DateInvite.tsx    ← Үндсэн orchestrator
│   │   └── ui/
│   │       ├── HeartsBackground.tsx  ← Хөвдөг зүрхнүүд
│   │       ├── Progress.tsx          ← Алхамын цэгнүүд
│   │       ├── ScreenInvite.tsx      ← "Болзмоор байна" дэлгэц
│   │       ├── ScreenDate.tsx        ← Өдөр сонгох
│   │       ├── ScreenActivity.tsx    ← Үйл ажиллагаа сонгох
│   │       ├── ScreenTime.tsx        ← Цаг сонгох
│   │       └── ScreenConfirm.tsx     ← Баталгаажуулалт
│   └── lib/
│       ├── data.ts           ← Өгөгдлүүд (огноо, үйл ажиллагаа...)
│       └── animations.ts     ← Sparkle, ripple, confetti hooks
├── tailwind.config.ts        ← Ягаан өнгийн тохиргоо
└── package.json
```

---

## Өөрчлөх

- **Огноонуудыг** `src/lib/data.ts` → `DATE_OPTIONS` дотор засна
- **Үйл ажиллагааг** `src/lib/data.ts` → `ACTIVITIES` дотор засна
- **Өнгийг** `tailwind.config.ts` дотор `colors` хэсгийг засна
