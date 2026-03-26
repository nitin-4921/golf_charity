# Golf Charity Subscription Platform — Backend API

## Stack
- Node.js + Express
- MongoDB + Mongoose
- Stripe (subscriptions + webhooks)
- JWT authentication
- Nodemailer (email notifications)
- Winston (logging)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Stripe setup
- Create two recurring prices in your Stripe dashboard (monthly + yearly)
- Copy the Price IDs into `STRIPE_MONTHLY_PRICE_ID` and `STRIPE_YEARLY_PRICE_ID`
- For local webhook testing: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
- Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`

### 4. Run locally
```bash
npm run dev
```

### 5. Create admin user
After registering a user, update their role directly in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | JWT | Get current user |

### Subscriptions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/subscriptions/checkout | JWT | Create Stripe checkout session |
| POST | /api/subscriptions/cancel | JWT | Cancel subscription |
| GET | /api/subscriptions/status | JWT | Get subscription status |

### Scores
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/scores | JWT + Active | Get user scores |
| POST | /api/scores | JWT + Active | Add score (rolling-5) |
| PUT | /api/scores/:id | JWT + Active | Edit score |
| DELETE | /api/scores/:id | JWT + Active | Delete score |

### Draws
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/draws | — | List published draws |
| GET | /api/draws/my-results | JWT + Active | User's draw results |
| GET | /api/draws/:id | — | Get draw by ID |
| POST | /api/draws/run | Admin | Run draw |
| POST | /api/draws/:id/publish | Admin | Publish draw results |
| POST | /api/draws/:id/verify | JWT + Active | Submit winner proof |

### Charities
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/charities | — | List charities |
| GET | /api/charities/:id | — | Get charity |
| PUT | /api/charities/select | JWT | Select charity |
| POST | /api/charities | Admin | Create charity |
| PUT | /api/charities/:id | Admin | Update charity |
| DELETE | /api/charities/:id | Admin | Deactivate charity |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/admin/users | Admin | List users |
| GET | /api/admin/users/:id | Admin | Get user |
| PUT | /api/admin/users/:id | Admin | Update user |
| PUT | /api/admin/users/:id/scores | Admin | Edit user scores |
| GET | /api/admin/winners | Admin | Winners pending review |
| PUT | /api/admin/draws/:drawId/winners/:winnerId/verify | Admin | Approve/reject winner |
| PUT | /api/admin/draws/:drawId/winners/:winnerId/paid | Admin | Mark winner paid |
| GET | /api/admin/analytics | Admin | Platform analytics |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/webhooks/stripe | Stripe event handler |

---

## Draw System Logic

1. Admin calls `POST /api/draws/run` with `{ drawType: "random" | "algorithm", isSimulation: false }`
2. Engine generates 5 unique numbers (1–45)
3. All active subscribers with scores are checked for matches
4. Prize pools are calculated from active subscriber count
5. Jackpot (5-match) rolls over if unclaimed
6. Admin reviews simulation, then calls `POST /api/draws/:id/publish`
7. All subscribers receive email; winners receive winner notification

## Prize Pool Distribution
- 5-match: 40% of pool (jackpot — rolls over if no winner)
- 4-match: 35% of pool
- 3-match: 25% of pool
- Multiple winners in same tier split the prize equally

## Deployment (Render)
1. Push to GitHub
2. Create new Web Service on Render, connect repo
3. Set all environment variables from `.env.example`
4. Build command: `npm install`
5. Start command: `node server.js`
