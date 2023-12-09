# advent-of-code-2023

This year's AoC I'm gonna try out bun! I completed all of last year's problems in rust so lets see if it can keep up with the blazingly fast speed!

To install dependencies:

```bash
bun install
```

To run

#### Days 1 to 7

```bash
cd solutions/day-1/day-1
bun run index.ts
```

#### [Days 8 to 25]

```bash
bun run index.ts 24 1
```

TODO: script to run all solutions

To develop: 
```bash
bun --watch index.ts 10 2
```

TODO: "dev mode": It would take a day only(no part or example), but would also expect the example solutions. It would run in sequence: example part 1, real part 2, example part 2, real part 2, and would stop if an example didn't produce the correct solution. 


Starting a new year:

```
mkdir -p solutions/day-{1..25}/part-{1..2}
mkdir -p lib
touch solutions/day-{1..25}/part-{1..2}/question.md
touch solutions/day-{1..25}/part-{1..2}/Solver.ts
touch solutions/day-{1..25}/input.txt
touch solutions/day-{1..25}/part-{1..2}/example.txt
```

