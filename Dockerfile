# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Runtime with Python
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend code
COPY backend ./backend

# Copy built frontend assets
COPY --from=frontend-builder /app/dist ./dist

ENV PORT=8000
ENV ENV=production
EXPOSE 8000

CMD ["python", "backend/run.py"]
