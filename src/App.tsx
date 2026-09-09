import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

type Crowd = 'light' | 'moderate' | 'peak'
type Theme = 'light' | 'dark'

interface PartyNight {
  id: number
  date: Date
  dayLabel: string
  weekday: string
  fullLabel: string
  price: number
  crowd: Crowd
  soldOut: boolean
}

interface FreeItem {
  id: number
  name: string
  date: string
  blurb: string
}

/* ------------------------------------------------------------------ *
 * Hooks
 * ------------------------------------------------------------------ */

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem('rrg-theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('rrg-theme', theme)
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), [])
  return [theme, toggle]
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

function useAnimatedNumber(value: number, duration = 600, enabled = true): number {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setDisplay(value)
      return
    }
    fromRef.current = display
    startRef.current = null
    const from = fromRef.current
    const delta = value - from

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const t = Math.min(elapsed / duration, 1)
      const next = from + delta * easeOutCubic(t)
      setDisplay(next)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setDisplay(value) // land exactly
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, enabled])

  return display
}

/* ------------------------------------------------------------------ *
 * Icons (inline SVG)
 * ------------------------------------------------------------------ */

function Sun({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function Moon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function Printer({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}

function Link({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function Snow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v20M4.22 4.22l15.56 15.56M2 12h20M4.22 19.78L19.78 4.22" />
    </svg>
  )
}

function Ticket({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7v2a2 2 0 0 1 0 4v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
      <path d="M13 5v14" strokeDasharray="2 2" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Data — 22 party nights (Nov 13 – Dec 22)
 * ------------------------------------------------------------------ */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const FULL_WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildNights(): PartyNight[] {
  const nights: PartyNight[] = []
  // Nov 13 – Dec 22, party nights on select evenings.
  // We pick the operating calendar: mostly Thu–Sun plus a few weekdays.
  const schedule: { month: number; day: number; price: number; crowd: Crowd; soldOut?: boolean }[] = [
    // November
    { month: 10, day: 13, price: 139, crowd: 'light' },
    { month: 10, day: 14, price: 149, crowd: 'moderate' },
    { month: 10, day: 15, price: 159, crowd: 'moderate' },
    { month: 10, day: 16, price: 169, crowd: 'peak' },
    { month: 10, day: 20, price: 149, crowd: 'light' },
    { month: 10, day: 21, price: 159, crowd: 'moderate', soldOut: true },
    { month: 10, day: 22, price: 179, crowd: 'peak' },
    { month: 10, day: 23, price: 189, crowd: 'peak', soldOut: true },
    { month: 10, day: 27, price: 159, crowd: 'moderate' },
    { month: 10, day: 28, price: 179, crowd: 'peak' },
    { month: 10, day: 29, price: 199, crowd: 'peak', soldOut: true },
    { month: 10, day: 30, price: 209, crowd: 'peak' },
    // December
    { month: 11, day: 4, price: 169, crowd: 'moderate' },
    { month: 11, day: 5, price: 179, crowd: 'peak' },
    { month: 11, day: 6, price: 189, crowd: 'peak' },
    { month: 11, day: 7, price: 199, crowd: 'peak', soldOut: true },
    { month: 11, day: 11, price: 189, crowd: 'moderate' },
    { month: 11, day: 12, price: 209, crowd: 'peak' },
    { month: 11, day: 13, price: 219, crowd: 'peak', soldOut: true },
    { month: 11, day: 14, price: 229, crowd: 'peak' },
    { month: 11, day: 18, price: 209, crowd: 'peak' },
    { month: 11, day: 19, price: 219, crowd: 'peak' },
    { month: 11, day: 20, price: 229, crowd: 'peak' },
  ]

  let id = 1
  for (const s of schedule) {
    const date = new Date(2025, s.month, s.day)
    const dow = date.getDay()
    nights.push({
      id: id++,
      date,
      dayLabel: `${MONTHS[s.month]} ${s.day}`,
      weekday: WEEKDAYS[dow],
      fullLabel: `${FULL_WEEKDAYS[dow]}, ${MONTHS[s.month]} ${s.day}, 2025`,
      price: s.price,
      crowd: s.crowd,
      soldOut: !!s.soldOut,
    })
  }
  return nights
}

const NIGHTS = buildNights()

const FREE_ITEMS: FreeItem[] = [
  { id: 1, name: 'Cookie Decorating Workshop', date: 'Every party night', blurb: 'Frost your own snowman cookie at the Holly Jolly Bakery. All supplies included with admission.' },
  { id: 2, name: 'Snowfall on Main Street', date: 'Every party night', blurb: 'Synthetic snow falls every 20 minutes along Main Street, synced to the holiday score.' },
  { id: 3, name: 'Tinkerbell’s Tree-Lighting', date: 'Every party night', blurb: 'Countdown to the lighting of the 60-foot holiday tree in the hub. Show runs 7:15 & 9:00 PM.' },
  { id: 4, name: 'Holiday Fireworks Finale', date: 'Every party night', blurb: '“Joy to the Stars” fireworks above the castle. Best viewing from the hub and Tomorrowland bridge.' },
  { id: 5, name: 'A capella Carolers', date: 'Every party night', blurb: 'Roaming quartets singing classics through Town Square, Liberty Square, and Frontierland.' },
  { id: 6, name: 'Frozen Sing-Along', date: 'Every party night', blurb: 'Anna, Elsa, and Kristoff host a 25-minute sing-along at the Gazebo Stage. Indoor seating.' },
  { id: 7, name: 'Hot Cocoa Sampling', date: 'Nov 13–16', blurb: 'Three cocoa styles (classic, peppermint, Mexican spice) at the Trail’s End cart. One flight per guest.' },
  { id: 8, name: 'Gingerbread Photo Op', date: 'Nov 20–23', blurb: 'Life-size gingerbread house display in the Grand Hall. Self-photos encouraged; character shots Nov 22.' },
  { id: 9, name: 'Reindeer Games Lawn', date: 'Nov 27–30', blurb: 'Ring toss, antler ring toss, and snowball skee-ball on the Frontierland lawn. All ages.' },
  { id: 10, name: 'Ornament Crafting', date: 'Dec 4–7', blurb: 'Build a pressed-tin ornament to take home at the Crafters Cottage. While supplies last.' },
  { id: 11, name: 'Brass Band Holiday March', date: 'Dec 11–14', blurb: '12-piece brass band parades down Main Street twice nightly with a guest conductor from the crowd.' },
  { id: 12, name: 'Letters to the North Pole', date: 'Dec 18–22', blurb: 'Write and post a letter to Santa at the Tomorrowland Post Office. Stamped and “delivered” by reindeer.' },
]

const POLISH_MOVES = [
  {
    title: 'Spring-settle chip selection',
    detail:
      'Tapping a night scales the chip to 0.88 then springs back with a cubic-bezier overshoot over 300ms — a tactile “click” that confirms the pick without a jarring snap.',
  },
  {
    title: 'Cross-fading verdict line',
    detail:
      'The prose verdict remounts on a key so React cross-fades the swap, giving the changing sentence a soft transition instead of a hard text replace.',
  },
  {
    title: 'Count-up totals that land exactly',
    detail:
      'Animated totals use a requestAnimationFrame loop with an easeOutCubic curve and an explicit “land on the final value” step so the number never overshoots or drifts.',
  },
  {
    title: 'Arrow-key calendar navigation',
    detail:
      'Left/Right move to adjacent nights, Up/Down jump five nights at a time, and Enter/Space toggles the focused chip — the whole grid is keyboard-navigable with live aria-labels.',
  },
  {
    title: 'Designed empty state',
    detail:
      'With no nights selected the panel shows a snowflake and a one-line guide rather than a blank box — the empty state is a deliberate part of the design, not an absence.',
  },
]

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const crowdLabel = (c: Crowd) => (c === 'light' ? 'Light crowd' : c === 'moderate' ? 'Moderate crowd' : 'Peak crowd')

function formatMoney(n: number): string {
  return `$${Math.round(n)}`
}

// Group nights into weeks (by ISO-ish week start = the Monday before/at date)
function groupByWeek(nights: PartyNight[]): PartyNight[][] {
  const weeks: PartyNight[][] = []
  let current: PartyNight[] = []
  let currentWeekStart: number | null = null

  for (const n of nights) {
    const d = n.date
    const dow = d.getDay()
    // Monday-based week start
    const offset = dow === 0 ? 6 : dow - 1
    const weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate() - offset).getTime()

    if (currentWeekStart === null) {
      currentWeekStart = weekStart
      current = [n]
    } else if (weekStart === currentWeekStart) {
      current.push(n)
    } else {
      weeks.push(current)
      current = [n]
      currentWeekStart = weekStart
    }
  }
  if (current.length) weeks.push(current)
  return weeks
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const reducedMotion = useReducedMotion()

  const [picked, setPicked] = useState<Set<number>>(new Set())
  const [focusIndex, setFocusIndex] = useState<number>(0)
  const [printOpen, setPrintOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])

  const weeks = useMemo(() => groupByWeek(NIGHTS), [])

  const pickedNights = useMemo(
    () => NIGHTS.filter((n) => picked.has(n.id)).sort((a, b) => a.date.getTime() - b.date.getTime()),
    [picked],
  )

  const totalCost = useMemo(() => pickedNights.reduce((sum, n) => sum + n.price, 0), [pickedNights])
  const cheapest = useMemo(
    () => (pickedNights.length ? pickedNights.reduce((m, n) => (n.price < m.price ? n : m)) : null),
    [pickedNights],
  )
  const soldOutPicked = useMemo(() => pickedNights.filter((n) => n.soldOut), [pickedNights])

  const animatedTotal = useAnimatedNumber(totalCost, 600, !reducedMotion)

  const toggleNight = useCallback((id: number) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleChipKey = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const last = NIGHTS.length - 1
      let next = index
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next = Math.min(index + 1, last)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        next = Math.max(index - 1, 0)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        next = Math.min(index + 5, last)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        next = Math.max(index - 5, 0)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggleNight(NIGHTS[index].id)
        return
      } else {
        return
      }
      setFocusIndex(next)
      chipRefs.current[next]?.focus()
    },
    [toggleNight],
  )

  // Keep focus index in range
  useEffect(() => {
    if (focusIndex > NIGHTS.length - 1) setFocusIndex(0)
  }, [focusIndex])

  const verdictKey = `${picked.size}-${soldOutPicked.length}`
  const verdict = useMemo(() => {
    const count = picked.size
    if (count === 0) return null
    if (count === 1) return 'You’re easing in with a single night — a smart taste-test before going all-in.'
    if (count <= 3)
      return soldOutPicked.length
        ? 'A tidy short-list, with one hard-to-get night in the mix. Good hunting.'
        : 'A tidy short-list of three — enough variety to catch different shows without burning out.'
    if (count <= 8)
      return soldOutPicked.length
        ? 'Going for breadth, and you’ve snagged some scarce nights. That’s a serious party run.'
        : 'Going for breadth: a solid run that hits every crowd level and most show slots.'
    return 'That’s a full-on holiday marathon — pace the cocoa intake and rotate who drives.'
  }, [picked.size, soldOutPicked.length])

  const shareLink = useMemo(() => {
    const ids = [...picked].sort((a, b) => a - b)
    const code = ids.length
      ? btoa(ids.join(',')).replace(/=+$/, '').slice(0, 7).toLowerCase()
      : 'welcome'
    return `rrg.party/${code}`
  }, [picked])

  const copyShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareLink} — Ride Ready Guide: Party-Night Planner`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }, [shareLink])

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead-inner">
          <a className="brand" href="#top">
            <Ticket className="brand-icon" />
            <span>
              <span className="brand-name">Ride Ready Guide</span>
              <span className="brand-sub">Party-Night Planner</span>
            </span>
          </a>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon /> : <Sun />}
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-inner">
          <p className="hero-eyebrow">Holiday 2025 · After-hours event planner</p>
          <h1 className="hero-title">Plan your party nights.</h1>
          <p className="hero-lede">
            Twenty-two after-hours party nights from November 13 through December 22. Tap the nights you want,
            watch the budget roll up, and share the short-list. Every item below the calendar is{' '}
            <strong>free with admission</strong>.
          </p>
        </div>
      </section>

      <main className="tool">
        <section className="tool-main" aria-label="Party-night calendar">
          <div className="tool-head">
            <h2 className="tool-title">Pick your nights</h2>
            <p className="tool-help">
              Tap a chip to add or remove a night. Use arrow keys to move through the calendar and Enter or Space to
              toggle.
            </p>
          </div>

          {weeks.map((week, wi) => (
            <div className="week" key={wi}>
              <p className="week-label">
                Week of {MONTHS[week[0].date.getMonth()]} {week[0].date.getDate()}
              </p>
              <div className="chip-row" role="group" aria-label={`Week of ${MONTHS[week[0].date.getMonth()]} ${week[0].date.getDate()}`}>
                {week.map((n) => {
                  const idx = NIGHTS.findIndex((x) => x.id === n.id)
                  const isPicked = picked.has(n.id)
                  return (
                    <button
                      key={n.id}
                      ref={(el) => {
                        chipRefs.current[idx] = el
                      }}
                      className={`chip ${isPicked ? 'is-picked' : ''} ${n.soldOut ? 'is-soldout' : ''}`}
                      onClick={() => toggleNight(n.id)}
                      onKeyDown={(e) => handleChipKey(e, idx)}
                      aria-pressed={isPicked}
                      aria-label={`${n.fullLabel}, ${formatMoney(n.price)}, ${crowdLabel(n.crowd)}${n.soldOut ? ', sold out' : ''}${isPicked ? ', selected' : ''}`}
                      tabIndex={focusIndex === idx ? 0 : -1}
                    >
                      <span className="chip-weekday">{n.weekday}</span>
                      <span className="chip-day">{n.date.getDate()}</span>
                      <span className="chip-price">{formatMoney(n.price)}</span>
                      <span className={`chip-crowd crowd-${n.crowd}`}>{n.crowd}</span>
                      {isPicked && <Check className="chip-check" />}
                      {n.soldOut && <span className="chip-soldout">Sold out</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="legend" aria-label="Calendar legend">
            <span className="legend-item"><span className="dot crowd-light" /> Light crowd</span>
            <span className="legend-item"><span className="dot crowd-moderate" /> Moderate crowd</span>
            <span className="legend-item"><span className="dot crowd-peak" /> Peak crowd</span>
            <span className="legend-item"><span className="dot dash" /> Sold out</span>
          </div>

          {soldOutPicked.length > 0 && (
            <p className="soldout-note">
              {soldOutPicked.length === 1
                ? 'One of your picks is currently sold out — you can leave it on the list as a reminder.'
                : `${soldOutPicked.length} of your picks are currently sold out — keep them as reminders or swap them out.`}
            </p>
          )}
        </section>

        <aside className="tool-side" aria-label="Your party-night summary">
          <div className="side-panel">
            {pickedNights.length === 0 ? (
              <div className="empty-state">
                <Snow className="empty-icon" />
                <p className="empty-title">No nights picked yet</p>
                <p className="empty-help">
                  Tap a chip in the calendar to start building your party run. Your total, cheapest night, and
                  shareable link will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="stat-block">
                  <div className="stat">
                    <span className="stat-label">Total cost</span>
                    <span className="stat-value" aria-live="polite">
                      {formatMoney(animatedTotal)}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Nights</span>
                    <span className="stat-value">{pickedNights.length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Cheapest night</span>
                    <span className="stat-value">
                      {cheapest ? formatMoney(cheapest.price) : '—'}
                      {cheapest && <span className="stat-sub">{cheapest.dayLabel}</span>}
                    </span>
                  </div>
                </div>

                <ul className="picked-list">
                  {pickedNights.map((n) => (
                    <li key={n.id} className="picked-item">
                      <span className="picked-date">{n.fullLabel.replace(', 2025', '')}</span>
                      <span className="picked-meta">
                        {formatMoney(n.price)} · <span className={`crowd-tag crowd-${n.crowd}`}>{n.crowd}</span>
                        {n.soldOut && <span className="picked-soldout">Sold out</span>}
                      </span>
                      <button
                        className="picked-remove"
                        onClick={() => toggleNight(n.id)}
                        aria-label={`Remove ${n.fullLabel}`}
                      >
                        <X className="picked-remove-icon" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="verdict" key={reducedMotion ? 'static' : verdictKey}>
                  <p className="verdict-line">{verdict}</p>
                </div>
              </>
            )}

            <div className="share-panel">
              <div className="share-link">
                <Link className="share-link-icon" />
                <span className="share-link-text">{shareLink}</span>
                <button
                  className="copy-btn"
                  onClick={copyShare}
                  aria-label="Copy share link"
                >
                  {copied ? <Check className="copy-btn-icon" /> : 'Copy'}
                </button>
              </div>
              <button className="print-btn" onClick={() => setPrintOpen(true)}>
                <Printer className="print-btn-icon" /> Print checklist
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Free-with-admission items */}
      <section className="free-items" aria-label="Free with admission">
        <div className="section-head">
          <h2 className="section-title">Free with admission</h2>
          <p className="section-help">Twelve holiday extras included in your party ticket — no upcharge.</p>
        </div>
        <ul className="free-grid">
          {FREE_ITEMS.map((item) => (
            <li className="free-card" key={item.id}>
              <h3 className="free-name">{item.name}</h3>
              <p className="free-date">{item.date}</p>
              <p className="free-blurb">{item.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Polish moves */}
      <section className="polish" aria-label="Polish moves">
        <div className="section-head">
          <h2 className="section-title">Polish moves</h2>
          <p className="section-help">Five interaction details that make the planner feel hand-built.</p>
        </div>
        <ol className="polish-list">
          {POLISH_MOVES.map((m, i) => (
            <li className="polish-item" key={i}>
              <span className="polish-num">{i + 1}</span>
              <div>
                <h3 className="polish-title">{m.title}</h3>
                <p className="polish-detail">{m.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="site-foot">
        <p>Ride Ready Guide — Party-Night Planner. A fictional demo. Prices and dates are illustrative.</p>
      </footer>

      {/* Print preview overlay */}
      {printOpen && (
        <div className="print-overlay" role="dialog" aria-modal="true" aria-label="Print preview">
          <div className="print-toolbar">
            <button className="print-do" onClick={() => window.print()}>
              <Printer className="print-btn-icon" /> Print now
            </button>
            <button className="print-close" onClick={() => setPrintOpen(false)} aria-label="Close print preview">
              <X /> Close
            </button>
          </div>
          <div className="paper">
            <h2 className="paper-title">Ride Ready Guide — Party-Night Checklist</h2>
            <p className="paper-sub">
              {pickedNights.length} night{pickedNights.length === 1 ? '' : 's'} · Total {formatMoney(totalCost)}
            </p>
            <ul className="paper-list">
              {pickedNights.map((n) => (
                <li className="paper-item" key={n.id}>
                  <span className="paper-box" aria-hidden="true" />
                  <span className="paper-date">{n.fullLabel}</span>
                  <span className="paper-meta">
                    {formatMoney(n.price)} · {crowdLabel(n.crowd)}
                    {n.soldOut ? ' · Sold out' : ''}
                  </span>
                </li>
              ))}
              {pickedNights.length === 0 && (
                <li className="paper-item paper-empty">
                  <span className="paper-box" aria-hidden="true" />
                  <span>No nights selected yet.</span>
                </li>
              )}
            </ul>
            <h3 className="paper-h3">Free with admission</h3>
            <ul className="paper-list">
              {FREE_ITEMS.map((item) => (
                <li className="paper-item" key={item.id}>
                  <span className="paper-box" aria-hidden="true" />
                  <span className="paper-date">{item.name}</span>
                  <span className="paper-meta">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
