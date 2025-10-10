# Project Organization

**Last Updated:** October 9, 2025, 10:30 PM  
**Purpose:** Guide to project structure

---

## 📁 Directory Structure

```
local-agent-builder/
├── README.md                          # Project overview
├── QUICKSTART.md                      # Setup guide
│
├── dev/                               # 🔧 Development docs
│   ├── README.md                      # Dev docs guide
│   ├── TODO.md                        # ⭐ Current tasks
│   ├── CHANGELOG.md                   # All changes
│   ├── bugs/                          # Bug reports
│   ├── testing/                       # Test results
│   ├── planning/                      # Planning docs
│   └── screenshots/                   # Dev screenshots
│
├── docs/                              # 📚 User documentation
│   ├── README.md                      # Docs navigation
│   ├── SUMMARY.md                     # Quick summary
│   └── archive/                       # Old docs (37 files)
│
├── Reference/                         # 📖 Reference docs
│   ├── openai-agent-builder-reference.md  # OpenAI docs
│   ├── ARCHITECTURE.md                # Our architecture
│   ├── UI_UX_SPECIFICATION.md         # UI/UX details
│   └── REFERENCE_GUIDE.md             # Guide to references
│
├── agent-builder/                     # 🎨 Main application
│   ├── src/                           # Source code
│   │   ├── components/                # React components
│   │   ├── pages/                     # Page components
│   │   ├── services/                  # Business logic
│   │   └── data/                      # Data/constants
│   └── ...
│
├── scripts/                           # 🔧 Utility scripts
│   ├── cleanup-docs.sh                # Doc cleanup
│   └── capture-ui-state.js            # UI capture
│
├── tests/                             # 🧪 Test files
│   └── archive/                       # Old tests (10 files)
│
└── Setup/                             # 🚀 Setup docs
    ├── agent-builder-clone-summary.md
    └── agentic-signal-setup.md
```

---

## 🎯 Where to Find Things

### "What should I work on?"
→ `dev/TODO.md`

### "What changed?"
→ `dev/CHANGELOG.md`

### "What's broken?"
→ `dev/bugs/`

### "How do I set up?"
→ `QUICKSTART.md`

### "How does OpenAI's system work?"
→ `openai-agent-builder-reference.md`

### "How is our system structured?"
→ `ARCHITECTURE.md`

### "What are the UI details?"
→ `UI_UX_SPECIFICATION.md`

---

## 📊 File Count

| Location | Files | Purpose |
|----------|-------|---------|
| Root | 10 | Essential docs |
| /dev | 5+ | Development docs |
| /docs | 3 | User docs |
| /docs/archive | 37 | Old docs (reference) |
| /tests/archive | 10 | Old tests (reference) |
| /scripts | 2 | Utility scripts |
| /agent-builder | ~50 | Application code |

---

## 🗂️ Documentation Types

### Development Docs (`/dev`)
**Purpose:** For developers working on the project  
**Contents:** TODOs, bugs, testing, planning, changelog  
**Audience:** Developers, contributors

### User Docs (`/docs`)
**Purpose:** For users of the application  
**Contents:** Guides, tutorials, FAQs  
**Audience:** End users

### Reference Docs (Root)
**Purpose:** Technical reference material  
**Contents:** Architecture, OpenAI docs, UI specs  
**Audience:** Developers, designers

### Setup Docs (Root)
**Purpose:** Getting started  
**Contents:** Installation, configuration  
**Audience:** Everyone

---

## 🔄 Maintenance

### When you fix a bug:
1. Update `dev/bugs/[bug-file].md` - Mark as fixed
2. Update `dev/TODO.md` - Check off task
3. Update `dev/CHANGELOG.md` - Add entry
4. Move bug file to archive

### When you add a feature:
1. Update `dev/TODO.md` - Check off task
2. Update `dev/CHANGELOG.md` - Add entry
3. Update user docs if needed

### When you find a bug:
1. Create file in `dev/bugs/`
2. Add to `dev/TODO.md`
3. Prioritize appropriately

---

## ✅ Organization Principles

### Keep It Clean:
- ✅ Separate dev docs from user docs
- ✅ Separate reference from active docs
- ✅ Archive old docs, don't delete
- ✅ One source of truth for each topic

### Keep It Simple:
- ✅ Clear directory names
- ✅ Obvious file locations
- ✅ Consistent structure
- ✅ Easy navigation

### Keep It Updated:
- ✅ Update TODO.md regularly
- ✅ Update CHANGELOG.md with every change
- ✅ Archive completed work
- ✅ Remove duplicates

---

## 📈 Evolution

### Before (Oct 9, 9:00 PM):
- ❌ 58 files in root
- ❌ No organization
- ❌ Duplicates everywhere
- ❌ Hard to find anything

### After (Oct 9, 10:30 PM):
- ✅ 10 files in root
- ✅ Clear organization
- ✅ No duplicates
- ✅ Easy navigation
- ✅ Separate dev/user docs
- ✅ Active/archive separation

---

## 🎉 Success Metrics

- ✅ 83% reduction in root files (58 → 10)
- ✅ Clear separation of concerns
- ✅ Easy to find what you need
- ✅ Maintainable structure
- ✅ Professional appearance

---

**Organization Status:** ✅ COMPLETE  
**Maintenance:** Follow the principles above

**Last Updated:** October 9, 2025, 10:30 PM
