---
name: code-quality
description: Run comprehensive code quality checks including linting, type checking, tests, N+1 detection, and best practices review for Rails + Vue/Inertia projects.
allowed-tools: Bash, Read, Grep, Glob
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "npm run check 2>&1 | head -50 || true"
          timeout: 60
          statusMessage: "TypeScript check..."
        - type: command
          command: |
            FILE=$(cat | jq -r '.tool_input.file_path // empty' 2>/dev/null)
            if [[ "$FILE" == *.rb ]]; then
              bundle exec rubocop --force-exclusion "$FILE" 2>&1 | head -30 || true
            fi
          timeout: 30
          statusMessage: "RuboCop check..."
  Stop:
    - hooks:
        - type: prompt
          prompt: |
            Verify code quality after changes. Context: $ARGUMENTS
            Check: 1) Changes complete 2) No obvious errors 3) Follows conventions
            Return {"ok": true} or {"ok": false, "reason": "explanation"}
          timeout: 20
---

# Code Quality Check

Comprehensive code quality verification for Rails 8.1 + Vue 3 + Inertia.js.

## Usage

```
/code-quality              # Full check suite
/code-quality frontend     # TypeScript + ESLint only
/code-quality backend      # RuboCop + Brakeman + tests
/code-quality n+1          # N+1 query detection
/code-quality dry          # Code duplication analysis
```

## Bundled Scripts

Run these scripts for detailed analysis:

```bash
# Full quality report
"$CLAUDE_PROJECT_DIR"/.claude/skills/code-quality/scripts/full-check.sh

# N+1 query detection
"$CLAUDE_PROJECT_DIR"/.claude/skills/code-quality/scripts/check-n1.sh

# DRY analysis (find duplication)
"$CLAUDE_PROJECT_DIR"/.claude/skills/code-quality/scripts/check-dry.sh
```

## Automatic Hooks

This skill automatically runs after file edits:
- **TypeScript check** (`npm run check`)
- **RuboCop** on edited `.rb` files
- **Stop verification** ensures quality before finishing

## Additional Resources

- For N+1 query patterns and solutions, see [reference-n1.md](reference-n1.md)
- For security best practices, see [reference-security.md](reference-security.md)

---

## Quick Check Commands

| Check | Command |
|-------|---------|
| TypeScript | `npm run check` |
| ESLint | `npx eslint . --ext .js,.ts,.vue` |
| ESLint fix | `npx eslint . --ext .js,.ts,.vue --fix` |
| RuboCop | `bundle exec rubocop` |
| RuboCop fix | `bundle exec rubocop -A` |
| Brakeman | `bundle exec brakeman -q --no-pager` |
| Rails tests | `RAILS_ENV=test rails test` |
| Single test | `rails test test/path/file_test.rb:LINE` |
| Security audit | `bundle audit && npm audit` |

## Full Check Workflow

### 1. Frontend

```bash
npm run check                        # TypeScript errors
npx eslint . --ext .js,.ts,.vue     # Linting
```

**Look for:**
- Type errors, implicit `any`
- Unused imports/variables
- Missing prop types

### 2. Backend

```bash
bundle exec rubocop                  # Style
bundle exec brakeman -q --no-pager   # Security
RAILS_ENV=test rails test            # Tests
```

**Look for:**
- Style violations
- Security vulnerabilities
- Test failures

### 3. N+1 Detection

Search for patterns:
```ruby
# BAD - N+1
@items.each { |i| i.association.method }
@items.map { |i| i.relation.attribute }

# GOOD - Eager load
Model.includes(:association)
Model.preload(:association)
Model.eager_load(:association)
```

### 4. Best Practices

**Rails Controllers:**
- Skinny controllers, fat models
- Strong parameters always
- Authorization on every action
- RESTful actions preferred

**Rails Models:**
- Validations comprehensive
- Scopes over class methods
- Callbacks sparingly
- Indexes on foreign keys

**Vue Components:**
- TypeScript interfaces for props
- `defineProps<{...}>()` for type safety
- Handle loading with `form.processing`
- Use `only:` for partial reloads

## Report Format

```markdown
## Code Quality Report

| Check | Status | Issues |
|-------|--------|--------|
| TypeScript | PASS/FAIL | X |
| ESLint | PASS/FAIL | X |
| RuboCop | PASS/FAIL | X |
| Brakeman | PASS/WARN | X |
| Tests | PASS/FAIL | X |
| N+1 | PASS/WARN | X |

### Critical (Must Fix)
1. `file:line` - Description

### Warnings (Should Fix)
1. `file:line` - Description
```

## Pre-Commit Checklist

- [ ] `npm run check` passes
- [ ] `bundle exec rubocop` passes
- [ ] `rails test` passes
- [ ] No Brakeman high/medium warnings
- [ ] N+1 queries prevented
- [ ] Props have TypeScript interfaces
- [ ] No hardcoded secrets
- [ ] Migrations are reversible
