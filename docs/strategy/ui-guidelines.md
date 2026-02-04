# UI/UX Strategist Guidelines

> [!NOTE]
> **Design Philosophy**: "Military Precision meets Civilian Sophistication."
> The interface should feel familiar to veterans (structured, clear) but welcoming to the corporate world (modern, sleek, premium).

## 1. Accessibility (Universal Design)
**Compliance Target**: WCAG 2.1 AA
- **Contrast**: All text must have a strictly accessible contrast ratio against its background.
- **Keyboard Navigation**: Every interactive element must be reachable and usable via Tab/Enter/Space.
- **Screen Readers**: All images require `alt` text. Icons used as buttons require `aria-label`.

## 2. Visual Identity

### Color Palette ("The Regiment")
- **Primary (The Uniform)**: `#4A5D23` (Olive Drab - Deep, Professional)
- **Secondary (The Brass)**: `#C5A059` (Muted Gold - for calls to action, highlights)
- **Neutral (The Structure)**:
    - Slate 900 (`#0F172A`) - Text Primary
    - Slate 500 (`#64748B`) - Text Secondary
    - Gray 50 (`#F9FAFB`) - Backgrounds
- **Feedback**:
    - Success: Emerald 600
    - Error: Rose 600
    - Warning: Amber 500

### Typography
- **Headings**: `Outfit` (Google Fonts) - Bold, modern, geometric. Represents the future/tech.
- **Body**: `Inter` (Google Fonts) - Clean, highly legible, standard. Represents clarity.

## 3. Component Standards

### Buttons
- **Primary**: Solid Olive, White Text, Rounded-md. `hover:bg-olive-dark`. slightly elevated shadow.
- **Secondary**: Transparent background, Olive border, Olive text.
- **States**: Must have visible Focus ring (blue/gold) for accessibility.

### Cards (Glassmorphism Lite)
- White background with high opacity (95%).
- Subtle border: `border-gray-200`.
- Shadow: `shadow-lg` on hover (lift effect).
- Padding: standardized `p-6`.

### Animations (Micro-interactions)
- **Hover**: 150ms ease-in-out.
- **Page Load**: `animate-fade-in-up` (subtle 300ms drift).
- **Avoid**: Excessive motion that causes dizziness.

## 4. Emotional Design
- **Trust**: Use whitespace generously to prevent cognitive overload.
- **Empowerment**: Success messages should be celebratory ("Mission Accomplished" vibe, but professional).
- **Clarity**: No jargon. Translate "Military Speak" to "Civilian Speak" visually and textually.
