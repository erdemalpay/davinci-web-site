import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

const CREAM = '#FFF4DF'
const INK = '#1F2937'

const icons = {
  cup: (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13h17v6a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7v-6z" fill="currentColor" fillOpacity="0.15" />
      <path d="M22 15h2.5a3.5 3.5 0 0 1 0 7H21" />
      <path d="M11 4c-1 1.5 1 2.5 0 4M15 4c-1 1.5 1 2.5 0 4M19 4c-1 1.5 1 2.5 0 4" />
      <path d="M4 29h22" />
    </svg>
  ),
  calendar: (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="24" height="22" rx="3" fill="currentColor" fillOpacity="0.15" />
      <path d="M4 12h24M10 3v6M22 3v6" />
      <path d="M10 17h2M15 17h2M20 17h2M10 22h2M15 22h2M20 22h2" />
    </svg>
  ),
  dice: (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <rect x="5" y="5" width="22" height="22" rx="5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="11" cy="11" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="21" cy="11" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="11" cy="21" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="21" cy="21" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  cart: (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h4l3 15h15l3-11H8.5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="12" cy="26" r="2" />
      <circle cx="23" cy="26" r="2" />
    </svg>
  ),
}

interface CardProps {
  icon: ReactNode
  label: string
  href?: string
  onClick?: () => void
  compact: boolean
  children?: ReactNode
  wide?: boolean
}

function Card({ icon, label, href, onClick, compact, children, wide }: CardProps) {
  const style = {
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
    gap: compact ? '4px' : '6px',
    background: CREAM, color: 'var(--red)',
    border: wide ? '3px solid var(--red)' : '2px solid rgba(168,0,0,0.22)',
    borderRadius: compact ? '12px' : '16px',
    padding: compact ? '8px 4px' : '12px 10px',
    minWidth: 0, width: '100%', alignSelf: 'stretch' as const, boxSizing: 'border-box' as const,
    flex: compact ? '1 1 0' : undefined,
    minHeight: compact ? '72px' : '98px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.28)',
    cursor: 'pointer', fontFamily: 'var(--font-body)',
  }
  const content = (
    <>
      {icon}
      <span style={{
        color: INK, fontWeight: 800, fontSize: compact ? '0.7rem' : '0.88rem',
        lineHeight: 1.15, textAlign: 'center',
      }}>
        {label}
      </span>
      {children}
    </>
  )
  const motionProps = { whileHover: { y: -4 }, whileTap: { scale: 0.96 } }

  return href ? (
    <motion.a href={href} target="_blank" rel="noopener noreferrer" style={style} {...motionProps}>
      {content}
    </motion.a>
  ) : (
    <motion.button type="button" onClick={onClick} style={style} {...motionProps}>
      {content}
    </motion.button>
  )
}

interface HeroMeepleoProps {
  compact: boolean
  onEventsClick?: () => void
}

export default function HeroMeepleo({ compact, onEventsClick }: HeroMeepleoProps) {
  const { t } = useTranslation()

  const smallCards = [
    <Card key="cafe" compact={compact} icon={icons.cup} label={t('Is There Space at the Cafe?')} href="https://yervarmi.davinciboardgame.com" />,
    onEventsClick && (
      <Card key="events" compact={compact} icon={icons.calendar} label={t('See Events')} onClick={onEventsClick} />
    ),
    <Card key="games" compact={compact} icon={icons.dice} label={t('Discover Games')} href="https://buoyunvarmi.davinciboardgame.com" />,
  ].filter(Boolean)

  const storeCard = (
    <Card compact={compact} wide={!compact} icon={icons.cart} label={t('Online Store')} href="https://kutuoyunual.com">
      {!compact && (
        <span style={{
          marginTop: '2px', background: 'var(--red)', color: '#fff', borderRadius: '100px',
          padding: '3px 12px', fontSize: '0.78rem', fontWeight: 700,
        }}>
          kutuoyunual.com
        </span>
      )}
    </Card>
  )

  const cards = (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
      {smallCards}
      {storeCard}
    </div>
  )

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.05 }}
        style={{ marginTop: '20px' }}
      >
        {cards}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.0 }}
      style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}
    >
      <img
        src="/images/meepleo.png"
        alt="Meepleo"
        style={{ height: 'clamp(150px, min(30vh, 18vw), 280px)', width: 'auto', display: 'block', flexShrink: 0, marginRight: '-6px' }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${smallCards.length}, clamp(96px, 8.4vw, 140px)) clamp(150px, 13vw, 210px)`,
        columnGap: '10px', rowGap: '14px', alignItems: 'end',
        paddingBottom: '28px',
      }}>
        <div style={{
          gridColumn: `1 / span ${smallCards.length}`,
          position: 'relative', background: CREAM, color: INK,
          borderRadius: '32px', padding: '16px 24px', textAlign: 'center',
          boxShadow: '0 10px 28px rgba(0,0,0,0.3)',
        }}>
          <span style={{
            position: 'absolute', left: '-9px', bottom: '26px', width: '24px', height: '24px',
            background: CREAM, transform: 'rotate(45deg)', borderRadius: '4px',
          }} />
          <p style={{ position: 'relative', margin: 0, fontWeight: 800, fontSize: '1.35rem', lineHeight: 1.2 }}>
            {t('Hello! I\'m Meepleo!')} 👋
          </p>
          <p style={{ position: 'relative', margin: '6px 0 0', fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.4 }}>
            {t('Welcome to the board game world with our cafe, events and online store!')}
          </p>
        </div>
        <img
          src="/images/koa-logo.png"
          alt="Kutu Oyunu Al"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        {smallCards}
        {storeCard}
      </div>
    </motion.div>
  )
}
