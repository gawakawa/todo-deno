# Todo App (Verification)

A Todo application for verification purposes, built with React + TypeScript +
Vite.

## Requirements

- Nix with flakes enabled
  - Nix 2.4 or later with flakes feature enabled
  - Add `experimental-features = nix-command flakes` to your `nix.conf`

## Usage

The application is live at: https://todo-deno.gawakawa.deno.net/

## Development

### Setup Development Environment

```bash
# Enter Nix development shell
nix develop

# Or if using direnv
direnv allow
```

### Development Commands

```bash
# Start development server
deno task dev

# Build
deno task build

# Lint
deno task lint

# Preview
deno task preview
```

### Format

```bash
# Format Nix and TypeScript files
nix fmt
```

## Deployment

Deployed on Deno Deploy with automatic deployment from GitHub.

## Directory Structure

```
.
├── flake.nix              # Nix flake configuration
├── flake.lock             # Nix flake lock file
├── .gitignore             # Git ignore rules
├── src/                   # Source code
│   ├── App.tsx            # Main app component
│   ├── App.css            # App styles
│   ├── main.tsx           # Entry point
│   ├── index.css          # Global styles
│   └── assets/            # Static assets
├── public/                # Public files
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json      # TypeScript app configuration
├── tsconfig.node.json     # TypeScript node configuration
├── eslint.config.js       # ESLint configuration
├── package.json           # npm package configuration
└── deno.lock              # Deno lock file
```
