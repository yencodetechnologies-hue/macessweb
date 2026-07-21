# M Access Web (React)

Management login, admin dashboard, college/property setup, and marketing landing page.

## Development

```bash
cd macessweb/macessweb
npm install
npm run dev
```

- Landing: http://localhost:5173/
- Login: http://localhost:5173/login
- Admin dashboard: http://localhost:5173/admin (after login)

API calls proxy to `http://localhost:5000/api` in dev. Override with:

```bash
VITE_API_BASE_URL=https://maccess.octosofttechnologies.in/api npm run dev
```

## Production build

```bash
npm run build
```

Deploy the `dist/` folder to static hosting. SPA fallback is included via `public/_redirects`.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing |
| `/login` | Admin / Management / User login |
| `/admin` | Dashboard with visitor stats (screenshot-style UI) |
| `/admin/college` | Create & list colleges (company) |
| `/admin/properties` | Create property blocks under a college |
| `/user` | Resident/user dashboard |

## Auth

Uses existing backend `POST /api/auth/login` with `userType`: `admin`, `apartment`, or `user`.
