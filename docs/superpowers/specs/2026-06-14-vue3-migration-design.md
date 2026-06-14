# Vue 2 → Vue 3 Migration — Design

**Date:** 2026-06-14
**Status:** Approved
**Motivation:** Clear the remaining Dependabot alerts that have no Vue 2 fix — chiefly
`vue-template-compiler` XSS (no patch in the 2.x line) and the large webpack/vue-cli build-time
tree. The only real remediation is moving off Vue 2 (EOL) and the deprecated vue-cli toolchain.

## Goals

- Migrate the app from Vue 2.6 + @vue/cli-service 3 to Vue 3 + Vite.
- **Strict 1:1 port:** identical UI and behavior, no feature changes, no redesign.
- Eliminate the build-time vulnerability tree (vue-cli/webpack) and the Vue-2-only runtime alerts.

## Non-Goals

- No migration to Pinia (stay on Vuex, upgraded to v4).
- No new tests beyond manual verification (project currently has none).
- No UI/UX changes, no refactoring unrelated to the migration.
- No backend changes (`backendUrl` is a hardcoded server address in `store.js`).

## Decisions (locked)

| Area | Decision |
|---|---|
| Build tool | **Vite** (replaces vue-cli 3 / webpack 4) |
| State management | **Vuex 4** (keep existing store.js structure) |
| Verification | **Build passes + Vite dev server boots + manual route click-through** |
| Port fidelity | Strict 1:1 — same UI/behavior |

## Current State (verified)

- 18 `.vue` files, 3 `.js` files (`main.js`, `router.js`, `store.js`).
- **Absent (good news — no migration needed):** `.sync`, `$listeners`, event bus, scoped-slot
  syntax (`slot=`/`slot-scope=`), `$set`/`$delete`/`Vue.set`, `<transition>`.
- **Present (must change):** Vue filters, global `Vue.use`/`Vue.component`, `new Vue()`,
  `process.env.BASE_URL`, and five Vue-2-only plugins.
- `backendUrl` is hardcoded (`http://178.22.122.251:3000`) in `store.js` — **not** an env var.
- Router uses `mode: 'history'`, `base: process.env.BASE_URL`.
- `public/index.html` uses `<%= BASE_URL %>` for the favicon and has a Persian `<title>`.
- Clickaway used as `v-on-clickaway="close_rmenu"` (Rmenu.vue) and `v-on-clickaway="close_dropdown"`
  (Nav.vue); methods already exist.
- `mapState(['backendUrl'])` used in `Create-problem.vue` (Vuex 4 keeps this API).

## Design

### 1. Build tooling: vue-cli 3 → Vite

- **Remove deps:** `@vue/cli-service`, `@vue/cli-plugin-babel`, `@vue/cli-plugin-eslint`,
  `@vue/eslint-config-standard`, `babel-eslint`, `vue-template-compiler`, `core-js`,
  and the old `eslint`/`eslint-plugin-vue` (re-added at modern versions if linting is kept).
  This removes the entire webpack tree — the 3 critical + most high/moderate **build-time**
  alerts go away with it.
- **Add (dev):** `vite`, `@vitejs/plugin-vue`.
- **New `vite.config.js`:** register `@vitejs/plugin-vue`, alias `@` → `src`, set a fixed dev
  server port. (Match the previous vue-cli `@` alias so existing `@/...` imports keep working.)
- **`public/index.html` → root `index.html`:** replace `<%= BASE_URL %>favicon.ico` with
  `/favicon.ico`; add `<script type="module" src="/src/main.js"></script>` before `</body>`;
  keep `public/favicon.ico` (Vite serves `public/` at web root); preserve the Persian `<title>`
  and `<noscript>` block and the `<div id="app">`.
- **package.json scripts:** `dev: vite`, `build: vite build`, `preview: vite preview`.
  (Lint script optional — see §8.)

### 2. Vue 3 core + entry rewrite

- Bump `vue ^2.6 → ^3.5`, `vue-router ^3 → ^4`, `vuex ^3 → ^4`.
- **`src/main.js`:**
  - `import { createApp } from 'vue'`.
  - `const app = createApp(App)`; `app.use(router)`; `app.use(store)`.
  - `Vue.component('font-awesome-icon', ...)` / `Vue.component('multiselect', ...)`
    → `app.component(...)`.
  - The Persian date-picker registration moves to `app.use(...)` / `app.component(...)`
    per the v3 package's API (see §4).
  - Register the new `v-click-outside` directive globally (see §4).
  - Drop `Vue.config.productionTip` (removed in Vue 3).
  - Drop `Vue.use(VueCookie)`.
  - `app.mount('#app')`.
- **`src/router.js`:**
  - `import { createRouter, createWebHistory } from 'vue-router'`.
  - `createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })`.
  - Drop `Vue.use(Router)`.
  - Nav-guard cookie calls swapped to `js-cookie` (see §4).
- **`src/store.js`:**
  - `import { createStore } from 'vuex'`; `export default createStore({...})`.
  - Drop `Vue.use(Vuex)`.
  - Keep all `state` / `mutations` / `actions` unchanged except the cookie call swap (§4).

### 3. Vue filters → methods (filters removed in Vue 3)

Affected files: `Problems.vue`, `Submit-history.vue`, `Contests.vue`, `Contest.vue`.

- Move `getIndexByPage` and `plus_one` from the `filters:` block to `methods:`.
- Rewrite templates:
  - `{{ index | getIndexByPage(page) }}` → `{{ getIndexByPage(index, page) }}`
  - `{{ page | plus_one }}` → `{{ plus_one(page) }}`

### 4. Plugin replacements

| Current (Vue 2 only) | Replacement | Call sites / notes |
|---|---|---|
| `vue-cookie` (`Vue.cookie.get/delete`) | **`js-cookie ^3`** | `store.js` (×2 `get`), `router.js` (`get` ×1, `delete` ×2). Use `Cookies.get('auth')` and `Cookies.remove('auth')`. Module-level imports — no component `$cookie` usage to worry about. |
| `vue-clickaway` mixin | **custom `v-click-outside` directive** | ~15-line global directive in `main.js`. Replaces `v-on-clickaway` in `Nav.vue` + `Rmenu.vue`. **Must ignore clicks on the toggle element** (the same node also has `@click="show_*"`) so it doesn't immediately close-then-reopen. Zero new runtime deps. |
| `vue-persian-datetime-picker ^2` | **`vue3-persian-datetime-picker`** | Same author; near-identical props. Registered as global `custom-date-picker` with the same default props, used with `v-model` in `Create-contest.vue`. **Highest-risk item — validate first** (Jalali calendar + prop parity). |
| `vue-multiselect ^2` | **`vue-multiselect ^3`** | Vue 3 major. Same `v-model` / `:options` / `:multiple` API and same `vue-multiselect/dist/vue-multiselect.min.css` import. |
| `@fortawesome/vue-fontawesome ^0.1` | **`^3`** (+ bump `@fortawesome/fontawesome-svg-core` & `free-solid-svg-icons` to `^6`) | `library.add(...)` and `<font-awesome-icon icon="...">` usage unchanged. |

### 5. Custom `v-click-outside` directive (detail)

A global directive registered in `main.js`. On `mounted`, attach a document `click` listener that
fires the bound handler only when the click target is outside the element. On `unmounted`, remove
the listener. Guard against the toggle: because the toggle button lives **inside** the bound
element in both `Nav.vue` and `Rmenu.vue`, an "outside" test (`!el.contains(e.target)`) naturally
excludes toggle clicks. Confirm during implementation that the bound element wraps the toggle.

## Verification Plan

No backend is required to render the app; API calls may fail (server may be down) — that is
orthogonal to the migration.

1. `npm run build` completes and emits `dist/`.
2. `npm run dev` boots the Vite dev server with no console errors on load.
3. Manual click-through of all routes: Home, Dashboard, Problems, Problem, Contests, Contest,
   Contest-problem, Create-problem, Create-contest, Profile, Submit-history, Scoreboard.
   Specifically exercise: the Nav dropdown + Rmenu open/close (click-outside), the multiselect
   in Create-contest, and the Persian date picker in Create-contest.

## Sequencing (de-risked)

1. **Tooling swap** — add Vite + plugin, `vite.config.js`, move `index.html`, update scripts;
   get the dev server to boot.
2. **Core API** — rewrite `main.js`, `router.js`, `store.js`; app compiles under Vue 3.
3. **Filters → methods** — 4 files.
4. **Plugins, one at a time, date-picker first** (riskiest), then multiselect, fontawesome,
   js-cookie swap, click-outside directive.
5. **Full smoke test** per the Verification Plan.

## Risks / Unknowns

- `vue3-persian-datetime-picker` prop/Jalali-calendar parity — the biggest unknown; validate early.
- `vue-multiselect@3` is a relatively new major; watch for slot/styling differences.
- Click-outside toggle nuance (above).
- Persian/RTL fonts (Vazir) and global CSS should carry over untouched — eyeball during smoke test.

## Out of scope / follow-ups

- Linting: keeping ESLint is optional. If kept, re-add modern `eslint` + `eslint-plugin-vue ^9`
  (flat config) as a separate, low-priority step; otherwise drop the `lint` script. Not required
  for the migration to be considered complete.
- Committing `package-lock.json` (separate decision already raised with the user).
