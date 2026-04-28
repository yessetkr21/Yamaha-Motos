# ── Stage 1: build React ──────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci --silent
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Django app ───────────────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Inject pre-built React assets (vite outputs to ../static/react from /frontend)
COPY --from=frontend-builder /static/react/ ./static/react/

EXPOSE 8000

CMD ["sh", "-c", \
  "mkdir -p /app/data && \
   python manage.py migrate --noinput && \
   python manage.py collectstatic --noinput && \
   python manage.py loaddata fixtures/initial_data.json --ignorenonexistent || true && \
   gunicorn yamaha_shop.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 60"]
