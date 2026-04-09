from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker
from init_db import engine, Prenda, ModaVigente
from trend_agent import actualizar_tendencias
import random

app = FastAPI(title="Quemepongo API Hibrida")

# Configurar CORS (Permitir conexiones de React, Capacitor y Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En pro, cambiar a ["https://quemepongo.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/api/recomendacion")
def generar_recomendacion():
    db = SessionLocal()
    try:
        # Buscamos prenda y tendencia
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
