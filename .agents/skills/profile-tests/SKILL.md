---
name: profile-tests
description: Profile CPU performance of tests and browser tests in elements package. Use when investigating performance issues, optimizing test execution, or when the user mentions profiling, performance analysis, hotspots, or slow tests.
---

# Profiling Tests and Browser Tests

CPU profiling for elements package tests using the unified profiling library. Identifies performance bottlenecks, generates optimization recommendations, and detects anti-patterns.

## Quick Commands

### Profile Browser Tests (Simple)

```bash
# Built-in profiling for all browser tests
./scripts/browsertest --profile

# Profile specific test file
./scripts/browsertest --profile packages/elements/src/preview/renderTimegroupToCanvas.browsertest.ts

# Profile with test pattern
./scripts/browsertest --profile -t "batch capture"
```

### Profile Browser Tests (Detailed Analysis)

```bash
# Full analysis with unified profiling library
npx tsx scripts/profile-browsertest.ts \
  packages/elements/src/preview/renderTimegroupToCanvas.browsertest.ts

# Get JSON output for LLM analysis
npx tsx scripts/profile-browsertest.ts \
  packages/elements/src/preview/renderTimegroupToCanvas.browsertest.ts \
  --json

# Focus on specific file
npx tsx scripts/profile-browsertest.ts \
  packages/elements/src/preview/renderTimegroupToCanvas.browsertest.ts \
  --focus renderToImage \
  --json
```

### Profile Scenarios

```bash
# Profile a scenario in sandbox
./scripts/ef profile EFCanvas basic --json

# With pattern detection
./scripts/ef profile EFCanvas basic --json --verbose

# Compare against baseline
./scripts/ef profile EFCanvas basic \
  --baseline .profiles/baseline.cpuprofile \
  --json
```

## Performance Investigation Workflow

When investigating performance issues in tests:

### 1. Capture Initial Profile

```bash
# For browser tests
npx tsx scripts/profile-browsertest.ts \
  packages/elements/src/preview/renderTimegroupToCanvas.browsertest.ts \
  --json > profile.json

# For scenarios
./scripts/ef profile EFCanvas basic --json > profile.json
```

### 2. Analyze JSON Output

Parse the profile to identify:

```json
{
  "hotspots": [
    {
      "rank": 1,
      "functionName": "updateFrame",
      "file": "EFTimegroup.ts",
      "line": 234,
      "selfTimeMs": 45.2,
      "selfTimePct": 31.1,
      "callCount": 234
    }
  ],
  "byFile": [
    { "file": "EFTimegroup.ts", "timeMs": 82.1, "timePct": 56.5 }
  ],
  "recommendations": [
    "• updateFrame called 234 times - consider caching"
  ],
  "patterns": [
    {
      "name": "Hot Loop Detected",
      "severity": "high",
      "suggestion": "Review loop logic..."
    }
  ]
}
```

### 3. Prioritize Optimizations

Focus on:
- Functions with `selfTimePct > 15%` (critical bottlenecks)
- Functions with `callCount > 100` and `selfTimePct > 5%` (caching opportunities)
- Files with `timePct > 40%` (architectural issues)
- Patterns with `severity: "high"`

### 4. Make Changes

Apply optimizations based on patterns detected.

### 5. Validate with Baseline Comparison

```bash
# Save baseline before changes
./scripts/ef profile EFCanvas basic \
  --save .profiles/baseline-$(date +%Y%m%d-%H%M%S).cpuprofile

# After optimization, compare
./scripts/ef profile EFCanvas basic \
  --baseline .profiles/baseline-TIMESTAMP.cpuprofile \
  --json
```

Check comparison output:
- Negative `selfTimeDiffMs` = improvement ✅
- Positive `selfTimeDiffMs` = regression ⚠️

## Understanding Profile Metrics

### Key Metrics

| Metric | Meaning | Use For |
|--------|---------|---------|
| `selfTimeMs` | Time in function itself (excluding callees) | Direct optimization target |
| `selfTimePct` | Percentage of total profile time | Prioritization (>15% = critical) |
| `callCount` | Times function appears in call stacks | Caching/memoization decisions |
| `hitCount` | Profile samples that caught function | Loop detection (>200 = tight loop) |

### Interpreting Patterns

The unified profiling library detects 8 common anti-patterns:

**Excessive DOM Manipulation** → Batch DOM updates or use DocumentFragment
**Layout Thrashing** → Separate layout reads from writes
**Hot Loop** → Optimize loop body or reduce iterations
**Death by a Thousand Cuts** → Add memoization for frequently-called functions
**Heavy JSON Operations** → Use structured cloning or reduce serialization
**Frequent Style Computation** → Cache computed styles
**Animation API Overhead** → Cache animation objects
**File-Level Concentration** → Architectural review needed

## Common Optimization Patterns

### High Call Count (>100) + Moderate Time (5-15%)

**Problem:** Function called frequently with small individual cost
**Solution:** Memoization or caching

```typescript
// Before
function expensiveCalculation(x: number) {
  return /* complex math */;
}

// After
const cache = new Map<number, number>();
function expensiveCalculation(x: number) {
  if (cache.has(x)) return cache.get(x)!;
  const result = /* complex math */;
  cache.set(x, result);
  return result;
}
```

### High Self Time (>30%) + Low Call Count (<10)

**Problem:** Single function doing too much work
**Solution:** Reduce complexity or defer work

```typescript
// Before
function processAll() {
  // All work done synchronously
  loadData();
  transformData();
  validateData();
  saveData();
}

// After  
function processAll() {
  loadData(); // Only critical work
  queueMicrotask(() => {
    transformData();
    validateData();
    saveData();
  });
}
```

### DOM Manipulation Pattern Detected

**Problem:** Multiple DOM updates causing reflows
**Solution:** Batch updates

```typescript
// Before
for (const item of items) {
  container.appendChild(createItem(item)); // Multiple reflows
}

// After
const fragment = document.createDocumentFragment();
for (const item of items) {
  fragment.appendChild(createItem(item));
}
container.appendChild(fragment); // Single reflow
```

## Output Formats

### Text Output (Human-Readable)

```bash
./scripts/ef profile EFCanvas basic
```

Shows:
- Top hotspots by self time
- Time aggregated by file
- Automated recommendations
- Detected patterns (with --verbose)

### JSON Output (LLM/Script-Friendly)

```bash
./scripts/ef profile EFCanvas basic --json
```

Structured data for programmatic analysis:
- Ranked hotspots with metrics
- File-level aggregations
- Recommendations array
- Pattern detection results

### Verbose Mode (Enhanced Analysis)

```bash
./scripts/ef profile EFCanvas basic --json --verbose
```

Adds:
- Call count information
- Anti-pattern detection
- Detailed suggestions

## Specialized Profiling Tools

### Profile Playback Performance

```bash
npx tsx scripts/profile-playback.ts \
  --project improv-edit \
  --duration 5000 \
  --json
```

### Profile Export Performance

```bash
npx tsx scripts/profile-export.ts \
  --project design-catalog \
  --json
```

### Profile Page Load

```bash
npx tsx scripts/profile-load.ts \
  --project improv-edit \
  --json
```

## Troubleshooting

**"Profiling functions not available"**
- Ensure browser is controlled by Playwright (use `ef open`, not regular browser)

**"Profile data is empty"**
- Scenario/test may execute too quickly (<10ms)
- Try longer-running tests or increase test complexity

**"High numbers don't make sense"**
- Check if times are in microseconds vs milliseconds
- Unified library returns milliseconds
- Legacy interfaces may use microseconds

**"Call counts seem wrong"**
- Call count is approximate based on call stack traversal
- Use `hitCount` for sampling-based frequency instead

## Best Practices

1. **Always save baselines** before making changes
2. **Focus on self time** for direct impact (total time includes callees)
3. **Start with top 3 hotspots** for biggest impact
4. **Use JSON output** for programmatic analysis
5. **Check patterns** before manual analysis - they suggest specific fixes
6. **Validate changes** by comparing before/after profiles
7. **Watch for regressions** in baseline comparisons

## Additional Resources

- Full profiling guide: `elements/PROFILING.md`
- LLM-specific guide: `elements/LLM_PROFILING_GUIDE.md`
- Implementation details: `elements/PROFILING_IMPLEMENTATION_SUMMARY.md`
- Library source: `packages/elements/src/profiling/`
