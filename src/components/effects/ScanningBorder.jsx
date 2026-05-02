/**
 * ScanningBorder — wraps content with an animated gradient border that "orbits" the element.
 * The gradient rotates continuously, creating a sci-fi frame-of-light effect.
 *
 * Renders as an absolutely-positioned overlay; the parent must have position: relative
 * and overflow: hidden, and there should be a matching inset background to mask the inside.
 *
 * Usage:
 *   <div className="relative overflow-hidden rounded-2xl">
 *     <ScanningBorder color1="#22D3EE" color2="#6366F1" />
 *     <div className="relative m-px rounded-2xl bg-ink-900 p-6">your content</div>
 *   </div>
 */
export default function ScanningBorder({
  color1 = '#22D3EE',
  color2 = '#6366F1',
  duration = 4,
  className = ''
}) {
  return (
    <div
      className={`absolute -inset-px rounded-[inherit] pointer-events-none ${className}`}
      style={{
        background: `conic-gradient(from var(--angle, 0deg), transparent 0deg, ${color1} 60deg, ${color2} 120deg, transparent 180deg, transparent 360deg)`,
        animation: `spin-conic ${duration}s linear infinite`,
        opacity: 0.85
      }}
    />
  )
}
