# Design System Specification: Cirkkl Hub (`devcirkkl.vercel.app`)

This document provides a comprehensive UI/UX analysis and design specification to accurately replicate the aesthetic and interaction design of **Cirkkl Hub** (`https://devcirkkl.vercel.app/`) in this project.

---

## 1. Design Philosophy & Aesthetic Identity

Cirkkl Hub follows a **modern, minimalist SaaS aesthetic** characterized by:
- **Clean Whitespace & Airy Layouts:** Low-density data presentation with generous padding, subtle separators, and soft off-white canvas backgrounds.
- **Signature Accent Color (Chartreuse / Lime Green):** A high-energy, vibrant lime-green (`#C8E63C`) used strategically for active navigation pills, primary action buttons (e.g., `+ Host Event`, `Login`, `Edit`), and visual focal points.
- **High-Contrast Dark Typography on Lime:** White text is **never** used over the primary lime color; dark charcoal/slate (`#0F172A`) is consistently paired with lime for optimal legibility and accessible contrast.
- **Soft Geometry & Rounded Radii:** Elements feature generous corner radii ranging from `10px`–`12px` (`rounded-xl`) for buttons and inputs, up to `16px` (`rounded-2xl`) for cards and `24px`–`28px` (`rounded-3xl`) for modal dialogs.
- **Subtle Depth & Minimalist Elevation:** Flat surfaces with delicate `1px` borders (`#F1F5F9` / `#E2E8F0`) and soft, dispersed shadows instead of heavy skeuomorphism.
- **Segmented Control Pattern:** Pill-shaped grouped tab filters with smooth animated or sliding active states.

---

## 2. Color System & Design Tokens

### 2.1 Color Palette

| Token Name | HEX | RGB | HSL | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Primary (Lime)** | `#C8E63C` | `rgb(200, 230, 60)` | `hsl(71, 78%, 57%)` | Primary CTAs (`+ Host Event`, `Login`), Active sidebar pills |
| **Brand Primary Hover** | `#B8DC30` | `rgb(184, 220, 48)` | `hsl(73, 72%, 53%)` | Hover state for primary buttons |
| **Brand Primary Active** | `#A8CC24` | `rgb(168, 204, 36)` | `hsl(73, 70%, 47%)` | Active/pressed state for primary buttons |
| **Brand Primary Light** | `#F4F9D8` | `rgb(244, 249, 216)` | `hsl(70, 72%, 91%)` | Subtle chips, glow effects, badge backgrounds |
| **Text on Lime** | `#0F172A` | `rgb(15, 23, 42)` | `hsl(222, 47%, 11%)` | Font color on lime backgrounds (Slate 900) |
| **Canvas Background** | `#F8FAFC` | `rgb(248, 250, 252)` | `hsl(210, 40%, 98%)` | Main application background (Slate 50) |
| **Surface / Card** | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | Card backgrounds, sidebar, top header, active tab |
| **Muted Surface** | `#F1F5F9` | `rgb(241, 245, 249)` | `hsl(210, 40%, 96%)` | Segmented filter container, preview backgrounds |
| **Auth Input Fill** | `#EFF6FF` | `rgb(239, 246, 255)` | `hsl(214, 100%, 97%)` | Soft ice-blue background for auth inputs |
| **Border Subtlest** | `#F1F5F9` | `rgb(241, 245, 249)` | `hsl(210, 40%, 96%)` | Table row dividers, sidebar right border |
| **Border Default** | `#E2E8F0` | `rgb(226, 232, 240)` | `hsl(214, 32%, 91%)` | Card borders, secondary buttons, input borders |
| **Border Focus** | `#94A3B8` | `rgb(148, 163, 184)` | `hsl(215, 16%, 65%)` | Focus rings, active inputs |
| **Text Primary** | `#0F172A` | `rgb(15, 23, 42)` | `hsl(222, 47%, 11%)` | Headings, event titles, active labels |
| **Text Secondary** | `#475569` | `rgb(71, 85, 105)` | `hsl(215, 19%, 35%)` | Table cells, body copy, descriptions |
| **Text Muted** | `#94A3B8` | `rgb(148, 163, 184)` | `hsl(215, 16%, 65%)` | Table column headers, placeholders, footers |
| **Destructive / Live** | `#EF4444` | `rgb(239, 68, 68)` | `hsl(0, 84%, 60%)` | Live status text, Delete confirmation button |
| **Destructive Light** | `#FEF2F2` | `rgb(254, 242, 242)` | `hsl(0, 86%, 97%)` | Danger alert circle background in modals |
| **Destructive Border** | `#FEE2E2` | `rgb(254, 226, 226)` | `hsl(0, 93%, 94%)` | Modal alert icon container ring |
| **Attendee Blue CTA** | `#2563EB` | `rgb(37, 99, 235)` | `hsl(221, 83%, 53%)` | Public event preview "Request Attendance" button |

---

### 2.2 Tailwind CSS v4 Theme Integration

For this Next.js project using Tailwind CSS v4, add the custom tokens to `web/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #C8E63C;
  --color-brand-primary-hover: #B8DC30;
  --color-brand-primary-active: #A8CC24;
  --color-brand-primary-light: #F4F9D8;
  --color-brand-dark: #0F172A;

  --color-surface-canvas: #F8FAFC;
  --color-surface-card: #FFFFFF;
  --color-surface-muted: #F1F5F9;
  --color-input-tint: #EFF6FF;

  --color-border-subtle: #F1F5F9;
  --color-border-default: #E2E8F0;
  --color-border-strong: #94A3B8;

  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;

  --color-status-live: #EF4444;
  --color-status-danger: #EF4444;
  --color-status-danger-hover: #DC2626;

  --radius-button: 0.75rem;     /* 12px */
  --radius-input: 0.75rem;      /* 12px */
  --radius-card: 1rem;          /* 16px */
  --radius-modal: 1.5rem;       /* 24px */
}
```

---

## 3. Typography Scale & Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Color |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth Heading** | `26px` (`text-2xl` / `1.625rem`) | `700` (Bold) | `1.2` | `-0.02em` | `#0F172A` |
| **Page / Event Title** | `20px` (`text-xl` / `1.25rem`) | `700` (Bold) | `1.3` | `-0.01em` | `#0F172A` |
| **Card / Section Title**| `16px` (`text-base` / `1rem`) | `600` (Semibold) | `1.4` | `normal` | `#0F172A` |
| **Primary Table Value** | `14px` (`text-sm` / `0.875rem`)| `600` (Semibold) | `1.5` | `normal` | `#0F172A` |
| **Regular Body / Cells**| `14px` (`text-sm` / `0.875rem`)| `400` (Regular) | `1.5` | `normal` | `#475569` |
| **Muted Meta / Subtext**| `13px` (`text-xs` / `0.8125rem`)| `400` (Regular) | `1.4` | `normal` | `#94A3B8` |
| **Table Header Label** | `11px`–`12px` (`0.75rem`) | `600` (Semibold) | `1.2` | `0.05em` (`tracking-wider`) | `#94A3B8` (Uppercase) |
| **Ticket / Code Identifier**| `13px` (`font-mono`) | `500` (Medium) | `1.4` | `0.025em` | `#475569` |

---

## 4. Elevation, Radii & Shadow System

### 4.1 Radii
- **`rounded-full` (`9999px`)**: User avatars, circular icon containers, segmented tab pills.
- **`rounded-3xl` (`24px` / `1.5rem`)**: Modal confirmation dialogs.
- **`rounded-2xl` (`16px` / `1rem`)**: Main card containers, overview panel wrappers.
- **`rounded-xl` (`10px`–`12px` / `0.75rem`)**: Action buttons, inputs, navigation pills, search bar.
- **`rounded-lg` (`8px` / `0.5rem`)**: Segmented control inner active tab, icon utility buttons.

### 4.2 Shadows
- **Card Shadow (`shadow-sm`):**
  ```css
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
  ```
- **Active Segmented Filter Pill:**
  ```css
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  ```
- **Modal Dialog (`shadow-2xl`):**
  ```css
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  ```
- **Ambient Illustration Glow (Auth page):**
  ```css
  background: radial-gradient(circle at 65% 50%, rgba(200, 230, 60, 0.18) 0%, rgba(255, 255, 255, 0) 70%);
  ```

---

## 5. Layout Architecture

```
+-----------------------------------------------------------------------------------------+
| [Cirkkl Hub]                                                     (Bell Icon) [Avatar]  | <-- Header (h-16, bg-white, border-b)
+-------------------+---------------------------------------------------------------------+
| (Sidebar)         | (Main Content Canvas: bg-[#F8FAFC])                                |
|                   |                                                                     |
| [O Events]  <--   |   +-------------------------------------------------------------+   |
|   (Lime Pill)     |   | [Search...]                    [All | Upcoming | Live | Past] |   |
|   Members         |   +-------------------------------------------------------------+   |
|   About           |   | EVENT            DATE         TYPE       STATUS             |   |
|                   |   | TechVista 2026   Oct 30, 2026 Workshop   Live           ... |   |
|                   |   | Hackathon        Sep 29, 2026 Sports     Past           ... |   |
|                   |   +-------------------------------------------------------------+   |
|                   |   | Showing 2 of 2 events                                       |   |
|                   |   +-------------------------------------------------------------+   |
|                   |                                                                     |
| [*] Settings      |                                                                     |
+-------------------+---------------------------------------------------------------------+
```

### 5.1 App Shell Dimensions
- **Top Header:** Height `64px` (`h-16`), full width, white background, `border-b border-slate-100`, flex layout `items-center justify-between px-6`.
- **Sidebar:** Width `240px`–`260px` (`w-60` to `w-64`), full height minus header (`h-[calc(100vh-4rem)]`), `bg-white border-r border-slate-100`, `flex flex-col justify-between p-4`.
- **Main Canvas:** `flex-1 min-h-[calc(100vh-4rem)] bg-[#F8FAFC] p-6 lg:p-8 overflow-y-auto`.

---

## 6. Detailed Component Specifications

### 6.1 Top Header & Sidebar Navigation

#### Sidebar Active Item (The Signature Lime Pill)
```tsx
<button className="flex w-full items-center gap-3 rounded-xl bg-[#C8E63C] px-3.5 py-2.5 font-semibold text-[#0F172A] transition-colors">
  <Calendar className="h-5 w-5" />
  <span className="text-sm">Events</span>
</button>
```

#### Sidebar Inactive Item
```tsx
<button className="flex w-full items-center gap-3 rounded-xl bg-transparent px-3.5 py-2.5 font-medium text-[#64748B] transition-colors hover:bg-slate-100 hover:text-[#0F172A]">
  <Users className="h-5 w-5" />
  <span className="text-sm">Members</span>
</button>
```

---

### 6.2 Buttons & Action Triggers

#### 1. Primary Action Button (`+ Host Event`, `Login`)
- **Background:** `#C8E63C`
- **Hover:** `#B8DC30`
- **Text:** `#0F172A` (Slate 900), `font-semibold` (weight 600)
- **Corner Radius:** `rounded-xl` (`12px`)
- **Padding:** `px-5 py-2.5`
```tsx
<button className="inline-flex items-center gap-2 rounded-xl bg-[#C8E63C] px-5 py-2.5 text-sm font-semibold text-[#0F172A] shadow-none transition-all hover:bg-[#B8DC30] active:scale-[0.98]">
  <Plus className="h-4 w-4 stroke-[2.5]" />
  Host Event
</button>
```

#### 2. Secondary / Outline Button (`Mark Attendance`, `Unpublish`, `Cancel`)
- **Background:** `#FFFFFF`
- **Border:** `1px solid #E2E8F0`
- **Text:** `#334155` (Slate 700)
- **Hover:** `bg-slate-50 border-slate-300 text-slate-900`
```tsx
<button className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#334155] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]">
  <QrCode className="h-4 w-4" />
  Mark Attendance
</button>
```

#### 3. Destructive Action Button (`Delete`)
- **Background:** `#EF4444` (Hover: `#DC2626`)
- **Text:** `#FFFFFF`, `font-semibold`
- **Corner Radius:** `rounded-2xl` (`14px`)
```tsx
<button className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#EF4444] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#DC2626]">
  Delete
</button>
```

#### 4. Icon Utility Button (`...` Action Menu or Refresh)
```tsx
<button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition-colors hover:border-slate-300 hover:text-[#0F172A]">
  <RotateCw className="h-4 w-4" />
</button>
```

---

### 6.3 Inputs & Filter Controls

#### 1. Search Bar with Leading Icon
```tsx
<div className="relative w-full max-w-xs">
  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
  <input
    type="text"
    placeholder="Search events..."
    className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] transition-colors focus:border-[#94A3B8] focus:outline-none"
  />
</div>
```

#### 2. Segmented Pill Tab Filter
```tsx
<div className="inline-flex items-center gap-1 rounded-xl bg-[#F1F5F9] p-1">
  <button className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] shadow-sm transition-all">
    All
  </button>
  <button className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-[#64748B] transition-colors hover:text-[#0F172A]">
    Upcoming
  </button>
  <button className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-[#64748B] transition-colors hover:text-[#0F172A]">
    Live
  </button>
  <button className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-[#64748B] transition-colors hover:text-[#0F172A]">
    Past
  </button>
</div>
```

#### 3. Auth Soft-Tinted Input Field
As seen in the login screen, form inputs use a unique **ice-blue soft fill** (`#EFF6FF` / `#F0F4F8`) without heavy borders:
```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-xs font-medium text-[#334155]">Email</label>
  <input
    type="email"
    defaultValue="user@example.com"
    className="h-11 w-full rounded-xl border border-transparent bg-[#EFF6FF] px-4 text-sm text-[#0F172A] transition-all placeholder:text-[#94A3B8] focus:border-blue-200 focus:bg-white focus:outline-none"
  />
</div>
```

---

### 6.4 The Table Component Specification

The table is wrapped in a dedicated white card with rounded corners and integrated search/filters.

#### Key Specs:
- **Card Container:** `bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden`
- **Filter Bar:** `flex flex-wrap items-center justify-between gap-4 p-4 lg:p-5`
- **Column Header Row:**
  - Height: `44px`
  - Font: `text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]`
  - Border: `border-b border-[#F1F5F9]`
  - Padding: `px-6 py-3`
- **Data Rows:**
  - Row Height: `60px`–`64px`
  - Border: `border-b border-[#F8FAFC]`
  - Hover: `hover:bg-[#F8FAFC]/80 transition-colors`
  - Cell Typography:
    - **Event Name:** `font-semibold text-sm text-[#0F172A]`
    - **Date / Type / Visibility:** `font-normal text-sm text-[#475569]`
    - **Status (Live):** `font-medium text-sm text-[#EF4444]`
    - **Status (Past):** `font-normal text-sm text-[#94A3B8]`
    - **Status (Attended):** `font-medium text-sm text-[#334155]`
    - **Ticket Code:** `font-mono text-sm text-[#475569]`
    - **Action (`...`):** `text-[#94A3B8] hover:text-[#0F172A] cursor-pointer`
- **Table Footer:**
  - Height: `48px`
  - Text: `text-xs text-[#94A3B8]` ("Showing 2 of 2 events")
  - Padding: `px-6 py-3.5`

#### Full Table JSX Markup:
```tsx
<div className="rounded-2xl border border-[#F1F5F9] bg-white shadow-sm">
  {/* Top Table Control Bar */}
  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F1F5F9] p-4 lg:p-5">
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
      <input
        type="text"
        placeholder="Search events..."
        className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#94A3B8] focus:outline-none"
      />
    </div>

    {/* Segmented Filter */}
    <div className="inline-flex items-center gap-1 rounded-xl bg-[#F1F5F9] p-1">
      <button className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] shadow-sm">All</button>
      <button className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A]">Upcoming</button>
      <button className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A]">Live</button>
      <button className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A]">Past</button>
    </div>
  </div>

  {/* Table Body */}
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-[#F1F5F9] text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
          <th className="px-6 py-3.5">Event</th>
          <th className="px-6 py-3.5">Date</th>
          <th className="px-6 py-3.5">Type</th>
          <th className="px-6 py-3.5">Visibility</th>
          <th className="px-6 py-3.5">Status</th>
          <th className="px-6 py-3.5 text-right"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#F8FAFC]">
        <tr className="transition-colors hover:bg-[#F8FAFC]/80">
          <td className="px-6 py-4 text-sm font-semibold text-[#0F172A]">TechVista 2026 — Build, Break & Innovate</td>
          <td className="px-6 py-4 text-sm text-[#475569]">Oct 30, 2026</td>
          <td className="px-6 py-4 text-sm text-[#475569]">Workshops</td>
          <td className="px-6 py-4 text-sm text-[#475569]">Public</td>
          <td className="px-6 py-4 text-sm font-medium text-[#EF4444]">Live</td>
          <td className="px-6 py-4 text-right">
            <button className="text-[#94A3B8] hover:text-[#0F172A]">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </td>
        </tr>
        <tr className="transition-colors hover:bg-[#F8FAFC]/80">
          <td className="px-6 py-4 text-sm font-semibold text-[#0F172A]">Hackathon</td>
          <td className="px-6 py-4 text-sm text-[#475569]">Sep 29, 2026</td>
          <td className="px-6 py-4 text-sm text-[#475569]">Sports</td>
          <td className="px-6 py-4 text-sm text-[#475569]">Public</td>
          <td className="px-6 py-4 text-sm text-[#94A3B8]">Past</td>
          <td className="px-6 py-4 text-right">
            <button className="text-[#94A3B8] hover:text-[#0F172A]">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Footer */}
  <div className="border-t border-[#F1F5F9] px-6 py-3.5 text-xs text-[#94A3B8]">
    Showing 2 of 2 events
  </div>
</div>
```

---

### 6.5 Modal Dialog Specification (`Delete Event?`)

#### Key Specs:
- **Backdrop:** `fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4`
- **Dialog Box:** `w-full max-w-[420px] rounded-3xl bg-white p-8 shadow-2xl relative text-center`
- **Close Button:** Top-right `absolute right-5 top-5 text-[#94A3B8] hover:text-[#0F172A]`
- **Alert Icon Circle:**
  - Size: `56px` (`h-14 w-14`)
  - Background: `#FEF2F2` (soft pale red)
  - Border: `border border-[#FEE2E2]`
  - Icon: `AlertTriangle` in `#EF4444` (`h-7 w-7`)
- **Title:** `text-lg font-bold text-[#0F172A] mt-4` ("Delete Event?")
- **Description:** `text-sm text-[#64748B] mt-2 leading-relaxed`
- **Button Grid:** `grid grid-cols-2 gap-3 mt-7`
  - **Cancel:** `rounded-2xl border border-[#E2E8F0] bg-white h-11 font-semibold text-sm text-[#374151] hover:bg-slate-50`
  - **Delete:** `rounded-2xl bg-[#EF4444] h-11 font-semibold text-sm text-white hover:bg-[#DC2626]`

#### Full Modal Markup:
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
  <div className="relative w-full max-w-[420px] rounded-3xl bg-white p-8 text-center shadow-2xl">
    {/* Close button */}
    <button className="absolute right-5 top-5 text-[#94A3B8] hover:text-[#0F172A]">
      <X className="h-5 w-5" />
    </button>

    {/* Warning Icon Badge */}
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#FEE2E2] bg-[#FEF2F2]">
      <AlertTriangle className="h-7 w-7 text-[#EF4444] stroke-[1.75]" />
    </div>

    {/* Title & Body */}
    <h3 className="mt-4 text-lg font-bold text-[#0F172A]">Delete Event?</h3>
    <p className="mt-2 text-sm text-[#64748B]">
      This will permanently delete this event and all its registrations. This cannot be undone.
    </p>

    {/* Action Buttons */}
    <div className="mt-7 grid grid-cols-2 gap-3">
      <button className="h-11 rounded-2xl border border-[#E2E8F0] bg-white text-sm font-semibold text-[#374151] transition-colors hover:bg-slate-50">
        Cancel
      </button>
      <button className="h-11 rounded-2xl bg-[#EF4444] text-sm font-semibold text-white transition-colors hover:bg-[#DC2626]">
        Delete
      </button>
    </div>
  </div>
</div>
```

---

### 6.6 Split-Screen Authentication Page

#### Key Specs:
- **Layout:** `min-h-screen grid grid-cols-1 lg:grid-cols-2`
- **Left Column:**
  - Branding at top-left: "Cirkkl" (`text-xl font-bold tracking-tight text-[#0F172A]`)
  - Centered Form Card: `max-w-sm w-full mx-auto`
  - Heading: "Welcome back" (`text-2xl font-bold text-[#0F172A]`)
  - Subheading: "Login to your account" (`text-sm text-[#64748B] mt-1 mb-6`)
  - Submit Button: Full-width Lime button (`bg-[#C8E63C] text-[#0F172A] font-semibold h-11 rounded-xl`)
  - Footer link: "Don't have an account? **Sign up**"
- **Right Column (Hero / Decorative Graphic):**
  - Background: Soft white with radial lime gradient glow
  - Graphic: Vector illustration of person walking toward a large location pin (pin accent is `#C8E63C`)

---

## 7. Responsive Breakpoints & Mobile Adaptation

- **Desktop (`>= 1024px`):**
  - Fixed sidebar (`w-60`), sticky header, table displayed in full width with all columns.
- **Tablet / Mobile (`< 1024px`):**
  - Sidebar collapses into a slide-over mobile drawer toggled via hamburger menu.
  - Table horizontally scrolls inside its container with `overflow-x-auto`.
  - Auth page collapses to single-column (illustration hidden, form centered).
  - Segmented controls allow touch swiping or wrap comfortably.

---

## 8. Summary Checklist for Implementation

- [ ] Add the custom colors (`#C8E63C`, `#F8FAFC`, `#EFF6FF`, etc.) to Tailwind configuration.
- [ ] Set default body background to `#F8FAFC` and foreground to `#0F172A`.
- [ ] Ensure all buttons on `#C8E63C` use dark text `#0F172A`, not white.
- [ ] Implement `rounded-xl` (`12px`) for primary buttons and form fields.
- [ ] Implement `rounded-2xl` (`16px`) for cards and tables.
- [ ] Implement `rounded-3xl` (`24px`) for modals.
- [ ] Use `lucide-react` icons (Calendar, Users, Info, Settings, Search, Plus, MoreHorizontal, QrCode, AlertTriangle).
- [ ] Replicate the segmented pill tab bar for filters (`All`, `Upcoming`, `Live`, `Past`).

