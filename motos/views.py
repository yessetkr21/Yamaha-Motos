"""
Frontend servido por React (Vite build).
El backend Django solo expone la API REST en /api/v1/.
"""
from django.http import HttpResponse
from django.shortcuts import render
from django.conf import settings
import os


def react_app(request):
    """Sirve la SPA de React para cualquier ruta del frontend."""
    index_path = os.path.join(settings.BASE_DIR, 'static', 'react', 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    # Fallback desarrollo: plantilla que apunta al build
    return render(request, 'react_index.html')
