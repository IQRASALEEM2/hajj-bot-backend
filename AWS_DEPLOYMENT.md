# AWS EC2 Deployment Guide for Hajj Bot Backend

This guide is tailored for your AWS EC2 instance:
- Instance ID: `i-0fb97cb96b41d58bf`
- Public IP: `3.14.151.183`
- Public DNS: `ec2-3-14-151-183.us-east-2.compute.amazonaws.com`
- Ubuntu version: `Ubuntu 26.04`
- Instance type: `t3.micro`

## 1. Connect to your EC2 instance
Use your SSH key pair `hajj-bot-key`:

```bash
ssh -i "path/to/hajj-bot-key.pem" ubuntu@3.14.151.183
```

## 2. Install dependencies

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip git docker.io
sudo systemctl enable docker --now
```

## 3. Clone your backend repository

```bash
cd /home/ubuntu
git clone https://github.com/IQRASALEEM2/hajj-bot-backend.git
cd hajj-bot-backend/ZiyaBackend
```

## 4. Local backend setup (without Docker)

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-dev.txt
cp .env.example .env
# Edit .env with your actual OPENAI_API_KEY
```

Run the server:

```bash
source venv/bin/activate
python -m uvicorn chatbot:app --host 0.0.0.0 --port 5000
```

## 5. Docker-based deployment (recommended)

Build the container:

```bash
cd /home/ubuntu/hajj-bot-backend/ZiyaBackend
docker build -t hajj-bot-backend .
```

Run the container:

```bash
docker run -d --name hajj-bot-backend -p 5000:5000 \
  -v $(pwd)/product_files:/app/product_files \
  -v $(pwd)/ziya_vector_db:/app/ziya_vector_db \
  --env-file .env \
  hajj-bot-backend
```

## 6. Security Group and firewall

- Ensure inbound rule allows port `5000` from your needed sources.
- For public access, allow `0.0.0.0/0` on port `5000` temporarily.
- For production, restrict access to your frontend host or internal network.

## 7. Verify backend

Open in browser:

```text
http://3.14.151.183:5000
```

If the backend is running, you should reach the server and the `/ask` endpoint should accept requests.

## 8. Point mobile/frontend to backend

In `mobile/app.json` set:

```json
"apiUrl": "http://3.14.151.183:5000"
```

Or use your AWS public DNS:

```json
"apiUrl": "http://ec2-3-14-151-183.us-east-2.compute.amazonaws.com:5000"
```

## 9. Optional uptime

For production, use a process manager or Docker restart policy:

```bash
docker run -d --restart unless-stopped --name hajj-bot-backend -p 5000:5000 --env-file .env hajj-bot-backend
```
