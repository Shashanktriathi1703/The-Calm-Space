# The Calm Space — Dr. Kanchan Shukla Pandey

Full-stack site: React (Vite) frontend + Express/MongoDB backend, with online
booking (calendar → details → Razorpay payment → confirmation), a feedback →
testimonials pipeline, and automatic emails via Nodemailer (with the clinic
logo embedded in every email).

```
therapy-website/
├── client/     React frontend (Vite)
└── server/     Express API + MongoDB + email + payments
```

## 1. Run it locally

**Backend**
```bash
cd server
cp .env.example .env      # then fill in the values (see below)
npm install
npm run dev                # http://localhost:5000
```

**Frontend** (new terminal)
```bash
cd client
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

## 2. Fill in `server/.env`

| Variable | What it's for |
|---|---|
| `MONGO_URI` | MongoDB connection string (local or Atlas — see below) |
| `EMAIL_USER` / `EMAIL_APP_PASSWORD` | Gmail account + app password used to send emails |
| `CLINIC_NOTIFY_EMAIL` | Where new-booking/contact/feedback alerts are sent (defaults to `EMAIL_USER`) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Payment gateway keys |
| `SESSION_PRICE_INR` | Price per session, in rupees |
| `CLIENT_URL` | Your live frontend URL — used for CORS and for the link inside emails |
| `ADMIN_SECRET` | A password-like string used to approve testimonials (see section 4) |

### Getting a free MongoDB database (MongoDB Atlas)
1. Sign up at https://www.mongodb.com/cloud/atlas/register (free tier is enough).
2. Create a free (M0) cluster.
3. Under **Database Access**, create a user + password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) — or your host's IP once you know it.
5. Click **Connect → Drivers**, copy the connection string, and paste it into `MONGO_URI`, swapping in your username/password and adding a database name, e.g.:
   `mongodb+srv://myuser:mypassword@cluster0.xxxx.mongodb.net/therapy-booking`

### Getting Razorpay keys
1. Sign up at https://dashboard.razorpay.com/.
2. Go to **Settings → API Keys → Generate Test Key** to start (no KYC needed for test mode).
3. Copy the Key ID and Key Secret into `.env`.
4. Once you're ready to accept real payments, complete Razorpay's KYC/business verification and switch to the **Live** keys — no code changes needed, just swap the `.env` values.

## 3. Making email sending work after deployment

1. **The environment variables exist on the host too.** `.env` files are
   excluded from git and never uploaded. Whichever platform you deploy the
   backend to, you must add every variable from `server/.env.example` in
   that platform's **Environment Variables** settings panel.

2. **Use a Gmail App Password, not the normal password.**
   - Turn on 2-Step Verification: https://myaccount.google.com/security
   - Create an App Password: https://myaccount.google.com/apppasswords
     (App: "Mail", Device: "Other" → name it "The Calm Space Website")
   - Use the 16-character password Google gives you as `EMAIL_APP_PASSWORD`.
   - Gmail caps outgoing mail at ~500/day, plenty for a practice's booking,
     contact, and feedback volume. If it ever grows past that, swap the
     transporter in `server/utils/mailer.js` for a dedicated email API
     (Resend, SendGrid, Postmark).

3. **CORS must allow your live frontend's URL.** Set `CLIENT_URL` to your
   deployed frontend's exact URL, or the browser will block requests even
   though the backend itself is reachable.

After deploying, hit `https://your-backend-url/api/health` — `{"ok":true}`
means the server is up. Submit a real test booking and check the logs for
`[OK] Email transporter ready` on boot, and watch for any `...email failed:`
lines if a mail doesn't arrive.

## 4. Feedback → testimonials workflow

The "Share Feedback" page (`/feedback`) lets clients rate a session and leave
a message. This is **not** shown on the site automatically — every submission
needs a quick manual approval first, so nothing embarrassing or spammy can go
live without a look. When someone submits feedback:

1. It's saved to MongoDB and you get an email immediately with the content —
   including an **"Approve this feedback"** link at the bottom. Click it and
   it goes live on the homepage — no login, no dashboard, no technical steps.
2. If you'd rather browse everything waiting for approval in one place
   instead of hunting through emails, visit (in a browser):
   ```
   https://your-backend-url/api/feedback/pending?key=YOUR_ADMIN_SECRET
   ```
3. Once approved, it appears in the "Client Stories" section on the homepage
   automatically (replacing the sample placeholder quotes, which only show
   while there's no real approved feedback yet).

`ADMIN_SECRET` should be a long random string — treat it like a password.

## 5. Deploying — both frontend and backend on Render

You can host everything on Render: the backend as a **Web Service** and the
frontend as a **Static Site**. (Vercel/Netlify work identically for the
frontend if you'd rather use those instead — steps are the same idea.)

### 5a. Push to GitHub first
Render deploys from a Git repo, not a zip upload. If you haven't already:
```bash
cd therapy-website
git init
git add .
git commit -m "Initial commit"
```
Create a new repo on https://github.com/new, then:
```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

### 5b. Backend — Render Web Service
1. Go to https://dashboard.render.com → **New → Web Service**.
2. Connect your GitHub account and pick this repo.
3. Fill in:
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free is fine to start
4. Under **Environment**, add every variable from `server/.env.example`
   (`MONGO_URI`, `EMAIL_USER`, `EMAIL_APP_PASSWORD`, `CLINIC_NOTIFY_EMAIL`,
   `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `SESSION_PRICE_INR`,
   `ADMIN_SECRET`, and `CLIENT_URL` — you can leave `CLIENT_URL` blank for
   now and fill it in after step 5c).
5. Click **Create Web Service**. Render will build and deploy; note the URL
   it gives you, e.g. `https://calm-space-api.onrender.com`.
6. Visit `https://calm-space-api.onrender.com/api/health` — you should see
   `{"ok":true}`.

   *Note: on Render's free tier, the backend "sleeps" after 15 minutes of no
   traffic and takes ~30–50 seconds to wake up on the next request. That's
   normal for free hosting — the booking page will just feel slow on the
   very first load after a quiet period. Upgrading to a paid instance removes
   this.*

### 5c. Frontend — Render Static Site
1. Back on the Render dashboard → **New → Static Site**.
2. Connect the same GitHub repo.
3. Fill in:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment**, add:
   - `VITE_API_URL` = `https://calm-space-api.onrender.com/api` (your backend
     URL from step 5b, with `/api` on the end)
5. Click **Create Static Site**. Render builds and gives you a URL like
   `https://calm-space.onrender.com`.
6. Go back to the **backend's** environment variables (step 5b, service →
   Environment tab) and set `CLIENT_URL` to this frontend URL, then
   **Manual Deploy → Deploy latest commit** to restart it with the new value.
   This step matters — without it, the browser will block requests from your
   live site even though the backend works fine from Postman.

### 5d. Custom domain (optional)
If you have a domain (e.g. from GoDaddy, Namecheap, Hostinger):
1. On the Static Site's **Settings → Custom Domains**, add your domain.
2. Render shows you a CNAME record to add at your domain registrar's DNS
   settings. Add it there (usually takes a few minutes to a few hours to
   propagate).
3. Once your domain is live, update `CLIENT_URL` on the backend to the new
   domain and redeploy the backend, same as step 5c.6.

### 5e. Redeploying after future changes
Render auto-deploys on every push to your `main` branch by default — just
`git add . && git commit -m "..." && git push` and both services rebuild
automatically. No manual re-upload needed.

## 6. Customizing

- **Session price / working hours / slot length:** `server/routes/bookingRoutes.js`
  (`WORKING_HOURS` array) and `SESSION_PRICE_INR` in `.env`.
- **Copy (About text, workshops):** `client/src/pages/*.jsx`.
- **Colors/fonts:** `client/src/styles/tokens.css`.
- **Logo:** `client/public/images/logo.png` (website) and
  `server/assets/logo.png` (emails) — replace both files with the same
  filename to swap the logo everywhere at once.
- **Email templates:** `server/utils/mailer.js`.
