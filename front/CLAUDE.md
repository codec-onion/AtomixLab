# AtomixLab Frontend Codebase Architecture

## Project Overview

**AtomixLab** is a Vue 3 + Vite frontend application for a Physics and Chemistry courses platform. It's a web application that displays educational courses organized by session, academic level, and subject matter.

**Tech Stack:**
- Vue 3 (Composition API with `<script setup>`)
- Vue Router 4 (client-side routing)
- Pinia 3 (state management)
- Vite 7 (bundler and dev server)
- Axios (HTTP client)
- FontAwesome 7 (icons)
- Vue Select 4 (dropdown components)

**Node Requirements:** Node.js ^20.19.0 || >=22.12.0

---

## Directory Structure

```
front/
├── src/
│   ├── _services/              # API service layer
│   │   ├── axios.js           # Axios instance configuration
│   │   └── donnees.service.js  # Data fetching functions
│   │
│   ├── assets/
│   │   └── styles/
│   │       ├── reset.css       # CSS reset
│   │       ├── base.css        # Base element styling (h1-h4, paragraphs)
│   │       ├── class.css       # Utility classes (.flexbox_usual, .margin_section)
│   │       └── variables.css   # CSS custom properties (colors, fonts, sizes)
│   │
│   ├── components/
│   │   ├── Header.vue          # Main application header
│   │   ├── Footer.vue          # Main application footer
│   │   ├── Presentation.vue    # Hero/introduction section
│   │   └── ListeCours/         # Courses listing feature
│   │       ├── ListeCours.vue  # Container component for courses
│   │       ├── Cours.vue       # Individual course card component
│   │       └── header/
│   │           ├── HeaderListeCours.vue  # Filter header for courses
│   │           └── Select.vue   # Reusable dropdown component
│   │
│   ├── router/
│   │   └── index.js            # Vue Router configuration
│   │
│   ├── stores/
│   │   ├── donnes.js           # Pinia store for course data
│   │   └── counter.js          # Demo/template counter store
│   │
│   ├── views/
│   │   └── Accueil.vue         # Home page (Accueil = Welcome)
│   │
│   ├── App.vue                 # Root component
│   └── main.js                 # Application entry point
│
├── public/
│   ├── courses.json            # Mock data - course objects with metadata
│   ├── sessions.json           # Mock data - academic sessions (school years)
│   ├── niveauxScolaire.json    # Mock data - school levels
│   ├── thematique.json         # Mock data - subject themes
│   └── favicon.ico
│
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── package.json                # Project dependencies
├── jsconfig.json               # JavaScript configuration
├── .prettierrc.json            # Code formatting rules
└── .vscode/                    # VS Code settings

```

---

## Core Architecture Patterns

### 1. Routing Structure

**File:** `src/router/index.js`

Currently a **single-page application** with one main route:
- `/` → Accueil view (home page)

Uses Vue Router 4 with `createWebHistory` for clean URLs.

**Future Routes:** The architecture is prepared to add more routes (e.g., course details, login, admin panels).

### 2. State Management (Pinia)

**Primary Store:** `src/stores/donnes.js`

**Structure:**
```javascript
useDonnesStore() {
  // State
  - sessionChoisie (ref)        // Selected academic session
  - cours (ref[])               // Array of all courses
  - isLoading (ref)             // Loading state
  - isLoaded (ref)              // Cache flag to prevent duplicate loads
  
  // Actions
  - loadDatas()                 // Async function to fetch courses from API
}
```

**Design Pattern:**
- Composition API with Pinia's `defineStore`
- Reactive state using `ref()` and `computed()`
- Single responsibility: manages course and session data
- Lazy loading: data only fetches once and caches

**Secondary Store:** `stores/counter.js`
- Demo store for template reference, not currently used in app

### 3. API Integration

**File:** `src/_services/donnees.service.js` (with Axios client: `axios.js`)

**Current Implementation:**
- Axios instance configured with `baseURL: 'http://localhost:5173'`
- Fetches from local `/courses.json` and `/sessions.json` (mock data, not a real backend)
- Two main functions:
  - `getSessions()` → Fetches session list
  - `getCours()` → Fetches course data

**Authentication:** Currently commented out (interceptors for token handling are disabled)

**API Endpoints Used:**
- `GET /courses.json` → Returns array of course objects
- `GET /sessions.json` → Returns array of session objects

### 4. Component Hierarchy

```
App.vue (root layout)
├── Header.vue
├── RouterView
│   └── Accueil.vue (home view)
│       ├── Presentation.vue (hero section)
│       └── ListeCours.vue (main courses container)
│           ├── HeaderListeCours.vue (filter section)
│           │   ├── Select.vue (session dropdown)
│           │   ├── Select.vue (level dropdown)
│           │   └── Select.vue (theme dropdown)
│           └── Cours.vue (course card) × multiple
└── Footer.vue
```

**Component Communication:**
- **Props:** Parent → Child data flow (e.g., `infosCours` prop in `Cours.vue`)
- **Store:** Global state via Pinia (e.g., `useDonnesStore()` in multiple components)
- **Lifecycle:** `onMounted` hook triggers data loading in `ListeCours.vue`

---

## Key Features & Sections

### 1. Header Component
- Displays app title "AtomixLab"
- Shows thematic icons (explosion for Physics, flask for Chemistry)
- Primary color background with secondary color text

### 2. Presentation Section
- Introduction text about the platform
- "Cours de Physique et Chimie" (Physics and Chemistry Courses)
- Static content on home page

### 3. Courses List Feature
The main feature of the app with three layers:

#### a) **HeaderListeCours** (Filter Controls)
- Three dropdown selectors:
  - **Session**: Academic year (auto-detects current session)
  - **Niveau Scolaire**: School level/grade
  - **Thème**: Subject theme/topic
- Options are dynamically computed from course data using `Set` to get unique values
- Session selector auto-selects current year if available

#### b) **ListeCours** (Container)
- Fetches course data on component mount via `useDonnesStore().loadDatas()`
- Maps course data to `Cours.vue` cards
- Transforms course objects to pass only relevant data as props

#### c) **Cours** (Course Card)
- Displays individual course information:
  - Academic level (e.g., "Seconde Générale")
  - Session year (e.g., "2020-2021")
  - Type with icon (Chimie=flask, Physique=explosion, Other=book)
  - Theme
  - Title
  - Graduation cap icon (placeholder for download)
- Card styling with hover effects (shadow/transform animation)
- Currently links to `#` (functionality not implemented)

### 4. Footer
- Copyright notice with current year
- "Toute reproduction partielle ou totale est interdite." (No partial or total reproduction allowed)
- Secondary color background with tertiary text

---

## Styling System

### CSS Architecture

**Variables** (`assets/styles/variables.css`):
```css
Colors:
  --color-primary: #ECF8FF (light blue)
  --color-secondary: #34549F (dark blue)
  --color-tertiary: white
  --color-icons: #26AAE2 (bright cyan)

Fonts:
  --font-family-title1_2: "Rokkitt" (serif)
  --font-family-title3_4_text: "EB Garamond" (serif)
  
Desktop Sizes:
  Title 1: 68px
  Title 2: 55px
  Title 3: 45px
  Title 4: 36px
  Text Primary: 24px
  Text Secondary: 16px
  
Mobile Sizes: (smaller values for responsive design)
  Title 1: 40px
  Text Primary: 20px
  etc.
```

**Base Styles** (`assets/styles/base.css`):
- HTML element default styling (h1-h4, paragraphs)
- Font family assignments
- Font weight defaults

**Utility Classes** (`assets/styles/class.css`):
- `.flexbox_usual`: Flex with space-between and centered
- `.flexbox_center`: Centered flex container
- `.primary_text`: Font size for primary text
- `.secondary_text`: Font size for secondary text
- `.margin_section`: Horizontal margin (50px) for content sections

**Component Scoped Styles:**
- Each `.vue` file uses `<style scoped>` for component-specific styling
- Hover effects and transitions in course cards
- Responsive grid layout for course list

### Design System Notes:
- Mobile-first approach with mobile and desktop font sizes defined
- Consistent use of CSS custom properties throughout
- Flexbox-based layouts (no CSS Grid currently)
- Light blue primary with dark blue secondary creates good contrast
- Smooth transitions for interactive elements

---

## Data Structures

### Course Object
```javascript
{
  "id": "uuid",
  "title": "Course Title",
  "thematiqueId": "uuid",
  "thematique": "Theme Name",
  "niveauScolaireId": "uuid",
  "niveauScolaire": "Grade/Level",
  "sessionIds": ["uuid", ...],
  "session": "2020-2021",
  "type": "Chimie" | "Physique" | "Other",
  "creationDate": "DD-MM-YYYY HH:MM",
  "updateCours": [
    {
      "type": "creation",
      "userId": "userId",
      "whatUpdated": "title",
      "update": { "from": null, "to": "value" }
    }
  ]
}
```

### Session Object
```javascript
{
  "id": "uuid",
  "name": "2020-2021",
  "description": "Année scolaire 2020-2021"
}
```

---

## Build & Development

### NPM Scripts

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run format     # Format code with Prettier
```

### Vite Configuration

**Key Settings** (`vite.config.js`):
- Alias: `@` points to `src/` directory (import shortcuts)
- Plugins:
  - Vue 3 support via `@vitejs/plugin-vue`
  - JSX support via `@vitejs/plugin-vue-jsx`
  - Vue DevTools for debugging

### Environment

Configured for modern browsers with ES modules (type: "module" in package.json).

---

## Current State & Notes

### Implemented Features:
- Course listing with cards
- Filter dropdowns (session, level, theme) with dynamic options
- Auto-detection of current academic session
- Responsive styling (desktop/mobile sizes defined)
- Icon system via FontAwesome
- Basic layout with header/footer

### In-Progress / TODO:
- Course card click functionality (currently links to `#`)
- Backend API integration (currently using mock JSON files)
- Authentication system (token interceptors commented out)
- Additional routes (course details, admin panel, etc.)
- Mobile responsiveness refinement
- Session/level/theme filtering logic implementation

### Known Limitations:
- Single route (no multi-page navigation yet)
- Mock data stored in `public/` directory
- Authentication interceptors disabled
- No error handling UI for failed API calls
- No real backend connection

---

## Important Files Summary

| File | Purpose |
|------|---------|
| `main.js` | App initialization, plugin registration, global styles |
| `App.vue` | Root layout with Header/Footer |
| `router/index.js` | Route definitions |
| `stores/donnes.js` | Course and session state management |
| `_services/donnees.service.js` | Data fetching API layer |
| `_services/axios.js` | HTTP client configuration |
| `components/ListeCours/ListeCours.vue` | Main feature container |
| `assets/styles/variables.css` | Design system tokens |

---

## Development Tips

### Adding a New Feature:
1. Create component in `src/components/`
2. Import in parent component or view
3. Use Pinia store for state if needed
4. Add route in `router/index.js` if it's a page
5. Style with scoped CSS and CSS variables

### Adding a New API Endpoint:
1. Create function in `_services/donnees.service.js`
2. Call service function in store action
3. Update store state/refs
4. Use `storeToRefs()` in components to access reactive data

### Debugging:
- Vite DevTools enabled (check `_app_` window in browser DevTools)
- Vue DevTools browser extension recommended
- Check browser console for API errors

---

Generated for codebase documentation and onboarding purposes.
