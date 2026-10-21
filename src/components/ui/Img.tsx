import { useState, type ImgHTMLAttributes } from 'react'
import { img, srcSet, type ImageKey } from '../../data/images'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  name: ImageKey
  alt: string
  sizes?: string
  priority?: boolean
  width?: number
}

/** Responsive Unsplash image with a soft fade-in and a graceful fallback. */
export function Img({ name, alt, sizes = '100vw', priority, className = '', width = 1200, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} bg-linear-to-br from-lagoon/40 via-sand to-gold/30`}
      />
    )
  }
  return (
    <img
      src={img(name, width)}
      srcSet={srcSet(name)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      {...rest}
    />
  )
}
