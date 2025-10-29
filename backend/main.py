"""
Aplicación principal FastAPI
Sistema de Gestión de Siniestros Viales
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config.database import init_db, close_db
from config.settings import settings

# Importar todos los routers
from routers import (
    auth_router,
    usuarios_router,
    avenidas_router,
    tipos_siniestro_router,
    siniestros_router,
    vehiculos_router,
    reportes_router
)

# Lifespan para inicializar y cerrar la base de datos
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Iniciando aplicación...")
    await init_db()
    print("✅ Base de datos conectada")
    
    yield
    
    # Shutdown
    print("🔴 Cerrando aplicación...")
    await close_db()
    print("✅ Base de datos desconectada")

# Crear aplicación FastAPI
app = FastAPI(
    title="Sistema de Gestión de Siniestros Viales",
    description="""
    API REST para gestión y análisis de siniestros de tránsito en La Rioja.
    
    ## Características
    * Autenticación con JWT
    * CRUD completo de entidades
    * Reportes estadísticos con consultas complejas
    * Análisis de datos de siniestros viales
    
    ## Tecnologías
    * FastAPI - Framework web
    * MySQL - Base de datos
    * SQLAlchemy - ORM asíncrono
    * JWT - Autenticación
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth_router)
app.include_router(usuarios_router)
app.include_router(avenidas_router)
app.include_router(tipos_siniestro_router)
app.include_router(siniestros_router)
app.include_router(vehiculos_router)
app.include_router(reportes_router)

# Ruta raíz
@app.get("/", tags=["Root"])
async def root():
    """Endpoint raíz de la API"""
    return {
        "mensaje": "API de Gestión de Siniestros Viales",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Health check
@app.get("/health", tags=["Health"])
async def health_check():
    """Verifica el estado de la API"""
    return {"status": "healthy", "database": "connected"}

# Para ejecutar con: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
