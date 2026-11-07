import { Link } from 'react-router-dom'

const base =
  'group/btn relative isolate inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full px-6 text-sm font-semibold transition-[color,border-color,box-shadow,transform] duration-500 ease-out-expo active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60'

const fallbackVariant = {
  rest: 'bg-ember text-white hover:shadow-[0_14px_34px_-12px_rgb(31_111_178/0.8)]',
  fill: 'bg-sky',
}

// Each variant names its resting colours and the colour that floods in on hover.
// The flood colours pair the palette up: red buttons fill blue, green fill red,
// so every hover shows a second colour of the theme.
const variants = {
  primary: fallbackVariant,
  leaf: {
    rest: 'bg-leaf text-white hover:shadow-[0_14px_34px_-12px_rgb(200_55_45/0.8)]',
    fill: 'bg-ember',
  },
  light: { rest: 'bg-paper text-ink', fill: 'bg-leaf-soft' },
  outline: {
    rest: 'border border-paper/40 text-paper hover:border-paper hover:text-ink focus-visible:border-paper focus-visible:text-ink',
    fill: 'bg-paper',
  },
  outlineDark: {
    rest: 'border border-ink/25 text-ink hover:border-ink hover:text-paper focus-visible:border-ink focus-visible:text-paper',
    fill: 'bg-ink',
  },
  ghost: {
    rest: 'border border-ink/15 text-ink hover:border-ink hover:text-paper focus-visible:border-ink focus-visible:text-paper',
    fill: 'bg-ink',
  },
  whatsapp: { rest: 'bg-whatsapp text-white', fill: 'bg-leaf-deep' },
}

// Renders a router <Link> when given `to` (another page of the site), an <a>
// when given an href and a <button> otherwise (actions), so every button on the
// site is a real, accessible control.
// Hover: a circle of the fill colour rises from below while the label rolls
// up and a fresh copy rolls in behind it.
function Button({ to, href, variant = 'primary', className = '', children, external = false, ...props }) {
  const chosen = (variant && variants[variant]) || fallbackVariant
  const rest = chosen.rest || ''
  const fill = chosen.fill || ''
  const classes = `${base} ${rest} ${className}`

  const content = (
    <>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-full -z-10 aspect-square w-[160%] -translate-x-1/2 rounded-full transition-transform duration-700 ease-out-expo group-hover/btn:-translate-y-1/2 group-focus-visible/btn:-translate-y-1/2 ${fill}`}
      />
      <span className="relative block overflow-hidden py-1">
        <span className="flex items-center justify-center gap-2.5 transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-[130%] group-focus-visible/btn:-translate-y-[130%]">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex translate-y-[130%] items-center justify-center gap-2.5 transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0 group-focus-visible/btn:translate-y-0"
        >
          {children}
        </span>
      </span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <a href={href} className={classes} {...externalProps} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}

export default Button
