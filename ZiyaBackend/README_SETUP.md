# Ziya ul Harmayn - Setup Instructions

## Prerequisites
1. Python 3.x installed
2. Node.js and npm installed
3. (Optional) OpenAI API key for translation (`OPENAI_API_KEY`)

## Backend Setup (FastAPI)

1. **Create `.env` file** in the project root:
   ```
   # Optional (only used for non-Urdu translations)
   OPENAI_API_KEY=your_actual_openai_api_key_here
   OPENAI_MODEL=gpt-5-mini
   ```

2. **Install Python dependencies** (if not already done):
   ```bash
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Start API server**:
   ```bash
   python -m uvicorn chatbot:app --host 0.0.0.0 --port 5000
   ```
   Or double-click `start_server.bat`
   
   Server will run on: `http://localhost:5000` or `http://<your-ip>:5000`

## Mobile App Setup (React Native/Expo)

1. **Navigate to mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Update API URL** in `mobile/app.json`:
   - Change `apiUrl` to match your computer's IP address
   - Current: `http://192.168.0.107:5000`

4. **Start Expo**:
   ```bash
   npm start
   ```

5. **Run on device**:
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator
   - Or press `w` for web browser

## Troubleshooting

### Flask server won't start:
- Make sure `venv` is activated and dependencies are installed
- If you want translations, check `.env` has `OPENAI_API_KEY`
- Make sure port 5000 is not in use
- Check Python virtual environment is activated

### Mobile app can't connect:
- Ensure Flask server is running
- Check firewall allows port 5000
- Verify IP address in `mobile/app.json` matches your computer's IP
- Make sure both devices are on the same network

### Voice features not working:
- Voice requires a development build (not Expo Go)
- Use text input for testing in Expo Go
- For full voice support, build with: `npx expo prebuild` and `npx expo run:android`

