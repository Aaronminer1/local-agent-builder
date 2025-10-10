#!/bin/bash

# Documentation Cleanup Script
# Consolidates and removes outdated/duplicate documentation

echo "🗂️  Documentation Cleanup"
echo "======================="
echo ""

# Create archive directory
mkdir -p docs/archive

# Files to KEEP (move to docs/)
echo "📋 Moving essential docs to /docs..."

# Keep these - they're current and useful
mv -f CHANGELOG.md docs/ 2>/dev/null || echo "  ✓ CHANGELOG.md already in place"
mv -f README.md docs/README-root.md 2>/dev/null || echo "  ✓ README.md already in place"

# Files to ARCHIVE (old/outdated/duplicate)
echo ""
echo "📦 Archiving outdated documents..."

# These are old status reports - info is in CURRENT_STATUS.md now
mv -f ALL_FIXES_COMPLETE.md docs/archive/ 2>/dev/null && echo "  ✓ Archived ALL_FIXES_COMPLETE.md"
mv -f COMPLETE_FIX_SUMMARY.md docs/archive/ 2>/dev/null && echo "  ✓ Archived COMPLETE_FIX_SUMMARY.md"
mv -f FIXES_APPLIED.md docs/archive/ 2>/dev/null && echo "  ✓ Archived FIXES_APPLIED.md"
mv -f FIXES_REQUIRED.md docs/archive/ 2>/dev/null && echo "  ✓ Archived FIXES_REQUIRED.md"
mv -f POLISHED_UI_COMPLETE.md docs/archive/ 2>/dev/null && echo "  ✓ Archived POLISHED_UI_COMPLETE.md"
mv -f SYSTEM_READY.md docs/archive/ 2>/dev/null && echo "  ✓ Archived SYSTEM_READY.md"
mv -f NEW_FEATURES_IMPLEMENTED.md docs/archive/ 2>/dev/null && echo "  ✓ Archived NEW_FEATURES_IMPLEMENTED.md"

# These are old test reports - info is in TESTING.md now
mv -f TESTING_REPORT.md docs/archive/ 2>/dev/null && echo "  ✓ Archived TESTING_REPORT.md"
mv -f TESTING_RESULTS.md docs/archive/ 2>/dev/null && echo "  ✓ Archived TESTING_RESULTS.md"
mv -f UI_TESTING_REPORT.md docs/archive/ 2>/dev/null && echo "  ✓ Archived UI_TESTING_REPORT.md"
mv -f UI_AUDIT_REPORT.md docs/archive/ 2>/dev/null && echo "  ✓ Archived UI_AUDIT_REPORT.md"
mv -f COMPLETE_SYSTEM_TEST_GUIDE.md docs/archive/ 2>/dev/null && echo "  ✓ Archived COMPLETE_SYSTEM_TEST_GUIDE.md"
mv -f PLAYWRIGHT_FINDINGS.md docs/archive/ 2>/dev/null && echo "  ✓ Archived PLAYWRIGHT_FINDINGS.md"

# These are old implementation plans - info is in IMPLEMENTATION.md now
mv -f IMPLEMENTATION_PLAN.md docs/archive/ 2>/dev/null && echo "  ✓ Archived IMPLEMENTATION_PLAN.md"
mv -f IMPLEMENTATION_ROADMAP.md docs/archive/ 2>/dev/null && echo "  ✓ Archived IMPLEMENTATION_ROADMAP.md"
mv -f PROJECT_PLAN.md docs/archive/ 2>/dev/null && echo "  ✓ Archived PROJECT_PLAN.md"
mv -f CODE_PLAYGROUND_SPEC.md docs/archive/ 2>/dev/null && echo "  ✓ Archived CODE_PLAYGROUND_SPEC.md"

# These are old analysis docs - info is in REFERENCE.md now
mv -f COMPREHENSIVE_OPENAI_ANALYSIS.md docs/archive/ 2>/dev/null && echo "  ✓ Archived COMPREHENSIVE_OPENAI_ANALYSIS.md"
mv -f OPENAI_AGENT_BUILDER_ANALYSIS.md docs/archive/ 2>/dev/null && echo "  ✓ Archived OPENAI_AGENT_BUILDER_ANALYSIS.md"
mv -f OPENAI_EXPLORATION_FINDINGS.md docs/archive/ 2>/dev/null && echo "  ✓ Archived OPENAI_EXPLORATION_FINDINGS.md"
mv -f OPENAI_IMPLEMENTATION_PLAN.md docs/archive/ 2>/dev/null && echo "  ✓ Archived OPENAI_IMPLEMENTATION_PLAN.md"
mv -f FEATURE_COMPARISON.md docs/archive/ 2>/dev/null && echo "  ✓ Archived FEATURE_COMPARISON.md"

# These are old session notes
mv -f SESSION_SUMMARY.md docs/archive/ 2>/dev/null && echo "  ✓ Archived SESSION_SUMMARY.md"
mv -f PHASE_1_COMPLETE.md docs/archive/ 2>/dev/null && echo "  ✓ Archived PHASE_1_COMPLETE.md"
mv -f PROGRESS_REPORT.md docs/archive/ 2>/dev/null && echo "  ✓ Archived PROGRESS_REPORT.md"

# These are old bug reports - info is in TESTING.md now
mv -f NODE_REGISTRATION_REPORT.md docs/archive/ 2>/dev/null && echo "  ✓ Archived NODE_REGISTRATION_REPORT.md"
mv -f INSPECTOR_BUTTON_FIXES.md docs/archive/ 2>/dev/null && echo "  ✓ Archived INSPECTOR_BUTTON_FIXES.md"
mv -f WORKFLOW_MANAGEMENT_FIXES.md docs/archive/ 2>/dev/null && echo "  ✓ Archived WORKFLOW_MANAGEMENT_FIXES.md"
mv -f CRITICAL_UI_FINDINGS.md docs/archive/ 2>/dev/null && echo "  ✓ Archived CRITICAL_UI_FINDINGS.md"
mv -f UI_IMPROVEMENTS_NEEDED.md docs/archive/ 2>/dev/null && echo "  ✓ Archived UI_IMPROVEMENTS_NEEDED.md"

# These are duplicates
mv -f DOCUMENTATION_INDEX.md docs/archive/ 2>/dev/null && echo "  ✓ Archived DOCUMENTATION_INDEX.md (duplicate)"
mv -f summary.md docs/archive/ 2>/dev/null && echo "  ✓ Archived summary.md (duplicate)"
mv -f QUICK_FEATURE_SUMMARY.md docs/archive/ 2>/dev/null && echo "  ✓ Archived QUICK_FEATURE_SUMMARY.md (duplicate)"

# These are current bugs - keep in root for visibility
echo ""
echo "⚠️  Keeping current bug reports in root:"
echo "  • CRITICAL_BUGS_FOUND.md"
echo "  • TOOL_INTEGRATION_GAP.md"

# These are reference docs - keep
echo ""
echo "📚 Keeping reference documents:"
echo "  • openai-agent-builder-docs.md"
echo "  • ARCHITECTURE.md"
echo "  • CODEBASE_AUDIT.md"
echo "  • UI_UX_SPECIFICATION.md"
echo "  • OBSERVATIONS.md"
echo "  • SYSTEM_CRITIQUE_AND_IMPROVEMENTS.md"
echo "  • COMPLETE_AGENT_BUILDER_DOCS.md"

# These are setup docs - keep
echo ""
echo "🚀 Keeping setup documents:"
echo "  • QUICKSTART.md"
echo "  • agent-builder-clone-summary.md"
echo "  • agentic-signal-setup.md"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  • Essential docs: in /docs"
echo "  • Archived docs: in /docs/archive"
echo "  • Current bugs: in root"
echo "  • Reference docs: in root"
echo ""
echo "Next: Review /docs/CURRENT_STATUS.md for current state"
