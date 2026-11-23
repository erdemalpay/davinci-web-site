import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useEmbedLink } from '../ui/EmbedModal'

const NAV_LINKS = [
  { label: 'Is This Game at the Cafe?', href: 'https://buoyunvarmi.davinciboardgame.com', external: false },
  { label: 'Is There Space at the Cafe?', href: 'https://yervarmi.davinciboardgame.com', external: false },
  { label: 'Buy Games', href: 'https://kutuoyunual.com', external: false },
  { label: 'Menu', href: 'https://menu.davinciboardgame.com/2', external: false },
  { label: 'Contact', href: '#contact', external: false },
]

export default function Header() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const embedLink = useEmbedLink()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')

  const navLinkColor = scrolled ? 'rgba(31,41,55,0.75)' : 'rgba(255,255,255,0.85)'
  const navLinkHoverColor = scrolled ? 'var(--red)' : '#fff'

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.35s ease',
          background: scrolled
            ? 'rgba(255,255,255,0.96)'
            : 'linear-gradient(180deg, rgba(17,24,39,0.85) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
          padding: scrolled ? '10px 0' : '20px 0',
        }}
      >
        <div className="container-xl" style={{
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/images/davinci-logo.png"
              alt="Da Vinci Board Game"
              style={{
                height: scrolled ? '40px' : '52px',
                width: 'auto',
                transition: 'height 0.3s ease',
                objectFit: 'contain',
                filter: scrolled ? 'none' : 'brightness(1)',
              }}
            />
          </a>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="desktop-nav">
            {NAV_LINKS.map(({ label, href, external }) => (
              <motion.a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                whileHover={{ color: navLinkHoverColor, y: 3 }}
                transition={{ duration: 0.1 }}
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: navLinkColor,
                  padding: '8px 11px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-body)',
                }}
                onClick={(e) => {
                  setMenuOpen(false)
                  embedLink(href, t(label))(e)
                }}
              >
                {t(label)}
              </motion.a>
            ))}
          </nav>

          {/* Right side: lang + CTA + burger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button
              onClick={toggleLang}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: scrolled ? 'var(--gray-600)' : 'rgba(255,255,255,0.7)',
                padding: '6px 12px',
                borderRadius: '100px',
                border: scrolled ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.25)',
                background: 'transparent',
                transition: 'all 0.25s ease',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.color = 'var(--red)'
                el.style.borderColor = 'rgba(168,0,0,0.35)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.color = scrolled ? 'var(--gray-600)' : 'rgba(255,255,255,0.7)'
                el.style.borderColor = scrolled ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.25)'
              }}
            >
              {i18n.language === 'tr' ? 'EN' : 'TR'}
            </button>

            <motion.a
              href="https://yervarmi.davinciboardgame.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={embedLink('https://yervarmi.davinciboardgame.com', t('Is There Space at the Cafe?'))}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(168,0,0,0.35)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#fff',
                background: 'var(--red)',
                padding: '10px 20px',
                borderRadius: '100px',
                letterSpacing: '0.02em',
                fontFamily: 'var(--font-body)',
                display: 'none',
              }}
              className="header-cta"
            >
              {t('Is There Space at the Cafe?')}
            </motion.a>

            {/* Hamburger */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'none',
                flexDirection: 'column',
                gap: '5px',
                padding: '8px',
              }}
            >
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  animate={{
                    rotate: menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                    y: menuOpen && i === 0 ? 7 : menuOpen && i === 2 ? -7 : 0,
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                  style={{
                    display: 'block',
                    width: '24px',
                    height: '2px',
                    background: scrolled ? 'var(--black)' : '#fff',
                    borderRadius: '2px',
                    transformOrigin: 'center',
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(320px, 100vw)',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              zIndex: 999,
              padding: '80px 32px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              borderLeft: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '-4px 0 40px rgba(0,0,0,0.12)',
            }}
          >
            {NAV_LINKS.map(({ label, href, external }, idx) => (
              <motion.a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--black)',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  fontFamily: 'var(--font-body)',
                }}
                onClick={(e) => {
                  setMenuOpen(false)
                  embedLink(href, t(label))(e)
                }}
              >
                {t(label)}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={toggleLang}
              style={{
                marginTop: '24px',
                padding: '12px 24px',
                borderRadius: '100px',
                border: '1px solid rgba(168,0,0,0.3)',
                color: 'var(--red)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: 'rgba(168,0,0,0.05)',
                alignSelf: 'flex-start',
                fontFamily: 'var(--font-body)',
              }}
            >
              {i18n.language === 'tr' ? 'Switch to English' : "Türkçe'ye Geç"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.35)',
              zIndex: 998,
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .header-cta { display: inline-flex !important; align-items: center; }
        }
      `}</style>
    </>
  )
}
