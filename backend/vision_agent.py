import requests
import json
import re
from config import GEMINI_API_KEY

URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

def analizar_imagen_ropa(base64_img: str):
    print("👁️ Activando Gemini Vision...")
    prompt = """
    Analizá esta prenda de ropa. Detectá su categoría principal (ej: Remera, Jean, Campera, Zapatos),
    identificá su color predominante en formato Hexadecimal (Color_hex) e inferí su nivel de 
    formalidad (del 1 al 10, donde 1 es muy casual y 10 es de etiqueta).
    Devolvé SOLO un JSON puro estricto con esta estructura:
    {"categoria": "...", "color_hex": "...", "formalidad": 5}
    """
    
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {
                    "inline_data": {
                        "mime_type": "image/jpeg",
                        "data": base64_img
                    }
                }
            ]
        }]
    }
    
    try:
        response = requests.post(URL, json=payload)
        res_data = response.json()
        
        if 'error' in res_data:
            print(f"❌ Error API: {res_data['error']['message']}")
            return None
            
        texto_ia = res_data['candidates'][0]['content']['parts'][0]['text']
        match = re.search(r'\{.*\}', texto_ia, re.DOTALL)
        
        if match:
            return json.loads(match.group())
        return None
        
    except Exception as e:
        print(f"❌ Error procesando vision: {e}")
        return None
