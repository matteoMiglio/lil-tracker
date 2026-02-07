#!/bin/bash
# Full Code Quality Check Script
# Runs all quality checks and generates a report

set -e

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
cd "$PROJECT_DIR"

REPORT=""
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

add_result() {
    local check="$1"
    local status="$2"
    local details="$3"
    REPORT+="| $check | $status | $details |"$'\n'
    case $status in
        "PASS") ((PASS_COUNT++)) ;;
        "FAIL") ((FAIL_COUNT++)) ;;
        "WARN") ((WARN_COUNT++)) ;;
    esac
}

echo "Running full code quality check..."
echo ""

# 1. TypeScript Check
echo "1/6 TypeScript check..."
if npm run check 2>&1 | tee /tmp/tsc_output.txt | grep -q "error"; then
    TSC_ERRORS=$(grep -c "error" /tmp/tsc_output.txt || echo "0")
    add_result "TypeScript" "FAIL" "$TSC_ERRORS errors"
else
    add_result "TypeScript" "PASS" "No errors"
fi

# 2. ESLint Check
echo "2/6 ESLint check..."
if npx eslint . --ext .js,.ts,.vue 2>&1 | tee /tmp/eslint_output.txt | grep -qE "error|warning"; then
    ESLINT_ERRORS=$(grep -c "error" /tmp/eslint_output.txt 2>/dev/null || echo "0")
    ESLINT_WARNINGS=$(grep -c "warning" /tmp/eslint_output.txt 2>/dev/null || echo "0")
    if [ "$ESLINT_ERRORS" -gt 0 ]; then
        add_result "ESLint" "FAIL" "$ESLINT_ERRORS errors, $ESLINT_WARNINGS warnings"
    else
        add_result "ESLint" "WARN" "$ESLINT_WARNINGS warnings"
    fi
else
    add_result "ESLint" "PASS" "No issues"
fi

# 3. RuboCop Check
echo "3/6 RuboCop check..."
if bundle exec rubocop --format simple 2>&1 | tee /tmp/rubocop_output.txt | grep -q "offense"; then
    RUBOCOP_OFFENSES=$(grep -oE "[0-9]+ offense" /tmp/rubocop_output.txt | head -1 || echo "0 offense")
    add_result "RuboCop" "FAIL" "$RUBOCOP_OFFENSES"
else
    add_result "RuboCop" "PASS" "No offenses"
fi

# 4. Brakeman Security Check
echo "4/6 Brakeman security check..."
if bundle exec brakeman -q --no-pager -w2 2>&1 | tee /tmp/brakeman_output.txt | grep -qE "Security Warnings|High|Medium"; then
    BRAKEMAN_WARNINGS=$(grep -cE "High|Medium" /tmp/brakeman_output.txt 2>/dev/null || echo "0")
    if [ "$BRAKEMAN_WARNINGS" -gt 0 ]; then
        add_result "Brakeman" "WARN" "$BRAKEMAN_WARNINGS warnings"
    else
        add_result "Brakeman" "PASS" "No high/medium warnings"
    fi
else
    add_result "Brakeman" "PASS" "No security issues"
fi

# 5. Rails Tests
echo "5/6 Rails tests..."
if RAILS_ENV=test rails test 2>&1 | tee /tmp/test_output.txt | grep -q "failures\|errors"; then
    TEST_FAILURES=$(grep -oE "[0-9]+ failures" /tmp/test_output.txt | head -1 || echo "0 failures")
    TEST_ERRORS=$(grep -oE "[0-9]+ errors" /tmp/test_output.txt | head -1 || echo "0 errors")
    add_result "Tests" "FAIL" "$TEST_FAILURES, $TEST_ERRORS"
else
    TEST_COUNT=$(grep -oE "[0-9]+ runs" /tmp/test_output.txt | head -1 || echo "? runs")
    add_result "Tests" "PASS" "$TEST_COUNT"
fi

# 6. N+1 Quick Check
echo "6/6 N+1 detection..."
N1_COUNT=$(grep -rc "\.each.*\.\|\.map.*\." app/controllers --include="*.rb" 2>/dev/null | awk -F: '{sum+=$2} END {print sum}' || echo "0")
if [ "$N1_COUNT" -gt 5 ]; then
    add_result "N+1 Detection" "WARN" "$N1_COUNT potential patterns"
else
    add_result "N+1 Detection" "PASS" "$N1_COUNT patterns (low risk)"
fi

# Generate Report
echo ""
echo "## Code Quality Report"
echo ""
echo "### Summary"
echo "| Check | Status | Details |"
echo "|-------|--------|---------|"
echo "$REPORT"
echo ""
echo "**Total:** $PASS_COUNT passed, $FAIL_COUNT failed, $WARN_COUNT warnings"
echo ""

if [ $FAIL_COUNT -gt 0 ]; then
    echo "### Critical Issues"
    echo "Run individual checks for details:"
    echo "- \`npm run check\` for TypeScript errors"
    echo "- \`bundle exec rubocop\` for style issues"
    echo "- \`rails test\` for test failures"
    exit 1
fi

if [ $WARN_COUNT -gt 0 ]; then
    echo "### Warnings to Address"
    echo "- Review ESLint warnings: \`npx eslint . --ext .js,.ts,.vue\`"
    echo "- Check Brakeman report: \`bundle exec brakeman\`"
    echo "- Run N+1 analysis: \`$PROJECT_DIR/.claude/skills/code-quality/scripts/check-n1.sh\`"
fi

echo ""
echo "Quality check complete."
