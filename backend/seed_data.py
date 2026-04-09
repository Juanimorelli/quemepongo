from sqlalchemy.orm import sessionmaker
from init_db import engine, Usuario, Prenda
import uuid

Session = sessionmaker(bind=engine)
session = Session()

try:
    # 1. Crear el usuario (si no existe)
    user_id = "jimorelli"
    existe_usuario = session.query(Usuario).filter(Usuario.id == user_id).first()
    
    if not existe_usuario:
        nuevo_usuario = Usuario(
            id=user_id,
            email="usuario@ejemplo.com",
            preferencias_estilo={"casual": 1.0}
        )
        session.add(nuevo_usuario)

    # 2. Cargar la chomba Penguin
    nueva_prenda = Prenda(
        id=str(uuid.uuid4()),
        user_id=user_id,
        categoria="Chomba",
        color_hex="#007BFF",  # Azul Cobalto
        formalidad=5,
        es_favorito=True
    )
    
    session.add(nueva_prenda)
    session.commit()
    print("✅ Prenda cargada exitosamente en la base de datos.")

except Exception as e:
    session.rollback()
    print(f"❌ Error al cargar datos: {e}")
finally:
    session.close()
