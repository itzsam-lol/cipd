# Demo Deploy — MongoDB Atlas + Vercel + AWS EC2

This is the temporary demo setup. It gets replaced by the IIIT-D infra deploy once
the resources requested in `IT_REQUEST_EMAIL.md` come through.

## 1. MongoDB Atlas

1. Create a free/shared cluster.
2. Create a database user, note its username/password.
3. Network Access → allow the EC2 instance's IP (or `0.0.0.0/0` for the demo, tighten later).
4. Copy the connection string → this is `MONGO_URL`.

## 2. AWS S3 (media storage)

The backend never exposes the bucket publicly — every upload/download goes through
`/api/admin/upload` and `/api/files/{path}`, which use your IAM credentials server-side
(see `get_object`/`put_object` in `backend/server.py`). So the bucket stays fully private;
nothing below needs public access.

### 2a. Create the bucket

Go to the S3 console → **Create bucket**, and fill in the form exactly like this:

| Field | What to pick | Why |
|---|---|---|
| AWS Region | `Asia Pacific (Mumbai) ap-south-1` (or whatever's closest to your users) | Write this down — it's your `AWS_REGION` env var, must match exactly. |
| Bucket type | **General purpose** | Directory buckets (S3 Express) are a different, pricier API our code doesn't use. |
| Bucket namespace | **Global namespace** (default) | Simplest option, no downside for this use case. Leave it as-is. |
| Bucket name | e.g. `cipd-s3` | Must be globally unique across *all* AWS accounts — if it's taken, try `cipd-media-<something>`. Whatever you land on is your `S3_BUCKET_NAME` env var, exactly as typed. |
| Copy settings from existing bucket | leave blank | Not relevant, you have no existing bucket. |
| **Object Ownership** | **ACLs disabled — Bucket owner enforced** (default) | Our code never sets ACLs; access is controlled purely by the IAM policy in step 2b. |
| **Block Public Access settings** | Leave **all four checked / "Block all public access" ON** (default) | The bucket is never read directly by browsers — everything goes through the backend. There is no reason to open this up. |
| **Bucket Versioning** | **Disable** | Keeps it simple/cheap for a demo. Nothing in our code relies on object versions. |
| Tags | skip | Optional, purely for your own cost tracking. |
| **Default encryption** | **SSE-S3 (Server-side encryption with Amazon S3 managed keys)** | Free, zero setup. SSE-KMS/DSSE-KMS add cost and complexity (a KMS key to manage) for no benefit here. |
| Bucket Key | doesn't matter | Only applies to SSE-KMS, which you're not using. |
| **Object Lock** (Advanced settings) | **Disable** | This is a compliance/WORM feature (can't delete/overwrite objects) — enabling it also force-enables Versioning. Not needed for a demo CMS. |

Click **Create bucket**. You do *not* need to upload anything manually — the app uploads
media itself via `/api/admin/upload`.

### 2b. Create an IAM user scoped to just this bucket

Go to **IAM → Users → Create user**.

1. User name: e.g. `cipd-backend`. Do **not** check "Provide user access to the AWS Management
   Console" — this is a machine/API-only identity, it should never be able to log into the
   AWS console.
2. Permissions options → **Attach policies directly** → **Create policy** (opens a new tab).
3. In the policy editor, switch to the **JSON** tab and paste this, replacing
   `YOUR-BUCKET-NAME` with the exact bucket name from step 2a:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:PutObject", "s3:GetObject"],
         "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
       }
     ]
   }
   ```
   This grants read/write on objects *inside* the bucket only — not permission to list,
   delete, or change bucket settings, and no access to any other bucket in the account.
4. Name the policy (e.g. `cipd-s3-media-access`), create it, go back to the user-creation
   tab, refresh the policy list, and attach it.
5. Finish creating the user. Open the new user → **Security credentials** tab →
   **Create access key** → choose **Application running outside AWS** → create it.
6. Copy the **Access key** and **Secret access key** *immediately* — the secret is shown
   only once. These are `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`.

## 3. EC2 (backend)

### 3a. Application and OS Images (AMI)

If your launch wizard is currently showing **"Ubuntu Server 22.04 with SQL S..."** — that's
not the plain OS, it's an AWS Marketplace image with SQL Server bundled in (which is also why
the wizard tried to auto-open an MSSQL port to the internet, see below). Go back to that step
and pick the plain one instead:

- Search "Ubuntu" → choose **Ubuntu Server 22.04 LTS**, published by **Canonical**, marked
  **Free tier eligible**. Architecture: 64-bit (x86).

### 3b. Instance type

`t3.small` (2 GiB RAM) is a safe choice for Docker + FastAPI + Caddy. If you want to stay
inside the AWS Free Tier (new accounts, 750 hrs/month for 12 months) use `t3.micro` (1 GiB)
instead — it's tighter on memory but workable for a demo.

### 3c. Key pair

Create a new key pair (RSA, `.pem` format) if you don't have one, download it, and **don't
lose it** — AWS won't let you download it again. You'll use it to SSH in.

> On Windows, OpenSSH (built into PowerShell) needs the key file's permissions locked down
> before it'll accept it, or you'll get an "unprotected private key file" error:
> ```powershell
> icacls.exe "path\to\key.pem" /reset
> icacls.exe "path\to\key.pem" /grant:r "$($env:USERNAME):(R)"
> icacls.exe "path\to\key.pem" /inheritance:r
> ```

### 3d. Network settings

| Field | What to pick | Why |
|---|---|---|
| VPC | leave the default (`vpc-...`) | Fine for a single demo instance. |
| Subnet | **No preference** | Fine. |
| Auto-assign public IP | **Enable** | Required — you need a reachable public IP for DNS to point at. |
| Firewall (security group) | **Create security group**, then fix the rules (below) | Don't keep the auto-suggested rules as-is. |

The wizard auto-generates a security group named `launch-wizard-1`. Before launching, edit its
rules to exactly this:

| Rule | Source | Keep? |
|---|---|---|
| Allow MSSQL traffic (port 1433) | Anywhere `0.0.0.0/0` | **Delete this rule.** It only appeared because of the SQL Server AMI — this app has nothing to do with MSSQL, and an open database port to the entire internet is a real risk. |
| Allow SSH traffic (port 22) | Anywhere `0.0.0.0/0` | **Change source to "My IP"** instead of Anywhere — no reason to expose SSH to the whole internet when it's just you connecting. |
| Allow HTTPS traffic (port 443) | Anywhere `0.0.0.0/0` | Keep as-is — needs to be public for visitors and for Caddy's TLS cert issuance. |
| Allow HTTP traffic (port 80) | Anywhere `0.0.0.0/0` | Keep as-is — Caddy needs port 80 open for the Let's Encrypt HTTP challenge (it redirects to HTTPS automatically afterward). |

### 3e. Storage

Bump this from the default **8 GiB** to **20 GiB, gp3** (gp3 is cheaper and faster than gp2,
and still within the free-tier allowance on a new account). 8 GiB gets tight fast once you
have the Ubuntu base system + Docker + your backend image + Caddy image all on one disk.

Leave **File systems** as **None** — you don't need S3 Files/EFS/FSx, media goes straight to
the S3 bucket from step 2, not to the instance's own disk.

### 3f. Elastic IP (recommended)

A plain EC2 public IP changes if you ever stop/restart the instance, which would silently
break your DNS record and Caddy's TLS cert. After launching:

1. **EC2 → Elastic IPs → Allocate Elastic IP address** → Allocate.
2. Select it → **Actions → Associate Elastic IP address** → pick your instance.
3. Use *this* IP (not the original public IP) for the DNS record in the next step.

### 3g. DNS + bring it up

1. Point a DNS record you control (e.g. `api-demo.yourdomain.com`) at the Elastic IP from 3f.
   Caddy needs this to issue a real HTTPS cert — it won't work against a bare IP.
2. SSH in (`ssh -i key.pem ubuntu@<elastic-ip>`), install Docker + the compose plugin:
   ```bash
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker $USER   # log out/in after this
   ```
3. Clone the repo and configure env:
   ```bash
   git clone -b main https://github.com/itzsam-lol/cipd
   cd cipd
   cp backend/.env.example backend/.env
   nano backend/.env   # fill in MONGO_URL, JWT_SECRET, ADMIN_EMAIL/PASSWORD, S3_*, CORS_ORIGINS
   ```
   - `JWT_SECRET`: generate with `openssl rand -hex 32`
   - `CORS_ORIGINS`: the Vercel URL from step 4 below (comma-separated if more than one)
4. Edit `Caddyfile` — replace `api-demo.example.com` with your real DNS name from step 3g.1.
5. Start it:
   ```bash
   sudo docker compose up -d --build
   ```
   Caddy automatically requests and renews the TLS cert on first request. Check logs with
   `sudo docker compose logs -f` if it doesn't come up.
6. Verify: `curl https://api-demo.yourdomain.com/api/` should return `{"status":"ok",...}`.

## 4. Vercel (frontend)

1. Import the GitHub repo into Vercel, set it to deploy from the **`frontend`** branch
   (root of that branch is already `frontend/`'s contents, no root-directory config needed).
2. Project → Environment Variables:
   - `REACT_APP_BACKEND_URL` = `https://api-demo.yourdomain.com` (from step 3g.1, no trailing slash)
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
