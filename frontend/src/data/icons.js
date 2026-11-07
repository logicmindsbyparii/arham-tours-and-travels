// Service icons by name. The names match SERVICE_ICONS in
// backend/src/models/Service.js; the admin picks one per service.
import { Bus, Camera, CarFront, Globe, Hotel, Luggage, Map, Plane, ShieldCheck, Ship, Stamp, Train } from 'lucide-react'

export const SERVICE_ICONS = { Plane, Stamp, Hotel, Ship, CarFront, Luggage, Train, Bus, Globe, ShieldCheck, Map, Camera }

export const serviceIcon = (name) => SERVICE_ICONS[name] ?? Plane
