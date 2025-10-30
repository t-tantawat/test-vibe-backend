# Expense Tracker Dashboard

## Overview

This repository contains a Vite + React + TypeScript single-page application for tracking personal income and expenses. The default route renders a dashboard that surfaces current balance, income, and expense totals, along with filtering tools, CSV export, and a Recharts-powered monthly overview. All transaction data persists locally in the browser via `localStorage`, making the app fully client-side with no backend dependencies.

## Key Features

- **Dashboard summary** displaying total balance, income, and expenses at a glance.
- **Transaction management** with shadcn dialog for adding and editing entries, plus inline delete actions.
- **Filtering and export** tools covering category/date filters and CSV export with toast feedback.
- **Monthly visualization** using Recharts to plot income vs. expenses for the current month.
- **Local persistence** handled by a custom `useTransactions` hook that syncs transactions to `localStorage`.

## Run Locally

Ensure you have Node.js and npm installed (the project uses npm scripts by default).

```sh
npm install
npm run dev
```

Open the URL printed by Vite (typically http://localhost:5173) to view the app. While the dev server is running, edits to the `src` directory hot-reload in the browser.

## GitHub Copilot Guidelines

- Treat Copilot suggestions as drafts—review for correctness, security, and design consistency before accepting.
- Prefer prompting Copilot with clear function and test intentions so generated code includes validation paths.
- Keep domain logic transparent; avoid accepting opaque code blocks that you cannot explain to reviewers.
- Run relevant tests or manual checks after inserting Copilot code to confirm behavior matches project expectations.
- Remove unused imports, variables, or placeholder code that Copilot may include to keep the codebase tidy.

## Project info

**Lovable URL**: https://lovable.dev/projects/1da6e1a7-fe0f-470a-af54-367320e74b6a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1da6e1a7-fe0f-470a-af54-367320e74b6a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1da6e1a7-fe0f-470a-af54-367320e74b6a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
