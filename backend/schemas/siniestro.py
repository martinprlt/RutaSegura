"""
Schemas para Siniestro
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, time, datetime

class SiniestroBase(BaseModel):
    """Schema base de siniestro"""
    fecha: date
    hora: time
    avenida_id: int = Field(..., gt=0)
    tipo_id: int = Field(..., gt=0)
    nivel_gravedad: str = Field(..., pattern="^(baja|media|alta)$")
    victimas_fatales: int = Field(default=0, ge=0)
    heridos: int = Field(default=0, ge=0)
    num_vehiculos: int = Field(..., gt=0)
    dia_semana: str
    es_fin_de_semana: bool = False
    observaciones: Optional[str] = None

class SiniestroCreate(SiniestroBase):
    """Schema para crear siniestro"""
    usuario_id: int = Field(..., gt=0)

class SiniestroUpdate(BaseModel):
    """Schema para actualizar siniestro"""
    fecha: Optional[date] = None
    hora: Optional[time] = None
    avenida_id: Optional[int] = Field(None, gt=0)
    tipo_id: Optional[int] = Field(None, gt=0)
    nivel_gravedad: Optional[str] = Field(None, pattern="^(baja|media|alta)$")
    victimas_fatales: Optional[int] = Field(None, ge=0)
    heridos: Optional[int] = Field(None, ge=0)
    num_vehiculos: Optional[int] = Field(None, gt=0)
    dia_semana: Optional[str] = None
    es_fin_de_semana: Optional[bool] = None
    observaciones: Optional[str] = None

class SiniestroResponse(SiniestroBase):
    """Schema para respuesta de siniestro"""
    id: int
    usuario_id: int
    fecha_registro: datetime
    ultima_modificacion: datetime
    
    model_config = {"from_attributes": True}

class SiniestroDetallado(SiniestroResponse):
    """Schema con información completa del siniestro (incluye joins)"""
    avenida_nombre: Optional[str] = None
    tipo_nombre: Optional[str] = None
    usuario_nombre: Optional[str] = None
    total_vehiculos: Optional[int] = None