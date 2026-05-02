import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, Globe, MapPin, Download, Check } from 'lucide-react'
import { useState } from 'react'

/**
 * PresenterContactCard — modal popup with presenter's contact details
 * and a "Save Contact" button that downloads a .vcf vCard file the
 * audience can import into their phone's contacts app.
 *
 * Triggered by clicking a presenter's name on the closing slide
 * (desktop slide 11 + mobile experience).
 */
export default function PresenterContactCard({ presenter, open, onClose }) {
  const [saved, setSaved] = useState(false)

  // Reset saved state when modal opens
  useEffect(() => {
    if (open) setSaved(false)
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!presenter) return null
  const c = presenter.contact || {}
  const addr = c.address || {}

  function handleSaveContact() {
    const vcf = buildVCard(presenter)
    const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${presenter.firstName}-${presenter.companyShort.replace(/\s+/g, '-')}.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 300)
    setSaved(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Overlay — solid color, no backdrop-filter (it kills FPS during entry) */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(5, 4, 12, 0.78)' }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full sm:max-w-md max-h-[92vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-white/12 contact-card-perf"
            style={{
              background: 'linear-gradient(160deg, #0E0C20 0%, #0A0820 100%)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(95,182,255,0.06)',
              willChange: 'transform, opacity',
              transform: 'translateZ(0)'
            }}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {/* Photo + accent gradient header */}
            <div className="relative">
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at center top, rgba(41,151,255,0.4), transparent 70%), radial-gradient(ellipse at bottom right, rgba(192,100,240,0.2), transparent 70%)'
                }}
              />
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur flex items-center justify-center transition"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative pt-10 pb-6 text-center px-6">
                <div className="relative inline-block">
                  <div
                    className="absolute inset-[-4px] rounded-full"
                    style={{ background: 'linear-gradient(135deg, #2997FF, #6366F1)' }}
                  />
                  <div className="relative h-28 w-28 mx-auto rounded-full overflow-hidden bg-[#0E0C20] ring-2 ring-[#07060F]">
                    <img
                      src={presenter.photo}
                      alt={presenter.name}
                      loading="eager"
                      decoding="sync"
                      fetchpriority="high"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: presenter.id === 'romik' ? 'center 25%' : 'center 30%' }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-white text-[22px] font-bold leading-tight" style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}>
                  {presenter.name}
                </div>
                <div className="text-white/65 text-[14px] mt-1">
                  {presenter.role}
                </div>
                {presenter.logo && (
                  <div className="mt-4 flex items-center justify-center" style={{ height: '40px' }}>
                    <img
                      src={presenter.logo}
                      alt={presenter.company}
                      loading="eager"
                      decoding="sync"
                      fetchpriority="high"
                      className="object-contain"
                      style={{ maxHeight: '40px', maxWidth: '180px', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Body — contact details */}
            <div className="flex-1 overflow-y-auto elegant-scroll px-6 py-5 border-t border-white/8">
              <div className="space-y-2">
                {c.phone && (
                  <ContactRow
                    icon={Phone}
                    label="Phone"
                    value={c.phone}
                    href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}
                    accent="#5FB6FF"
                  />
                )}
                {c.email && (
                  <ContactRow
                    icon={Mail}
                    label="Email"
                    value={c.email}
                    href={`mailto:${c.email}`}
                    accent="#C064F0"
                  />
                )}
                {c.website && (
                  <ContactRow
                    icon={Globe}
                    label="Website"
                    value={c.website}
                    href={`https://${c.website.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    accent="#2997FF"
                  />
                )}
                {(addr.street || addr.city) && (
                  <ContactRow
                    icon={MapPin}
                    label="Address"
                    value={
                      <>
                        {addr.street && <div>{addr.street}</div>}
                        <div>
                          {[addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}
                        </div>
                      </>
                    }
                    href={addr.street ? `https://maps.google.com/?q=${encodeURIComponent([addr.street, addr.city, addr.state, addr.zip].filter(Boolean).join(', '))}` : undefined}
                    target="_blank"
                    accent="#F5A623"
                    multiLine
                  />
                )}
              </div>
            </div>

            {/* Save Contact CTA */}
            <div className="px-6 py-5 border-t border-white/8 bg-black/20" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
              <button
                onClick={handleSaveContact}
                disabled={saved}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white text-[15px] transition disabled:opacity-90"
                style={{
                  background: saved
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : 'linear-gradient(135deg, #2997FF 0%, #6366F1 100%)',
                  boxShadow: saved
                    ? '0 8px 22px -8px rgba(16,185,129,0.55)'
                    : '0 8px 22px -8px rgba(41,151,255,0.55)'
                }}
              >
                {saved ? (
                  <>
                    <Check className="h-5 w-5" />
                    Saved — open Downloads to import
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Save to my phone
                  </>
                )}
              </button>
              <div className="text-center text-[11px] text-white/40 mt-3 leading-relaxed">
                Downloads a .vcf contact file. Open it from your phone to add to Contacts.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ContactRow({ icon: Icon, label, value, href, target, accent, multiLine }) {
  const inner = (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/4 border border-white/8 hover:border-white/20 hover:bg-white/8 transition">
      <div
        className="shrink-0 h-9 w-9 rounded-lg flex items-center justify-center"
        style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
      >
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/45 font-bold">
          {label}
        </div>
        <div className={`text-white text-[15px] mt-0.5 ${multiLine ? 'leading-snug' : 'truncate'}`}>
          {value}
        </div>
      </div>
    </div>
  )
  if (!href) return inner
  return (
    <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="block">
      {inner}
    </a>
  )
}

/**
 * Build a vCard 3.0 string from the presenter object.
 * Compatible with iOS Contacts, Android Contacts, Outlook, Google Contacts.
 */
function buildVCard(p) {
  const c = p.contact || {}
  const addr = c.address || {}
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${p.name}`,
    `N:${p.name.split(' ').reverse().join(';')};;;`,
    p.role && `TITLE:${p.role}`,
    p.company && `ORG:${p.company}`,
    c.phone && `TEL;TYPE=WORK,VOICE:${c.phone}`,
    c.email && `EMAIL;TYPE=WORK:${c.email}`,
    c.website && `URL:https://${c.website.replace(/^https?:\/\//, '')}`,
    (addr.street || addr.city) &&
      `ADR;TYPE=WORK:;;${addr.street || ''};${addr.city || ''};${addr.state || ''};${addr.zip || ''};USA`,
    'END:VCARD'
  ]
  return lines.filter(Boolean).join('\r\n') + '\r\n'
}
