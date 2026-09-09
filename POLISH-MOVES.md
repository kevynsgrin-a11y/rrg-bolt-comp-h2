# Polish Moves — Party-Night Planner

Five interaction details that make the planner feel hand-built rather than
auto-generated. Each is small on its own but the combination is what gives the
tool a considered, responsive feel.

## 1. Spring-settle chip selection

When you tap a night, the chip scales down to `0.88` and then springs back to
full size over `300ms` using a `cubic-bezier(0.34, 1.56, 0.64, 1)` curve — the
overshoot beyond `1.0` produces a tactile "click" that confirms the pick without
a jarring snap. The selected state also gains a teal border, a soft glow ring,
and a check mark that fades in with the same spring timing.

## 2. Cross-fading verdict line

The prose verdict under the picked-nights list changes its wording based on the
*shape* of the selection (one night, a short list, a broad run, or a full
marathon — with a sub-variant when a sold-out night is included). Rather than
hard-replacing the text, the verdict block is keyed on a composite key
(`${count}-${soldOutCount}`) so React remounts it, and the remount runs a short
`verdict-fade` keyframe that cross-fades the new sentence in. The result is a
soft transition that draws the eye to the change instead of a blink-replace.

## 3. Count-up totals that land exactly

The total-cost stat uses a `requestAnimationFrame` loop with an `easeOutCubic`
curve over `600ms`. The crucial detail is the final step: when `t` reaches `1`,
the loop explicitly sets the display value to the exact target (`setDisplay(value)`)
rather than letting the easing math compute the last frame. This guarantees the
number never overshoots, never drifts by a fraction, and always lands on the
true total. When reduced motion is requested, the animation is skipped entirely
and the value snaps.

## 4. Arrow-key calendar navigation

The whole calendar is keyboard-navigable as a flat roving-tabindex grid:

- **Left / Right** — move to the adjacent night (clamped at the ends).
- **Up / Down** — jump five nights forward or backward, so the grid behaves like
  a spatial layout even though it visually wraps by week.
- **Enter / Space** — toggle the currently focused chip.

Focus is managed with a roving `tabIndex` (only the focused chip has `tabIndex=0`,
the rest are `-1`), and every chip carries a full `aria-label` with date, price,
crowd level, sold-out status, and selected state — so screen-reader users get the
complete picture without reading the visual layout.

## 5. Designed empty state

With no nights selected the side panel doesn't show a blank box. Instead it
renders a deliberate empty state: a snowflake icon, the line "No nights picked
yet," and one sentence of guidance pointing back to the calendar. The empty
state is treated as part of the design — it tells the user what the panel *will*
do once they start picking, so the first interaction feels intentional rather
than the panel merely being empty.
