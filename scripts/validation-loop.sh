#!/bin/bash

# PDDL-Enhanced Continuous Validation Loop for Yoga App
# External validation principle: Use automated tools rather than self-checking

echo "🧘 Starting Yoga App Validation Loop..."
echo "Running validation checks every 3 minutes..."

while true; do
    echo ""
    echo "=== Validation Check at $(date) ==="

    # Precondition: Check if dev server is running
    if ! lsof -ti:5174 > /dev/null; then
        echo "❌ CRITICAL: Dev server not running on port 5174"
        echo "Please start with: npm run dev"
        exit 1
    fi

    echo "✅ Dev server running on port 5174"

    # External Validation 1: Linting (catches code quality issues)
    echo "🔍 Running lint checks..."
    if npm run lint --silent; then
        echo "✅ Lint checks passed"
    else
        echo "❌ Lint checks failed - fix before continuing"
    fi

    # External Validation 2: Build process (catches compilation errors)
    echo "🏗️  Testing build process..."
    if npm run build --silent > /dev/null 2>&1; then
        echo "✅ Build successful"
    else
        echo "❌ Build failed - compilation errors detected"
    fi

    # External Validation 3: App accessibility check
    echo "🌐 Checking app accessibility..."
    if curl -s http://localhost:5174/ | grep -q "<!doctype html>"; then
        echo "✅ App serving correctly"
    else
        echo "❌ App not accessible"
    fi

    # External Validation 4: Check for critical file integrity
    echo "📁 Verifying critical files..."
    critical_files=(
        "/Users/gil/git/yoga-app/src/App.jsx"
        "/Users/gil/git/yoga-app/src/screens/Welcome.jsx"
        "/Users/gil/git/yoga-app/src/components/design-system/index.js"
    )

    for file in "${critical_files[@]}"; do
        if [[ -f "$file" ]]; then
            echo "✅ $file exists"
        else
            echo "❌ CRITICAL: Missing file $file"
        fi
    done

    echo ""
    echo "Validation complete. Next check in 3 minutes..."
    echo "Press Ctrl+C to stop validation loop"

    # Sleep for 3 minutes (180 seconds)
    sleep 180
done