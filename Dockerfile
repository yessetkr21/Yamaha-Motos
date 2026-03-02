FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

# Copiar requirements e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar proyecto
COPY . .

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py loaddata fixtures/initial_data.json --ignorenonexistent && python manage.py runserver 0.0.0.0:8000"]
