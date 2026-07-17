import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface SlideMonthlyProps {
  monthlyImageUrl: string
  onImageClick: () => void
}

export default function SlideMonthly({ monthlyImageUrl, onImageClick }: SlideMonthlyProps) {
  const { t } = useTranslation()

  return (
    <div style={{ position: 'relative', height: '100vh', minHeight: '600px' }}>
      <img
        src="/images/davinci-board-game-cafe.webp"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(17,24,39,0.93) 0%, rgba(17,24,39,0.65) 50%, rgba(17,24,39,0.85) 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(0deg, rgba(17,24,39,1) 0%, transparent 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 40px',
      }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          {t('Monthly Activity')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{
            position: 'relative', padding: '8px', borderRadius: '20px',
            background: 'linear-gradient(145deg, #A80000, #540000, rgba(168,0,0,0.4))',
            boxShadow: '0 0 0 1px rgba(168,0,0,0.5), 0 24px 64px rgba(0,0,0,0.6), 0 0 32px rgba(168,0,0,0.2)',
            width: '100%', maxWidth: '360px',
          }}
        >
          <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--red)', boxShadow: '0 2px 8px rgba(168,0,0,0.6)', zIndex: 2 }} />
          <div
            style={{ borderRadius: '14px', overflow: 'hidden', background: '#000', cursor: 'pointer' }}
            onClick={onImageClick}
          >
            <img
              src={monthlyImageUrl}
              alt="monthly activity"
              style={{ width: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
