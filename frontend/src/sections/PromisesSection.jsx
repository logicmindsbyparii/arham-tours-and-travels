import Container from '../components/ui/Container.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { PROMISES } from '../data/promises.js'

// "Why travel with us": three promise cards.
function PromisesSection() {
  return (
    <section aria-labelledby="promises-title" className="bg-paper py-20 text-ink sm:py-28">
      <Container>
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-sky-deep">Why travel with us</span>
          <h2 id="promises-title" className="mt-5 text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.08]">
            Planned like <em className="italic text-sky-deep">we were going too.</em>
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-6 sm:mt-14 md:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, text, tone }, index) => (
            <Reveal
              as="li"
              key={title}
              delay={index * 0.1}
              className="group relative overflow-hidden rounded-[24px] bg-paper-2 p-7 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-35px_rgb(15_23_42/0.4)] sm:p-8"
            >
              <span
                aria-hidden="true"
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 transition-transform duration-700 ease-out-expo group-hover:scale-[2.5] ${tone}`}
              />
              <span className={`relative flex h-12 w-12 items-center justify-center rounded-2xl text-white ${tone}`}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="relative mt-6 text-xl font-semibold text-ink sm:text-2xl">{title}</h3>
              <p className="relative mt-3 text-sm leading-6 text-slate">{text}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default PromisesSection
