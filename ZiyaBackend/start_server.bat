@echo off
echo Starting Ziya ul Harmayn API server (FastAPI)...
cd /d "%~dp0"
call venv\Scripts\activate.bat
python -m uvicorn chatbot:app --host 0.0.0.0 --port 5000
pause

