from sqlalchemy import create_engine, Column, String, Integer, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
from config import DATABASE_URL

# Conexión principal usando URL del config
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
Base = declarative_base()

# --- DEFINICIÓN DE TABLAS ---

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True)
    preferencias_estilo = Column(JSON) # Ej: {"minimalista": 0.8}

class Prenda(Base):
    __tablename__ = "prendas"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("usuarios.id"))
    categoria = Column(String) # Chomba, Pantalón, etc.
    color_hex = Column(String)
    imagen_url = Column(String, nullable=True) # Foto de camara
    formalidad = Column(Integer)
    ultima_vez_usado = Column(DateTime, default=datetime.datetime.utcnow)
    es_favorito = Column(Boolean, default=False)

class ModaVigente(Base):
    __tablename__ = "moda_vigente"
    id = Column(Integer, primary_key=True)
    estilo = Column(String)
    paleta_colores = Column(JSON) # Usamos JSON en lugar de ARRAY para compatibilidad con SQLite
    prendas_clave = Column(JSON)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True)
    prenda_id = Column(String, ForeignKey("prendas.id"))
    puntuacion = Column(Integer) # -1, 1, 5

# Crear todas las tablas en la base de datos
if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print(f"✅ ¡Arquitectura de tablas creada exitosamente en {DATABASE_URL}!")
