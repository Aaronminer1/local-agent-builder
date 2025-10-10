# Agent Builder UI Improvements - Match OpenAI Quality

## Current Issues vs. OpenAI Original

### Visual Design Problems

1. **Nodes are blocky and basic**
   - Current: Simple rounded corners, flat colors, basic shadows
   - OpenAI: Gradient backgrounds, larger rounded corners (rounded-xl/2xl), layered shadows, smooth hover effects

2. **Typography lacks hierarchy**
   - Current: Basic font weights, limited sizing
   - OpenAI: Clear font hierarchy, semibold/medium weights, proper spacing

3. **Color palette is too harsh**
   - Current: Saturated colors (#3b82f6 blue-500), sharp contrasts
   - OpenAI: Subtle gradients (from-blue-50 to-blue-100 for backgrounds), softer accent colors

4. **Spacing is cramped**
   - Current: px-4 py-3 (16px/12px)
   - OpenAI: px-5/6 py-4 (20-24px/16px), more breathing room

5. **Handles (connection points) are small and hard to see**
   - Current: w-3 h-3 (12px), gray
   - OpenAI: Larger (14-16px), colored to match node, white border, shadow

6. **Inspector panel lacks polish**
   - Current: Basic inputs, simple buttons
   - OpenAI: Refined form controls, better labeling, subtle borders, proper focus states

### Required Changes

#### Node Components

**All Nodes Should Have:**
```tsx
- Outer wrapper: `className="group"` for hover effects
- Inner container: `shadow-lg rounded-xl bg-gradient-to-br` with 2 colors
- Border: `border-2` with matching color + `hover:border-[lighter]`
- Padding: `px-5 py-4` (or px-6 py-4 for larger nodes)
- Transition: `transition-all duration-200`
- Icon: Larger (text-2xl), subtle drop-shadow
- Text: Semibold/medium fonts, proper line-height
- Handles: `w-4 h-4 !border-2 !border-white shadow-md`, colored to match node
```

**Color Scheme:**
- Start: `from-emerald-50 to-green-50 border-emerald-300` handle: `!bg-emerald-500`
- Agent: `from-blue-500 to-blue-600 border-blue-400` text: white, handle: `!bg-blue-400`
- End: `from-red-50 to-rose-50 border-red-300` handle: `!bg-red-500`
- If/Else: `from-orange-400 to-orange-500 border-orange-300` handle: `!bg-orange-400`
- Transform: `from-purple-400 to-purple-500 border-purple-300` handle: `!bg-purple-400`
- FileSearch: `from-yellow-400 to-amber-500 border-yellow-300` handle: `!bg-yellow-500`
- Note: `from-yellow-50 to-amber-50 border-yellow-300 border-dashed`
- Guardrails: `from-red-400 to-rose-500 border-red-300`
- MCP: `from-violet-400 to-purple-500 border-violet-300`
- While: `from-indigo-400 to-blue-500 border-indigo-300`
- UserApproval: `from-pink-400 to-rose-500 border-pink-300`
- SetState: `from-cyan-400 to-blue-500 border-cyan-300`

#### Inspector Panel

**Current Problems:**
- Basic input styling
- No focus states
- Labels too close to inputs
- Buttons lack hover effects

**Required Changes:**
```tsx
- Labels: `text-xs font-semibold text-gray-700 mb-2 block`
- Inputs: `px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
- Textareas: Same as inputs + `resize-none` or `resize-y`
- Select: Custom styling with chevron, `appearance-none`
- Buttons: `px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors`
- Add buttons: `border-dashed border-2 hover:border-blue-500 hover:text-blue-600`
```

#### Node Palette

**Current:**
- Plain list items
- Basic hover
- Simple icons

**Required:**
```tsx
- Each node item: `px-3 py-2.5 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing transition-colors`
- Icons: Larger (text-lg), consistent spacing
- Labels: `font-medium text-sm`
- Categories: `text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2`
```

#### Top Bar

**Current:**
- Basic buttons
- No visual hierarchy

**Required:**
```tsx
- Height: `h-16` (64px)
- Buttons: Primary action (Deploy) = blue bg, Secondary = white bg with border
- Settings icon: `w-5 h-5` in a `p-2 hover:bg-gray-100 rounded-lg`
- Version selector: Subtle pill shape with dropdown chevron
```

### Implementation Priority

1. **Fix corrupted files** (EndNode, IfElseNode, TransformNode, FileSearchNode)
2. **Update all node components** with gradient backgrounds and better styling
3. **Improve Inspector panel** with better form controls
4. **Polish Node Palette** with hover effects
5. **Refine Top Bar** with proper button hierarchy

### Code Quality Issues

1. Duplicate imports in AgentNode.tsx
2. Corrupted EndNode.tsx with partial old code
3. Missing TypeScript types for some props
4. Inconsistent styling patterns across components

