import { useState, type ImgHTMLAttributes } from 'react'
import { img, lqip, srcSet, type ImageKey } from '../../data/images'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  name: ImageKey
  alt: string
  sizes?: string
  priority?: boolean
  width?: number
}

/**
 * Responsive Unsplash image with a blurred low-quality preview that sharpens
 * once the full image arrives, plus a graceful fallback if it fails.
 */
export function Img({ name, alt, sizes = '100vw', priority, className = '', width = 1200, style, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <div role="img" aria-label={alt} className={`${className} bg-linear-to-br from-lagoon/40 via-sand to-gold/30`} />
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
      style={{
        ...style,
        backgroundImage: loaded ? undefined : `url("${lqip(name)}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // one shared transition so hover zooms and the blur-up never fight over transition-property
        transition: 'filter 1s ease-out, scale 1.6s cubic-bezier(.22,1,.36,1), transform 1.6s cubic-bezier(.22,1,.36,1), opacity .7s ease',
      }}
      className={`${className} ${loaded ? 'blur-0' : 'blur-lg'}`}
      {...rest}
    />
  )
}
