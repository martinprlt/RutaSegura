"""
Configuración y variables de entorno
Sistema de Gestión de Siniestros Viales
"""

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Configuración de la aplicación"""
    
    # Base de datos
    DB_HOST: str = "localhost"
    DB_USER: str = "root"
    DB_PASSWORD: str = "tu_password"
    DB_NAME: str = "siniestros_viales"
    DB_PORT: int = 3306
    
    # JWT
    SECRET_KEY: str = "tu_clave_secreta_super_segura_cambiar_en_produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # API
    API_TITLE: str = "Sistema de Gestión de Siniestros Viales"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "API REST para la gestión y análisis de siniestros viales en La Rioja"
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Instancia global de configuración
settings = Settings()

# Database URL para SQLAlchemy
DATABASE_URL = f"mysql+aiomysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"