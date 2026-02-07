#!/bin/bash
# DRY (Don't Repeat Yourself) Analysis Script
# Finds potential code duplication

set -e

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
echo "Analyzing code for potential duplication..."

echo ""
echo "=== Similar Query Patterns ==="
grep -rhn "\.where(" "$PROJECT_DIR/app/models" --include="*.rb" 2>/dev/null | \
    sed 's/.*\.where(/where(/' | sort | uniq -c | sort -rn | head -10 || echo "None found"

echo ""
echo "=== Repeated Validation Patterns ==="
grep -rhn "validates\s" "$PROJECT_DIR/app/models" --include="*.rb" 2>/dev/null | \
    sed 's/.*validates /validates /' | sort | uniq -c | sort -rn | head -10 || echo "None found"

echo ""
echo "=== Similar Scope Definitions ==="
grep -rhn "scope\s*:" "$PROJECT_DIR/app/models" --include="*.rb" 2>/dev/null | \
    awk -F: '{print $3}' | sort | uniq -c | sort -rn | head -10 || echo "None found"

echo ""
echo "=== Repeated Controller Patterns ==="
for pattern in "def index" "def show" "def create" "def update" "def destroy"; do
    count=$(grep -rn "$pattern" "$PROJECT_DIR/app/controllers" --include="*.rb" 2>/dev/null | wc -l | tr -d ' ')
    echo "$pattern: $count occurrences"
done

echo ""
echo "=== Vue Component Props Patterns ==="
grep -rhn "defineProps<" "$PROJECT_DIR/app/frontend" --include="*.vue" 2>/dev/null | \
    awk -F'<' '{print $2}' | cut -d'>' -f1 | sort | uniq -c | sort -rn | head -10 || echo "None found"

echo ""
echo "=== Similar Import Patterns ==="
grep -rhn "^import.*from" "$PROJECT_DIR/app/frontend" --include="*.vue" --include="*.ts" 2>/dev/null | \
    awk -F: '{print $3}' | sort | uniq -c | sort -rn | head -10 || echo "None found"

echo ""
echo "Recommendations:"
echo "1. Extract repeated query patterns into model scopes"
echo "2. Create shared validation concerns for common validations"
echo "3. Use controller concerns for shared actions"
echo "4. Extract common Vue logic into composables"
echo "5. Create shared TypeScript interfaces for common prop shapes"
