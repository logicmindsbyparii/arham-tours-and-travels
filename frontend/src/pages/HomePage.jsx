import Seo from '../components/seo/Seo.jsx'
import HeroSection from '../sections/HeroSection.jsx'
import AboutSection from '../sections/AboutSection.jsx'
import ContactSection from '../sections/ContactSection.jsx'
import TourPackagesSection from '../features/packages/TourPackagesSection.jsx'
import DestinationsSection from '../features/destinations/DestinationsSection.jsx'
import ServicesSection from '../features/services/ServicesSection.jsx'
import CarRentalSection from '../features/car-rental/CarRentalSection.jsx'
import TestimonialsSection from '../features/testimonials/TestimonialsSection.jsx'

// The home page gives a taste of every section; each also has its own page
// (see data/navigation.js).
function HomePage() {
  return (
    <>
      <Seo path="/" />
      <HeroSection />
      <AboutSection />
      <TourPackagesSection />
      <DestinationsSection />
      <ServicesSection />
      <CarRentalSection />
      <TestimonialsSection />
      <ContactSection withMap />
    </>
  )
}

export default HomePage
