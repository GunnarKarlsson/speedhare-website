# speedhare

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fspeedhare.io&label=speedhare.io)](https://speedhare.io)
[![CI](https://github.com/GunnarKarlsson/speedhare-website/actions/workflows/ci.yml/badge.svg)](https://github.com/GunnarKarlsson/speedhare-website/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-source--available-lightgrey)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)

Hong Kong race analytics — comprehensive race results and performance data for road races.

[speedhare.io](https://speedhare.io) consolidates official, publicly downloadable race results into a searchable archive. Browse 5K, 10K, and half-marathon events, open a race for finisher lists and splits, look up a runner, or use the stats pages and pace calculators.

Data comes from public result files released by organizers — not from scraping websites.

![speedhare homepage](screenshot-home.png)

## Run locally

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

With `VITE_API_ORIGIN` unset (the default), the app calls `/api/v1` on localhost and Vite proxies `/api` to `API_PROXY_TARGET` from `.env`.

| `.env` value                                | API            |
| ------------------------------------------- | -------------- |
| `API_PROXY_TARGET=http://127.0.0.1:80`      | Local API      |
| `API_PROXY_TARGET=https://api.speedhare.io` | Production API |

Restart Vite after changing `.env`.

## Scripts

| Script                 | Description                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Vite dev server                                                                                      |
| `npm run build`        | Production build → `dist/`                                                                           |
| `npm run preview`      | Serve the production build locally                                                                   |
| `npm run typecheck`    | TypeScript (`tsc --noEmit`)                                                                          |
| `npm run lint`         | ESLint                                                                                               |
| `npm run format`       | Prettier write                                                                                       |
| `npm run format:check` | Prettier check                                                                                       |
| `npm test`             | Vitest (single run)                                                                                  |
| `npm run test:watch`   | Vitest watch mode                                                                                    |
| `npm run ci`           | `format:check` → `lint` → `typecheck` → `test` → `npm audit --omit=dev --audit-level=high` → `build` |

```bash
npm run ci
```

GitHub Actions runs `npm run ci` on pushes and pull requests to `main`.

## License

Source-available. No license is granted except with written permission from Bahn Labs Ltd. See [LICENSE](LICENSE).
