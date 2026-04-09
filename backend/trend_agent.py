import requests
import json
import re
from sqlalchemy.orm import sessionmaker
from init_db import engine, ModaVigente
from config import GEMINI_API_KEY

# Usamos v1beta y el modelo 2.0 Flash
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
Session = sessionmaker(bind=engine)
session = Session()

def actualizar_tendencias():
    print("🛰️ Conectando con Gemini 2.0 Flash...")
    prompt = "Analizá tendencias de moda masculina otoño 2026 en Buenos Aires. Devolvé SOLO un JSON puro: {'estilo': '...', 'colores': ['#HEX1'], 'prendas_clave': ['...']}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    
    try:
        response = requests.post(URL, json=payload)
        res_data = response.json()

        if 'error' in res_data:
            print(f"❌ Error de Google: {res_data['error']['message']}")
            return

        # Procesamiento de la respuesta de la serie 2.0
        texto_ia = res_data['candidates'][0]['content']['parts'][0]['text']
        
        # Limpieza de JSON con Regex para evitar errores de formato
        match = re.search(r'\{.*\}', texto_ia, re.DOTALL)
        if match:
            data = json.loads(match.group())
            nueva_tendencia = ModaVigente(
                estilo=data['estilo'],
                paleta_colores=data['colores'],
                prendas_clave=data['prendas_clave']
            )
            session.add(nueva_tendencia)
            session.commit()
            print(f"✅ ¡ÉXITO! Tendencia '{data['estilo']}' guardada con Gemini 2.0.")
        else:
            print("⚠️ No se encontró un JSON válido. Respuesta de la IA: " + texto_ia)
        
    except Exception as e:
        print(f"❌ Error en el proceso: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    actualizar_tendencias()
