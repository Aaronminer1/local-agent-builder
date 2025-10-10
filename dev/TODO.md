# TODO List

**Last Updated:** October 9, 2025, 10:28 PM  
**Status:** Active Development

---

## 🔴 CRITICAL (Blocking)

### ~~Bug #1: Input State Not Syncing~~ ✅ FIXED
- **Priority:** ~~IMMEDIATE~~ COMPLETE
- **Impact:** ~~Workflows cannot execute~~ Workflows now work!
- **Status:** ✅ FIXED (Oct 9, 10:32 PM)
- **File:** `/agent-builder/src/pages/Builder.tsx` line 147
- **Solution:** Added `userInput` to useCallback dependency array
- **Fix Time:** 5 minutes
- **Details:** See `/dev/bugs/BUG-001-INPUT-STATE-FIXED.md`

### Bug #2: Tools Don't Execute  
- **Priority:** HIGH
- **Impact:** Tools are cosmetic only
- **Status:** Not Fixed
- **File:** `/agent-builder/src/services/workflowExecutor.ts` line 217
- **Details:** Tools not read from node data during execution
- **Estimated Time:** 26-40 hours (full implementation)

---

## 🟠 HIGH PRIORITY

### Test Node Settings
- [x] Test if changing model actually uses different model ✅ WORKS!
- [x] Test if "Include chat history" works ✅ WORKS!
- [x] Test if changing instructions affects behavior ✅ WORKS!
- [ ] Test if temperature setting works
- [ ] Test if output format (Text vs JSON) works
- **Status:** 60% Complete (3/5 tests passing!)

### Test Data Flow
- [x] Test if output from Start reaches Agent ✅ WORKS!
- [ ] Test if output from Agent reaches End
- [ ] Test if multiple agents pass data correctly
- [ ] Test if If/Else branches work
- [ ] Test if While loops work
- **Status:** 20% Complete (1/5 tests passing!)

---

## 🟡 MEDIUM PRIORITY

### Phase 2: UI Improvements
- [ ] Replace checkboxes with toggle switches
- [ ] Add collapsible sections in inspector
- [ ] Implement workflow actions menu (Duplicate/Rename/Delete)
- [ ] Add undo/redo functionality
- [ ] Add keyboard shortcuts

### Test Data Persistence
- [ ] Test if workflow settings save
- [ ] Test if node configurations persist
- [ ] Test if tools persist after reload
- [ ] Test if input persists
- [ ] Test if execution logs persist

---

## 🟢 LOW PRIORITY

### Documentation
- [x] Consolidate scattered documentation
- [x] Create dev/ directory structure
- [ ] Add inline code documentation
- [ ] Create API documentation
- [ ] Add contribution guidelines

### Tool Implementation
- [ ] Implement File Search executor
- [ ] Implement Web Search executor
- [ ] Implement Code Interpreter executor
- [ ] Implement MCP server integration
- [ ] Implement Function calling
- [ ] Implement Custom tools

---

## ✅ COMPLETED

### Phase 1: Critical Fixes
- [x] Register all 13 node types (Oct 9, 9:45 PM)
- [x] Add `input_as_text` variable to Start node (Oct 9, 9:57 PM)
- [x] Create dynamic input panel (Oct 9, 9:57 PM)
- [x] Implement tool selection UI (Oct 9, 10:05 PM)

### Documentation Cleanup
- [x] Consolidate 46 markdown files → 10 files (Oct 9, 10:20 PM)
- [x] Archive old test files (Oct 9, 10:22 PM)
- [x] Consolidate OpenAI docs (Oct 9, 10:25 PM)
- [x] Create dev/ directory (Oct 9, 10:28 PM)

---

## 📊 Progress

```
Nodes Tested:      2/13 (15%)  
Nodes Working:     5/13 (38%)  ✅✅✅✅✅
Nodes Partial:     3/13 (23%)  ⚠️⚠️⚠️
Nodes Stub:        5/13 (38%)  ❌❌❌❌❌

Critical Bugs:     1/2  (50%)  🟢 (Bug #1 fixed!)
High Priority:     4/10 (40%)  🟡
Medium Priority:   0/9  (0%)   🔴
Low Priority:      4/11 (36%)  🟢

Overall:           9/44 (20%)
```

---

## 🎯 Next Actions

1. **Fix Bug #1** - Input state sync (IMMEDIATE)
2. **Test workflow execution** - Verify it works
3. **Test node settings** - Do they affect behavior?
4. **Fix Bug #2** - Implement tool execution
5. **Continue testing** - Find more issues

---

## 📝 Notes

- All testing blocked by Bug #1
- Tool execution is a large task (26-40 hours)
- Documentation is now clean and organized
- Focus on critical bugs first

---

**Last Updated:** October 9, 2025, 10:28 PM  
**Next Review:** After Bug #1 is fixed
