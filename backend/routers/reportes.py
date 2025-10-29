"""
Router de reportes y estadísticas
Incluye las 4 consultas complejas requeridas:
1. INNER JOIN + GROUP BY
2. Subconsulta
3. GROUP BY con agregaciones múltiples
4. Subconsulta correlacionada
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict

from config.database import get_db
from services import reportes as reportes_service
from routers.auth import obtener_usuario_actual

router = APIRouter(prefix="/reportes", tags=["Reportes y Estadísticas"])

@router.get("/resumen-general")
async def obtener_resumen_general(
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """
    Resumen general del sistema
    Total de siniestros, fallecidos, heridos, etc.
    """
    return await reportes_service.obtener_resumen_general(db)

@router.get("/siniestros-por-zona")
async def obtener_siniestros_por_zona(
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """
    📊 CONSULTA 1: INNER JOIN + GROUP BY
    Estadísticas de siniestros por zona geográfica
    """
    return await reportes_service.obtener_siniestros_por_zona(db)

@router.get("/avenidas-peligrosas")
async def obtener_avenidas_peligrosas(
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """
    📊 CONSULTA 2: SUBCONSULTA
    Ranking de avenidas más peligrosas usando subconsulta
    """
    return await reportes_service.obtener_avenidas_peligrosas(db)

@router.get("/estadisticas-por-tipo")
async def obtener_estadisticas_por_tipo(
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """
    📊 CONSULTA 3: GROUP BY con múltiples agregaciones
    Estadísticas detalladas por tipo de siniestro
    """
    return await reportes_service.obtener_estadisticas_por_tipo(db)

@router.get("/analisis-vehiculos")
async def obtener_analisis_vehiculos(
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """
    📊 CONSULTA 4: SUBCONSULTA CORRELACIONADA
    Análisis de vehículos con subconsulta correlacionada
    """
    return await reportes_service.obtener_analisis_vehiculos(db)

@router.get("/siniestros-por-mes")
async def obtener_siniestros_por_mes(
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """Distribución de siniestros por mes"""
    return await reportes_service.obtener_siniestros_por_mes(db)

@router.get("/siniestros-por-dia-semana")
async def obtener_siniestros_por_dia_semana(
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """Distribución de siniestros por día de la semana"""
    return await reportes_service.obtener_siniestros_por_dia_semana(db)

@router.get("/horarios-criticos")
async def obtener_horarios_criticos(
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """Horarios con mayor cantidad de siniestros"""
    return await reportes_service.obtener_horarios_criticos(db)

@router.get("/top-marcas-involucradas")
async def obtener_top_marcas_involucradas(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """Top marcas de vehículos más involucradas"""
    return await reportes_service.obtener_top_marcas_involucradas(db, limit)