# Demo Deploy — MongoDB Atlas + Vercel + AWS EC2

This is the temporary demo setup. It gets replaced by the IIIT-D infra deploy once
the resources requested in `IT_REQUEST_EMAIL.md` come through.

## 1. MongoDB Atlas

1. Create a free/shared cluster.
2. Create a database user, note its username/password.
3. Network Access → allow the EC2 instance's IP (or `0.0.0.0/0` for the demo, tighten later).
4. Copy the connection string → this is `MONGO_URL`.

## 2. AWS S3 (media storage)

1. Create a bucket (any region close to your users) → `S3_BUCKET_NAME`.
2. Create an IAM user with a policy scoped to that bucket (`s3:PutObject`, `s3:GetObject`) →
   `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`. Note the bucket's region → `AWS_REGION`.

## 3. EC2 (backend)

1. Launch an EC2 instance — Ubuntu 22.04, `t3.micro`/`t3.small` is enough for a demo.
2. Security group: allow inbound `22` (SSH, your IP only), `80`, `443`.
3. Point a DNS record you control (e.g. `api-demo.yourdomain.com`) at the instance's public IP.
   Caddy (below) needs this to issue a real HTTPS cert — it won't work against a bare IP.
4. SSH in, install Docker + the compose plugin:
   ```bash
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker $USER   # log out/in after this
   ```
5. Clone the repo and configure env:
   ```bash
   git clone -b main https://github.com/itzsam-lol/cipd
   cd cipd
   cp backend/.env.example backend/.env
   nano backend/.env   # fill in MONGO_URL, JWT_SECRET, ADMIN_EMAIL/PASSWORD, S3_*, CORS_ORIGINS
   ```
   - `JWT_SECRET`: generate with `openssl rand -hex 32`
   - `CORS_ORIGINS`: the Vercel URL from step 4 below (comma-separated if more than one)
6. Edit `Caddyfile` — replace `api-demo.example.com` with your real DNS name from step 3.
7. Start it:
   ```bash
   sudo docker compose up -d --build
   ```
   Caddy automatically requests and renews the TLS cert on first request. Check logs with
   `sudo docker compose logs -f` if it doesn't come up.
8. Verify: `curl https://api-demo.yourdomain.com/api/` should return `{"status":"ok",...}`.

## 4. Vercel (frontend)

1. Import the GitHub repo into Vercel, set it to deploy from the **`frontend`** branch
   (root of that branch is already `frontend/`'s contents, no root-directory config needed).
2. Project → Environment Variables:
   - `REACT_APP_BACKEND_URL` = `https://api-demo.yourdomain.com` (from step 3.3, no trailing slash)
   - `GENERATE_SOURCEMAP` = `false`
3. Deploy. Once it's live, go back to `backend/.env` on the EC2 box and set `CORS_ORIGINS`
   to the actual `https://<project>.vercel.app` URL Vercel gave you, then
   `sudo docker compose up -d --build` again to pick it up.

## Notes

- Backend and Caddy restart automatically on reboot (`restart: unless-stopped`) but won't
  survive an instance replacement — this is a demo, not HA. Don't put real content only here.
- The `backend` branch (root = `backend/` contents) exists for platforms like AWS App Runner
  that want a Dockerfile at repo root with no subdirectory config — not needed for this
  docker-compose path, but there if you switch later.
