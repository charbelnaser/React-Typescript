# Architecture

This document explains how the app is put together and the reasoning behind the
non-obvious decisions. The boilerplate (Vite, TypeScript, `@lumx/react`, MSW, the
mock dataset) was provided; everything described below is the implementation on
top of it.

## Folder structure

```
src/
  api/index.tsx              fetchCharacters / fetchReactions — the only place that calls fetch()
  utils/reactions.ts         groups raw reactions into per-character emoji counts
  types.ts                   Character, Reaction, and API response shapes
  __mocks/                   MSW handlers + fixture data (provided, lightly patched — see below)
  components/
    App/                     React Router setup (unchanged)
    Header/                  logo + search field
    Content/                 data fetching, loading/error/empty states, list + pagination
    CharacterCard/           a single result (image, name, chips, description, reactions)
    Pagination/              page-number navigation with ellipsis
```

## Data flow

- `Content` is the only component that fetches data. On mount it loads all reactions
  once (they aren't paginated) and groups them by `characterId` via
  `groupReactionsByCharacter`. On every change to the search term or page it calls
  `fetchCharacters({ name, page, limit: 4 })`.
- Both fetches use an `AbortController` cleaned up in the `useEffect` return, so a
  fast typer or page-clicker never has a stale response overwrite a newer one (this
  also makes React's Strict Mode double-invoke in dev a non-issue).
- Reactions are merged into the UI by character `id` via a `Map`, not stored on the
  `Character` object — keeps the two API resources independent.

## State lives in the URL, not in React context

Search (`?q=`) and pagination (`?page=`) are both stored in the URL via
`react-router-dom`'s `useSearchParams`, read independently by `Header` and
`Content`. This was chosen over lifting state into `App` or a context because:
- the two components never need to talk to each other directly;
- the page is shareable/bookmarkable and survives a refresh;
- browser back/forward "just works" (`Header` re-syncs its input value via a
  `useEffect` keyed on `searchParams`, but only reacts to *external* URL changes —
  typing doesn't touch the URL until Enter is pressed, so keystrokes are never
  fought over).

Submitting a new search term deletes the `page` param (so the next fetch starts at
page 1). If a `page` param ever points past the last page (e.g. a stale bookmark,
or a search that now has fewer results), `Content` clamps it back down automatically
once the real total is known.

## Notable bugs found and fixed along the way

- **Search semantics mismatch**: the provided mock filtered with
  `name.includes(query)`, but the brief requires "starts with". Patching this only
  on the client (after receiving an already-`includes`-filtered, paginated slice)
  would have left `total`/pagination math inconsistent with what's rendered. Fixed
  at the source in `src/__mocks/index.ts` (`includes` → `startsWith`) so the
  pagination metadata the mock returns matches what's actually displayed.
- **`Thumbnail` with no image**: `@lumx/react`'s `Thumbnail` always renders
  `<img src={image}>` even when a `fallback` icon is supplied — `fallback` only
  swaps in after a real load error. Passing `image=""` for characters without an
  `imageUrl` made the browser request the current document as an image (console
  warnings, spurious network activity). Fixed by rendering a plain icon
  placeholder `<div>` instead of `Thumbnail` when `imageUrl` is missing, found by
  actually running the app in a browser and reading the console, not just by
  type-checking.
- **`tsconfig.json`** referenced `"types": ["jest", "gapi", "google.picker"]`,
  none of which are installed or used anywhere in this project — this made `tsc`
  fail before checking a single file. Removed, along with the now-deprecated
  `downlevelIteration` flag (a no-op at `target: "ES2018"`).

## Other edge cases handled

- Characters can be missing `description`, `species`, `birthYear`, or `imageUrl`
  in the fixture data — each is rendered conditionally with a sensible fallback
  instead of showing `undefined`.
- The reaction fixtures contain duplicate IDs and repeated emoji for the same
  character (and a few corrupted/mojibake emoji from the source data) — reactions
  are grouped by emoji content and counted rather than trusting `id` uniqueness,
  so duplicates surface as a count instead of rendering broken or duplicate badges.
- Loading, error (failed fetch), and empty-search states are distinct UI states in
  `Content`, not just "no results".

## What I'd consider next with more time

- Unit tests for `getPaginationRange` and `groupReactionsByCharacter` (pure
  functions, easy to test in isolation) and a component test for the search →
  filter flow.
- Debounce-as-you-type as an alternative/addition to "press Enter".
