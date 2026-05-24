<p align="center">
  <img src="./assets/images/icon.png" alt="Paper Stack logo" width="112" height="112" />
</p>

<h1 align="center">Paper Stack</h1>

<p align="center">
  A polished Expo mobile app for browsing, searching, downloading, and reviewing Pakistani board past papers.
</p>

<p align="center">
  <a href="https://expo.dev">Expo SDK 54</a> |
  <a href="https://reactnative.dev">React Native 0.81</a> |
  <a href="https://supabase.com">Supabase</a> |
  <a href="https://tanstack.com/query/latest">TanStack Query</a>
</p>

---

## Overview

Paper Stack is a mobile-first past-paper library built with Expo Router and Supabase. It helps students browse education boards, choose a class and subject, open real PDF papers, search across published papers, bookmark important material, and keep downloaded files available offline.

The app is designed around fast repeated use: board-based browsing, compact paper cards, subject-aware filtering, offline status handling, and a preview build that can be installed directly on Android.

## Preview Build

An Android preview APK is included in the repository:

```text
preview/paper-stack.apk
```

Install it on an Android device to test the current native build. The preview build uses native modules that Expo Go cannot fully exercise, including PDF rendering and filesystem behavior.

## Features

- Browse active boards grouped by province from Supabase.
- View board details with board-specific color theming.
- Select class levels and subjects through the board/class/subject flow.
- Fetch live papers from Supabase with board, subject, class, year, and session filters.
- Open PDF papers in the native viewer when available.
- Fall back to an external PDF open action if native preview cannot load.
- Search papers with debounced server-side queries.
- Bookmark papers and hydrate bookmark metadata from the server.
- Download papers for offline reading.
- Restore offline download metadata with local snapshots.
- Continue browsing recently opened papers.
- View common questions grouped by chapter.
- Persist preferences and offline state with Zustand and AsyncStorage.
- Show loading, empty, offline, and network retry states across data-driven screens.

## Tech Stack

| Area | Technology |
| --- | --- |
| App runtime | Expo SDK 54, React Native 0.81, React 19 |
| Routing | Expo Router |
| Server data | Supabase direct database access |
| Async state | TanStack Query |
| Local state | Zustand |
| Persistence | AsyncStorage |
| Offline files | Expo FileSystem |
| PDF viewing | react-native-pdf with external-open fallback |
| Styling | NativeWind, Tailwind config, custom theme tokens |
| Icons | Lucide React Native |
| Builds | EAS Build |

## Project Structure

```text
paper-stack/
|-- app/
|   |-- (tabs)/                 # Home, search, downloads, profile
|   |-- (stack)/                # Boards, papers, viewer, bookmarks, questions
|   |-- _layout.tsx             # Root providers, routing, deep links
|   |-- onboarding.tsx
|   `-- splash.tsx
|-- components/
|   |-- browse/                 # Board/class/subject/paper browse UI
|   |-- common/                 # Empty, error, network, skeleton, toast UI
|   |-- home/                   # Home sections and offline shortcut
|   |-- search/                 # Search header, filters, results
|   |-- viewer/                 # PDF viewer, toolbar, download progress
|   `-- ui/                     # Shared primitives
|-- hooks/
|   |-- api/                    # TanStack Query hooks
|   |-- useDownload.ts
|   |-- useBookmark.ts
|   `-- useNetworkStatus.ts
|-- lib/
|   |-- queries/                # Pure Supabase query functions
|   |-- supabase.ts             # Supabase client
|   |-- query-keys.ts
|   `-- offline-files.ts
|-- store/
|   `-- index.ts                # Zustand store
|-- types/
|   `-- index.ts                # Server-aligned app types and mappers
|-- constants/                  # Theme and offline fallback data
|-- supabase/                   # SQL helpers
|-- preview/
|   `-- paper-stack.apk         # Android preview build
`-- assets/images/
    `-- icon.png
```

## Data Flow

Paper Stack uses Supabase as the primary source of truth. The query layer is split into pure async functions and React hooks:

```text
Supabase tables
  -> lib/queries/*
  -> hooks/api/*
  -> screens/components
```

The main data entities are:

- `Board`
- `Subject`
- `Paper`
- `CommonQuestion`
- `Download`
- `UserPreferences`

Database rows are mapped from snake_case Supabase columns into camelCase mobile types in `types/index.ts`.

## Supabase Integration

The Supabase client lives in:

```text
lib/supabase.ts
```

Environment variables are expected in `.env` for local development:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Use `.env.example` as the template. Do not commit real secrets.

For EAS builds, the same variables must be available to the selected build profile. This project currently defines them under the `preview` and `production` profiles in `eas.json`.

## Query Layer

Pure query functions live in `lib/queries/`:

- `boards.ts` - board list, grouped boards, board detail
- `subjects.ts` - all subjects and board/class subjects
- `papers.ts` - paper lists, paper detail, recent papers, search, hydration by IDs
- `questions.ts` - common question queries
- `settings.ts` - feature flags
- `analytics.ts` - view/download analytics RPC calls

React hooks live in `hooks/api/` and wrap those functions with TanStack Query keys, caching, loading states, and retry behavior.

## Offline Strategy

Downloads are stored as local file records and persisted through Zustand/AsyncStorage. Each download can include a `paperSnapshot`, so the app can render metadata even when the network is unavailable.

The viewer prefers sources in this order:

1. Downloaded local file URI
2. Server `pdfUrl`
3. Navigation fallback metadata

The home screen also exposes an offline downloads shortcut when the device is offline.

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Expo CLI through `npx`
- Android Studio or a physical Android device for native testing
- Supabase project with the required tables and public read access/RLS policies

### Install

```bash
npm install
```

### Configure Environment

Create `.env` in the project root:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### Run Locally

```bash
npx expo start
```

Expo Go can run most of the app, but native PDF preview is limited. Use a development or preview build for the closest production behavior.

### Type Check

```bash
npx tsc --noEmit
```

### Android Export Check

```bash
npx expo export --platform android --clear
```

## EAS Builds

Build preview APK:

```bash
eas build -p android --profile preview
```

Build production Android App Bundle:

```bash
eas build -p android --profile production
```

The app is configured with:

```text
android.package = com.devjawadsher.paperstack
```

## Important Notes

- `react-native-pdf` is not available inside Expo Go. The app includes a fallback UI for Expo Go and slow native PDF loads.
- Supabase credentials used by EAS must be available at build time because Expo public env values are bundled into the app.
- `constants/boards.ts` and `constants/subjects.ts` are offline fallback data, not the primary source.
- `constants/questions.ts` is deprecated reference data and should not be used by new screens.
- `preview/paper-stack.apk` is a generated artifact for testers, not source code.

## Roadmap

- Add real app screenshots to `docs/screenshots/` and reference them in this README.
- Add a Supabase schema migration set for reproducible setup.
- Add automated smoke tests for the board -> class -> subject -> paper -> viewer flow.
- Add richer analytics dashboards for paper views and downloads.
- Improve in-app PDF rendering diagnostics for malformed or restricted PDF URLs.

## License

Private project. All rights reserved unless a license is added.
