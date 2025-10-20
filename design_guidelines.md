# Design Guidelines: 3x3 Basketball Tournament Platform

## Design Approach

**Selected System:** Material Design with Sports Platform Customization  
**Justification:** This platform balances information-dense dashboards (tournaments, stats, analytics) with visual content (media hub, merchandise). Material Design provides robust components for data displays while allowing customization for the sports context.

**Key References:** ESPN Tournament interfaces, FIBA 3x3 platform aesthetics, Challonge's bracket clarity, combined with Material Design's structural principles.

**Core Principles:**
- Action-oriented interfaces with clear CTAs for tournament registration, team creation, and role selection
- Real-time data presentation for live match scoring and tournament brackets
- Role-based visual hierarchy (Player, Sponsor, Organizer views)
- Mobile-first approach for on-court score entry and tournament viewing

## Color Palette

**Light Mode:**
- Primary: 200 85% 45% (vibrant basketball orange)
- Primary Variant: 200 90% 35% (deeper orange for active states)
- Secondary: 220 70% 50% (professional blue for secondary actions)
- Background: 0 0% 98% (off-white)
- Surface: 0 0% 100% (white cards/panels)
- Text Primary: 0 0% 13%
- Text Secondary: 0 0% 40%

**Dark Mode:**
- Primary: 200 80% 55% (slightly brighter orange)
- Primary Variant: 200 75% 45%
- Secondary: 220 60% 60%
- Background: 0 0% 8% (court-dark)
- Surface: 0 0% 12% (elevated cards)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%

**Sponsor/Analytics Accents:**
- Success: 140 60% 45% (green for positive metrics)
- Warning: 40 95% 55% (gold for highlights/MVPs)
- Error: 0 70% 50% (red for alerts)

## Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - clean, modern, excellent for data tables and dashboards
- Display: 'Poppins' (Google Fonts) - bold, sporty for headings and tournament names
- Monospace: 'JetBrains Mono' (Google Fonts) - for match scores and stats

**Hierarchy:**
- H1: Poppins Bold, 2.5rem (tournament names, page headers)
- H2: Poppins SemiBold, 2rem (section headers)
- H3: Poppins Medium, 1.5rem (card titles)
- Body: Inter Regular, 1rem (all content)
- Caption: Inter Regular, 0.875rem (metadata, timestamps)
- Button: Inter Medium, 0.875-1rem (uppercase for primary actions)
- Score Display: JetBrains Mono Bold, 3rem (live match scores)

## Layout System

**Spacing Units:** Consistent use of Tailwind units: **2, 4, 8, 12, 16** for all spacing  
- Tight spacing: p-2, m-2 (compact data tables, stat chips)
- Standard: p-4, gap-4 (form fields, card padding)
- Comfortable: p-8, my-8 (section spacing, dashboard modules)
- Generous: p-12, py-16 (hero sections, major page divisions)

**Grid System:**
- Dashboards: 3-column grid (lg:grid-cols-3) for metric cards, collapsing to single column on mobile
- Tournament Brackets: Responsive horizontal scroll with fixed column widths
- Merchandise: 4-column product grid (lg:grid-cols-4, md:grid-cols-3, sm:grid-cols-2)
- Court Map: Full-width map container with sidebar filter panel

**Container Widths:**
- Full dashboards: max-w-7xl
- Forms and wizards: max-w-3xl
- Content pages: max-w-6xl

## Component Library

**Navigation:**
- Top app bar with role badge (Player/Sponsor/Organizer) in top-right
- Persistent side navigation for dashboard modules (collapsible on mobile)
- Breadcrumb navigation for deep hierarchies (Tournament > Bracket > Match)
- Bottom navigation bar on mobile for primary actions

**Cards:**
- Elevated cards with subtle shadows (shadow-md)
- Tournament cards: Horizontal layout with image thumbnail, title, date, location, CTA
- Stat cards: Large numeric display with label and trend indicator (↑/↓)
- Team/Player cards: Avatar, name, stats in compact format

**Forms:**
- Multi-step wizards for tournament creation and team registration
- Inline validation with immediate feedback
- File upload zones with drag-and-drop for media/brand assets
- Role selector: Three large radio cards with icons and descriptions
- Date/time pickers integrated with tournament scheduling

**Data Display:**
- Tournament brackets: Tree-view component with match nodes, expandable for details
- Leaderboards: Striped tables with ranking badges and expandable rows for full stats
- Analytics charts: Line/bar charts for sponsor engagement metrics
- Match scoreboard: Large split-screen score display with timer and quarter indicators

**Buttons:**
- Primary: Solid orange fill for main actions (Register Team, Submit Score)
- Secondary: Outlined for secondary actions
- Text buttons: For tertiary actions in dense interfaces
- FAB (Floating Action Button): Bottom-right for quick actions like "Log Score" during live matches

**Overlays:**
- Modal dialogs for confirmations (Submit Tournament, Complete Registration)
- Bottom sheets on mobile for filters and quick actions
- Snackbar notifications for success/error feedback (top-right, auto-dismiss)
- Full-screen loading states for bracket generation

## Module-Specific Designs

**Login Page:**
- Centered card layout on gradient background (orange to blue diagonal)
- Email/password fields with Google button below
- Role selector appears post-authentication as modal overlay with three prominent cards

**Tournament Brackets:**
- Horizontal scrollable bracket with zoom controls
- Color-coded by match status (scheduled=gray, live=orange, complete=green)
- Click match node to open score entry modal

**Sponsor Dashboard:**
- 3-column metric cards at top (Total Views, Engagement Rate, Merch Sales)
- Chart section showing trend over tournament timeline
- Active tournaments list with visibility metrics per tournament

**Merchandise Shop:**
- Hero banner with featured products
- Filter sidebar (Category, Price, Team)
- Product grid with hover zoom on images
- Persistent cart drawer sliding from right

**Court Map:**
- Full-screen map with clustered pins
- Filter panel on left (University, City, Availability)
- Click pin to show court details card with booking info

**Media Hub:**
- Masonry grid layout for photos/videos
- Upload button as prominent FAB
- Filter tags as chips above grid
- Lightbox viewer for full-screen media

## Images

**Hero Image:**
- Login page: Dynamic 3x3 basketball action shot (players mid-jump, urban court background)
- No other pages use hero images - dashboard modules prioritize immediate data access

**Supplementary Images:**
- Tournament cards: Court/venue thumbnails (16:9 aspect ratio)
- Team/player profiles: Avatar photos (circular crop)
- Merchandise: Product photos on white background (square 1:1)
- Sponsor logos: High-contrast brand marks on dashboard
- Media hub: User-uploaded tournament photos/videos in gallery

## Animations

**Minimal, Purposeful Motion:**
- Page transitions: Simple fade-in (200ms)
- Card hover: Subtle elevation increase (shadow transition)
- Live score updates: Number flip animation (500ms) when score changes
- Bracket progression: Smooth scroll to active match
- No decorative or distracting animations - focus on content and functionality