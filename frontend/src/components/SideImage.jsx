import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const imageAnimation = { x: 24 }
const contentAnimation = { y: 24 }

/**
 * A side image that animates into view and drifts subtly as the user scrolls
 * (gentle parallax), anchoring a section's copy to a visual. Pass `side="left"`
 * to place the image before (left of) the copy, `side="right"` for after.
 */
export function SideImage({ src, alt = '', side = 'right', className = '', children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.75, 1, 1, 0.9])

  const image = (
    <motion.div
      initial={imageAnimation}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
      className="relative"
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale, opacity }}
        className="aspect-[7/5] w-full rounded-2xl object-cover shadow-lg"
      />
    </motion.div>
  )

  const content = (
    <motion.div
      initial={contentAnimation}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-w-0"
    >
      {children}
    </motion.div>
  )

  return (
    <div ref={ref} className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${className}`}>
      {side === 'left' ? (
        <>
          {image}
          {content}
        </>
      ) : (
        <>
          {content}
          {image}
        </>
      )}
    </div>
  )
}
