# WanderLog

WanderLog is a single-page React application for exploring countries, viewing country details, and saving personal travel lists.

## How to run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite, usually `http://localhost:4173/`.

## Test credentials

Use Reqres test login:

```text
eve.holt@reqres.in / any password
```

Reqres only accepts selected test emails for successful responses, so invalid emails show a graceful error message.

## Features included

- Login and signup screens using Reqres mock auth
- Protected application view after authentication
- Session persistence with `localStorage`
- REST Countries API fetching with loading and error states
- Search, region filter, and sorting
- Country detail screen with rich facts
- Bucket list and visited list persisted per user
- Responsive desktop and mobile layout

## Improvements with more time

I would add automated tests for auth and list persistence, support drag-to-reorder for the bucket list, and cache REST Countries data for faster repeat visits. I would also add a dedicated dark mode toggle and more detailed accessibility testing.
