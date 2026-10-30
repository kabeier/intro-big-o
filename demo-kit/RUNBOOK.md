# Runbook · Big-O Notation (DS 2, Fri Nov 6, 2026)

One lecture, 40 minutes, 15 slides. Python code-along in the slide VS Code (real Python 3, in the browser).

## Before class
- Open `lecture-1-big-o/slides.html` in **Chrome**, with internet (the editor and Python load once; "Python loading…" for a few seconds is normal).
- Your own terminal: `python3 --version`.
- Press **P** for the presenter window, **T** to start the clock.
- Rehearse the code slides once: type from the notes' **TYPE THIS** block, **Ctrl+S**, then type the command in the terminal. **Reset** (status bar) clears a slide.

## Keys
| Where | Key | Does |
|---|---|---|
| Code slide | **N** | types the next step (backup) |
| Code slide | **R** | types and runs the command |
| Editor | **Ctrl+S** / **Esc** | save / give the keys back to the deck |
| Chart slide | type in the box | changes n (keys stay in the box) |

While the cursor is in the editor, the terminal, the chart box or the embedded docs, the arrow keys go **there**. Click the slide outside them, or use the presenter's **Next**.

## Per slide
| # | Min | Do | Say |
|---|---|---|---|
| 1 | 0 | T; students `mkdir big-o`, `cd big-o`, `code .` | today: how work grows |
| 2 | 1 | ask: list doubles → how many looks? | 2,000,000 vs 21 |
| 3 | 3 | — | growth, not seconds; worst case; time vs space |
| 4 | 5 | drag n; type 1000, then 1000000 | O(log n) ≈ 20 at a million |
| 5 | 7 | **growth.py**: type 3 parts, save, `python3 growth.py` | 10 10 / 100 100 / 1000 1000 → O(n) |
| 6 | 12 | **pairs.py**, `python3 pairs.py` | 100 / 10,000 / 1,000,000 → O(n²) |
| 7 | 15 | **halving.py**, `python3 halving.py` | 4 / 7 / 10 / 20 → O(log n) |
| 8 | 18 | — | log n = halvings to reach 1 |
| 9 | 19 | — | four rules (homework uses them) |
| 10 | 22 | — | same loop, different memory |
| 11 | 24 | **branching.py**, `python3 branching.py` | 177 / 21,891 / 242,785 calls → O(2ⁿ); n! orderings |
| 12 | 28 | — | cheat sheet: don't read it out |
| 13 | 29 | timer 7 min; open activity-name-that-big-o/ | first 6 cards are core |
| 14 | 36 | click both docs tabs | `in` on a list O(n), on a set O(1) |
| 15 | 37 | — | homework: Algo Big O, then Runestone |

## Time checks
- Slide 7 should start by **minute 15**. Late? Press **N** twice and **R** on halving.py instead of typing it.
- Slide 11 by **minute 24**. Late? Run it with **N N N R**, read the numbers, move on.
- Activity: stop at card 6 if it's past minute 36.

## Things to expect
- `python3: command not found` on Windows → `python growth.py`.
- `10 1` instead of `10 10` → they searched for something in the list (best case). Search for `n`.
- Nothing prints → the `for n in …` block is indented inside the function.
- Someone tries `fib(40)` → it runs for minutes (300+ million calls). Ctrl+C. That *is* O(2ⁿ).
