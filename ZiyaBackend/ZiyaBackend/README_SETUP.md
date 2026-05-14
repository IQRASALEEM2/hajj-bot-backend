# Ziya ul Harmayn - Setup Instructions

## Prerequisites
1. Python 3.x installed
2. Node.js and npm installed
3. (Optional) OpenAI API key for translation (`OPENAI_API_KEY`)

## Backend Setup (FastAPI)

### 1. Create `.env` file
Create `.env` in the `ZiyaBackend` folder:
```bash
cd ZiyaBackend
copy .env.example .env
```
Then edit `.env`:
```env
OPENAI_API_KEY=your_actual_openai_api_key_here
OPENAI_MODEL=gpt-5-mini
```

### 2. Create and activate virtual environment
```bash
cd ZiyaBackend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Run the API server locally
```bash
cd ZiyaBackend
venv\Scripts\activate
python -m uvicorn chatbot:app --host 0.0.0.0 --port 5000
```
Server will run on: `http://localhost:5000`

### 4. Developer tooling
Install developer tools inside the backend virtual environment:
```bash
pip install -r requirements-dev.txt
```
Then you can run:
```bash
isort .
black .
```

## Docker support
Build a production-ready image for AWS or any container host:
```bash
cd ZiyaBackend
docker build -t ziya-backend .
```
Run it locally:
```bash
docker run -p 5000:5000 ziya-backend
```

## AWS deployment notes
This project is ready for AWS deployment using EC2, ECS, or App Runner.
- Use the `ZiyaBackend/Dockerfile` to build a container image.
- Keep `.env` and `ZiyaBackend/venv/` out of source control.
- The backend can rebuild the vector database from `product_files/product_catalog.json` if `ziya_vector_db/` is not present.
- See `../AWS_DEPLOYMENT.md` for EC2-specific commands and instance setup.

## Mobile App Setup (React Native/Expo)
### 1. Navigate to mobile directory
```bash
cd mobile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the backend URL
Open `mobile/app.json` and update `extra.apiUrl` to your deployed backend host:
```json
"apiUrl": "http://YOUR_BACKEND_HOST:5000"
```

### 4. Start Expo
```bash
npm start
```

### 5. Run on device
- Scan QR code with Expo Go app (iOS/Android)
- Or press `a` for Android emulator
- Or press `w` for web browser

## Troubleshooting

### Server won't start
- Make sure `venv` is activated and dependencies are installed
- Ensure `OPENAI_API_KEY` is set in `.env`
- Make sure port 5000 is available

### Mobile app can't connect
- Verify backend is running and reachable from your device
- Update `mobile/app.json` to the deployed backend address
- Ensure firewall/security groups allow port 5000

### Deployment issues
- Do not commit `.env`
- Do not commit `venv/` or `ziya_vector_db/`
- Use Docker or AWS deployment service for production

