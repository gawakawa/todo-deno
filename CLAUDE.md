# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Overview

Todo application built with React 19 + TypeScript + Vite (using rolldown-vite).
The project uses Nix flakes for dependency management and development
environment setup, with Deno as the primary runtime.

## Development Setup

```bash
# Enter Nix development shell (preferred)
nix develop

# Or if using direnv
direnv allow
```

The shell hook automatically generates `.mcp.json` from the flake configuration.

## Common Commands

### Development

```bash
# Start dev server with HMR
deno task dev

# Build for production (runs TypeScript compiler first)
deno task build

# Preview production build
deno task preview
```

### Linting and Formatting

```bash
# Lint TypeScript/JavaScript files
deno task lint
# Or directly: deno lint

# Format all code (Nix and TypeScript/JavaScript)
nix fmt

# Check formatting in CI mode
nix fmt -- --ci
```

### Type Checking

```bash
# Type check TypeScript files
deno check
```

### Testing

```bash
# Run tests
deno test

# Run tests with permissions (when needed)
deno test --allow-read --allow-write --allow-env
```

## Deployment

The application is deployed on Deno Deploy with GitHub integration:

- **Production URL**: https://todo-deno.gawakawa.deno.net/
- **Platform**: Deno Deploy
- **Deployment method**: Automatic deployment via GitHub integration
- **Trigger**: Changes pushed to the main branch are automatically deployed

The GitHub-Deno Deploy integration handles automatic deployments, so no manual
deployment steps are required once changes are merged to main.

## Architecture

This is a standard Vite + React SPA with client-side state management and
IndexedDB persistence:

### Core Structure

- **Entry point**: `src/main.tsx` renders the root `App` component into `#root`
- **App component**: `src/App.tsx` uses React 19's `use()` hook with Suspense
  for data loading
- **Container pattern**: `TodoContainer` manages all state and CRUD operations,
  passing handlers to child components
- **Build tool**: Vite (specifically rolldown-vite@7.2.5) with React plugin

### Component Hierarchy

```
App (Suspense boundary)
└── TodoContainer (state management)
    ├── TodoForm (add new todos)
    └── TodoList (display todos)
        └── TodoItem (individual todo with edit/delete)
```

### Data Flow

- **Storage**: IndexedDB via action functions in `src/actions/`
  - `initDB.ts` - Database initialization with auto-incrementing IDs
  - `getTodos.ts` - Fetch all todos (returns Promise for Suspense)
  - `addTodo.ts` - Create new todo
  - `updateTodo.ts` - Partial update (completion toggle or title edit)
  - `deleteTodo.ts` - Delete by ID
  - `const.ts` - Database constants (DB_NAME, DB_VERSION, STORE_NAME)
- **State**: React 19 features (`use()` hook, Suspense) with local state in
  TodoContainer
- **Updates**: After each mutation, todos are reloaded from IndexedDB to ensure
  consistency

### Styling

- **TailwindCSS** for utility classes with dark mode support
- **React Aria Components** for accessible UI primitives (Button, TextField,
  etc.)
- Component styles in individual `.css` files where needed

## Nix Configuration

The flake provides:

- **CI package** (`nix build .#ci`): Minimal package with Deno for CI
  environments
- **Dev shell** (`nix develop`): CI packages + development tools
- **MCP config** (`nix build .#mcp-config`): Configured with nixos and serena
  MCP servers
- **Treefmt**: Integrated formatting with nixfmt (Nix) and deno fmt
  (TypeScript/JavaScript), excludes `node_modules/`

The CI workflow (`.github/workflows/ci.yml`) runs format check, lint, and tests
using Nix.
