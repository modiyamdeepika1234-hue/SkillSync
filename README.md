# SkillSync v2 — Student Skill Exchange Platform

A full-stack MERN app where students teach what they know and learn what they don't.
This v2 adds **connection requests with notifications**, **real-time chat**, **Google login**, and a **left sidebar UI**.

---

## 1. What you need installed (Windows)

- **Node.js 18+** — https://nodejs.org
- **MongoDB Compass** + local MongoDB server — https://www.mongodb.com/try/download/compass
- A code editor (VS Code recommended)

---

## 2. Get a Google OAuth Client ID (for the "Sign in with Google" button)

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a project → **Create Credentials** → **OAuth client ID** → **Web application**
3. **Authorized JavaScript origins** → add `http://localhost:5173`
4. Copy the **Client ID** (looks like `1234-abcd.apps.googleusercontent.com`)

You'll paste it into both `.env` files below.

---

## 3. Run the backend

Open a terminal in the project folder:

```bash
cd backend
copy .env.example .env        # then open .env and fill in MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID
npm install
npm run dev
```

You should see:
```
✅ MongoDB connected
✅ SkillSync API running on http://localhost:5000
```

Open MongoDB Compass and connect to `mongodb://127.0.0.1:27017`. After your first signup the
`skillsync` database appears with the collections: `users`, `posts`, `connections`,
`notifications`, `messages`.

---

## 4. Run the frontend

In a **second terminal**:

```bash
cd frontend
copy .env.example .env        # paste your Google Client ID into VITE_GOOGLE_CLIENT_ID
npm install
npm run dev
```

Open http://localhost:5173

---

## 5. Try the new features

1. Register two accounts (use two browsers or one normal + one private window).
2. From account **A** → **Skill Exchange** → click **Connect** on user **B**.
3. Switch to account **B** → a toast pops up + the **Notifications** badge shows `1`.
4. Open **Notifications** → click **Accept**.
5. Both accounts now see each other under **Messages** → real-time chat works.

---

## 6. Project structure

```
SkillSync/
├── backend/
│   ├── server.js                 entry — boots HTTP + Socket.IO
│   ├── app.js                    Express app (middleware, routes, error handler)
│   ├── .env.example              template for environment variables
│   ├── config/db.js              Mongoose connection
│   ├── models/                   Mongo schemas
│   │   ├── User.js               users + skills + connections list
│   │   ├── Post.js               community posts
│   │   ├── Connection.js         pending/accepted connection requests
│   │   ├── Notification.js       in-app notifications
│   │   └── Message.js            chat messages
│   ├── controllers/              route business logic
│   │   ├── auth.controller.js    register / login / Google login / me
│   │   ├── user.controller.js    list users, get one, update profile
│   │   ├── post.controller.js    feed posts + likes
│   │   ├── connection.controller.js  send / respond / list connections
│   │   ├── notification.controller.js  list + mark all read
│   │   └── message.controller.js chat history (live send is via socket)
│   ├── routes/                   thin Express routers binding URLs to controllers
│   ├── middleware/
│   │   ├── auth.js               verifies JWT, sets req.user
│   │   └── errorHandler.js       single error responder
│   ├── utils/
│   │   ├── asyncHandler.js       promise-aware route wrapper
│   │   └── token.js              signs JWTs
│   └── sockets/index.js          Socket.IO: presence + chat + emitToUser()
│
└── frontend/
    ├── index.html                Vite HTML shell + favicon
    ├── vite.config.js            dev server + /api & /socket.io proxy
    ├── tailwind.config.js        brand color palette
    ├── postcss.config.js         Tailwind/PostCSS
    ├── .env.example              VITE_GOOGLE_CLIENT_ID
    └── src/
        ├── main.jsx              React entry: Router + GoogleOAuth + Auth + Socket providers
        ├── App.jsx               route table (public vs protected)
        ├── index.css             Tailwind + base component classes (.card .btn .input)
        ├── assets/logo.png       SkillSync logo
        ├── api/client.js         Axios instance, attaches JWT automatically
        ├── context/
        │   ├── AuthContext.jsx   user/token state, login/register/google/logout
        │   └── SocketContext.jsx single Socket.IO client + live notification stream
        ├── components/
        │   ├── Logo.jsx           logo + wordmark
        │   ├── Sidebar.jsx        LEFT navigation, active route highlight, unread badge
        │   ├── AppLayout.jsx      sidebar + main content wrapper
        │   ├── ProtectedRoute.jsx redirects guests to /login
        │   └── UserCard.jsx       user tile with Connect / Pending / Connected button
        └── pages/
            ├── Landing.jsx        public marketing page
            ├── Login.jsx          email + password OR Google sign-in
            ├── Register.jsx       sign up + Google sign-in (placed near form)
            ├── Dashboard.jsx      stats hydrated from your account
            ├── Profile.jsx        edit name / bio / skills (offered + wanted)
            ├── SkillExchange.jsx  search & send connection requests
            ├── Notifications.jsx  Accept/Reject inbox + activity log
            ├── Chat.jsx           real-time conversation with accepted connections
            ├── Community.jsx      post feed + likes
            ├── LearningHub.jsx    resources matched to skillsWanted
            └── NotFound.jsx       404
```

---

## 7. How the new features work end-to-end

**Connection request (Instagram-style)**
1. `UserCard` calls `POST /api/connections/:userId`.
2. Controller creates a `Connection { status:'pending' }` and a `Notification`.
3. Server emits `notification:new` over Socket.IO to the receiver — toast appears instantly.
4. Receiver opens `Notifications` → clicks Accept → `PUT /api/connections/:id/respond`.
5. Both users get each other's id pushed into their `User.connections` array.

**Real-time chat**
- `SocketContext` opens **one** `socket.io-client` connection authenticated with the JWT.
- `Chat.jsx` lists accepted connections, loads history via `GET /api/messages/:userId`,
  and sends new messages via `socket.emit('message:send', { to, text })`.
- Server validates both users are connected, persists the `Message`, and emits `message:new`
  to **both** sockets so every open tab updates live.

**Google login**
- `@react-oauth/google` renders the official Google button.
- On success the browser receives a Google ID token and posts it to `POST /api/auth/google`.
- Server verifies the token with `google-auth-library`, finds-or-creates the user, returns a JWT.

---

## 8. Best-practice notes

- Passwords hashed with bcrypt; password field is `select: false`.
- All routes that mutate data go through `protect` middleware (JWT).
- Sockets use the same JWT — no separate session.
- Errors flow through one `errorHandler` so responses are consistent.
- Only whitelisted profile fields can be updated.
- Tailwind tokens (brand-*, accent-*, ink-*) make the palette swap a one-line change.

Enjoy building! 🚀
