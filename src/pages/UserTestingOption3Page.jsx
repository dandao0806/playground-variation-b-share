import { useMemo, useState } from 'react'

// GitHub Pages serves this app under /playground-usertesting-share-/, so
// hardcoded absolute paths like /icons/foo.svg would 404. Vite exposes the
// configured base as import.meta.env.BASE_URL — we prefix every static asset
// path with it so builds work locally and on Pages.
const BASE = import.meta.env.BASE_URL
import Button from '../components/Button.jsx'
import Select from '../components/Select.jsx'
import Accordion from '../components/Accordion.jsx'
import ChevronIcon from '../components/ChevronIcon.jsx'
import PriceChangeAlert from '../components/PriceChangeAlert.jsx'
import usePriceRecalcFeedback from '../components/usePriceRecalcFeedback.js'
import useSwipeTabs from '../components/useSwipeTabs.js'

// Reuses the tokens/components from the existing Plymouth Rock pages
// (Button, Select, Accordion, ChevronIcon, and the .pr-* styling in
// styles.css). New UI: the tab-nav layout, per-coverage card style, the
// Monthly/Semi-annually toggle chip, and the vehicle card. Discount banner
// and edit/pending/recalculate behaviour mirror the tier-flow pages.

const steps = [
  'About You',
  'Drivers',
  'Vehicles',
  'Discounts',
  'Your Quote',
  'Final Details',
  'Purchase',
]
const stepsMobile = 7
const activeStep = 4 // Your Quote is Step 5 of 7

// ---------- Summary tab data ----------
// Icons are the 4 provided SVGs (40x40, black at 56% opacity — matches the
// PRCINS icon-button style).
// `editRowName` is the exact `name` field of the matching row in editGroups.
// If a row exists there, the Summary shows the LIVE committed selection
// (so after Recalculate the two tabs agree). If no editRowName is set,
// the summary falls back to the static `value`.
const summaryCoverages = [
  { id: 'bi', name: 'Bodily Injury', editRowName: 'Bodily injury liability', value: '$50,000/$100,000', icon: `${BASE}icons/ut-shield.svg` },
  { id: 'pd', name: 'Property Damage', editRowName: 'Property damage liability', value: '$10,000', icon: `${BASE}icons/ut-property.svg` },
  { id: 'uim', name: 'Underinsured/Uninsured', value: '$50,000/$100,000', icon: `${BASE}icons/ut-medical.svg` },
  { id: 'comp', name: 'Comprehensive Damage', editRowName: 'Comprehensive', value: '$5,000', icon: `${BASE}icons/ut-comprehensive.svg` },
  { id: 'coll', name: 'Collision Damage', editRowName: 'Collision', value: '$500', icon: `${BASE}icons/ut-car.svg` },
  { id: 'roadside', name: 'Roadside Assistance', value: 'Free', icon: `${BASE}icons/ut-device.svg`, chip: true },
]

// ---------- Edit tab data ----------
// Every row has options[] (list of dropdown labels) and a base cost. The
// per-option cost is synthesized around the base, so switching selection
// actually moves the cost (mirrors the other tier pages).
const editGroups = [
  {
    id: 'others',
    title: 'Policy Coverages',
    description: 'Coverage paid to others when you are at fault for a covered loss.',
    rows: [
      {
        name: 'Bodily injury liability',
        description:
          "Protects you if you're held responsible for injuring someone in a car accident. This coverage can help pay for the injured party's medical expenses, lost wages, pain and suffering, and may also help pay your expenses in a related lawsuit.",
        selection: '$50,000/$100,000',
        options: ['$35,000/$70,000', '$50,000/$100,000', '$100,000/$300,000', '$250,000/$500,000'],
        cost: '$30',
      },
      {
        name: 'Property damage liability',
        description:
          "Protects you if you are held responsible for damaging someone else's property in a car accident. This coverage helps reimburse another person for their damaged property and helps pay your expenses in a related lawsuit.",
        selection: '$10,000',
        options: ['$5,000', '$10,000', '$25,000', '$50,000', '$100,000'],
        cost: '$40',
      },
    ],
  },
  {
    id: 'yourself',
    title: 'Personal Coverages',
    description: 'Coverage for you and your passengers.',
    rows: [
      {
        name: 'Personal injury protection',
        description:
          'New Jersey is a no-fault state, which means medical expenses from injuries sustained in a car accident are paid by your own insurance policy regardless of who caused the accident. Personal Injury Protection (PIP) provides coverage for medical treatment, rehabilitation, and related expenses for you and your household family members, as well as passengers in your vehicle, up to the limit you select.',
        selection: '$250,000',
        options: ['$15,000', '$50,000', '$75,000', '$150,000', '$250,000'],
        cost: 'Free',
      },
      {
        name: 'Personal injury protection deductible',
        description:
          'The amount you must pay out of pocket for every claim before your PIP coverage begins to pay. A higher deductible typically lowers your monthly premium but increases the amount you owe when you file a claim, so choose a level that fits both your budget and your comfort with out-of-pocket risk.',
        selection: '$2,500',
        options: ['$250', '$500', '$1,000', '$2,500'],
        cost: 'Free',
      },
      {
        name: 'PIP healthcare selection',
        description:
          'You can lower the cost of your insurance if you select your health insurance as the primary payer for medical expenses arising from a car accident. When Health Insurance is Primary, your health plan pays covered medical bills first and PIP pays only what health insurance does not cover, up to your PIP limit. PIP Primary reverses this order and always pays first.',
        selection: 'Health Insurance Primary',
        options: ['Health Insurance Primary', 'PIP Primary'],
        cost: '$40',
      },
      {
        name: 'PIP full/med only',
        description:
          'In addition to medical expenses, Full Benefits pays for income continuation, essential services (like household help while you recover), death benefits, and funeral expenses. Medical Expense Benefits Only limits your PIP coverage to medical bills, with no reimbursement for lost income or related costs, in exchange for a lower premium.',
        selection: 'Full Benefits',
        options: ['Full Benefits', 'Medical Expense Benefits Only'],
        cost: '$8',
      },
      {
        name: 'Extra PIP package options',
        description:
          'You can add extra PIP coverage for lost wages, essential services, and death and funeral benefits above the standard PIP limits. Each package option provides progressively higher weekly and total maximums, so a more expensive package returns more money if you are seriously injured; Decline keeps your policy at the standard state minimums with no additional cost.',
        selection: 'Option 1',
        options: ['Decline', 'Option 1', 'Option 2', 'Option 3', 'Option 4'],
        cost: 'Free',
      },
      {
        name: 'Medical payments',
        description:
          'Medical Payments will pay for medical or funeral expenses for you or your passengers resulting from a covered auto accident, regardless of who was at fault. It supplements PIP by covering costs that exceed your PIP limit or that PIP does not cover, such as certain deductibles and copayments, up to the amount you select.',
        selection: '$10,000',
        options: ['$1,000', '$2,500', '$5,000', '$10,000'],
        cost: 'Free',
      },
      {
        name: 'Tort threshold',
        description:
          "You can choose either 'Limitation on Lawsuit' or 'No Limitation on Lawsuit' as your tort threshold. Limitation on Lawsuit restricts your right to sue for pain and suffering to only the serious injuries defined by New Jersey law, in exchange for a lower premium. No Limitation preserves your full right to sue for any injury caused by another driver, but costs more.",
        selection: 'Limitation on lawsuit',
        options: ['Limitation on lawsuit', 'No Limitation on lawsuit'],
        cost: 'Free',
      },
    ],
  },
  {
    id: 'vehicles',
    title: 'Vehicle Coverages',
    description: 'Coverages for damages to your car',
    collapsible: true,
    vehicleName: '2022 CHEVROLET EQUINOX LT AWD Sport Utility Vehicle',
    rows: [
      {
        name: 'Comprehensive',
        description:
          'Comprehensive is an optional car insurance coverage that pays for damage to your vehicle from causes other than a collision, including theft, vandalism, fire, hail, flooding, falling objects, and hitting an animal. A deductible applies to each claim; choosing a higher deductible reduces your monthly premium in exchange for a higher out-of-pocket cost when you file.',
        selection: '$5,000',
        options: ['$500', '$1,000', '$2,500', '$5,000', '$10,000'],
        cost: '$15',
      },
      {
        name: 'Glass deductible',
        description:
          'If you select Comprehensive coverage, you have the option to choose a separate deductible for glass claims such as windshield chips and cracks. Comprehensive Deductible applies your standard deductible to glass damage. $50 Glass Deductible caps your out-of-pocket cost at $50 for a small additional premium. No Glass Deductible waives the deductible for glass claims entirely.',
        selection: 'Comprehensive Deductible',
        options: ['Comprehensive Deductible', '$50 Glass Deductible', 'No Glass Deductible'],
        cost: 'Free',
      },
      {
        name: 'Collision',
        description:
          'Collision helps pay to repair or replace your car if it hits or is hit by another vehicle or object, regardless of who is at fault. A deductible applies to each collision claim, and higher deductibles reduce your monthly premium while raising the amount you pay when you file a claim.',
        selection: '$500',
        options: ['$250', '$500', '$1,000', '$2,500'],
        cost: 'Free',
      },
      {
        name: 'Collision damage waiver applies to',
        description:
          'You may select a Collision deductible with "Waiver" which waives your Collision deductible when the accident is caused by another driver and that driver\'s insurance company accepts liability. This means you pay no deductible in not-at-fault losses, so your out-of-pocket cost drops to zero when someone else is clearly responsible.',
        selection: 'Yes',
        options: ['Yes', 'No'],
        cost: 'Free',
      },
      {
        name: 'Towing and labor',
        description:
          'Towing and Labor coverage pays to have your car towed or receive emergency roadside labor if your vehicle becomes disabled due to a mechanical breakdown, dead battery, flat tire, or lockout. Coverage applies per occurrence up to the selected limit; higher per-occurrence limits cover more of the cost of towing to a shop or getting back on the road.',
        selection: '$100 Per Occurence',
        options: ['Not Included', '$100 Per Occurence', '$200 Per Occurence'],
        cost: 'Free',
      },
      {
        name: 'Rental reimbursement',
        description:
          'Substitute Transportation or Rental Reimbursement protects you against the cost of a rental car or alternative transportation while your vehicle is being repaired after a covered loss. Coverage pays a per-day amount up to a selected maximum total, so a higher daily rate and higher maximum keep you in a replacement vehicle for a longer repair period.',
        selection: '$40 per day/1.2K Maximum',
        options: [
          'Not Included',
          '$30 per day/900 Maximum',
          '$40 per day/1.2K Maximum',
          '$60 per day/1.8K Maximum',
        ],
        cost: 'Free',
      },
    ],
  },
]

// ---------- Add-ons tab data ----------
const essentialAssuranceItems = [
  'Door-to-Door Valet Claims Service®',
  'Get Home Safe® Taxi Ride',
  'Guaranteed Repairs',
  'Online & Mobile Services',
  'eDocuments & eReminders',
  'Pledge of Assurance',
]

const packageUpgradeRow = {
  name: 'Package Upgrade',
  description:
    'The Assurance Preferred and Assurance Premier packages are optional upgrades to the Essential Assurance Package and are available for an additional cost. Preferred adds enhanced roadside benefits, deductible reductions, and extended rental coverage, while Premier includes the highest tier of protection with new-car replacement, key replacement, and expanded rental days for a covered loss.',
  selection: 'No Upgrade',
  options: ['No Upgrade', 'Assurance Preferred', 'Assurance Premier'],
  cost: 'Free',
  // Explicit per-option costs so switching selection reflects the correct
  // dollar value on Recalculate (upgrade tiers aren't a linear fan-out).
  optionCosts: {
    'No Upgrade': 'Free',
    'Assurance Preferred': '$25',
    'Assurance Premier': '$50',
  },
  compareLink: true,
}

const perksRow = {
  name: 'Accident Forgiveness',
  description:
    'Accident Forgiveness coverage will forgive one surchargable accident so that it does not impact your policy premium at renewal. You must meet certain qualifications, such as a minimum accident-free period on your driving record, in order to purchase this coverage. Once used, it will not apply again until you re-qualify.',
  selection: 'Not Included',
  options: ['Not Included', 'Included'],
  cost: 'N/A',
  optionCosts: { 'Not Included': 'N/A', 'Included': '$18' },
}

// ---------- Cost helpers (mirror the tier pages' normalizeOptions) ----------
function parseCostNumber(cost) {
  if (typeof cost !== 'string') return 0
  const n = parseFloat(cost.replace(/[^\d.]/g, ''))
  return Number.isNaN(n) ? 0 : n
}
function formatCost(n, template) {
  if (template === 'Free' || template === 'N/A') return template
  return `$${n}`
}
// For each row, resolve the cost of a selected option. If the row provides
// an explicit `optionCosts` map (e.g. Package Upgrade tiers or Accident
// Forgiveness on/off), use that. Otherwise fan out around the baseline cost
// so switching selections still moves the total. Rows whose base is Free or
// N/A keep that label for every option.
function costFor(row, selectedLabel) {
  if (row.optionCosts && selectedLabel in row.optionCosts) {
    return row.optionCosts[selectedLabel]
  }
  const idx = Math.max(0, row.options.indexOf(selectedLabel))
  const baseIdx = Math.max(0, row.options.indexOf(row.selection))
  const base = parseCostNumber(row.cost)
  if (base <= 0) return row.cost
  const step = Math.max(2, Math.round(base * 0.2))
  const value = Math.max(0, base + (idx - baseIdx) * step)
  return formatCost(value, row.cost)
}
function costNumber(row, selectedLabel) {
  const c = costFor(row, selectedLabel)
  return parseCostNumber(c)
}

// Flat list of all editable rows (Edit tab + Add-ons tab).
const allEditableRows = [
  ...editGroups.flatMap((g) => g.rows),
  packageUpgradeRow,
  perksRow,
]
const defaultSelections = allEditableRows.reduce((acc, r) => {
  acc[r.name] = r.selection
  return acc
}, {})
const defaultBaseCostSum = allEditableRows.reduce(
  (sum, r) => sum + costNumber(r, r.selection),
  0,
)

// Anchor "monthly payment" to $115.07 baseline. Delta from default costs is
// added on top so switching selections actually moves the total.
const BASELINE_MONTHLY = 115.07
function computeMonthly(selections) {
  const delta = allEditableRows.reduce(
    (sum, r) => sum + (costNumber(r, selections[r.name]) - costNumber(r, r.selection)),
    0,
  )
  return Math.max(0, BASELINE_MONTHLY + delta)
}

// ---------- Shared header pieces ----------
function PlymouthHeader() {
  return (
    <div className="pr-header">
      <div className="pr-header-inner">
        <img
          src={`${BASE}plymouth-rock-logo.svg`}
          alt="Plymouth Rock Assurance"
          className="pr-header-logo"
        />
        <div className="pr-help">
          <div className="pr-help-label">Need Help?</div>
          <div className="pr-help-phone">(800) 521-4067</div>
        </div>
      </div>
    </div>
  )
}

function Stepper({ activeIndex }) {
  return (
    <div className="pr-stepper">
      <div className="pr-stepper-inner">
        {steps.map((s, i) => {
          const state =
            i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'upcoming'
          return (
            <div
              key={s}
              className={`pr-step pr-step-${state}`}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <span className="pr-step-label">{s}</span>
              <span className="pr-step-bar" aria-hidden="true" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MobileHeader() {
  return (
    <div className="pr-mobile-header">
      <img
        src={`${BASE}plymouth-rock-logo.svg`}
        alt="Plymouth Rock Assurance"
        className="pr-mobile-header-logo"
      />
      <button type="button" className="pr-mobile-help">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.5 9a2.5 2.5 0 015 0c0 1.7-2.5 2-2.5 3.5" />
          <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
        </svg>
        Help
      </button>
    </div>
  )
}

function MobileStepper() {
  return (
    <div className="pr-mobile-stepper">
      <div className="pr-mobile-stepper-head">
        <button type="button" className="pr-mobile-prev" disabled>
          <span aria-hidden="true">←</span> Previous
        </button>
        <div className="pr-mobile-step-name">Your Quote</div>
        <div className="pr-mobile-step-count">Step 5 of {stepsMobile}</div>
      </div>
      <div className="pr-mobile-bars">
        {Array.from({ length: stepsMobile }).map((_, i) => (
          <div
            key={i}
            className={`pr-mobile-bar ${i <= activeStep ? 'done' : ''}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}

// ---------- Hero pieces ----------
// Billing toggle uses a shared sliding pill (`::before`) that translates
// horizontally based on the selected index — the buttons themselves are just
// labels, so the transition is one smooth movement instead of two crossfades.
function BillingToggle({ value, onChange }) {
  const idx = value === 'semi' ? 1 : 0
  return (
    <div className="ut-billing-toggle-wrap">
      <div
        className="ut-billing-toggle"
        role="tablist"
        style={{ '--ut-billing-idx': idx }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={value === 'monthly'}
          onClick={() => onChange('monthly')}
          className={`ut-billing-toggle-btn ${value === 'monthly' ? 'selected' : ''}`}
        >
          Monthly
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value === 'semi'}
          onClick={() => onChange('semi')}
          className={`ut-billing-toggle-btn ${value === 'semi' ? 'selected' : ''}`}
        >
          Semi-annually
        </button>
      </div>
      <span className="ut-save-chip">Save 15%</span>
    </div>
  )
}

// Discount banner — same badge, chevron, applied-list, and toggle behaviour
// as the shared PRCINS component used by Example 1, the tier pages, and the
// Flow: Choose Plan page.
const appliedDiscounts = [
  { bold: '5 year claims free', rest: ' discount' },
  { bold: 'eDocument', rest: ' discount' },
  { bold: 'Homeowner', rest: ' discount' },
  { bold: 'Safety Pledge', rest: ' discount' },
]

function CircleCheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="pr-discount-check"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}

function DiscountBadge() {
  return (
    <svg
      className="pr-discount-badge"
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17 8.25C18.3008 8.25 19.4258 8.98828 19.9883 10.043C21.1484 9.69141 22.4492 9.97266 23.3633 10.8867C24.2773 11.8008 24.5586 13.1016 24.207 14.2617C25.2617 14.8242 26 15.9492 26 17.25C26 18.5508 25.2617 19.6758 24.207 20.2383C24.5586 21.3984 24.2773 22.6992 23.3633 23.6133C22.4492 24.5273 21.1484 24.8086 19.9883 24.457C19.4258 25.5117 18.3008 26.25 17 26.25C15.6992 26.25 14.5742 25.5117 14.0117 24.457C12.8516 24.8086 11.5508 24.5273 10.6367 23.6133C9.72266 22.6992 9.44141 21.3984 9.79297 20.2383C8.73828 19.6758 8 18.5508 8 17.25C8 15.9492 8.73828 14.8242 9.79297 14.2617C9.44141 13.1016 9.72266 11.8008 10.6367 10.8867C11.5508 9.97266 12.8516 9.69141 14.0117 10.043C14.5742 8.98828 15.6992 8.25 17 8.25ZM14.75 16.125C15.3828 16.125 15.875 15.6328 15.875 15C15.875 14.3672 15.3828 13.875 14.75 13.875C14.1172 13.875 13.625 14.3672 13.625 15C13.625 15.6328 14.1172 16.125 14.75 16.125ZM20.375 19.5C20.375 18.8672 19.8828 18.375 19.25 18.375C18.6172 18.375 18.125 18.8672 18.125 19.5C18.125 20.1328 18.6172 20.625 19.25 20.625C19.8828 20.625 20.375 20.1328 20.375 19.5ZM19.8477 15.5977C20.1641 15.2812 20.1641 14.7188 19.8477 14.4023C19.5312 14.0859 18.9688 14.0859 18.6523 14.4023L14.1523 18.9023C13.8359 19.2188 13.8359 19.7812 14.1523 20.0977C14.4688 20.4141 15.0312 20.4141 15.3477 20.0977L19.8477 15.5977Z"
        fill="#1A8400"
      />
    </svg>
  )
}

// Discount banner — body is always rendered so we can transition max-height
// + opacity smoothly. `.ut-discount-body` on the wrapper drives the state.
function DiscountBanner() {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      className={`pr-discount-banner ut-discount-banner ${open ? 'open' : ''}`}
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
    >
      <DiscountBadge />
      <div className="pr-discount-content">
        <div className="pr-discount-head">
          <div className="pr-discount-head-text">
            <div className="pr-discount-title">You've saved $90 in discounts</div>
            <div className="pr-discount-sub">4 applied automatically</div>
          </div>
          <ChevronIcon
            size={24}
            className={`pr-discount-chevron ${open ? 'open' : ''}`}
          />
        </div>
        <div className="ut-discount-body" aria-hidden={!open}>
          <div className="pr-discount-list">
            {appliedDiscounts.map((d) => (
              <div key={d.bold} className="pr-discount-item">
                <CircleCheckIcon />
                <span className="pr-discount-item-text">
                  <strong>{d.bold}</strong>
                  {d.rest}
                </span>
              </div>
            ))}
            <div className="pr-discount-footer">
              Want to save more? Pay in full at checkout.
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

// ---------- Summary tab ----------
// `committed` is the map of row-name → selected option currently committed
// (i.e. reflected in the price). When a Summary row's `editRowName` matches
// a key in `committed`, we render that value so the two tabs stay in sync
// after Recalculate.
function SummaryTab({ committed }) {
  return (
    <div className="ut-summary">
      <h2 className="ut-section-title">What's covered</h2>
      <ul className="ut-summary-list">
        {summaryCoverages.map((c) => {
          const value =
            c.editRowName && committed && committed[c.editRowName]
              ? committed[c.editRowName]
              : c.value
          return (
            <li key={c.id} className="ut-summary-row">
              <img className="ut-summary-icon" src={c.icon} alt="" aria-hidden="true" />
              <span className="ut-summary-name">{c.name}</span>
              {c.chip ? (
                <span className="ut-free-chip">{value}</span>
              ) : (
                <span className="ut-summary-value">{value}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ---------- Coverage row (Edit + Add-ons) ----------
// Renders name + description + Select + Cost. The Cost value reflects
// draft-vs-committed state:
//   pending           → shows "$—" in primary-blue semibold
//   recently-updated  → shows the new cost in primary-blue semibold
//   normal            → shows the committed cost in muted text
function CoverageBody({
  row,
  draftValue,
  committedValue,
  wasRecentlyUpdated,
  onSelect,
  nameTrailing,
}) {
  const [expanded, setExpanded] = useState(false)
  const rowPending = draftValue !== committedValue
  const committedCost = costFor(row, committedValue)
  const displayCost = rowPending ? '$—' : committedCost
  const costState = rowPending
    ? 'pending'
    : wasRecentlyUpdated
      ? 'recently-updated'
      : ''
  const nameNode = <span className="ut-cov-name">{row.name}</span>
  return (
    <>
      {nameTrailing ? (
        <div className="ut-cov-name-row">
          {nameNode}
          {nameTrailing}
        </div>
      ) : (
        nameNode
      )}
      <button
        type="button"
        className={`ut-cov-desc ${expanded ? 'expanded' : 'truncated'}`}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {row.description}
      </button>
      <Select
        value={draftValue}
        options={row.options}
        onChange={(next) => onSelect(row.name, next)}
      />
      <div className="ut-cov-cost">
        <span className="ut-cov-cost-label">Premium:</span>
        <span className={`ut-cov-cost-value ${costState}`}>{displayCost}</span>
      </div>
    </>
  )
}

function CoverageCard({ row, draftValue, committedValue, wasRecentlyUpdated, onSelect }) {
  return (
    <div className="ut-cov-card">
      <CoverageBody
        row={row}
        draftValue={draftValue}
        committedValue={committedValue}
        wasRecentlyUpdated={wasRecentlyUpdated}
        onSelect={onSelect}
      />
    </div>
  )
}

// Same body but no card chrome — used inside the vehicle card.
function CoverageInline(props) {
  return (
    <div className="ut-cov-row">
      <CoverageBody {...props} />
    </div>
  )
}

// Option 3 layout: every group is a single bordered card. The group title +
// description live inside the card as the accordion header (with a chevron on
// the right), and the coverage rows are stacked below the header, separated
// by thin dividers. Matches the pattern used by Example 1 and Flow: Choose
// Plan. The Vehicles group additionally shows the vehicle name as a sub-row
// inside the header block.
function EditGroup({ group, draft, committed, previous, onSelect, stagger = 0 }) {
  return (
    <section
      className="ut-opt3-group"
      style={{ '--ut-stagger': stagger }}
    >
      <div className="ut-opt3-group-card">
        <Accordion
          defaultExpanded={true}
          className="pr-section-accordion ut-opt3-group-accordion"
          headerLeft={
            <div>
              <h3 className="ut-group-title">{group.title}</h3>
              <p className="ut-group-desc">{group.description}</p>
              {group.vehicleName && (
                <p className="ut-opt3-vehicle-name">{group.vehicleName}</p>
              )}
            </div>
          }
        >
          <div className="ut-vehicle-rows">
            {group.rows.map((row, i) => (
              <div key={row.name}>
                {i > 0 && <hr className="ut-vehicle-divider" aria-hidden="true" />}
                <CoverageInline
                  row={row}
                  draftValue={draft[row.name] ?? row.selection}
                  committedValue={committed[row.name] ?? row.selection}
                  wasRecentlyUpdated={
                    (committed[row.name] ?? row.selection) !==
                    (previous[row.name] ?? row.selection)
                  }
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>
        </Accordion>
      </div>
    </section>
  )
}

function EditTab({ draft, committed, previous, onSelect }) {
  return (
    <div className="ut-edit">
      {editGroups.map((g, i) => (
        <EditGroup
          key={g.id}
          group={g}
          draft={draft}
          committed={committed}
          previous={previous}
          onSelect={onSelect}
          stagger={i}
        />
      ))}
    </div>
  )
}

// ---------- Add-ons tab ----------
function CheckDot() {
  return (
    <span className="pr-check" aria-hidden="true">
      <svg viewBox="0 0 12 12" width="8" height="8" fill="none">
        <path
          d="M2.5 6.3l2.3 2.3 4.7-4.7"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

// Package Included content, without the outer .ut-cov-card chrome — used
// inline in Option 3's Add-ons section where the parent grouped-card wraps
// everything.
function PackageIncludedInline() {
  return (
    <>
      <div className="ut-cov-name">Package Included</div>
      <p className="ut-cov-desc">
        The Essential Assurance Package is automatically included with your new
        policy at no extra cost to you.
      </p>
      <div className="pr-essential-card">
        <div className="pr-essential-title">Essential Assurance Includes:</div>
        <ul className="pr-essential-list">
          {essentialAssuranceItems.map((item) => (
            <li key={item}>
              <CheckDot />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="ut-cov-cost">
        <span className="ut-cov-cost-label">Premium:</span>
        <span className="ut-cov-cost-value">Free</span>
      </div>
    </>
  )
}

function PackageIncludedCard() {
  return (
    <div className="ut-cov-card">
      <PackageIncludedInline />
    </div>
  )
}

// Perk row — same draft/committed/pending flow as the coverage cards, but
// swaps the dropdown for a blue Add / Remove toggle button. When the row is
// pending, Cost shows "$—" in primary blue; after Recalculate the new cost
// stays highlighted in primary blue until the next change (recently-updated).
function PerkRow({ row, draftValue, committedValue, wasRecentlyUpdated, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const rowPending = draftValue !== committedValue
  const committedCost = costFor(row, committedValue)
  const displayCost = rowPending ? '$—' : committedCost
  const costState = rowPending
    ? 'pending'
    : wasRecentlyUpdated
      ? 'recently-updated'
      : ''
  const isIncluded = draftValue === 'Included'
  const nextLabel = isIncluded ? 'Not Included' : 'Included'
  return (
    <>
      <div className="ut-cov-name">{row.name}</div>
      <button
        type="button"
        className={`ut-cov-desc ${expanded ? 'expanded' : 'truncated'}`}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {row.description}
      </button>
      <Button
        severity="primary"
        variant={isIncluded ? 'outlined' : 'filled'}
        size="medium"
        shape="pill"
        onClick={() => onSelect(row.name, nextLabel)}
      >
        {isIncluded ? 'Remove' : 'Add perks'}
      </Button>
      <div className="ut-cov-cost">
        <span className="ut-cov-cost-label">Premium:</span>
        <span className={`ut-cov-cost-value ${costState}`}>{displayCost}</span>
      </div>
    </>
  )
}

// Option 3 Add-ons: mirror the Edit-tab grouped-card pattern. Package Upgrades
// and Perks live inside a single "Packages and Perks" bordered accordion card,
// separated by blue-tinted sub-section labels — same visual as Example 1.
function AddonsTab({ draft, committed, previous, onSelect }) {
  return (
    <div className="ut-addons">
      <section className="ut-opt3-group" style={{ '--ut-stagger': 0 }}>
        <div className="ut-opt3-group-card">
          <Accordion
            defaultExpanded={true}
            className="pr-section-accordion ut-opt3-group-accordion"
            headerLeft={
              <div>
                <h3 className="ut-group-title">Packages and perks</h3>
                <p className="ut-group-desc">
                  Optional upgrades and extras you can add to your policy.
                </p>
              </div>
            }
          >
            <div className="ut-opt3-subsections">
              <div className="ut-opt3-subsection-label">Package Upgrades</div>
              <div className="ut-vehicle-rows">
                <div className="ut-cov-row">
                  <PackageIncludedInline />
                </div>
                <hr className="ut-vehicle-divider" aria-hidden="true" />
                <CoverageInline
                  row={packageUpgradeRow}
                  draftValue={
                    draft[packageUpgradeRow.name] ?? packageUpgradeRow.selection
                  }
                  committedValue={
                    committed[packageUpgradeRow.name] ?? packageUpgradeRow.selection
                  }
                  wasRecentlyUpdated={
                    (committed[packageUpgradeRow.name] ?? packageUpgradeRow.selection) !==
                    (previous[packageUpgradeRow.name] ?? packageUpgradeRow.selection)
                  }
                  onSelect={onSelect}
                  nameTrailing={
                    <a href="#compare" className="ut-compare-link">Compare</a>
                  }
                />
              </div>

              <div className="ut-opt3-subsection-label">Perks</div>
              <div className="ut-vehicle-rows">
                <div className="ut-cov-row">
                  <PerkRow
                    row={perksRow}
                    draftValue={draft[perksRow.name] ?? perksRow.selection}
                    committedValue={committed[perksRow.name] ?? perksRow.selection}
                    wasRecentlyUpdated={
                      (committed[perksRow.name] ?? perksRow.selection) !==
                      (previous[perksRow.name] ?? perksRow.selection)
                    }
                    onSelect={onSelect}
                  />
                </div>
              </div>
            </div>
          </Accordion>
        </div>
      </section>
    </div>
  )
}

// ---------- Page ----------
const tabs = [
  { id: 'summary', label: 'Summary' },
  { id: 'edit', label: 'Edit' },
  { id: 'addons', label: 'Add-ons' },
]

export default function UserTestingOption3Page() {
  const [viewport] = useState('mobile') // share build: mobile-only, no toggle
  const [tab, setTab] = useState('summary')
  const tabIndex = tabs.findIndex((t) => t.id === tab)
  const { trackRef, tabsRef, registerPanel } = useSwipeTabs(tabs, tab, setTab)
  const [billing, setBilling] = useState('monthly')
  const [draftSelections, setDraftSelections] = useState(defaultSelections)
  const [committedSelections, setCommittedSelections] = useState(defaultSelections)
  const [previousCommittedSelections, setPreviousCommittedSelections] =
    useState(defaultSelections)

  const isPending = useMemo(
    () =>
      allEditableRows.some(
        (r) => draftSelections[r.name] !== committedSelections[r.name],
      ),
    [draftSelections, committedSelections],
  )

  const committedMonthly = useMemo(
    () => computeMonthly(committedSelections),
    [committedSelections],
  )

  const { shellRef, priceDelta, bouncing, triggerFeedback } =
    usePriceRecalcFeedback()

  const onSelect = (name, value) =>
    setDraftSelections((prev) => ({ ...prev, [name]: value }))

  const handleRecalculate = () => {
    const prev = committedMonthly
    setPreviousCommittedSelections(committedSelections)
    setCommittedSelections({ ...draftSelections })
    triggerFeedback(prev, computeMonthly(draftSelections))
  }

  // Price always reflects the LAST committed selections — pending state only
  // dims the color to signal "there are uncommitted edits". The number itself
  // only updates after Recalculate.
  const priceDisplay =
    billing === 'monthly'
      ? `$${committedMonthly.toFixed(2)}`
      : `$${(committedMonthly * 6).toFixed(2)}`
  const priceUnit = billing === 'monthly' ? '/mo' : '/6 mo'

  const footerCtaLabel = isPending ? 'Recalculate' : 'Continue'
  const footerCtaOnClick = isPending ? handleRecalculate : undefined

  return (
    <div className={`pr-frame pr-frame--${viewport} ut-frame ut-frame--opt3`}>
      <div className="pr-shell" ref={shellRef}>
        {viewport === 'mobile' ? (
          <>
            <MobileHeader />
            <MobileStepper />
          </>
        ) : (
          <>
            <PlymouthHeader />
            <Stepper activeIndex={activeStep} />
          </>
        )}

        <div className="pr-content ut-content">
          <div className="ut-hero">
            <h1 className="ut-hero-title">Here's your auto quote</h1>
            <div className={`ut-big-price ${isPending ? 'pending' : ''} ${bouncing ? 'bouncing' : ''}`}>
              <span className="ut-big-price-value">{priceDisplay}</span>
              <span className="ut-big-price-unit">{priceUnit}</span>
            </div>
            <hr className="pr-price-divider ut-price-divider" aria-hidden="true" />
            <div className="pr-total ut-total">
              6 Month Total Premium: $
              {(committedMonthly * 6).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <PriceChangeAlert delta={priceDelta} />
            <DiscountBanner />
          </div>

          <div
            className="ut-tabs"
            role="tablist"
            ref={tabsRef}
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`ut-tab ${tab === t.id ? 'selected' : ''}`}
              >
                {t.label}
              </button>
            ))}
            <span className="ut-tab-indicator" aria-hidden="true" />
          </div>

          <div className="ut-tab-body" ref={trackRef}>
            <div className="ut-tab-track">
              <div className="ut-tab-panel" ref={registerPanel(0)} data-tab-id="summary">
                <SummaryTab committed={committedSelections} />
              </div>
              <div className="ut-tab-panel" ref={registerPanel(1)} data-tab-id="edit">
                <EditTab
                  draft={draftSelections}
                  committed={committedSelections}
                  previous={previousCommittedSelections}
                  onSelect={onSelect}
                />
              </div>
              <div className="ut-tab-panel" ref={registerPanel(2)} data-tab-id="addons">
                <AddonsTab
                  draft={draftSelections}
                  committed={committedSelections}
                  previous={previousCommittedSelections}
                  onSelect={onSelect}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bottom bar.
         *
         * IMPORTANT: The two states (normal / pending) render into THE
         * SAME grid cells — price → cell "price", label → cell "label",
         * CTA button → cell "button". Only the text content and color
         * change on state swap. The wrapper .pr-footer-price-block uses
         * `display: contents` in CSS so grid-template-areas addresses the
         * price and label directly. No conditional wrappers, no
         * conditional layout. */}
        <footer className={`pr-footer-bar ${isPending ? 'pending' : ''}`}>
          <div className="pr-footer-inner">
            <div className="pr-footer-price-block">
              <div className={`pr-footer-price ${isPending ? 'pending' : ''}`}>
                {priceDisplay}
              </div>
              <div className="pr-footer-label">
                {isPending
                  ? 'estimated · tap Recalculate'
                  : billing === 'monthly'
                    ? 'monthly payment'
                    : 'total payment'}
              </div>
            </div>
            <Button
              severity="secondary"
              size="medium"
              shape="pill"
              onClick={footerCtaOnClick}
            >
              {footerCtaLabel}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
