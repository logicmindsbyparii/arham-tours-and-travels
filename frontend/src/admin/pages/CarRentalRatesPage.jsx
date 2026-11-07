import { useState } from 'react'
import {
  Car,
  Plus,
  Trash2,
  Save,
  Route,
  Clock,
  FileText,
  Bus,
  ExternalLink,
} from 'lucide-react'
import { useApiQuery, useMutation } from '../hooks.js'
import { useToast } from '../toast.js'
import { announceSiteChange } from '../../features/site/siteSlice.js'
import { fallbackCarRates } from '../../features/site/fallbackSite.js'
import { Button, Card, ErrorState, LoadingState, PageHeader } from '../components/ui.jsx'

function CarRentalRatesForm({ initial }) {
  const mutate = useMutation()
  const toast = useToast()

  const [saving, setSaving] = useState(false)
  const [rates, setRates] = useState(() => ({
    note: initial?.note ?? fallbackCarRates.note,
    outstationFixedFares: initial?.outstationFixedFares?.length ? initial.outstationFixedFares : fallbackCarRates.outstationFixedFares,
    localDuty: initial?.localDuty?.length ? initial.localDuty : fallbackCarRates.localDuty,
    extraCharges: initial?.extraCharges?.length ? initial.extraCharges : fallbackCarRates.extraCharges,
    termsAndConditions: initial?.termsAndConditions?.length ? initial.termsAndConditions : fallbackCarRates.termsAndConditions,
    tempoBusVehicles: initial?.tempoBusVehicles?.length ? initial.tempoBusVehicles : fallbackCarRates.tempoBusVehicles,
    tempoBusFixedRoutes: initial?.tempoBusFixedRoutes?.length ? initial.tempoBusFixedRoutes : fallbackCarRates.tempoBusFixedRoutes,
  }))
  const [activeTab, setActiveTab] = useState('outstation')

  // Save changes to backend
  const handleSave = async (e) => {
    if (e) e.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      const res = await mutate('put', '/admin/car-rental', rates)
      toast.success(res.message || 'Car rental rates saved successfully!')
      announceSiteChange()
    } catch (err) {
      toast.error(err.message || 'Failed to save car rental rates')
    } finally {
      setSaving(false)
    }
  }

  // --- Handlers for Outstation Fixed Fares ---
  const updateFixedFare = (index, field, value) => {
    setRates((prev) => {
      const updated = [...prev.outstationFixedFares]
      if (field.startsWith('prices.')) {
        const carKey = field.split('.')[1]
        updated[index] = {
          ...updated[index],
          prices: {
            ...updated[index].prices,
            [carKey]: Number(value) || 0,
          },
        }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      return { ...prev, outstationFixedFares: updated }
    })
  }

  const addFixedFare = () => {
    setRates((prev) => ({
      ...prev,
      outstationFixedFares: [
        ...prev.outstationFixedFares,
        {
          id: `route-${Date.now()}`,
          route: 'New Route (e.g. Surat to Mumbai)',
          from: 'Surat',
          to: '',
          type: 'one-way',
          prices: { sedan: 3000, ertiga: 4000, innova: 5000, innovaCrysta: 6500 },
        },
      ],
    }))
  }

  const removeFixedFare = (index) => {
    setRates((prev) => ({
      ...prev,
      outstationFixedFares: prev.outstationFixedFares.filter((_, i) => i !== index),
    }))
  }

  // --- Handlers for Local Duty ---
  const updateLocalDuty = (index, field, value) => {
    setRates((prev) => {
      const updated = [...prev.localDuty]
      if (field.startsWith('prices.')) {
        const carKey = field.split('.')[1]
        updated[index] = {
          ...updated[index],
          prices: {
            ...updated[index].prices,
            [carKey]: Number(value) || 0,
          },
        }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      return { ...prev, localDuty: updated }
    })
  }

  const addLocalDuty = () => {
    setRates((prev) => ({
      ...prev,
      localDuty: [
        ...prev.localDuty,
        {
          id: `duty-${Date.now()}`,
          package: '4 hr / 40 km',
          duration: '4 Hours',
          distance: '40 Kms',
          tag: 'Short city duty',
          prices: { sedan: 1200, ertiga: 1600, innova: 2000, innovaCrysta: 2500 },
        },
      ],
    }))
  }

  const removeLocalDuty = (index) => {
    setRates((prev) => ({
      ...prev,
      localDuty: prev.localDuty.filter((_, i) => i !== index),
    }))
  }

  // --- Handlers for Extra Charges ---
  const updateExtraCharge = (index, field, value) => {
    setRates((prev) => {
      const updated = [...prev.extraCharges]
      updated[index] = {
        ...updated[index],
        [field]: Number(value) || 0,
      }
      return { ...prev, extraCharges: updated }
    })
  }

  // --- Handlers for Terms & Conditions ---
  const updateTerm = (index, value) => {
    setRates((prev) => {
      const updated = [...prev.termsAndConditions]
      updated[index] = value
      return { ...prev, termsAndConditions: updated }
    })
  }

  const addTerm = () => {
    setRates((prev) => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, 'New term or condition.'],
    }))
  }

  const removeTerm = (index) => {
    setRates((prev) => ({
      ...prev,
      termsAndConditions: prev.termsAndConditions.filter((_, i) => i !== index),
    }))
  }

  // --- Handlers for Tempo & Bus ---
  const updateTempoVehicle = (index, field, value) => {
    setRates((prev) => {
      const updated = [...prev.tempoBusVehicles]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, tempoBusVehicles: updated }
    })
  }

  const updateTempoRoute = (index, field, value) => {
    setRates((prev) => {
      const updated = [...prev.tempoBusFixedRoutes]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, tempoBusFixedRoutes: updated }
    })
  }

  const addTempoRoute = () => {
    setRates((prev) => ({
      ...prev,
      tempoBusFixedRoutes: [
        ...prev.tempoBusFixedRoutes,
        {
          route: 'Surat to New Destination',
          winger: 'Call for price',
          tempo12: 'Call for price',
          tempo17: 'Call for price',
          tempo20: 'Call for price',
        },
      ],
    }))
  }

  const removeTempoRoute = (index) => {
    setRates((prev) => ({
      ...prev,
      tempoBusFixedRoutes: prev.tempoBusFixedRoutes.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header with Save and Live Preview Actions */}
      <PageHeader
        title="Car Rental Rates"
        description="Manage all fixed fares, local duty packages, per-km extra charges, and terms shown on the website."
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/car-rental"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-admin-border bg-white px-3.5 py-2 text-xs font-semibold text-admin-text transition hover:bg-admin-subtle"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span>View Live Page</span>
            </a>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5"
            >
              <Save size={15} aria-hidden="true" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </Button>
          </div>
        }
      />

      {/* Global Note & GST banner editor */}
      <Card className="p-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-admin-text">
          Notice Note (Shown on top of rate tables)
        </label>
        <input
          type="text"
          value={rates.note || ''}
          onChange={(e) => setRates((prev) => ({ ...prev, note: e.target.value }))}
          placeholder="e.g. GST 5% extra on total bill amount. Toll tax, parking & border tax extra as applicable."
          className="mt-2 w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-admin-text focus:border-admin-primary focus:bg-white focus:outline-none"
        />
      </Card>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-admin-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('outstation')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'outstation'
              ? 'bg-admin-primary text-white shadow-sm'
              : 'bg-white text-admin-muted hover:text-admin-text border border-admin-border'
          }`}
        >
          <Route size={16} aria-hidden="true" />
          <span>Outstation Fixed Fares ({rates.outstationFixedFares.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('local')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'local'
              ? 'bg-admin-primary text-white shadow-sm'
              : 'bg-white text-admin-muted hover:text-admin-text border border-admin-border'
          }`}
        >
          <Clock size={16} aria-hidden="true" />
          <span>Surat Local Duty ({rates.localDuty.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('extra')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'extra'
              ? 'bg-admin-primary text-white shadow-sm'
              : 'bg-white text-admin-muted hover:text-admin-text border border-admin-border'
          }`}
        >
          <Car size={16} aria-hidden="true" />
          <span>Extra Charges (Per KM / Hour)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'terms'
              ? 'bg-admin-primary text-white shadow-sm'
              : 'bg-white text-admin-muted hover:text-admin-text border border-admin-border'
          }`}
        >
          <FileText size={16} aria-hidden="true" />
          <span>Terms &amp; Conditions ({rates.termsAndConditions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tempo')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'tempo'
              ? 'bg-admin-primary text-white shadow-sm'
              : 'bg-white text-admin-muted hover:text-admin-text border border-admin-border'
          }`}
        >
          <Bus size={16} aria-hidden="true" />
          <span>Tempo Traveller &amp; Bus Fleet</span>
        </button>
      </div>

      {/* --- TAB 1: OUTSTATION FIXED FARES --- */}
      {activeTab === 'outstation' && (
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-admin-border">
            <div>
              <h3 className="text-base font-bold text-admin-text">Outstation Fixed Route Fares</h3>
              <p className="text-xs text-admin-muted">
                Edit prices for each vehicle category or add new popular routes.
              </p>
            </div>
            <button
              type="button"
              onClick={addFixedFare}
              className="inline-flex items-center gap-1.5 rounded-xl bg-admin-subtle px-3 py-1.5 text-xs font-semibold text-admin-text border border-admin-border transition hover:bg-admin-border"
            >
              <Plus size={14} aria-hidden="true" />
              <span>Add New Route</span>
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {rates.outstationFixedFares.map((routeItem, index) => (
              <div
                key={routeItem.id || index}
                className="rounded-2xl border border-admin-border bg-admin-bg/50 p-4 transition hover:border-admin-primary/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                      Route Title
                    </label>
                    <input
                      type="text"
                      value={routeItem.route}
                      onChange={(e) => updateFixedFare(index, 'route', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3.5 py-2 text-sm font-semibold text-admin-text focus:border-admin-primary focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFixedFare(index)}
                    aria-label={`Delete ${routeItem.route}`}
                    className="mt-5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="text-xs font-medium text-admin-text">
                      Sedan (₹)
                    </label>
                    <input
                      type="number"
                      value={routeItem.prices?.sedan ?? 0}
                      onChange={(e) => updateFixedFare(index, 'prices.sedan', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-admin-text">
                      SUV Ertiga (₹)
                    </label>
                    <input
                      type="number"
                      value={routeItem.prices?.ertiga ?? 0}
                      onChange={(e) => updateFixedFare(index, 'prices.ertiga', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-admin-text">
                      SUV Innova (₹)
                    </label>
                    <input
                      type="number"
                      value={routeItem.prices?.innova ?? 0}
                      onChange={(e) => updateFixedFare(index, 'prices.innova', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-admin-text">
                      Innova Crysta (₹)
                    </label>
                    <input
                      type="number"
                      value={routeItem.prices?.innovaCrysta ?? 0}
                      onChange={(e) => updateFixedFare(index, 'prices.innovaCrysta', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* --- TAB 2: SURAT LOCAL DUTY --- */}
      {activeTab === 'local' && (
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-admin-border">
            <div>
              <h3 className="text-base font-bold text-admin-text">Surat Local Duty Packages</h3>
              <p className="text-xs text-admin-muted">
                Configure hourly and kilometer packages for city sightseeing and business duty.
              </p>
            </div>
            <button
              type="button"
              onClick={addLocalDuty}
              className="inline-flex items-center gap-1.5 rounded-xl bg-admin-subtle px-3 py-1.5 text-xs font-semibold text-admin-text border border-admin-border transition hover:bg-admin-border"
            >
              <Plus size={14} aria-hidden="true" />
              <span>Add Package</span>
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {rates.localDuty.map((duty, index) => (
              <div
                key={duty.id || index}
                className="rounded-2xl border border-admin-border bg-admin-bg/50 p-4 transition hover:border-admin-primary/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                        Package Label
                      </label>
                      <input
                        type="text"
                        value={duty.package}
                        onChange={(e) => updateLocalDuty(index, 'package', e.target.value)}
                        placeholder="e.g. 12 hr / 100 km"
                        className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3.5 py-2 text-sm font-semibold text-admin-text focus:border-admin-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                        Duration &amp; Distance
                      </label>
                      <div className="mt-1 flex gap-2">
                        <input
                          type="text"
                          value={duty.duration || ''}
                          onChange={(e) => updateLocalDuty(index, 'duration', e.target.value)}
                          placeholder="12 Hours"
                          className="w-1/2 rounded-xl border border-admin-border bg-white px-3 py-2 text-xs text-admin-text focus:border-admin-primary focus:outline-none"
                        />
                        <input
                          type="text"
                          value={duty.distance || ''}
                          onChange={(e) => updateLocalDuty(index, 'distance', e.target.value)}
                          placeholder="100 Kms"
                          className="w-1/2 rounded-xl border border-admin-border bg-white px-3 py-2 text-xs text-admin-text focus:border-admin-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                        Badge Tag
                      </label>
                      <input
                        type="text"
                        value={duty.tag || ''}
                        onChange={(e) => updateLocalDuty(index, 'tag', e.target.value)}
                        placeholder="e.g. Full day duty"
                        className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3.5 py-2 text-sm text-admin-text focus:border-admin-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLocalDuty(index)}
                    aria-label={`Delete ${duty.package}`}
                    className="mt-5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="text-xs font-medium text-admin-text">
                      Sedan (₹)
                    </label>
                    <input
                      type="number"
                      value={duty.prices?.sedan ?? 0}
                      onChange={(e) => updateLocalDuty(index, 'prices.sedan', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-admin-text">
                      SUV Ertiga (₹)
                    </label>
                    <input
                      type="number"
                      value={duty.prices?.ertiga ?? 0}
                      onChange={(e) => updateLocalDuty(index, 'prices.ertiga', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-admin-text">
                      SUV Innova (₹)
                    </label>
                    <input
                      type="number"
                      value={duty.prices?.innova ?? 0}
                      onChange={(e) => updateLocalDuty(index, 'prices.innova', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-admin-text">
                      Innova Crysta (₹)
                    </label>
                    <input
                      type="number"
                      value={duty.prices?.innovaCrysta ?? 0}
                      onChange={(e) => updateLocalDuty(index, 'prices.innovaCrysta', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* --- TAB 3: EXTRA CHARGES --- */}
      {activeTab === 'extra' && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-admin-text">Extra Charges (Per KM &amp; Overtime)</h3>
          <p className="text-xs text-admin-muted">
            Configure extra hourly fees, excess kilometer charges, and base outstation per-km rent.
          </p>

          <div className="mt-5 space-y-4">
            {rates.extraCharges.map((item, index) => (
              <div
                key={item.id || index}
                className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-admin-border bg-admin-bg/50 p-4 sm:grid-cols-4"
              >
                <div>
                  <span className="block font-bold text-admin-text">{item.vehicle}</span>
                  <span className="block text-xs text-admin-muted">{item.subtitle}</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-admin-text">
                    Extra Hour Rate (₹/hr)
                  </label>
                  <input
                    type="number"
                    value={item.extraHr ?? 0}
                    onChange={(e) => updateExtraCharge(index, 'extraHr', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-admin-text">
                    Extra Km Rate (₹/km)
                  </label>
                  <input
                    type="number"
                    value={item.extraKm ?? 0}
                    onChange={(e) => updateExtraCharge(index, 'extraKm', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-admin-text">
                    Outstation Rent (₹/km)
                  </label>
                  <input
                    type="number"
                    value={item.outstationPerKm ?? 0}
                    onChange={(e) => updateExtraCharge(index, 'outstationPerKm', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-bold text-admin-primary focus:border-admin-primary focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* --- TAB 4: TERMS & CONDITIONS --- */}
      {activeTab === 'terms' && (
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-admin-border">
            <div>
              <h3 className="text-base font-bold text-admin-text">Terms &amp; Conditions</h3>
              <p className="text-xs text-admin-muted">
                Add, update or remove terms shown below the car rental tables.
              </p>
            </div>
            <button
              type="button"
              onClick={addTerm}
              className="inline-flex items-center gap-1.5 rounded-xl bg-admin-subtle px-3 py-1.5 text-xs font-semibold text-admin-text border border-admin-border transition hover:bg-admin-border"
            >
              <Plus size={14} aria-hidden="true" />
              <span>Add Condition</span>
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {rates.termsAndConditions.map((term, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={term}
                  onChange={(e) => updateTerm(index, e.target.value)}
                  className="flex-1 rounded-xl border border-admin-border bg-white px-3.5 py-2.5 text-sm text-admin-text focus:border-admin-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeTerm(index)}
                  aria-label="Delete condition"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* --- TAB 5: TEMPO TRAVELLER & BUS --- */}
      {activeTab === 'tempo' && (
        <Card className="p-6 space-y-8">
          <div>
            <h3 className="text-base font-bold text-admin-text">Tempo Traveller &amp; Bus Fleet Specifications</h3>
            <p className="text-xs text-admin-muted">
              Configure vehicle capacity, outstation rates, and driver allowances.
            </p>

            <div className="mt-5 space-y-4">
              {rates.tempoBusVehicles.map((vehicle, index) => (
                <div
                  key={vehicle.id || index}
                  className="rounded-2xl border border-admin-border bg-admin-bg/50 p-4"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                        Vehicle Name
                      </label>
                      <input
                        type="text"
                        value={vehicle.name}
                        onChange={(e) => updateTempoVehicle(index, 'name', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm font-semibold text-admin-text focus:border-admin-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                        Capacity
                      </label>
                      <input
                        type="text"
                        value={vehicle.capacity}
                        onChange={(e) => updateTempoVehicle(index, 'capacity', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm text-admin-text focus:border-admin-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                        Driver Allowance
                      </label>
                      <input
                        type="text"
                        value={vehicle.driverAllowance}
                        onChange={(e) => updateTempoVehicle(index, 'driverAllowance', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-sm text-admin-text focus:border-admin-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-xs font-medium text-admin-text">
                        Outstation Rate (per km or fixed)
                      </label>
                      <input
                        type="text"
                        value={vehicle.outstationPerKm}
                        onChange={(e) => updateTempoVehicle(index, 'outstationPerKm', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-xs font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-admin-text">
                        Local Duty (8h / 80km)
                      </label>
                      <input
                        type="text"
                        value={vehicle.local8hr80km}
                        onChange={(e) => updateTempoVehicle(index, 'local8hr80km', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-xs font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-admin-text">
                        Local Duty (12h / 100km)
                      </label>
                      <input
                        type="text"
                        value={vehicle.local12hr100km}
                        onChange={(e) => updateTempoVehicle(index, 'local12hr100km', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-xs font-bold text-admin-text focus:border-admin-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-admin-border pt-6">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h4 className="text-sm font-bold text-admin-text">Popular Group Routes</h4>
                <p className="text-xs text-admin-muted">Fixed routes for Winger &amp; Tempo Travellers</p>
              </div>
              <button
                type="button"
                onClick={addTempoRoute}
                className="inline-flex items-center gap-1.5 rounded-xl bg-admin-subtle px-3 py-1.5 text-xs font-semibold text-admin-text border border-admin-border transition hover:bg-admin-border"
              >
                <Plus size={14} aria-hidden="true" />
                <span>Add Route</span>
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {rates.tempoBusFixedRoutes.map((routeItem, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-xl border border-admin-border bg-admin-bg/40 p-3 sm:flex-row sm:items-center"
                >
                  <input
                    type="text"
                    value={routeItem.route}
                    onChange={(e) => updateTempoRoute(index, 'route', e.target.value)}
                    className="flex-1 rounded-lg border border-admin-border bg-white px-3 py-1.5 text-xs font-semibold text-admin-text focus:border-admin-primary focus:outline-none"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={routeItem.winger}
                      onChange={(e) => updateTempoRoute(index, 'winger', e.target.value)}
                      placeholder="Winger"
                      className="w-28 rounded-lg border border-admin-border bg-white px-2 py-1.5 text-xs text-admin-text"
                    />
                    <input
                      type="text"
                      value={routeItem.tempo12}
                      onChange={(e) => updateTempoRoute(index, 'tempo12', e.target.value)}
                      placeholder="12S"
                      className="w-28 rounded-lg border border-admin-border bg-white px-2 py-1.5 text-xs text-admin-text"
                    />
                    <input
                      type="text"
                      value={routeItem.tempo17}
                      onChange={(e) => updateTempoRoute(index, 'tempo17', e.target.value)}
                      placeholder="17S"
                      className="w-28 rounded-lg border border-admin-border bg-white px-2 py-1.5 text-xs text-admin-text"
                    />
                    <button
                      type="button"
                      onClick={() => removeTempoRoute(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default function CarRentalRatesPage() {
  const { data, loading, error, refetch } = useApiQuery('/admin/car-rental')

  return (
    <>
      <PageHeader
        title="Car Rental Rates"
        description="Manage outstation fixed fares, local duty packages, extra per-km charges, terms & conditions, and tempo fleet rates."
        crumbs={[{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Car rental rates' }]}
      />
      {loading && !data ? (
        <Card>
          <LoadingState />
        </Card>
      ) : error ? (
        <Card>
          <ErrorState error={error} onRetry={refetch} />
        </Card>
      ) : (
        <CarRentalRatesForm key={data?.updatedAt ?? 'initial'} initial={data} />
      )}
    </>
  )
}
