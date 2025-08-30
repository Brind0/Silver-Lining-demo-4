# v0 Prompt: Silver Lining Demo Platform - Friday Presentation Ready

Create a luxury property management dashboard with real-time cost tracking and RAG (Red/Amber/Green) project health monitoring. Use shadcn/ui components, Tailwind CSS, and React with TypeScript. The platform must demonstrate three key moments in a 10-minute demo: instant cost reconciliation, early problem detection, and audit trail control.

## Core Design Requirements

Use a clean, professional design with:
- **Color Palette**: Slate grays (#0F172A, #1E293B) for navigation, blue (#3B82F6) for primary actions
- **RAG Colors**: Green (#10B981), Amber (#F59E0B), Red (#EF4444) 
- **Font**: Inter for all text, 16px base size
- **Spacing**: 8-point grid system
- **Components**: shadcn/ui Cards, Buttons, Alerts, Tabs, Dialog modals
- **Layout**: Responsive with sidebar navigation, main content area, and alerts panel

## Page 1: Dashboard

Create a dashboard with three sections:

### Top Metrics Bar
Display three metric cards in a row using shadcn/ui Card components:
- Total Revenue: £487,000
- Active Projects: 5
- Pending Receipts: 3

### Hero RAG Status Section (Primary Feature)
Create a prominent card below metrics showing the logged-in user's personalized task status:

```tsx
// Use a shadcn/ui Card with color-coded border based on status
// GREEN border-green-500, AMBER border-amber-500, RED border-red-500
// Display user name: "Emily's Tasks"
// Show RAG status with count of tasks
// List specific tasks with project names

Example content for AMBER status:
"Your Status: AMBER
2 projects need attention

Tasks:
• Approve £2,500 receipt (Henderson Golf Sim)
• Review 6% budget overrun (Henderson)
• Check supplier delay - TravisPerkins 3 days late"
