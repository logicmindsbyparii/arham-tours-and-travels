import Reveal from './Reveal.jsx'
import SplitHeading from './SplitHeading.jsx'

// Accent colour of the eyebrow and the italic words, per theme colour:
// light shades for the navy sections, deep shades for the paper ones.
const ACCENT_TEXT = {
  red: { light: 'text-ember-soft', dark: 'text-ember-deep' },
  blue: { light: 'text-sky-soft', dark: 'text-sky-deep' },
  green: { light: 'text-leaf-soft', dark: 'text-leaf-deep' },
}

// tone="dark" is for sections on the light paper background.
// accentTone picks red, blue or green, so neighbouring sections can differ.
function SectionHeading({
  eyebrow,
  title,
  accent,
  intro,
  tone = 'light',
  accentTone = 'red',
  align = 'left',
  id,
  className = '',
}) {
  const isDark = tone === 'dark'
  const accentClass = ACCENT_TEXT[accentTone][isDark ? 'dark' : 'light']
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start'

  return (
    <Reveal className={`flex max-w-3xl flex-col ${alignment} ${className}`}>
      <span className={`eyebrow ${accentClass}`}>{eyebrow}</span>
      <SplitHeading
        id={id}
        text={title}
        accent={accent}
        accentClassName={accentClass}
        className={`mt-5 text-[clamp(1.9rem,5.5vw,4.8rem)] leading-[1.04] ${isDark ? 'text-ink' : 'text-paper'}`}
      />
      {intro && (
        <p className={`mt-6 max-w-xl text-base leading-7 ${isDark ? 'text-slate' : 'text-mist'}`}>{intro}</p>
      )}
    </Reveal>
  )
}

export default SectionHeading
