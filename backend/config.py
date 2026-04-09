"""
Quemepongo - Configuración Centralizada
Carga variables de entorno desde .env
"""
import os
from dotenv import load_dotenv

# Cargar .env del directorio raíz del proyecto
load_dotenv()

# --- Base de Datos ---
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///quemepongo.db")

# --- Google Gemini ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# --- Entorno ---
APP_ENV = os.getenv("APP_ENV", "development")
IS_DEV = APP_ENV == "development"
