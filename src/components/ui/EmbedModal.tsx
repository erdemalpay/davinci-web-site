import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// Our own pages (Yer Var mı, Bu Oyun Var mı, Menü) open in a large popup in the
// middle of the site instead of a new page. kutuoyunual.com is not listed:
// Shopify refuses to be shown inside another site (frame-ancestors 'none').
const EMBEDDABLE_HOSTS = [
  'yervarmi.davinciboardgame.com',
  'buoyunvarmi.davinciboardgame.com',
  'menu.davinciboardgame.com',
]

export function isEmbeddable(href: string): boolean {
  try {
    return EMBEDDABLE_HOSTS.includes(new URL(href).hostname)
  } catch {
    return false
  }
}

interface Embed {
  url: string
  title: string
}

const EmbedContext = createContext<(embed: Embed) => void>(() => {})

/**
 * Click handler for a link to one of our pages: a plain left click opens the
 * popup; ctrl/cmd/shift/middle click keep the browser's usual behaviour.
 */
export function useEmbedLink() {
  const open = useContext(EmbedContext)
  return useCallback(
    (href: string, title: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isEmbeddable(href)) return
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      open({ url: href, title })
    },
    [open],
  )
}

export function EmbedModalProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [embed, setEmbed] = useState<Embed | null>(null)
  const [loaded, setLoaded] = useState(false)

  const open = useCallback((next: Embed) => {
    setLoaded(false)
    setEmbed(next)
  }, [])
  const close = useCallback(() => setEmbed(null), [])

  useEffect(() => {
    if (!embed) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [embed, close])

  return (
    <EmbedContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {embed && (
          <motion.div
            key="embed-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="embed-overlay"
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={embed.title}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              className="embed-panel"
              style={{
                width: 'min(1100px, 94vw)', height: 'min(860px, 88vh)',
                background: '#fff', borderRadius: '18px', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 40px 120px rgba(0,0,0,0.55)',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px 12px 20px', borderBottom: '1px solid rgba(0,0,0,0.08)',
                fontFamily: 'var(--font-body)',
              }}>
                <span style={{ fontWeight: 700, color: 'var(--black)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {embed.title}
                </span>
                <a
                  href={embed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', whiteSpace: 'nowrap' }}
                >
                  {t('Open in new tab')} ↗
                </a>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t('Close')}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1l12 12M13 1L1 13" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div style={{ position: 'relative', flex: 1 }}>
                {!loaded && (
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {t('Loading...')}
                  </div>
                )}
                <iframe
                  src={embed.url}
                  title={embed.title}
                  onLoad={() => setLoaded(true)}
                  allow="geolocation; clipboard-write"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @media (max-width: 640px) {
          .embed-overlay { align-items: stretch !important; padding: 10px; }
          .embed-panel { width: 100% !important; height: auto !important; border-radius: 14px !important; }
        }
      `}</style>
    </EmbedContext.Provider>
  )
}
