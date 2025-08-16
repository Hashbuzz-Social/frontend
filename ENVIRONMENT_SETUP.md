# Environment Configuration Setup Summary

## Overview

Set up multiple environment configurations for the frontend application to support both local and remote development environments.

## Files Created/Modified

### 1. Environment Files

- **`.env`** - Local development environment (localhost:4000)
- **`.env.dev`** - Remote development environment (testnet-dev-api.hashbuzz.social)

### 2. Configuration Files

#### `vite.config.ts`

- Updated to handle different modes and environment files
- Added console logging to show which environment file is being used
- Supports `localdev` mode for local development and `development` mode for remote

#### `package.json`

- Added new scripts for different environments:
  - `dev` / `dev:local` - Local development using `.env`
  - `dev:remote` - Remote development using `.env.dev`
  - `build` / `build:local` - Local build
  - `build:dev` - Development build

#### `README.md`

- Added comprehensive environment configuration documentation
- Documented available scripts and their purposes
- Explained which environment file each script uses

## Usage

### Local Development (Backend at localhost:4000)

```bash
yarn dev
# or
yarn dev:local
```

Uses `.env` file with:

- `VITE_DAPP_API = http://localhost:4000`
- `VITE_API_BASE_URL = "http://localhost:4000"`

### Remote Development (Remote API)

```bash
yarn dev:remote
```

Uses `.env.dev` file with:

- `VITE_DAPP_API = https://testnet-dev-api.hashbuzz.social`
- `VITE_API_BASE_URL = "https://testnet-dev-api.hashbuzz.social"`

### Building for Different Environments

```bash
yarn build          # Local build
yarn build:local    # Local build
yarn build:dev      # Development build with remote API
```

## Environment File Details

### `.env` (Local Development)

- Network: testnet
- API: http://localhost:4000
- Mirror Node: https://testnet.mirrornode.hedera.com
- Firebase: Development configuration

### `.env.dev` (Remote Development)

- Network: testnet
- API: https://testnet-dev-api.hashbuzz.social
- Mirror Node: https://testnet.mirrornode.hedera.com
- Firebase: Development configuration

## Technical Implementation

### Vite Configuration

- Uses `defineConfig` with mode parameter
- Dynamically determines environment file based on mode
- Logs current mode and environment file for debugging
- Supports both `localdev` and `development` modes

### Script Mapping

- `localdev` mode → `.env` file
- `development` mode → `.env.dev` file

This setup provides clear separation between local and remote development environments, making it easy to switch between different backend configurations during development.
