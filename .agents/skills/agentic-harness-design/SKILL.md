---
name: agentic-harness-design
description: Design multi-agent harnesses for long-running autonomous coding tasks. Covers generator/evaluator loops, context reset strategy, sprint contracts, and the planner-generator-evaluator architecture from Anthropic's harness research.
---

# Agentic Harness Design

Patterns for building multi-agent systems that produce high-quality outputs on long, complex tasks—covering generator/evaluator loops, context management, and task decomposition.

## Core Architecture: Planner → Generator → Evaluator

Three-agent split addresses the two main failure modes of solo agents:

1. **Context degradation** — models lose coherence as the context window fills; some exhibit "context anxiety" and wrap up prematurely.
2. **Self-evaluation bias** — agents reliably over-praise their own output; separating producer from judge is the key lever.

**Planner** takes a short user prompt (1–4 sentences) and expands it into a full product spec. Keep it at the level of deliverables and high-level architecture—not granular implementation details, which cascade errors downstream. Ask the planner to identify opportunities to weave AI-native features into the spec.

**Generator** implements against the spec. Works in sprints (one feature at a time) when the model needs scaffolding. Stronger models can run as a single continuous session with SDK-level compaction handling context growth. Self-evaluates at the end of each sprint before handoff.

**Evaluator** grades the generator's output against agreed criteria. Uses a live browser tool (e.g. Playwright MCP) to interact with the running app rather than scoring static screenshots. Produces specific, actionable findings.

## Sprint Contracts

Before each sprint, generator and evaluator negotiate a **sprint contract**: the generator proposes what it will build and how success will be verified; the evaluator reviews and agrees. This bridges the gap between a high-level spec and testable behavior without over-specifying implementation upfront.

Contracts are communicated via files—one agent writes, the other reads and responds in kind. This keeps both agents grounded in agreed scope.

## Context Management

**Context resets** vs. **compaction** are not equivalent:
- Compaction summarizes earlier context in-place; the same agent continues. Context anxiety can persist.
- A context reset starts a fresh agent with a structured handoff artifact containing prior state and next steps. Provides a clean slate at the cost of orchestration overhead.

Use resets when the model exhibits context anxiety (observable as premature wrap-up behavior). Stronger models (e.g. Opus 4.6+) often sustain long sessions without resets, making compaction sufficient.

## Evaluator Calibration

Out of the box, evaluators are lenient. Calibration steps:
1. Write explicit grading criteria that encode your quality bar. Turn subjective judgments ("is this good?") into concrete, gradable terms.
2. Use few-shot examples with detailed score breakdowns to anchor the evaluator's judgment.
3. Set hard thresholds per criterion. If any falls below threshold, the sprint fails.
4. Read evaluator logs after each run. When its judgment diverges from yours, update the prompt to resolve it.
5. Instruct the evaluator to be skeptical; it is far easier to tune a standalone evaluator to be critical than to make a generator self-critical.

For design tasks, weight criteria that the model under-delivers on by default (originality, coherence) more heavily than what it handles well (functional correctness, technical craft).

## Harness Simplification Principle

Every component encodes an assumption about what the model can't do solo. As models improve, those assumptions go stale. After each model upgrade:
- Re-run representative tasks with simplified harnesses
- Remove components one at a time and measure the impact on output quality
- Only add complexity when simpler approaches demonstrably fall short

Sprint decomposition, context resets, and per-sprint evaluation loops may all become unnecessary overhead as model capability increases.

## When to Use This Skill

Use this skill when:
- Building agent harnesses for tasks that run longer than a single context window
- Output quality from a single-agent approach is plateauing
- The task has subjective quality dimensions (design, UX) where binary correctness checks don't apply
- You need to decide whether to use context resets vs. compaction vs. a fresh session architecture
- Calibrating an evaluator agent to grade reliably against your quality bar
