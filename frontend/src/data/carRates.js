// Standard published car rental rates for Arham Tours & Travels, Surat.
// Edit this file to update rental rates, route fares, local duty, or terms.

export const CAR_COLUMNS = [
  { id: 'sedan', name: 'Sedan', subtitle: 'Dzire / Etios / Aura', capacity: '4+1 Seater' },
  { id: 'ertiga', name: 'SUV (Ertiga)', subtitle: 'Maruti Ertiga / XL6', capacity: '6+1 Seater' },
  { id: 'innova', name: 'SUV (Innova)', subtitle: 'Toyota Innova', capacity: '6/7+1 Seater' },
  { id: 'innovaCrysta', name: 'SUV (Innova Crysta)', subtitle: 'Innova Crysta Luxury', capacity: '6/7+1 Seater' },
]

export const OUTSTATION_FIXED_FARES = [
  {
    id: 'surat-mumbai-airport',
    route: 'Surat to Mumbai Airport',
    from: 'Surat',
    to: 'Mumbai Airport',
    type: 'one-way',
    prices: {
      sedan: 3500,
      ertiga: 4500,
      innova: 5500,
      innovaCrysta: 7500,
    },
  },
  {
    id: 'mumbai-airport-surat',
    route: 'Mumbai Airport to Surat',
    from: 'Mumbai Airport',
    to: 'Surat',
    type: 'one-way',
    prices: {
      sedan: 3500,
      ertiga: 4500,
      innova: 5500,
      innovaCrysta: 7500,
    },
  },
  {
    id: 'surat-vapi',
    route: 'Surat to Vapi',
    from: 'Surat',
    to: 'Vapi',
    type: 'one-way',
    prices: {
      sedan: 2500,
      ertiga: 3500,
      innova: 4500,
      innovaCrysta: 5000,
    },
  },
  {
    id: 'vapi-surat',
    route: 'Vapi to Surat',
    from: 'Vapi',
    to: 'Surat',
    type: 'one-way',
    prices: {
      sedan: 2500,
      ertiga: 3500,
      innova: 4500,
      innovaCrysta: 5000,
    },
  },
  {
    id: 'surat-vadodara',
    route: 'Surat to Vadodara',
    from: 'Surat',
    to: 'Vadodara',
    type: 'one-way',
    prices: {
      sedan: 2500,
      ertiga: 3500,
      innova: 4500,
      innovaCrysta: 5000,
    },
  },
  {
    id: 'vadodara-surat',
    route: 'Vadodara to Surat',
    from: 'Vadodara',
    to: 'Surat',
    type: 'one-way',
    prices: {
      sedan: 2500,
      ertiga: 3500,
      innova: 4500,
      innovaCrysta: 5000,
    },
  },
]

export const SURAT_LOCAL_DUTY = [
  {
    id: 'local-12hr-100km',
    package: '12 hr / 100 km',
    duration: '12 Hours',
    distance: '100 Kms',
    tag: 'Full day duty',
    prices: {
      sedan: 2500,
      ertiga: 3200,
      innova: 3500,
      innovaCrysta: 4500,
    },
  },
  {
    id: 'local-8hr-80km',
    package: '8 hr / 80 km',
    duration: '8 Hours',
    distance: '80 Kms',
    tag: 'Half day / Standard duty',
    prices: {
      sedan: 2000,
      ertiga: 2700,
      innova: 3000,
      innovaCrysta: 4000,
    },
  },
]

export const EXTRA_CHARGES = [
  {
    id: 'sedan',
    vehicle: 'Sedan',
    subtitle: 'Dzire / Etios / Aura',
    extraHr: 100,
    extraKm: 12,
    outstationPerKm: 12,
  },
  {
    id: 'ertiga',
    vehicle: 'SUV (Ertiga)',
    subtitle: 'Maruti Ertiga / XL6',
    extraHr: 100,
    extraKm: 13,
    outstationPerKm: 13,
  },
  {
    id: 'innova',
    vehicle: 'SUV (Innova)',
    subtitle: 'Toyota Innova',
    extraHr: 100,
    extraKm: 15,
    outstationPerKm: 15,
  },
  {
    id: 'innovaCrysta',
    vehicle: 'SUV (Innova Crysta)',
    subtitle: 'Innova Crysta Luxury',
    extraHr: 150,
    extraKm: 18,
    outstationPerKm: 18,
  },
]

export const TERMS_AND_CONDITIONS = [
  'GST 5% extra on total bill amount.',
  'Driver allowance ₹300 per day for out-station (300 km range per day minimum).',
  'Toll tax, parking, state & border taxes extra as applicable / actuals.',
  'Payment within 15 days after submission of invoice.',
  'These rates are not applicable in Diwali season / peak festival dates.',
]

// Heavy passenger & group travel: Tempo Traveller, Winger & Luxury Buses.
export const TEMPO_BUS_VEHICLES = [
  {
    id: 'winger',
    name: 'Tata Winger AC',
    capacity: '9 to 12 Seater',
    idealFor: 'Family airport transfers & small group travel',
    outstationPerKm: 'Call for price',
    local8hr80km: 'Call for price',
    local12hr100km: 'Call for price',
    driverAllowance: '₹400 / day',
  },
  {
    id: 'tempo12',
    name: 'Tempo Traveller (12 Seater)',
    capacity: '12+1 Seater (Pushback)',
    idealFor: 'Outstation trips, weddings, corporate groups',
    outstationPerKm: 'Call for price',
    local8hr80km: 'Call for price',
    local12hr100km: 'Call for price',
    driverAllowance: '₹500 / day',
  },
  {
    id: 'tempo17',
    name: 'Tempo Traveller (17 Seater)',
    capacity: '17+1 Seater (Pushback AC)',
    idealFor: 'Tour groups, pilgrim trips (Shirdi, Somnath)',
    outstationPerKm: 'Call for price',
    local8hr80km: 'Call for price',
    local12hr100km: 'Call for price',
    driverAllowance: '₹500 / day',
  },
  {
    id: 'tempo20',
    name: 'Tempo Traveller (20 / 26 Seater)',
    capacity: '20 to 26 Seater Luxury',
    idealFor: 'Large families, schools & corporate excursions',
    outstationPerKm: 'Call for price',
    local8hr80km: 'Call for price',
    local12hr100km: 'Call for price',
    driverAllowance: '₹500 / day',
  },
  {
    id: 'minibus',
    name: 'Mini Luxury Bus',
    capacity: '28 to 35 Seater AC',
    idealFor: 'Marriage parties, long distance holiday tours',
    outstationPerKm: 'Call for price',
    local8hr80km: 'Call for price',
    local12hr100km: 'Call for price',
    driverAllowance: '₹600 / day',
  },
  {
    id: 'largebus',
    name: 'Luxury Coach / Volvo Bus',
    capacity: '45 to 56 Seater AC',
    idealFor: 'Grand events, school picnics, pan-India tours',
    outstationPerKm: 'Call for price',
    local8hr80km: 'Call for price',
    local12hr100km: 'Call for price',
    driverAllowance: '₹800 / day',
  },
]

export const TEMPO_BUS_FIXED_ROUTES = [
  {
    route: 'Surat to Mumbai Airport',
    winger: 'Call for price',
    tempo12: 'Call for price',
    tempo17: 'Call for price',
    tempo20: 'Call for price',
  },
  {
    route: 'Surat to Statue of Unity (Round Trip)',
    winger: 'Call for price',
    tempo12: 'Call for price',
    tempo17: 'Call for price',
    tempo20: 'Call for price',
  },
  {
    route: 'Surat to Shirdi (Round Trip)',
    winger: 'Call for price',
    tempo12: 'Call for price',
    tempo17: 'Call for price',
    tempo20: 'Call for price',
  },
]

