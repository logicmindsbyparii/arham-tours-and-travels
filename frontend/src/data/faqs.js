// Frequently asked questions for each page. They are also published as FAQPage
// structured data for search engines (components/seo/FaqSection.jsx).
//
// NOTE FOR THE OWNER: answers only repeat what the packages, services and
// contact details on this site already say. Add questions customers really ask.
import { ADDRESS, BUSINESS, EMAILS, PHONE_NUMBERS } from '../config/business.js'

const phones = PHONE_NUMBERS.map((phone) => phone.label).join(' or ')

export const FAQS = {
  destinations: [
    {
      question: 'Which destinations do your tour packages cover?',
      answer:
        'Our current packages cover Vietnam (Da Nang, Hoi An, Ba Na Hills, Phu Quoc, Hanoi, Ninh Binh and Ha Long Bay) and Goa. We also plan trips to other destinations on request.',
    },
    {
      question: 'What is included in the Vietnam group departure?',
      answer:
        'Our Vietnam group departures include return international flights, internal flights, 4-star stays, meals, the Vietnam tourist visa and an experienced Gujarati tour manager throughout the trip.',
    },
    {
      question: 'Is a Ha Long Bay cruise included?',
      answer: 'Yes, on the 7 night Vietnam Group Departure with Phu Quoc, which includes a night on a 4-star Ha Long Bay cruise.',
    },
    {
      question: 'Can you plan a trip to a place that is not listed?',
      answer: `Yes. Share your destination, dates and budget through the enquiry form, on WhatsApp or by calling ${phones}, and we will send you options and a quote.`,
    },
  ],
  services: [
    {
      question: 'Can I book flights, hotels or a visa without a tour package?',
      answer:
        'Yes. Flight tickets, visa assistance, hotel booking and cruises can be part of your package or booked on their own.',
    },
    {
      question: 'Do you help with visa applications?',
      answer:
        'Yes. We guide you on the documents your destination needs and help with the application. The Vietnam tourist visa is already included in our 7 night Vietnam with Phu Quoc package.',
    },
    {
      question: 'Do you book group flight tickets?',
      answer: 'Yes. We book domestic and international flights, including group bookings.',
    },
    {
      question: 'How do I get a quote?',
      answer: `Send an enquiry from this page, message us on WhatsApp or call ${phones}. We come back with options and a quote.`,
    },
  ],
  carRental: [
    {
      question: 'Do you offer car rental with a driver in Surat?',
      answer: `Yes. ${BUSINESS.name} arranges a car and driver for airport transfers, local sightseeing, outstation trips and group travel.`,
    },
    {
      question: 'How much does car rental cost?',
      answer:
        'The price depends on the vehicle, the route and the number of days. Tell us your trip type, route and dates and we will suggest a suitable vehicle and send a quote.',
    },
    {
      question: 'Can you arrange an early-morning airport drop?',
      answer: 'Yes. Airport transfers are one of the trip types we arrange. Share your flight time and pickup point when you enquire.',
    },
  ],
  contact: [
    {
      question: 'Where is your office?',
      answer: `Our office is at ${ADDRESS.lines.join(', ')} (${BUSINESS.legalName}).`,
    },
    {
      question: 'What are your office hours?',
      answer: `We are open ${BUSINESS.hours}.`,
    },
    {
      question: 'How can I contact you?',
      answer: `Call ${BUSINESS.contactPerson} on ${phones}, email ${EMAILS[0]}, send a WhatsApp message or use the enquiry form on this page.`,
    },
  ],
  visa: [
    {
      question: 'Can you guarantee that my visa will be approved?',
      answer:
        'No. Visa approval is at the sole discretion of the respective embassy or consulate. Our role is to ensure your application form is accurate, your documentation is complete according to official rules, and your submission is processed smoothly.',
    },
    {
      question: 'What is the difference between embassy fee and service fee?',
      answer:
        'The embassy fee is the mandatory government fee charged by the consulate or visa processing centre. Our service fee covers document verification, form filling, appointment booking, and submission assistance.',
    },
    {
      question: 'How long before my travel date should I apply for a visa?',
      answer:
        'We recommend applying at least 3 to 4 weeks before your intended departure date, or earlier for destinations with longer consular processing times or high seasonal demand.',
    },
    {
      question: 'Can I send documents online, or do I need to visit your office?',
      answer:
        'You can share scanned copies or clear photos of your documents via WhatsApp or email for an initial pre-check. If physical passport submission or biometrics is required, our Surat team will guide you on the next steps.',
    },
    {
      question: 'What happens if my visa application is delayed by the embassy?',
      answer:
        'Processing times provided are estimates based on standard consulate timelines. Embassies may take additional time for verification during peak seasons. We track your application and keep you updated throughout.',
    },
    {
      question: 'Are visa fees refundable if my plans change or if the visa is refused?',
      answer:
        'Consulate and embassy fees are non-refundable once an application is submitted to the embassy. Our service fee is charged for the work performed in reviewing, compiling, and filing the application.',
    },
  ],
}
