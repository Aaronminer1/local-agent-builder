# Bug #8: No Workflow Persistence Across Page Refresh

**Status:** ❌ CRITICAL BUG  
**Date Found:** October 9, 2025, 11:29 PM  
**Severity:** 🔴 CRITICAL  
**Impact:** All work lost on refresh

---

## Problem

When you configure nodes and add new nodes to a workflow, then refresh the page, **all changes are lost**. The workflow resets to the default state (Start + Agent only).

**Symptoms:**
- Add nodes → Refresh → Nodes gone
- Configure nodes → Refresh → Configuration reset
- No auto-save functionality
- Changes only persist in memory during session

---

## Evidence

**Test Steps:**
1. Navigate to `/builder/new`
2. Add Transform node
3. Configure Agent with: "TEST PERSISTENCE: You are a pirate who loves mathematics."
4. Configure Transform with: `return "PERSISTENCE_TEST_" + input;`
5. Refresh page
6. **Result:** Transform node gone, Agent configuration reset ❌

**Expected:** Workflow should persist (either auto-save or prompt to save)  
**Actual:** All changes lost

---

## Root Cause Analysis

**URL:** `/builder/new` - Creates a NEW workflow each time  
**Issue:** No auto-save, no localStorage, no database persistence

**Possible Causes:**
1. `/builder/new` always creates fresh workflow
2. No auto-save on node changes
3. Save button exists but not being used
4. No localStorage fallback
5. Workflow not being saved to database

---

## Impact

**Severity:** CRITICAL  
**User Experience:** TERRIBLE  
**Data Loss:** 100% on refresh

**Affects:**
- All node configurations
- All added nodes
- All connections
- All workflow changes

**Workaround:** Click "💾 Save" button before refresh (needs testing)

---

## Solution Options

### Option 1: Auto-save (Recommended)
- Save to localStorage on every change
- Debounce saves (e.g., 500ms after last change)
- Show "Saving..." indicator
- Fallback to database save

### Option 2: Prompt on Refresh
- Detect unsaved changes
- Show "You have unsaved changes" dialog
- Offer to save before leaving

### Option 3: URL Change
- After first save, redirect to `/builder/{id}`
- Use workflow ID in URL
- Load workflow from database on page load

### Option 4: Combination
- Auto-save to localStorage (instant)
- Periodic save to database (every 30s)
- URL with ID after first save

---

## Testing Needed

1. ✅ Test if Save button works
2. ✅ Test if saved workflows persist
3. ✅ Test localStorage usage
4. ✅ Test database persistence
5. ✅ Test workflow loading by ID

---

## Related Code

**Files to Check:**
- `/src/pages/Builder.tsx` - Main builder page
- `/src/stores/workflowStore.ts` - Workflow state management
- `/src/services/workflowService.ts` - Save/load logic

**Save Button:** Exists at ref e17 (line 17-19)

---

## Priority

**Priority:** 🔴 CRITICAL  
**Reason:** Users lose all work on accidental refresh  
**Fix Urgency:** HIGH  
**Complexity:** Medium (need to implement persistence)

---

## Recommendations

1. **Immediate:** Add localStorage auto-save
2. **Short-term:** Add "unsaved changes" warning
3. **Long-term:** Implement full database persistence with IDs

---

**Date:** October 9, 2025, 11:29 PM  
**Status:** Confirmed and documented
