from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import sessionmaker
import random
import uuid
import base64

from init_db import engine, Prenda, ModaVigente
from trend_agent import actualizar_tendencias
from vision_agent import analizar_imagen_ropa

app = FastAPI(title="Quemepongo API Hibrida")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir imágenes al Front
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Quemepongo Backend 2.0 API is running"}

class PrendaUpload(BaseModel):
    imagen_b64: str

@app.post("/api/prendas/upload")
def upload_prenda(payload: PrendaUpload):
    b64_str = payload.imagen_b64
    if "," in b64_str:
        header, b64_str = b64_str.split(",", 1)
        
    file_id = str(uuid.uuid4())
    file_path = f"uploads/{file_id}.jpg"
    
    try:
        with open(file_path, "wb") as f:
            f.write(base64.b64decode(b64_str))
    except Exception:
        return JSONResponse({"status": "error", "message": "Fallo al guardar imagen"}, status_code=500)
    
    vision_data = analizar_imagen_ropa(b64_str)
    if not vision_data:
         return JSONResponse({"status": "error", "message": "La IA no pudo procesar la foto, intente nuevamente."}, status_code=500)

    db = SessionLocal()
    try:
        nueva_prenda = Prenda(
            id=file_id,
            user_id="jimorelli",
            categoria=vision_data.get("categoria", "Desconocido"),
            color_hex=vision_data.get("color_hex", "#000000"),
            formalidad=vision_data.get("formalidad", 5),
            imagen_url=f"/uploads/{file_id}.jpg"
        )
        db.add(nueva_prenda)
        db.commit()
    finally:
        db.close()
        
    return {"status": "success", "prenda": vision_data, "imagen": f"/uploads/{file_id}.jpg"}

@app.get("/api/recomendacion")
def generar_recomendacion():
    db = SessionLocal()
    try:
        chomba = db.query(Prenda).filter(Prenda.user_id == "jimorelli").first()
        tendencia = db.query(ModaVigente).order_by(ModaVigente.id.desc()).first()
        
        if not chomba or not tendencia:
            return JSONResponse({"status": "error", "message": "Datos insuficientes"}, status_code=400)
        
        prenda_sugerida = random.choice(tendencia.prendas_clave)
        color_sugerido = random.choice(tendencia.paleta_colores)
        
        return {
            "status": "success",
            "prenda_base": f"{chomba.categoria} (Color: {chomba.color_hex})",
            "color_base_hex": chomba.color_hex,
            "estilo_recomendado": tendencia.estilo,
            "sugerencia_prenda": prenda_sugerida,
            "sugerencia_color": color_sugerido
        }
    finally:
        db.close()

@app.post("/api/tendencias/actualizar")
def trigger_tendencias():
    try:
        actualizar_tendencias()
        return {"status": "success", "message": "Tendencias actualizadas con exito."}
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
