# Changelog
All notable changes to the Local Agent Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Testing Session Complete - October 9, 2025, 10:41 PM

**Tested:**
- ✅ 7 comprehensive tests run
- ✅ 100% pass rate
- ✅ Model selection works
- ✅ Instructions affect behavior
- ✅ Chat history toggle works
- ✅ Data flows between nodes

**Results:**
- System is functional
- Node settings work correctly
- Workflow execution verified
- No new bugs found

**See:** `/dev/testing/TEST-RESULTS-001.md` for details

---

### Bug Fix: Input State Sync - October 9, 2025, 10:32 PM

**Fixed:**
- 🐛 Critical bug: Input state not syncing with UI
- ✅ Workflows can now execute successfully
- ✅ Input flows through to agent correctly

**Technical Details:**
- Added `userInput` to useCallback dependency array in Builder.tsx
- Fixed stale closure issue in handleExecute function
- File: `/agent-builder/src/pages/Builder.tsx` line 147

**Impact:**
- Workflows now fully functional
- Can continue comprehensive testing
- Blocker removed

---

### Documentation Consolidation - October 9, 2025, 10:13 PM

**Changed:**
- 🗂️ Consolidated 48 scattered markdown files into 4 focused documents
- 📚 Created `/docs` folder with clear structure
- 📋 Single source of truth: `docs/CURRENT_STATUS.md`
- 🧪 All testing results in: `docs/TESTING.md`
- 🔧 Implementation guide in: `docs/IMPLEMENTATION.md`
- 📖 OpenAI comparison in: `docs/REFERENCE.md`

**Archived:**
- Old documentation files moved to `/docs/archive/` for reference

**Improved:**
- ✅ Clear navigation - know where to look
- ✅ No duplicate information
- ✅ Easy to maintain
- ✅ Always up to date

---

### Phase 1: Critical Fixes ✅ COMPLETE
**Goal:** Make all nodes work and fix input system  
**Started:** October 9, 2025, 9:41 PM  
**Completed:** October 9, 2025, 10:05 PM  
**Duration:** 24 minutes

#### Added
- [x] All 13 node types registered in React Flow (✅ Completed 9:45 PM)
- [x] `input_as_text` variable system in Start node (✅ Completed 9:57 PM)
- [x] Dynamic input panel in Builder (✅ Completed 9:57 PM)
- [x] Tool selection dropdown with categories (ChatKit/Hosted/Local) (✅ Completed 10:05 PM)

#### Fixed
- [x] 8 node types showing as generic fallback (61% broken) (✅ Completed 9:45 PM)
- [x] Hardcoded input "My score is 75 points" (✅ Completed 9:57 PM)
- [x] Non-functional "+ Add tool" button (✅ Completed 10:05 PM)

#### Changed
- [x] Added imports for EndNode, NoteNode, GuardrailsNode, MCPNode, UserApprovalNode, SetStateNode, WhileNode (✅ Completed 9:45 PM)
- [x] Updated nodeTypes object with all 13 node types organized by category (✅ Completed 9:45 PM)
- [x] WorkflowExecutor to use dynamic `userInput` instead of hardcoded string (✅ Completed 9:57 PM)
- [x] Start node inspector to show input_as_text variable with green highlight (✅ Completed 9:57 PM)
- [x] Added input validation - alerts if user tries to run without input (✅ Completed 9:57 PM)
- [x] Implemented tool selection with 7 tool types across 3 categories (✅ Completed 10:05 PM)
- [x] Tools save to node data and persist across sessions (✅ Completed 10:05 PM)
- [x] Added tool removal functionality with ✕ buttons (✅ Completed 10:05 PM)
- [x] Disabled already-selected tools in dropdown (✅ Completed 10:05 PM)

---

## [0.1.0] - 2025-10-09

### Initial Release
**Status:** MVP with 47% non-functional UI elements

#### Working Features
- ✅ Visual workflow canvas with React Flow
- ✅ Drag-and-drop node placement
- ✅ Node connections with typed edges
- ✅ 5 node types registered (Agent, Start, If/Else, Voice, While)
- ✅ Basic workflow execution
- ✅ Execution logs display
- ✅ Save/Load workflows to localStorage
- ✅ Code export (JSON only)
- ✅ Evaluate button (basic metrics)

#### Known Issues
- ❌ 8 node types not registered (End, Note, File Search, Guardrails, MCP, User Approval, Transform, Set State)
- ❌ Hardcoded input instead of dynamic
- ❌ "+ Add tool" button non-functional
- ❌ "+ Add variable" button non-functional
- ❌ "More Options" button non-functional
- ❌ No tool selection UI
- ❌ No undo/redo
- ❌ No workflow duplicate/rename/delete
- ❌ No versioning system
- ❌ No templates

---

## Progress Log

### 2025-10-09 21:41 PM - Project Kickoff
- Created comprehensive implementation plan
- Explored OpenAI's Agent Builder live
- Documented 9 screenshots of OpenAI's implementation
- Identified critical gaps and priorities
- Ready to begin Phase 1, Task 1.1

---

## Commit Messages Format

```
[Phase X.Y] Brief description

- Detailed change 1
- Detailed change 2

Fixes: #issue-number
Time: X hours
```

Example:
```
[Phase 1.1] Register all missing node types

- Added imports for 8 missing node components
- Updated nodeTypes object in Builder.tsx
- All 13 node types now render with custom UI
- No more "Node type not found" warnings

Fixes: Node registration issue
Time: 15 minutes
```

---

## Testing Checklist Template

After each task, verify:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] UI updates correctly
- [ ] Data persists (if applicable)
- [ ] Works with existing workflows
- [ ] No regressions in other features

---

**Last Updated:** October 9, 2025, 9:41 PM
