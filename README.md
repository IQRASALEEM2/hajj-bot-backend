# Hajj Bot Backend

This repository contains the backend for the Hajj Bot project.

## Structure
- `ZiyaBackend/` — Python FastAPI backend
- `frontend/` — React/Vite frontend
- `mobile/` — Expo React Native mobile app

## Backend setup
See `ZiyaBackend/README_SETUP.md` for development, Docker, and AWS deployment instructions.

## AWS deployment
See `AWS_DEPLOYMENT.md` for EC2-specific deployment commands and configuration.

## Notes
- Do not commit `.env` or `ZiyaBackend/venv/`
- The backend can rebuild its vector database from `ZiyaBackend/product_files/product_catalog.json`
- Use `mobile/app.json` to update the API endpoint for your deployed backend
