import { memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import SmartImage from '../../components/ui/SmartImage.jsx'
import { TiltGlare } from '../../components/ui/Tilt.jsx'
import { useTilt } from '../../hooks/useTilt.js'
import { formatPrice } from '../../data/packages.js'
import { CATEGORY_TONES } from '../../data/accents.js'
import { useEnquire } from '../inquiry/useEnquire.js'

const EASE = [0.16, 1, 0.3, 1]
const VISIBLE_PLACES = 3

// Compact package card for the packages page. "View more" opens the full
// details of this package in a popup.
function PackageTile({ item, index, onView }) {
  const enquire = useEnquire()
  const tilt = useTilt(6)
  const tone = CATEGORY_TONES[item.category]
  const serviceLabel = item.category === 'domestic' ? 'Domestic tour package' : 'International tour package'
  const morePlaces = item.places.length - VISIBLE_PLACES

  return (
    <motion.article
      layout
      aria-labelledby={`tile-${item.id}-title`}
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: EASE }}
      style={tilt.style}
      {...tilt.handlers}
      className="theme-base group relative flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_20px_40px_-30px_rgb(15_23_42/0.3)] ring-1 ring-ink/[0.07] transition-shadow duration-500 hover:shadow-[0_40px_70px_-35px_rgb(15_23_42/0.45)]"
    >
      <TiltGlare tilt={tilt} />

      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage
          src={item.image}
          alt={item.imageAlt}
          label={item.region}
          className="h-full w-full"
          imgClassName="transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.07]"
        />
        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur">
            {item.badge}
          </span>
        )}
        <span
          className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white ${tone.solid}`}
        >
          <CalendarDays size={13} aria-hidden="true" />
          {item.nights}N / {item.days}D
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className={`flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] ${tone.text}`}>
          <MapPin size={12} aria-hidden="true" />
          {item.region} · {item.category}
        </p>
        <h2 id={`tile-${item.id}-title`} className="mt-2 text-[1.6rem] leading-tight text-ink">
          {item.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate">{item.description}</p>
        <p className="mt-3 text-xs leading-5 text-slate">
          {item.places.slice(0, VISIBLE_PLACES).join(' · ')}
          {morePlaces > 0 && <span className="font-semibold text-ink"> +{morePlaces} more</span>}
        </p>

        <div className="mt-auto pt-5">
          <p className="border-t border-ink/10 pt-4">
            <span className="block text-[0.65rem] uppercase tracking-[0.14em] text-slate">From</span>
            <span className="font-display text-[1.7rem] leading-none text-ink">{formatPrice(item.price, item.currency)}</span>
            <span className="mt-1 block text-[0.7rem] text-slate">{item.priceBasis}</span>
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button onClick={() => onView(item)} aria-haspopup="dialog" className="min-h-11! whitespace-nowrap px-3! text-[0.8rem]! min-[360px]:px-4! min-[360px]:text-sm!">
            View more
            <ArrowUpRight size={16} aria-hidden="true" className="transition-transform group-hover/btn:rotate-45" />
          </Button>
          <Button
            variant="outlineDark"
            className="min-h-11! whitespace-nowrap px-3! text-[0.8rem]! min-[360px]:px-4! min-[360px]:text-sm!"
            onClick={() => enquire({ service: serviceLabel, destination: item.title })}
          >
            Enquire
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

// Memoised: typing in the search box or changing the sort only re-renders
// tiles whose package or position changed.
export default memo(PackageTile)
