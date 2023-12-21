// Approaches: 1)
// find all possible paths through - sorted in order such that the first paths through will always happen so long as any of the
// as you find the paths through, keep track of the "checks" that you passed in order.

// Approach 2: write a "merge boundaries" method which can take two workflows and merge them into a workflow which includes both lower and upper bound comparison checks.

// approach 3: find all terminal decision points which would result in acceptance. Work backwards from each one starting with 4000 in each, and narrowing things down until you eventually either reach the IN workflow, detect a cycle, or shrink down to no remaining possibilities.
