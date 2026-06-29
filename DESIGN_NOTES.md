# ServiceConnect Demo — Agent Build Brief

A Next.js (App Router) **click-through prototype**. No backend, no real data fetching —
everything is mocked in `src/lib/mock-data`. All screens render inside a centered
**mobile phone frame**. Match the mobile mockups in `images/1.png … 5.png`.

## Visual language
- Clean, friendly, **white surfaces on a light-gray page**, generous rounding (`rounded-2xl`).
- **Primary = blue-600** (`#2563EB`) → use `bg-primary` / `text-primary` / `border-primary`.
- Soft shadows (`shadow-sm`), 1px `border-border` dividers.
- Bold tracking-tight headings; `text-muted-foreground` for secondary text.
- Light mode only. Do NOT add dark styling.

## Design tokens (already in globals.css — use the utility names)
`bg-background` (white screen) · `bg-page` (gray behind phone) · `bg-card` · `border-border`
`text-foreground` / `text-muted-foreground` · `bg-primary` / `text-primary-foreground`
`bg-brand-soft` (light blue tint) · `text-accent-foreground` (blue) ·
`bg-success` / `text-success` / `bg-success-soft` · `bg-warning` / `bg-warning-soft` ·
`bg-destructive`. Radius scale `rounded-xl/2xl`.

## The Screen wrapper (ALWAYS wrap a page in this)
```tsx
import { Screen, ScreenHeader } from "@/components/phone";

export default function Page() {
  return (
    <Screen
      header={<ScreenHeader title="Wallet" />}   // optional top bar w/ back button
      footer={<Button className="w-full">Continue</Button>} // optional sticky CTA
      activeTab="wallet"                          // optional → shows bottom tab bar
      padded                                      // default true (px-5 py-4 body)
    >
      ...content...
    </Screen>
  );
}
```
- `activeTab`: one of `"home" | "orders" | "messages" | "wallet" | "profile"`. Omit it on
  flow screens (auth, booking, etc.) that should NOT show the tab bar.
- For a full-bleed top image (e.g. Service Details), pass `padded={false}` and add your own padding.
- `ScreenHeader` props: `title`, `showBack` (default true), `backHref`, `action` (right node), `transparent`.

## Shared components (`@/components/shared`)
`ServiceCard` (variant `"featured" | "list"`), `ProviderCard`, `CategoryChip`,
`CategoryIcon`, `SectionHeader` (title + "See all"), `StarRating`, `PriceRow`.

## UI primitives (`@/components/ui/*`, shadcn)
`button card input textarea label tabs avatar badge separator switch select progress dialog sheet`.
Icons: `lucide-react`. CTA buttons in the design are full-width, e.g.
`<Button className="h-12 w-full rounded-xl text-base font-semibold">`. Use `asChild` to wrap a `<Link>`.

## Mock data (`@/lib/mock-data`)
`services, getService, featuredServices, nearbyServices`, `providers, getProvider, currentUser`,
`categories, getCategory`, `reviews`, `bookings, getBooking, defaultBooking, orderPipeline`,
`conversations, getConversation`, `walletBalance, bankAccounts, transactions`.
Types in `@/lib/types`.

## Images
Remote images are pre-approved in `next.config.ts` (unsplash, pravatar). Use plain `<img className="object-cover" />`
(simpler than next/image here) or `next/image`. Cover images & avatars already live in the mock data.

## Interactivity
Demo only. Buttons navigate with `<Link>` / `useRouter().push()`. Toggles, tabs, date pickers,
quantity steppers use local `useState` — no persistence. Add `"use client"` when a component uses hooks.

## Rules
- Stay within YOUR assigned route folders + an optional component subfolder under
  `src/components/<your-area>/`. Do not edit shared foundation files or another agent's routes.
- Keep files focused (< ~250 lines). No `console.log`. TypeScript strict (no `any`).
- Every route must compile and look polished at 420px width.
