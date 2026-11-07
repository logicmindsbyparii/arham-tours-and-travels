import mongoose from 'mongoose'
import { cleanJson } from './plugins.js'

const fixedFareSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, default: () => new mongoose.Types.ObjectId().toString() },
    route: { type: String, required: true, trim: true, maxlength: 120 },
    from: { type: String, trim: true, default: '' },
    to: { type: String, trim: true, default: '' },
    type: { type: String, trim: true, default: 'one-way' },
    prices: {
      sedan: { type: Number, default: 0 },
      ertiga: { type: Number, default: 0 },
      innova: { type: Number, default: 0 },
      innovaCrysta: { type: Number, default: 0 },
    },
  },
  { _id: false },
)

const localDutySchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, default: () => new mongoose.Types.ObjectId().toString() },
    package: { type: String, required: true, trim: true, maxlength: 80 },
    duration: { type: String, trim: true, default: '' },
    distance: { type: String, trim: true, default: '' },
    tag: { type: String, trim: true, default: '' },
    prices: {
      sedan: { type: Number, default: 0 },
      ertiga: { type: Number, default: 0 },
      innova: { type: Number, default: 0 },
      innovaCrysta: { type: Number, default: 0 },
    },
  },
  { _id: false },
)

const extraChargeSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, default: () => new mongoose.Types.ObjectId().toString() },
    vehicle: { type: String, required: true, trim: true, maxlength: 80 },
    subtitle: { type: String, trim: true, default: '' },
    extraHr: { type: Number, default: 0 },
    extraKm: { type: Number, default: 0 },
    outstationPerKm: { type: Number, default: 0 },
  },
  { _id: false },
)

const tempoBusSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    capacity: { type: String, trim: true, default: '' },
    idealFor: { type: String, trim: true, default: '' },
    outstationPerKm: { type: String, trim: true, default: 'Call for price' },
    local8hr80km: { type: String, trim: true, default: 'Call for price' },
    local12hr100km: { type: String, trim: true, default: 'Call for price' },
    driverAllowance: { type: String, trim: true, default: '' },
  },
  { _id: false },
)

const tempoRouteSchema = new mongoose.Schema(
  {
    route: { type: String, required: true, trim: true, maxlength: 120 },
    winger: { type: String, trim: true, default: 'Call for price' },
    tempo12: { type: String, trim: true, default: 'Call for price' },
    tempo17: { type: String, trim: true, default: 'Call for price' },
    tempo20: { type: String, trim: true, default: 'Call for price' },
  },
  { _id: false },
)

const carRentalRateSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'rates', unique: true, immutable: true },
    note: {
      type: String,
      trim: true,
      default: 'GST 5% extra on total bill amount. Toll tax, parking & border tax extra as applicable.',
    },
    outstationFixedFares: { type: [fixedFareSchema], default: [] },
    localDuty: { type: [localDutySchema], default: [] },
    extraCharges: { type: [extraChargeSchema], default: [] },
    termsAndConditions: { type: [String], default: [] },
    tempoBusVehicles: { type: [tempoBusSchema], default: [] },
    tempoBusFixedRoutes: { type: [tempoRouteSchema], default: [] },
  },
  { timestamps: true },
)

cleanJson(carRentalRateSchema)

export const CarRentalRate = mongoose.model('CarRentalRate', carRentalRateSchema)

