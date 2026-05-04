---
name: skills-creation
description: Create, update, and maintain skills in the canonical .skills/internal/ directory. Includes step-by-step directives for agents to work with users, validate skill structure, and sync changes across agent directories. Use when users want to create new skills, update existing ones, or need guidance on skill authoring.
---

# Skills Creation & Maintenance

Agent guide for creating and updating skills in Editframe's centralized skills system.

## Overview

Skills are the foundation of agent capabilities. This skill provides directives for:
- **Creating new skills** from scratch with user guidance
- **Updating existing skills** with validation
- **Maintaining skill quality** through structured authoring
- **Syncing skills** across agent directories after changes

## Quick Start: Creating a New Skill

1. **Ask the user** what skill they want to create
2. **Gather requirements**: purpose, capabilities, use cases
3. **Create skill structure** in `.skills/internal/{skill-name}/`
4. **Write content** (SKILL.md + optional references/)
5. **Validate** the structure and frontmatter
6. **Sync** changes across agent directories
7. **Commit** to git

## Agent Workflow Directives

### Phase 1: Discovery

When a user requests a new skill or skill update:

1. **Ask clarifying questions**:
   - "What is the primary purpose of this skill?"
   - "Who will use this skill (which agents/users)?"
   - "What are the key capabilities or topics?"
   - "Is this updating an existing skill or creating new?"

2. **Document requirements**:
   - Skill name (kebab-case: `my-skill-name`)
   - Description (one sentence for LLMs)
   - Key sections/topics to cover
   - Example use cases

### Phase 2: Structure Planning

Before writing, plan the skill structure:

1. **Determine skill type**:
   - **Reference skill**: Documenting an existing system/API (most common)
   - **Tutorial skill**: Step-by-step learning with examples
   - **How-to skill**: Specific task guidance
   - **Explanation skill**: Deep conceptual understanding

2. **Classify each piece of planned content**:

   Before writing anything, categorize every section you plan to include:

   - **Procedural** -- how to do something (deploy, rollback, create a release). Stable. Write as prose.
   - **Architectural** -- how a system works at a high level (what connects to what, why things are structured a certain way). Moderately stable. Write as concise narrative, but avoid enumerating specifics.
   - **Enumerated data** -- lists of things, tables of values, counts, names, versions (service lists, resource allocations, package names, secret names, route tables). **Volatile. Do not write into the skill.** Instead, point the agent at the source file or create a companion script that queries it (see "Companion Scripts" below).

   The goal: if a config file changes, no skill doc should need updating. The skill teaches agents *how to reason* about a domain; scripts and source files provide *the current facts*.

3. **Plan file structure**:
   ```
   .skills/internal/{skill-name}/
   └── SKILL.md                    # Main entry point (required)
   ```

   OR if detailed:
   ```
   .skills/internal/{skill-name}/
   ├── SKILL.md                    # Overview + quick start
   └── references/
       ├── topic-1.md              # Deep dive on topic 1
       ├── topic-2.md              # Deep dive on topic 2
       └── topic-3.md              # Examples/guides
   ```

3. **Quick reference template**:
   - SKILL.md: 200-400 words introducing the skill
   - Each reference: 400-800 words covering one topic
   - Focus on clarity for LLM consumption

### Phase 3: Content Creation

**SKILL.md frontmatter** (required):
```yaml
---
name: skill-name-kebab-case
description: One sentence describing what this skill does and who should use it.
---
```

`name` must always be dash-case with no whitespace. Tools that load skills by name may fail silently or behave incorrectly when names contain spaces. The `name` field is the machine identifier; use the `# Heading` in the body for human-readable display.

**SKILL.md body** (recommended structure):
```markdown
# {Skill Title}

{2-3 sentence overview}

## Quick Start

{Most essential information to start using - code snippet, key concept, or first steps}

## Key Concepts

{Explain the main ideas or capabilities}

## Common Patterns

{Show 2-3 typical use cases with examples}

## When to Use This Skill

{Guidance on when agents should invoke this skill}
```

**Reference files** (optional, for complex skills):
```yaml
---
name: reference-title
description: What this reference covers
---

# Reference Title

{Introduction}

## Section 1
{Content}

## Section 2
{Content}
```

**Writing guidelines**:
- Target 300-500 words for SKILL.md
- Use concrete examples over abstract explanations
- Include code blocks or snippets when relevant
- Link between skills using relative paths: `[skill-name](...)`
- Write for LLM consumption (clear, structured, no marketing)
- **Never duplicate data that lives in source files.** If information can be derived from a config file, script, or definition that already exists in the repo, don't copy it into the skill. Instead, tell the agent where to find it (`"Run scripts/deploy-info telecine for current service list"`) or which file to read (`"See telecine/deploy/worker-resources.config.ts for current allocations"`). Skills should be a guide to reasoning, not a cache of facts.
- **Test for drift:** before finalizing any section, ask: "If someone changes a config file tomorrow, will this prose become wrong?" If yes, rewrite the section to reference the source rather than restating it.

### Companion Scripts

Some skills need a **companion script** -- a script that queries local config files and emits current data for agents to consume. This replaces hardcoded tables and lists in skill prose.

**When to create a companion script:**
- The skill domain involves configuration that changes (service lists, resource allocations, package versions, routing tables, secret names)
- Multiple source files must be read and correlated to answer common questions
- The source files are in formats that require domain knowledge to parse (Pulumi TypeScript, GitHub Actions YAML, complex configs)

**Design principles:**
- **Local only.** No network, no Docker, no auth. The script parses files on disk. It should run in under a second.
- **Root-level.** Place companion scripts at `scripts/` in the monorepo root, not inside a package.
- **Structured plain text output.** One field per line, YAML-ish. Readable by humans and LLMs. Not JSON (too verbose for context windows), not pretty-printed tables (ambiguous to parse).
- **Thin wrapper pattern.** A bash script (`scripts/{name}`) that calls `npx tsx scripts/{name}.ts`. Matches the existing convention (see `scripts/skills-sync`).

**When NOT to create a companion script:**
- The data lives in a single, simple file the agent can read directly (e.g., a `package.json`)
- The skill domain is purely procedural (how-to steps, debugging workflows)
- The data rarely changes (deployment process, toolchain choices)

In these cases, just tell the agent which file to read: `"See telecine/deploy/worker-resources.config.ts for current allocations."`

**Example:** The `deployments` skill uses `scripts/deploy-info telecine` and `scripts/deploy-info elements` to query current services, resources, routes, secrets, packages, and release pipeline steps from local config files.

### Phase 4: Validation

Before syncing, validate the skill:

1. **File structure check**:
   ```bash
   # Verify files exist
   ls -la .skills/internal/{skill-name}/

   # Should see: SKILL.md (required)
   # May see: references/ directory with additional .md files
   ```

2. **Frontmatter validation**:
   - Required fields present: `name`, `description`
   - `name` is kebab-case and matches directory name
   - `description` is a single sentence
   - No syntax errors (valid YAML)

3. **Content validation**:
   - Clear introductory section
   - Well-organized subsections
   - Concrete examples included
   - Links formatted correctly: `[text](path)` or `[text](references/file.md)`

4. **Drift check**:
   - Scan every section for enumerated data: tables of values, bulleted lists of names, hardcoded counts or versions
   - For each instance, ask: "Does this data live in a source file that could change independently?"
   - If yes: replace with a reference to the source file or companion script
   - Common offenders: service/worker lists, resource allocations, package names, secret names, route tables, pipeline step lists, environment variables

5. **Example check**:
   ```bash
   # Manually verify the content structure
   cat .skills/internal/{skill-name}/SKILL.md
   ```

### Phase 5: Synchronization

Once the skill is complete and validated:

1. **Confirm with user**: "Ready to sync this skill across all agent directories?"

2. **Run the sync script**:
   ```bash
   npm run skills:sync
   ```

3. **Verify the sync**:
   ```bash
   # Check that files now exist in all 3 directories
   ls -la .skills/internal/{skill-name}/SKILL.md
   ls -la .cursor/skills/{skill-name}/SKILL.md
   ls -la .claude/skills/{skill-name}/SKILL.md
   ```

4. **Report success**:
   ```
   ✅ Skill synced successfully!

   Synced to:
   - .skills/internal/ (canonical source)
   - .cursor/skills/ (Cursor agent)
   - .claude/skills/ (Claude Code agent)
   ```

### Phase 6: Commit to Git

If the skill is complete and approved:

1. **Stage the changes**:
   ```bash
   git add .skills/internal/{skill-name}/
   ```

2. **Create a commit**:
   ```bash
   git commit -m "Create {skill-name} skill"
   ```

3. **Confirm commit**:
   ```bash
   git log -1 --name-status
   ```

## Complete Example Interaction

**User**: "I need a skill for debugging video rendering issues"

**Agent** (Discovery Phase):
> I'll help you create a debugging skill for video rendering. Let me gather some details:
>
> 1. Should this cover common rendering errors (artifacts, playback issues, encoding)?
> 2. Who are the primary users (developers, content creators)?
> 3. What systems does it cover (Elements, React, API)?

**User**: "Yes to all - it's for developers debugging Elements rendering."

**Agent** (Planning Phase):
> Perfect! I'll create a reference skill called `elements-rendering-debug` with:
> - SKILL.md: Overview of debugging workflow
> - references/common-issues.md: Artifacts, playback, memory issues
> - references/diagnostics.md: How to inspect and troubleshoot
> - references/solutions.md: Common fixes and workarounds

**Agent** (Creation Phase):
> Creating the skill structure...
>
> [writes files]

**Agent** (Validation Phase):
> Validating the skill:
> ✅ Directory structure correct
> ✅ SKILL.md frontmatter valid
> ✅ All references included
> ✅ Links formatted correctly

**Agent** (Sync Phase):
> Ready to sync this skill across all agent directories?
>
> Running: npm run skills:sync
>
> ✅ Synced successfully!
> - .skills/internal/elements-rendering-debug/ (canonical)
> - .cursor/skills/elements-rendering-debug/
> - .claude/skills/elements-rendering-debug/

**Agent** (Commit Phase):
> Committing to git:
> ```
> git add .skills/internal/elements-rendering-debug/
> git commit -m "Add elements-rendering-debug skill"
> ```
>
> ✅ Complete! The skill is now available in all agent directories.

### Example: Identifying and Extracting Volatile Data

This example shows what happens when a first draft contains data that will drift.

**Agent** writes a deployment skill with a table:

> | Service | CPU | Memory | Max Instances |
> |---|---|---|---|
> | web | 1000m | 1Gi | 10 |
> | render-fragment | 2000m | 4Gi | 200 |

**Review** (Phase 4 drift check) catches this: the CPU, memory, and instance counts all come from `worker-resources.config.ts` and Pulumi `cloudrun.ts` files. If someone tunes render-fragment to 8Gi, the skill doc is immediately wrong.

**Resolution**: Create a companion script (`scripts/deploy-info`) that parses those source files and emits current values. Replace the table in the skill with:

> Run `scripts/deploy-info telecine` to see current services and resource allocations.

The skill keeps its procedural and architectural content (how deployment works, how to scale resources, how to roll back). The volatile data is always queried fresh.

## Updating Existing Skills

To update an existing skill:

1. **Locate the skill**:
   ```bash
   ls .skills/internal/{skill-name}/
   ```

2. **Make changes**:
   - Edit SKILL.md content
   - Add/modify reference files
   - Update frontmatter if needed

3. **Validate** (same as Phase 4 above)

4. **Sync**:
   ```bash
   npm run skills:sync
   ```

5. **Commit**:
   ```bash
   git add .skills/internal/{skill-name}/
   git commit -m "Update {skill-name} skill"
   ```

## Skill Directory

List current skills by inspecting the canonical directory:

```bash
ls .skills/internal/
```

Each subdirectory is a skill. Read its `SKILL.md` frontmatter for the name and description.

## Key Files & Scripts

### Scripts

- **`npm run skills:sync`** - Sync internal skills to all agent directories
- **`npm run skills:sync:dry`** - Preview what would be synced
- **`npm run skills:sync:verbose`** - Detailed sync output
- **`npm run skills:generate`** - Generate external published skills

### Directories

- **`.skills/internal/`** - Canonical source of truth (committed to git)
- **`.cursor/skills/`** - Cursor agent's synced copy
- **`.claude/skills/`** - Claude Code agent's synced copy
- **`.skills/external/`** - Generated external skills (gitignored)

### Documentation

- **`skills/SYNC.md`** - Complete skills sync system documentation
- **`.skills/internal/skills-docs/SKILL.md`** - Detailed skills documentation system

## Improving Skills From Use

Internal skills should self-improve through use. When an agent follows a skill and the result is wrong, incomplete, or suboptimal -- and the user provides feedback -- the agent should update the skill before finishing the task.

**When to update a skill:**
- The skill's guidance led to an incorrect result that required user correction
- The skill was missing a step or consideration that the user had to supply
- The user provided a principle or constraint that generalizes beyond the current task

**How to update:**
- **Generalize.** Extract the reusable lesson from the specific instance. "Always classify content as procedural, architectural, or enumerated" -- not "when building the deployments skill, we learned that service tables go stale."
- **Stay terse.** A skill improvement should make the skill more precise, not longer. If adding a paragraph, look for one to remove or tighten.
- **Don't append.** Skills are not logs. Don't add "lessons learned" sections or accumulate examples. Integrate the improvement into the existing structure -- revise a guideline, add a validation check, adjust a phase description.
- **Sync and commit.** Skill updates follow the same workflow: edit in `.skills/internal/`, run `npm run skills:sync`, commit.

**What NOT to do:**
- Don't record session-specific details ("on Feb 17 we discovered...")
- Don't add every edge case as a new bullet point -- skills should stay general
- Don't weaken existing guidance to accommodate a one-off exception

## When NOT to Create a Skill

A skill is **not** needed for:
- One-off tasks or debugging sessions
- Temporary utilities or scripts
- Content that belongs in code comments
- Questions that agents can answer inline

A skill **is** appropriate for:
- Repeatable processes (create new projects, debug patterns)
- Guidance that multiple agents should follow
- Knowledge that needs to be discoverable
- Practices that should be standardized

## Tips for Good Skills

✅ **Clear purpose** - One skill, one clear purpose or domain
✅ **Self-contained** - Can be understood independently
✅ **Practical** - Includes real examples and patterns
✅ **Discoverable** - Name clearly describes what it covers
✅ **Linkable** - References other skills when relevant
✅ **Current** - Updated when practices change

## Troubleshooting

**Q: Skill not syncing?**
A: Run `npm run skills:sync:dry` to see if there are errors. Check file permissions in `.skills/internal/`.

**Q: Should I edit in .cursor/ or .skills/?**
A: Always edit in `.skills/internal/` (canonical source). That's what gets committed to git.

**Q: Can I have agent-specific skills?**
A: No, all agents get identical skills. Use `.skills/internal/` as the single source.

**Q: How do I delete a skill?**
A: Delete from `.skills/internal/`, then run `npm run skills:sync`. The skill is automatically removed from agent directories.

**Q: Need to revert a skill change?**
A: Use git: `git checkout HEAD -- .skills/internal/{skill-name}/` then `npm run skills:sync`.
