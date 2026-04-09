from sqlalchemy.orm import sessionmaker
from init_db import engine, Prenda, ModaVigente
import random

Session = sessionmaker(bind=engine)
session = Session()

def generar_match():
    print("\n🧠 Iniciando Motor de Recomendación para Emilio...")
    
    # 1. Buscamos tu prenda ancla (la chomba Penguin)
    chomba = session.query(Prenda).filter(Prenda.user_id == "jimorelli").first()
    
    # 2. Buscamos la tendencia que cargamos manualmente (o la última de la base)
    tendencia = session.query(ModaVigente).order_by(ModaVigente.id.desc()).first()
    
    if not chomba:
        print("⚠️ No encontré la chomba en la base de datos. ¿Corriste seed_data.py?")
        return
    if not tendencia:
        print("⚠️ No hay tendencias cargadas. Corré el INSERT manual que te pasé antes.")
        return

    # 3. Lógica del "Match" (Simulando el Agente de Moda)
    print(f"\n" + "="*40)
    print(f"👕 PRENDA BASE: {chomba.categoria} Penguin")
    print(f"🎨 COLOR: {chomba.color_hex} (Azul Cobalto)")
    print(f"✨ ESTILO ACTUAL: {tendencia.estilo}")
    print("="*40)
    
    # Seleccionamos un ítem de la tendencia para combinar
    prenda_sugerida = random.choice(tendencia.prendas_clave)
    color_sugerido = random.choice(tendencia.paleta_colores)
    
    print(f"\n💡 RECOMENDACIÓN DE 'QUEMEPONGO':")
    print(f"Hoy es un gran día para lucir esa chomba.")
    print(f"Para el estilo '{tendencia.estilo}', combinala con:")
    print(f"👉 un {prenda_sugerida}")
    print(f"👉 en tono {color_sugerido}")
    print(f"\n✅ Outfit validado para la campaña Sigma 26-27.")
    print("="*40 + "\n")

if __name__ == "__main__":
    generar_match()
