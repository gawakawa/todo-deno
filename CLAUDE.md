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

### Testing

```bash
# Run tests
deno test
```

## Architecture

This is a standard Vite + React SPA with a minimal architecture:

- **Entry point**: `src/main.tsx` renders the root `App` component into `#root`
- **Main component**: `src/App.tsx` contains the primary application logic
- **Build tool**: Vite (specifically rolldown-vite@7.2.5) with React plugin
- **Package override**: Uses `rolldown-vite` instead of standard Vite via npm
  override

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
