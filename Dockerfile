# Multi-stage Docker build for SmartTour.Jo
# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
COPY frontend/yarn.lock ./

# Install frontend dependencies
RUN yarn install --frozen-lockfile

# Copy frontend source code
COPY frontend/ ./

# Build the frontend
RUN yarn build

# Stage 2: Python backend with FastAPI
FROM python:3.11-slim AS backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ ./

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/build ./static

# Create non-root user
RUN useradd --create-home --shell /bin/bash smarttour
RUN chown -R smarttour:smarttour /app
USER smarttour

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8001/api/health || exit 1

# Run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]