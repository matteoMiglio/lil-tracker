#!/bin/bash
# N+1 Query Detection Script
# Analyzes Ruby files for potential N+1 query patterns

set -e

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
OUTPUT=""
ISSUES=0

echo "Scanning for N+1 query patterns..."

# Pattern 1: .each or .map followed by association access
while IFS= read -r line; do
    if [[ -n "$line" ]]; then
        OUTPUT+="$line"$'\n'
        ((ISSUES++))
    fi
done < <(grep -rn "\.each\s*{.*\.\(belongs_to\|has_many\|has_one\)" "$PROJECT_DIR/app" --include="*.rb" 2>/dev/null || true)

# Pattern 2: .each or .map with dot access that might be associations
while IFS= read -r line; do
    if [[ -n "$line" ]]; then
        # Filter out obvious non-association patterns
        if ! echo "$line" | grep -qE "\.(to_s|to_i|to_a|id|name|title|created_at|updated_at|nil\?|present\?|blank\?|empty\?)\b"; then
            OUTPUT+="$line"$'\n'
            ((ISSUES++))
        fi
    fi
done < <(grep -rn "\.each.*|.*\.map.*{.*|[a-z].*\.[a-z_]*\.[a-z_]*" "$PROJECT_DIR/app/controllers" --include="*.rb" 2>/dev/null | head -20 || true)

# Pattern 3: Queries without includes/preload/eager_load
echo ""
echo "Checking for queries that might need eager loading..."
while IFS= read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    # Check if the same file has includes/preload/eager_load nearby
    if ! grep -q "includes\|preload\|eager_load" "$file" 2>/dev/null; then
        OUTPUT+="POTENTIAL: $line"$'\n'
        ((ISSUES++))
    fi
done < <(grep -rn "\.where\|\.find_by\|\.find\|\.all" "$PROJECT_DIR/app/controllers" --include="*.rb" 2>/dev/null | head -20 || true)

# Pattern 4: .count or .size on associations in loops
echo ""
echo "Checking for .count/.size that might need counter_cache..."
while IFS= read -r line; do
    if [[ -n "$line" ]]; then
        OUTPUT+="COUNTER_CACHE: $line"$'\n'
        ((ISSUES++))
    fi
done < <(grep -rn "\.each.*\.count\|\.each.*\.size\|\.map.*\.count\|\.map.*\.size" "$PROJECT_DIR/app" --include="*.rb" 2>/dev/null || true)

if [ $ISSUES -gt 0 ]; then
    echo ""
    echo "Found $ISSUES potential N+1 patterns:"
    echo "$OUTPUT"
    echo ""
    echo "Recommendations:"
    echo "1. Use .includes(:association) for belongs_to/has_many accessed in loops"
    echo "2. Use .preload(:association) when you need separate queries"
    echo "3. Use .eager_load(:association) for LEFT OUTER JOIN"
    echo "4. Consider counter_cache for .count/.size on associations"
else
    echo "No obvious N+1 patterns detected."
fi
