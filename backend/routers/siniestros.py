"""
Router de siniestros
Endpoints CRUD para siniestros
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from config.database import get_db
from schemas.siniestro import SiniestroResponse, SiniestroCreate, SiniestroUpdate, SiniestroDetallado
from services import siniestros as siniestros_service
from routers.auth import obtener_usuario_actual

router = APIRouter(prefix="/siniestros", tags=["Siniestros"])

@router.post("/", response_model=SiniestroResponse, status_code=status.HTTP_201_CREATED)
async def crear_siniestro(
    siniestro: SiniestroCreate,
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """
    Crea un nuevo siniestro
    El usuario_id se toma del usuario autenticado
    """
    if usuario_actual["rol"] not in ["admin", "editor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para crear siniestros"
        )
    
    # Asignar el ID del usuario actual
    siniestro.usuario_id = usuario_actual["id"]
    
    return await siniestros_service.crear_siniestro(db, siniestro)

@router.get("/", response_model=List[SiniestroDetallado])
async def listar_siniestros(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    avenida_id: Optional[int] = Query(None, description="Filtrar por avenida"),
    tipo_id: Optional[int] = Query(None, description="Filtrar por tipo de siniestro"),
    nivel_gravedad: Optional[str] = Query(None, description="Filtrar por gravedad (baja/media/alta)"),
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """
    Lista todos los siniestros con filtros opcionales
    Incluye información de avenida, tipo y usuario (INNER JOIN)
    """
    return await siniestros_service.obtener_todos_siniestros(
        db, skip, limit, avenida_id, tipo_id, nivel_gravedad
    )

@router.get("/count")
async def contar_siniestros(
    avenida_id: Optional[int] = Query(None),
    tipo_id: Optional[int] = Query(None),
    nivel_gravedad: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """Cuenta total de siniestros con filtros opcionales"""
    total = await siniestros_service.contar_siniestros(db, avenida_id, tipo_id, nivel_gravedad)
    return {"total": total}

@router.get("/{siniestro_id}", response_model=SiniestroDetallado)
async def obtener_siniestro(
    siniestro_id: int,
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """Obtiene un siniestro por ID con información detallada"""
    siniestro = await siniestros_service.obtener_siniestro_por_id(db, siniestro_id)
    if not siniestro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Siniestro no encontrado"
        )
    return siniestro

@router.put("/{siniestro_id}", response_model=SiniestroDetallado)
async def actualizar_siniestro(
    siniestro_id: int,
    siniestro_update: SiniestroUpdate,
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """Actualiza un siniestro"""
    if usuario_actual["rol"] not in ["admin", "editor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para actualizar siniestros"
        )
    
    siniestro = await siniestros_service.actualizar_siniestro(db, siniestro_id, siniestro_update)
    if not siniestro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Siniestro no encontrado"
        )
    return siniestro

@router.delete("/{siniestro_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_siniestro(
    siniestro_id: int,
    db: AsyncSession = Depends(get_db),
    usuario_actual: dict = Depends(obtener_usuario_actual)
):
    """Elimina un siniestro"""
    if usuario_actual["rol"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo administradores pueden eliminar siniestros"
        )
    
    eliminado = await siniestros_service.eliminar_siniestro(db, siniestro_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Siniestro no encontrado"
        )
    return None