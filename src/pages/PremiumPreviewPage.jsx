import { useState, useMemo } from 'react'
import Button from '../components/Button.jsx'
import Accordion from '../components/Accordion.jsx'
import ChevronIcon from '../components/ChevronIcon.jsx'
import Select from '../components/Select.jsx'
import PriceChangeAlert from '../components/PriceChangeAlert.jsx'
import usePriceRecalcFeedback from '../components/usePriceRecalcFeedback.js'


// Normalize options into { label, premium } shape. For string-only option
// lists, synthesize premiums that spread around the row's default so that
// changing the selection actually moves the total premium. The base premium
// is anchored to the row's default selection index; other options fan out by
// a step proportional to the base. Rows with a non-dollar base (Included,
// N/A) keep the row's label as-is to avoid nonsensical dollar values.
function normalizeOptions(row) {
  const opts = row.options && row.options.length > 0 ? row.options : [row.selection]
  const basePrem = parsePremiumNumber(row.premium)
  const centerIdx = Math.max(
    0,
    opts.findIndex(
      (o) => (typeof o === 'string' ? o : o.label) === row.selection,
    ),
  )
  return opts.map((o, i) => {
    if (typeof o !== 'string') return o
    if (basePrem <= 0) return { label: o, premium: row.premium }
    const step = Math.max(5, Math.round(basePrem * 0.12))
    const premium = Math.max(0, basePrem + (i - centerIdx) * step)
    return { label: o, premium: `$${premium}` }
  })
}

function rowPremiumFor(row, selectedLabel) {
  const opts = normalizeOptions(row)
  const found = opts.find((o) => o.label === selectedLabel)
  return (found || opts[0]).premium
}

function parsePremiumNumber(premium) {
  if (typeof premium !== 'string') return 0
  const digits = premium.replace(/[^\d.]/g, '')
  const n = parseFloat(digits)
  return Number.isNaN(n) ? 0 : n
}

const steps = [
  'About You',
  'Drivers',
  'Vehicles',
  'Discounts',
  'Your Quote',
  'Final Details',
  'Purchase',
]

const tiers = [
  { id: 'essential', name: 'Essential', price: '$95/mo', basePrice: 95 },
  { id: 'standard', name: 'Standard', price: '$115.07/mo', basePrice: 115.07 },
  { id: 'superior', name: 'Superior', price: '$250/mo', basePrice: 250 },
  { id: 'custom', name: 'Custom', price: '$—/mo', basePrice: null },
]

const policyCoverages = [
  {
    name: 'Bodily injury liability',
    blurb:
      "Protects you if you're held responsible for injuring someone in a car accident. This coverage can help pay for the injured party's medical expenses, lost wages, pain and suffering, and may also help pay your expenses in a related lawsuit.",
    premium: '$108',
    selection: '$50,000/$100,000',
    options: [
      { label: '$35,000/$70,000', premium: '$85' },
      { label: '$50,000/$100,000', premium: '$108' },
      { label: '$100,000/$300,000', premium: '$145' },
      { label: '$250,000/$500,000', premium: '$200' },
    ],
  },
  {
    name: 'Property damage liability',
    blurb:
      "Protects you if you are held responsible for damaging someone else's property in a car accident. This coverage helps reimburse another person for their damaged property and helps pay your expenses in a related lawsuit.",
    premium: '$108',
    selection: '$10,000/$20,000',
    options: [
      { label: '$5,000', premium: '$85' },
      { label: '$10,000/$20,000', premium: '$108' },
      { label: '$25,000', premium: '$135' },
      { label: '$50,000', premium: '$165' },
      { label: '$100,000', premium: '$205' },
    ],
  },
]

const personalCoverages = [
  {
    name: 'Personal injury protection',
    blurb:
      'New Jersey is a no-fault state, which means medical expenses from injuries sustained in a car accident are paid by your own insurance policy regardless of who caused the accident. Personal Injury Protection (PIP) provides coverage for medical treatment, rehabilitation, and related expenses for you and your household family members, as well as passengers in your vehicle, up to the limit you select.',
    premium: '$108',
    selection: '$250,000',
    options: ['$15,000', '$50,000', '$75,000', '$150,000', '$250,000'],
  },
  {
    name: 'Personal injury protection deductible',
    blurb:
      'The amount you must pay out of pocket for every claim before your PIP coverage begins to pay. A higher deductible typically lowers your monthly premium but increases the amount you owe when you file a claim, so choose a level that fits both your budget and your comfort with out-of-pocket risk.',
    premium: '$108',
    selection: '$2,500',
    options: ['$250', '$500', '$1,000', '$2,500'],
  },
  {
    name: 'PIP healthcare selection',
    blurb:
      'You can lower the cost of your insurance if you select your health insurance as the primary payer for medical expenses arising from a car accident. When Health Insurance is Primary, your health plan pays covered medical bills first and PIP pays only what health insurance does not cover, up to your PIP limit. PIP Primary reverses this order and always pays first.',
    premium: '$108',
    selection: 'Health Insurance Primary',
    options: ['Health Insurance Primary', 'PIP Primary'],
  },
  {
    name: 'PIP full/med only',
    blurb:
      'In addition to medical expenses, Full Benefits pays for income continuation, essential services (like household help while you recover), death benefits, and funeral expenses. Medical Expense Benefits Only limits your PIP coverage to medical bills, with no reimbursement for lost income or related costs, in exchange for a lower premium.',
    premium: '$108',
    selection: 'Full Benefits',
    options: ['Full Benefits', 'Medical Expense Benefits Only'],
  },
  {
    name: 'Extra PIP package options',
    blurb:
      'You can add extra PIP coverage for lost wages, essential services, and death and funeral benefits above the standard PIP limits. Each package option provides progressively higher weekly and total maximums, so a more expensive package returns more money if you are seriously injured; Decline keeps your policy at the standard state minimums with no additional cost.',
    premium: '$108',
    selection: 'Option 1',
    options: ['Decline', 'Option 1', 'Option 2', 'Option 3', 'Option 4'],
  },
  {
    name: 'Extra PIP package applies to',
    blurb:
      'If you select an Extra PIP Package, you can choose whether the increased limits apply only to the Named Insured, to the Named Insured and Spouse, or to the Named Insured and all household members. Broader coverage costs more but ensures every listed person on the policy receives the higher benefit maximums in the event of a claim.',
    premium: '$108',
    selection: 'Named Insured and Spouse',
    options: [
      'Named Insured Only',
      'Named Insured and Spouse',
      'Named Insured and Household Members',
    ],
  },
  {
    name: 'Medical payments',
    blurb:
      'Medical Payments will pay for medical or funeral expenses for you or your passengers resulting from a covered auto accident, regardless of who was at fault. It supplements PIP by covering costs that exceed your PIP limit or that PIP does not cover, such as certain deductibles and copayments, up to the amount you select.',
    premium: '$108',
    selection: '$10,000',
    options: ['$1,000', '$2,500', '$5,000', '$10,000'],
  },
  {
    name: 'Tort threshold',
    blurb:
      "You can choose either 'Limitation on Lawsuit' or 'No Limitation on Lawsuit' as your tort threshold. Limitation on Lawsuit restricts your right to sue for pain and suffering to only the serious injuries defined by New Jersey law, in exchange for a lower premium. No Limitation preserves your full right to sue for any injury caused by another driver, but costs more.",
    premium: '$108',
    selection: 'Limitation on lawsuit',
    options: ['Limitation on lawsuit', 'No Limitation on lawsuit'],
  },
  {
    name: 'UM/UIM bodily injury',
    blurb:
      "Pays for your medical expenses, lost wages, pain and suffering, and other damages when you are injured in an accident caused by an uninsured or underinsured driver. Because you cannot recover from a driver who has no insurance or too little, your UM/UIM limit should generally match your bodily injury liability limit so you're equally protected either way.",
    premium: '$108',
    selection: '$250,000/$500,000',
    options: [
      '$50,000/$100,000',
      '$100,000/$300,000',
      '$250,000/$500,000',
    ],
  },
  {
    name: 'UM/UIM property damage',
    blurb:
      'Protects you if your car is damaged in an accident caused by an uninsured driver. It pays to repair or replace your vehicle up to the coverage limit you select, minus any applicable deductible, so you are not left paying for damage that another driver is responsible for but cannot pay for themselves.',
    premium: '$108',
    selection: '$10,000/$20,000',
    options: ['$10,000/$20,000', '$25,000', '$50,000', '$100,000'],
  },
]

const vehicleCoverages = [
  {
    name: 'Comprehensive',
    blurb:
      'Comprehensive is an optional car insurance coverage that pays for damage to your vehicle from causes other than a collision, including theft, vandalism, fire, hail, flooding, falling objects, and hitting an animal. A deductible applies to each claim; choosing a higher deductible reduces your monthly premium in exchange for a higher out-of-pocket cost when you file.',
    premium: '$108',
    selection: '$5,000',
    options: ['$500', '$1,000', '$2,500', '$5,000', '$10,000'],
  },
  {
    name: 'Glass Deductible',
    blurb:
      'If you select Comprehensive coverage, you have the option to choose a separate deductible for glass claims such as windshield chips and cracks. Comprehensive Deductible applies your standard deductible to glass damage. $50 Glass Deductible caps your out-of-pocket cost at $50 for a small additional premium. No Glass Deductible waives the deductible for glass claims entirely.',
    premium: 'Included',
    selection: 'Comprehensive Deductible',
    options: ['Comprehensive Deductible', '$50 Glass Deductible', 'No Glass Deductible'],
  },
  {
    name: 'Collision',
    blurb:
      'Collision helps pay to repair or replace your car if it hits or is hit by another vehicle or object, regardless of who is at fault. A deductible applies to each collision claim, and higher deductibles reduce your monthly premium while raising the amount you pay when you file a claim.',
    premium: '$514',
    selection: '$500',
    options: ['$250', '$500', '$1,000', '$2,500'],
  },
  {
    name: 'Collision Damage Waiver Applies',
    blurb:
      'You may select a Collision deductible with "Waiver" which waives your Collision deductible when the accident is caused by another driver and that driver\'s insurance company accepts liability. This means you pay no deductible in not-at-fault losses, so your out-of-pocket cost drops to zero when someone else is clearly responsible.',
    premium: 'Included',
    selection: 'Yes',
    options: ['Yes', 'No'],
  },
  {
    name: 'Towing and Labor',
    blurb:
      'Towing and Labor coverage pays to have your car towed or receive emergency roadside labor if your vehicle becomes disabled due to a mechanical breakdown, dead battery, flat tire, or lockout. Coverage applies per occurrence up to the selected limit; higher per-occurrence limits cover more of the cost of towing to a shop or getting back on the road.',
    premium: '$10',
    selection: '$100 Per Occurence',
    options: ['Not Included', '$100 Per Occurence', '$200 Per Occurence'],
  },
  {
    name: 'Rental Reimbursement/Substitute Transportation',
    blurb:
      'Substitute Transportation or Rental Reimbursement protects you against the cost of a rental car or alternative transportation while your vehicle is being repaired after a covered loss. Coverage pays a per-day amount up to a selected maximum total, so a higher daily rate and higher maximum keep you in a replacement vehicle for a longer repair period.',
    premium: '$20',
    selection: '$40 per day/1.2K Maximum',
    options: [
      'Not Included',
      '$30 per day/900 Maximum',
      '$40 per day/1.2K Maximum',
      '$60 per day/1.8K Maximum',
    ],
  },
]

// Ordered to read down-then-across in a 2-column grid:
// Left col:  Door-to-Door, Guaranteed Repairs, eDocuments
// Right col: Get Home Safe, Online & Mobile, Pledge
const essentialAssuranceItems = [
  'Door-to-Door Valet Claims Service®',
  'Get Home Safe® Taxi Ride',
  'Guaranteed Repairs',
  'Online & Mobile Services',
  'eDocuments & eReminders',
  'Pledge of Assurance',
]

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

function MobileHeader() {
  return (
    <div className="pr-mobile-header">
      <img
        src="/plymouth-rock-logo.svg"
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

function MobileStepper({ activeIndex, onStepClick }) {
  const currentStep = steps[activeIndex] || steps[0]
  return (
    <div className="pr-mobile-stepper">
      <div className="pr-mobile-stepper-head">
        <button
          type="button"
          className="pr-mobile-prev"
          onClick={() =>
            activeIndex > 0 && onStepClick?.(activeIndex - 1)
          }
          disabled={activeIndex === 0}
          aria-label="Previous step"
        >
          <span aria-hidden="true">←</span> Previous
        </button>
        <div className="pr-mobile-step-name">{currentStep}</div>
        <div className="pr-mobile-step-count">
          Step {activeIndex + 1} of {steps.length}
        </div>
      </div>
      <div className="pr-mobile-bars">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`pr-mobile-bar ${i <= activeIndex ? 'done' : ''}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}

function PlymouthHeader() {
  return (
    <div className="pr-header">
      <div className="pr-header-inner">
        <img
          src="/plymouth-rock-logo.svg"
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

function Stepper({ activeIndex, onStepClick }) {
  return (
    <div className="pr-stepper">
      <div className="pr-stepper-inner">
        {steps.map((s, i) => {
          const state =
            i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'upcoming'
          const clickable = state === 'done'
          if (clickable) {
            return (
              <button
                key={s}
                type="button"
                className={`pr-step pr-step-${state} pr-step-clickable`}
                onClick={() => onStepClick?.(i)}
                aria-label={`Go back to ${s}`}
              >
                <span className="pr-step-label">{s}</span>
                <span className="pr-step-bar" aria-hidden="true" />
              </button>
            )
          }
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

function TierTabs({ tiers: tierList, selected, onSelect, disabledIds = [] }) {
  return (
    <div className="pr-tier-tabs">
      {tierList.map((t) => {
        const isDisabled = disabledIds.includes(t.id)
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => !isDisabled && onSelect(t.id)}
            aria-disabled={isDisabled}
            className={`pr-tier-tab ${selected === t.id ? 'selected' : ''} ${
              isDisabled ? 'disabled' : ''
            }`}
          >
            <div className="pr-tier-name">{t.name}</div>
            <div className="pr-tier-price">{t.price}</div>
          </button>
        )
      })}
    </div>
  )
}

function CoverageRow({
  row,
  draftValue,
  committedValue,
  onSelect,
  viewport,
}) {
  const [expanded, setExpanded] = useState(false)
  const options = normalizeOptions(row)
  const labels = options.map((o) => o.label)

  const defaultValue = row.selection
  const rowPending = draftValue !== committedValue
  const committedPremium = rowPremiumFor(row, committedValue)
  const previousPremium = rowPremiumFor(row, defaultValue)
  // A row is "customized" once its committed value differs from the row's
  // baseline default AND nothing is currently pending (i.e., Recalculate
  // has been run at least once with a non-default selection).
  const isCustomized = !rowPending && committedValue !== defaultValue
  const displayPremium = rowPending ? '$—' : committedPremium
  const premiumState = rowPending
    ? 'pending'
    : isCustomized
      ? 'recently-updated'
      : ''

  const blurbClass = `pr-coverage-blurb ${expanded ? 'expanded' : 'truncated'}`
  const handleSelect = (label) => onSelect?.(row.name, label)

  const prevNewLine = (
    <div className="pr-coverage-prevnew">
      <span className="pr-prevnew-cell">
        <span className="pr-prevnew-label">Previous:</span>{' '}
        <span className="pr-prevnew-value">{previousPremium}</span>
      </span>
      <span className="pr-prevnew-cell pr-prevnew-cell--right">
        <span className="pr-prevnew-label">New:</span>{' '}
        <span className="pr-prevnew-value pr-prevnew-value--new">
          {committedPremium}
        </span>
      </span>
    </div>
  )

  const currentLine = (
    <div className="pr-coverage-current-line">
      <span className="pr-current-label">Current:</span>
      <span className={`pr-current-value ${premiumState}`}>
        {displayPremium}
      </span>
    </div>
  )

  if (viewport === 'mobile') {
    return (
      <div className="pr-coverage-row open pr-coverage-row--mobile">
        <div className="pr-coverage-name">{row.name}</div>
        <button
          type="button"
          className={blurbClass}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {row.blurb}
        </button>
        <Select value={draftValue} options={labels} onChange={handleSelect} />
        {isCustomized ? prevNewLine : currentLine}
      </div>
    )
  }

  return (
    <div className="pr-coverage-row open">
      <div className="pr-coverage-row-header">
        <div className="pr-coverage-row-main">
          <div className="pr-coverage-name">{row.name}</div>
          <button
            type="button"
            className={blurbClass}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {row.blurb}
          </button>
        </div>
        {!isCustomized && (
          <div className={`pr-coverage-premium ${premiumState}`}>
            {displayPremium}
          </div>
        )}
      </div>
      <div className="pr-coverage-row-body">
        <Select value={draftValue} options={labels} onChange={handleSelect} />
        {isCustomized && prevNewLine}
      </div>
    </div>
  )
}

function CoverageSection({
  title,
  description,
  rows,
  initialCollapsed = false,
  vehicleLine,
  children,
  showTableHead = true,
  viewport,
  draft,
  committed,
  onSelect,
}) {
  return (
    <Accordion
      defaultExpanded={!initialCollapsed}
      className="pr-section-accordion"
      headerLeft={
        <div>
          <h3 className="pr-section-title">{title}</h3>
          {description && (
            <p className="pr-section-description">{description}</p>
          )}
          {vehicleLine && (
            <p className="pr-section-vehicle">{vehicleLine}</p>
          )}
        </div>
      }
    >
      {showTableHead && viewport !== 'mobile' && (
        <div className="pr-coverage-table-head">
          <span>Coverages</span>
          <span>Current</span>
        </div>
      )}
      <div className="pr-coverage-table">
        {rows &&
          rows.map((row) => (
            <CoverageRow
              key={row.name}
              row={row}
              draftValue={draft[row.name] ?? row.selection}
              committedValue={committed[row.name] ?? row.selection}
              onSelect={onSelect}
              viewport={viewport}
            />
          ))}
        {children}
      </div>
    </Accordion>
  )
}

function PackageIncludedCard() {
  return (
    <div className="pr-included-card">
      <div className="pr-included-head">
        <div>
          <div className="pr-coverage-name">Package Included</div>
          <div className="pr-coverage-blurb">
            The Essential Assurance Package is automatically included with your
            new policy.
          </div>
        </div>
        <div className="pr-coverage-premium">Included</div>
      </div>
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
    </div>
  )
}

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

function DiscountBanner() {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      className={`pr-discount-banner ${open ? 'open' : ''}`}
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
    >
      <DiscountBadge />
      <div className="pr-discount-content">
        <div className="pr-discount-head">
          <div className="pr-discount-head-text">
            <div className="pr-discount-title">
              You've saved $90 in discounts
            </div>
            <div className="pr-discount-sub">4 applied automatically</div>
          </div>
          <ChevronIcon
            size={24}
            className={`pr-discount-chevron ${open ? 'open' : ''}`}
          />
        </div>
        {open && (
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
        )}
      </div>
    </button>
  )
}

const packageUpgradeRow = {
  name: 'Package Upgrade',
  blurb:
    'The Assurance Preferred and Assurance Premier packages are optional upgrades to the Essential Assurance Package and are available for an additional cost. Preferred adds enhanced roadside benefits, deductible reductions, and extended rental coverage, while Premier includes the highest tier of protection with new-car replacement, key replacement, and expanded rental days for a covered loss.',
  premium: '$0',
  selection: 'No Upgrade',
  options: [
    { label: 'No Upgrade', premium: '$0' },
    { label: 'Assurance Preferred', premium: '$25' },
    { label: 'Assurance Premier', premium: '$50' },
  ],
}

const accidentForgivenessRow = {
  name: 'Accident Forgiveness',
  blurb:
    'Accident Forgiveness coverage will forgive one surchargable accident so that it does not impact your policy premium at renewal. You must meet certain qualifications, such as a minimum accident-free period on your driving record, in order to purchase this coverage. Once used, it will not apply again until you re-qualify.',
  premium: 'N/A',
  selection: 'Not Included',
  options: [
    { label: 'Not Included', premium: 'N/A' },
    { label: 'Included', premium: '$18' },
  ],
}

const allRows = [
  ...policyCoverages,
  ...personalCoverages,
  ...vehicleCoverages,
  packageUpgradeRow,
  accidentForgivenessRow,
]

const defaultSelections = allRows.reduce((acc, r) => {
  acc[r.name] = r.selection
  return acc
}, {})

const defaultPremiumMap = allRows.reduce((acc, r) => {
  acc[r.name] = parsePremiumNumber(rowPremiumFor(r, r.selection))
  return acc
}, {})

function computeMonthly(selections, base) {
  let delta = 0
  allRows.forEach((r) => {
    const current = parsePremiumNumber(rowPremiumFor(r, selections[r.name]))
    delta += current - defaultPremiumMap[r.name]
  })
  return Math.max(0, base + delta)
}

export default function PremiumPreviewPage() {
  const [stepIndex, setStepIndex] = useState(4)
  const [selectedTier, setSelectedTier] = useState('standard')
  const [viewport, setViewport] = useState('desktop')
  const [draftSelections, setDraftSelections] = useState(defaultSelections)
  const [committedSelections, setCommittedSelections] =
    useState(defaultSelections)
  // customState is null until the user runs Recalculate at least once with a
  // non-default selection. After that it snapshots the customized plan so
  // clicking Custom later restores it, and preset tabs can be visited without
  // losing the custom setup.
  const [customState, setCustomState] = useState(null)

  const presetTierBase = (tierId) =>
    tiers.find((t) => t.id === tierId)?.basePrice ?? 0

  const tierBase = useMemo(() => {
    if (selectedTier === 'custom') return customState?.base ?? 0
    return presetTierBase(selectedTier)
  }, [selectedTier, customState])

  const isPending = useMemo(
    () => allRows.some((r) => draftSelections[r.name] !== committedSelections[r.name]),
    [draftSelections, committedSelections],
  )
  const committedMonthly = useMemo(
    () => computeMonthly(committedSelections, tierBase),
    [committedSelections, tierBase],
  )

  const handleSelectRow = (rowName, label) => {
    setDraftSelections((prev) => ({ ...prev, [rowName]: label }))
  }
  const { shellRef, priceDelta, bouncing, triggerFeedback } =
    usePriceRecalcFeedback()

  const handleRecalculate = () => {
    const prev = committedMonthly
    const newSelections = { ...draftSelections }
    const baseAtCommit = tierBase
    const newPrice = computeMonthly(newSelections, baseAtCommit)
    setCommittedSelections(newSelections)
    setCustomState({
      price: newPrice,
      base: baseAtCommit,
      selections: newSelections,
    })
    setSelectedTier('custom')
    triggerFeedback(prev, newPrice)
  }
  // Selecting a preset tier resets coverage selections to defaults so the big
  // price exactly matches that tier's headline number. Selecting Custom
  // restores the last-committed customization instead of resetting.
  const handleSelectTier = (tierId) => {
    if (tierId === selectedTier) return
    if (tierId === 'custom') {
      if (!customState) return // Custom is disabled until first Recalculate
      setSelectedTier('custom')
      setDraftSelections(customState.selections)
      setCommittedSelections(customState.selections)
      return
    }
    setSelectedTier(tierId)
    setDraftSelections(defaultSelections)
    setCommittedSelections(defaultSelections)
  }

  // Custom tab stays hidden entirely until the first Recalculate creates a
  // customState snapshot. After that it appears with the live customized price.
  const displayTiers = useMemo(
    () =>
      tiers
        .filter((t) => t.id !== 'custom' || customState)
        .map((t) =>
          t.id === 'custom'
            ? { ...t, price: `$${customState.price.toFixed(2)}/mo` }
            : t,
        ),
    [customState],
  )

  const priceDisplay = isPending ? '$—' : `$${committedMonthly.toFixed(2)}`
  const ctaTopLabel = isPending ? 'Recalculate' : 'Looks good, continue'
  const ctaBottomLabel = isPending ? 'Recalculate' : 'Continue'
  const ctaOnClick = isPending ? handleRecalculate : undefined

  return (
    <div className={`pr-frame pr-frame--${viewport}`}>
      <div className="pr-viewport-toggle" role="group" aria-label="Viewport">
        <button
          type="button"
          className={viewport === 'desktop' ? 'active' : ''}
          onClick={() => setViewport('desktop')}
        >
          Desktop
        </button>
        <button
          type="button"
          className={viewport === 'mobile' ? 'active' : ''}
          onClick={() => setViewport('mobile')}
        >
          Mobile
        </button>
      </div>
    <div className="pr-shell" ref={shellRef}>
      {viewport === 'mobile' ? (
        <>
          <MobileHeader />
          <MobileStepper
            activeIndex={stepIndex}
            onStepClick={setStepIndex}
          />
        </>
      ) : (
        <>
          <PlymouthHeader />
          <Stepper activeIndex={stepIndex} onStepClick={setStepIndex} />
        </>
      )}

      <div className="pr-content">
        <div className="pr-hero">
          <h1 className="pr-hero-title">Select a 6-month estimated policy</h1>
          <p className="pr-hero-subtitle">
            Looks good? Continue to lock in this rate
          </p>

          <TierTabs
            tiers={displayTiers}
            selected={selectedTier}
            onSelect={handleSelectTier}
          />

          <div className={`pr-big-price ${isPending ? 'pending' : ''} ${bouncing ? 'bouncing' : ''}`}>
            <span className="pr-big-price-value">
              {isPending ? '$—' : `$${committedMonthly.toFixed(2)}`}
            </span>
            {!isPending && <span className="pr-big-price-unit">/mo</span>}
          </div>
          <PriceChangeAlert delta={priceDelta} />
          {isPending ? (
            <div className="pr-big-price-subtext">
              estimated · tap Recalculate
            </div>
          ) : (
            <>
              <hr className="pr-price-divider" aria-hidden="true" />
              <div className="pr-total">
                6 Month Total Premium: $
                {(committedMonthly * 6).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </>
          )}

          <Button
            severity="secondary"
            size="large"
            shape="pill"
            className="pr-cta-spacing"
            onClick={ctaOnClick}
          >
            {ctaTopLabel}
          </Button>

          <div className="pr-quote-links">
            <a href="#print" className="pr-quote-btn">
              <svg
                className="pr-quote-btn-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
              </svg>
              Print quote
            </a>
            <a href="#email" className="pr-quote-btn">
              <svg
                className="pr-quote-btn-icon"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M15 3H3C2.175 3 1.5075 3.675 1.5075 4.5L1.5 13.5C1.5 14.325 2.175 15 3 15H15C15.825 15 16.5 14.325 16.5 13.5V4.5C16.5 3.675 15.825 3 15 3ZM15 6L9 9.75L3 6V4.5L9 8.25L15 4.5V6Z" />
              </svg>
              Email quote
            </a>
          </div>
        </div>

        <DiscountBanner />

        <CoverageSection
          title="Policy coverages"
          description="Coverage paid to others when you are at fault for a covered loss."
          rows={policyCoverages}
          viewport={viewport}
          draft={draftSelections}
          committed={committedSelections}
          onSelect={handleSelectRow}
        />

        <CoverageSection
          title="Personal coverages"
          description="Coverage paid to others when you are at fault for a covered loss."
          rows={personalCoverages}
          viewport={viewport}
          draft={draftSelections}
          committed={committedSelections}
          onSelect={handleSelectRow}
        />

        <CoverageSection
          title="Vehicle Coverage for"
          vehicleLine="2022 Volkswagen Atlas Cross Sport SE AWD SUV (VIN ...6789)"
          rows={vehicleCoverages}
          viewport={viewport}
          draft={draftSelections}
          committed={committedSelections}
          onSelect={handleSelectRow}
        />

        <CoverageSection
          title="Packages and Perks"
          description="This is coverage paid to others when you are at fault for a covered loss."
          showTableHead={false}
          viewport={viewport}
          draft={draftSelections}
          committed={committedSelections}
          onSelect={handleSelectRow}
        >
          <div className="pr-subsection-label">
            <span>Package Upgrades</span>
            <span>Current</span>
          </div>
          <PackageIncludedCard />

          <CoverageRow
            row={packageUpgradeRow}
            draftValue={draftSelections[packageUpgradeRow.name]}
            committedValue={committedSelections[packageUpgradeRow.name]}
            onSelect={handleSelectRow}
            viewport={viewport}
          />

          <div className="pr-subsection-label">
            <span>Perks</span>
            <span>Current</span>
          </div>

          <CoverageRow
            row={accidentForgivenessRow}
            draftValue={draftSelections[accidentForgivenessRow.name]}
            committedValue={committedSelections[accidentForgivenessRow.name]}
            onSelect={handleSelectRow}
            viewport={viewport}
          />
        </CoverageSection>

      </div>

      <footer className={`pr-footer-bar ${isPending ? 'pending' : ''}`}>
        <div className="pr-footer-inner">
          <div className="pr-footer-price-block">
            <div className={`pr-footer-price ${isPending ? 'pending' : ''}`}>
              {priceDisplay}
            </div>
            <div className="pr-footer-label">
              {isPending ? 'estimated · tap Recalculate' : 'Monthly payment'}
            </div>
          </div>
          <Button
            severity="secondary"
            size={isPending ? 'medium' : 'large'}
            shape="pill"
            onClick={ctaOnClick}
          >
            {ctaBottomLabel}
          </Button>
        </div>
      </footer>
    </div>
    </div>
  )
}
