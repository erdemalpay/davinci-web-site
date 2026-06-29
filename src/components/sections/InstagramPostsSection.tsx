import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useInstagramPosts, type InstagramPost } from '../../utils/api/instagramPosts/instagramPosts'

function resolvePostImage(post: InstagramPost) {
  return post.thumbnail_url ?? post.media_url ?? ''
}

function formatDate(value?: string, locale = 'tr-TR') {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function shortCaption(caption?: string | null) {
  if (!caption) return ''
  return caption.length > 84 ? `${caption.slice(0, 84).trim()}...` : caption
}

export default function InstagramPostsSection() {
  const { t, i18n } = useTranslation()
  const { data, isLoading, isError } = useInstagramPosts(8)
  const posts = useMemo(() => (data ?? []).filter((post) => resolvePostImage(post)), [data])
  const loopPosts = useMemo(() => [...posts, ...posts], [posts])

  return (
    <section className="section-base instagram-feed-section">
      <div className="container-xl">
        <div className="instagram-feed-header">
          <a
            href="https://www.instagram.com/davinciboardgame/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '999px',
              backgroundColor: 'transparent',
              color: '#374151',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            davinciboardgame
          </a>
          <h2>{t('Latest Posts')}</h2>
        </div>

        {isLoading && (
          <div className="instagram-skeleton-grid" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="instagram-skeleton-card" key={index}>
                <div className="instagram-skeleton-image instagram-shimmer" />
                <div className="instagram-skeleton-body">
                  <div className="instagram-skeleton-line instagram-shimmer" />
                  <div className="instagram-skeleton-line instagram-skeleton-line-short instagram-shimmer" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="instagram-feed-state">
            <p>{t('Instagram content could not be loaded right now.')}</p>
          </div>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="instagram-feed-state">
            <p>{t('No posts to display yet.')}</p>
          </div>
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <div className="instagram-feed-marquee">
            <div className="instagram-feed-track" aria-label="Instagram post listesi">
              {loopPosts.map((post, index) => {
                const image = resolvePostImage(post)
                const caption = shortCaption(post.caption)
                const dateText = formatDate(post.timestamp, i18n.language === 'tr' ? 'tr-TR' : 'en-US')
                return (
                  <a
                    key={`${post.id}-${index}`}
                    className="instagram-feed-card"
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('Open post on Instagram')}
                  >
                    <div className="instagram-feed-media">
                      <img className="instagram-feed-media-image" src={image} alt={caption || 'Instagram'} loading="lazy" />
                    </div>
                    <div className="instagram-feed-card-body">
                      <p>{caption}</p>
                      {dateText && <small>{dateText}</small>}
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
