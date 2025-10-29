"""
Script para importar datos de CSVs a la base de datos MySQL
Sistema de Gestión de Siniestros Viales
"""

import pandas as pd
import mysql.connector
from mysql.connector import Error
import bcrypt
from datetime import datetime

# Configuración de conexión a MySQL
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'tu_password',  # Cambiar por tu password
    'database': 'siniestros_viales'
}

def crear_conexion():
    """Crea conexión a MySQL"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            print("✓ Conexión exitosa a MySQL")
            return conn
    except Error as e:
        print(f"✗ Error al conectar a MySQL: {e}")
        return None

def hashear_password(password):
    """Genera hash bcrypt de password"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def importar_usuarios(conn, csv_path='../data/USUARIOS.csv'):
    """Importa usuarios desde CSV"""
    try:
        df = pd.read_csv(csv_path)
        cursor = conn.cursor()
        
        # Password por defecto para todos (cambiar en producción)
        default_password = hashear_password('admin123')
        
        for _, row in df.iterrows():
            sql = """
                INSERT INTO usuarios (id, email, password_hash, nombre, rol, fecha_registro)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            valores = (
                row['id'],
                row['email'],
                default_password,
                row['nombre'],
                row['rol'],
                row['fecha_registro']
            )
            cursor.execute(sql, valores)
        
        conn.commit()
        print(f"✓ {len(df)} usuarios importados")
        cursor.close()
        
    except Exception as e:
        print(f"✗ Error importando usuarios: {e}")
        conn.rollback()

def importar_avenidas(conn, csv_path='AVENIDAS.csv'):
    """Importa avenidas desde CSV"""
    try:
        df = pd.read_csv(csv_path)
        cursor = conn.cursor()
        
        for _, row in df.iterrows():
            sql = """
                INSERT INTO avenidas (id, nombre, tipo, zona, longitud_km)
                VALUES (%s, %s, %s, %s, %s)
            """
            valores = (
                row['id'],
                row['nombre'],
                row['tipo'],
                row['zona'],
                row['longitud_km']
            )
            cursor.execute(sql, valores)
        
        conn.commit()
        print(f"✓ {len(df)} avenidas importadas")
        cursor.close()
        
    except Exception as e:
        print(f"✗ Error importando avenidas: {e}")
        conn.rollback()

def importar_tipos_siniestro(conn, csv_path='TIPOS_SINIESTRO.csv'):
    """Importa tipos de siniestro desde CSV"""
    try:
        df = pd.read_csv(csv_path)
        cursor = conn.cursor()
        
        for _, row in df.iterrows():
            sql = """
                INSERT INTO tipos_siniestro (id, nombre, gravedad)
                VALUES (%s, %s, %s)
            """
            valores = (
                row['id'],
                row['nombre'],
                row['gravedad']
            )
            cursor.execute(sql, valores)
        
        conn.commit()
        print(f"✓ {len(df)} tipos de siniestro importados")
        cursor.close()
        
    except Exception as e:
        print(f"✗ Error importando tipos de siniestro: {e}")
        conn.rollback()

def importar_siniestros(conn, csv_path='SINIESTROS.csv'):
    """Importa siniestros desde CSV"""
    try:
        df = pd.read_csv(csv_path)
        cursor = conn.cursor()
        
        # Convertir 'False'/'True' string a booleano
        df['es_fin_de_semana'] = df['es_fin_de_semana'].map({
            'False': False, 
            'True': True,
            False: False,
            True: True
        })
        
        for _, row in df.iterrows():
            sql = """
                INSERT INTO siniestros (
                    id, fecha, hora, avenida_id, tipo_id, nivel_gravedad,
                    victimas_fatales, heridos, num_vehiculos, dia_semana,
                    es_fin_de_semana, usuario_id, observaciones
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            valores = (
                row['id'],
                row['fecha'],
                row['hora'],
                row['avenida_id'],
                row['tipo_id'],
                row['nivel_gravedad'],
                row['victimas_fatales'],
                row['heridos'],
                row['num_vehiculos'],
                row['dia_semana'],
                row['es_fin_de_semana'],
                row['usuario_id'],
                row['observaciones']
            )
            cursor.execute(sql, valores)
        
        conn.commit()
        print(f"✓ {len(df)} siniestros importados")
        cursor.close()
        
    except Exception as e:
        print(f"✗ Error importando siniestros: {e}")
        conn.rollback()

def importar_vehiculos(conn, csv_path='VEHICULOS_INVOLUCRADOS.csv'):
    """Importa vehículos involucrados desde CSV"""
    try:
        df = pd.read_csv(csv_path)
        cursor = conn.cursor()
        
        # Convertir 'False'/'True' string a booleano
        df['es_fallecido'] = df['es_fallecido'].map({
            'False': False, 
            'True': True,
            False: False,
            True: True
        })
        
        for _, row in df.iterrows():
            sql = """
                INSERT INTO vehiculos_involucrados (
                    vehiculo_id, siniestro_id, tipo_vehiculo, marca,
                    modelo, rol, es_fallecido
                ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            valores = (
                row['vehiculo_id'],
                row['siniestro_id'],
                row['tipo_vehiculo'],
                row['marca'],
                row['modelo'],
                row['rol'],
                row['es_fallecido']
            )
            cursor.execute(sql, valores)
        
        conn.commit()
        print(f"✓ {len(df)} vehículos importados")
        cursor.close()
        
    except Exception as e:
        print(f"✗ Error importando vehículos: {e}")
        conn.rollback()

def verificar_importacion(conn):
    """Verifica que los datos se importaron correctamente"""
    try:
        cursor = conn.cursor()
        
        tablas = [
            'usuarios',
            'avenidas', 
            'tipos_siniestro',
            'siniestros',
            'vehiculos_involucrados'
        ]
        
        print("\n📊 RESUMEN DE IMPORTACIÓN:")
        print("-" * 50)
        
        for tabla in tablas:
            cursor.execute(f"SELECT COUNT(*) FROM {tabla}")
            count = cursor.fetchone()[0]
            print(f"  {tabla:30} {count:5} registros")
        
        print("-" * 50)
        cursor.close()
        
    except Exception as e:
        print(f"✗ Error verificando importación: {e}")

def main():
    """Función principal"""
    print("=" * 50)
    print("  IMPORTACIÓN DE DATOS - SINIESTROS VIALES")
    print("=" * 50)
    print()
    
    # Crear conexión
    conn = crear_conexion()
    if not conn:
        return
    
    try:
        # Importar en orden correcto (respetando foreign keys)
        print("\n1. Importando usuarios...")
        importar_usuarios(conn)
        
        print("\n2. Importando avenidas...")
        importar_avenidas(conn)
        
        print("\n3. Importando tipos de siniestro...")
        importar_tipos_siniestro(conn)
        
        print("\n4. Importando siniestros...")
        importar_siniestros(conn)
        
        print("\n5. Importando vehículos involucrados...")
        importar_vehiculos(conn)
        
        # Verificar
        verificar_importacion(conn)
        
        print("\n" + "=" * 50)
        print("  ✓ IMPORTACIÓN COMPLETADA EXITOSAMENTE")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n✗ Error general: {e}")
        
    finally:
        if conn and conn.is_connected():
            conn.close()
            print("\n✓ Conexión cerrada")

if __name__ == "__main__":
    main()