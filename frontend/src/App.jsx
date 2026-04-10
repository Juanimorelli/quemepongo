import { useState, useEffect } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

function App() {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visionMode, setVisionMode] = useState(false)
  
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname.includes('192');
  const API_URL = isLocal ? `http://${window.location.hostname}:8000` : "";

  const fetchRecommendation = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/recomendacion`)
      if (!res.ok) throw new Error('API Error')
      const data = await res.json()
      if (data.status === 'success') {
        setRecommendation(data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Problema al conectar con la API.')
    } finally {
      setLoading(false)
    }
  }

  const updateTrends = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/tendencias/actualizar`, { method: 'POST' })
      const data = await res.json()
      if (data.status === 'success') {
        fetchRecommendation()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Error al actualizar tendencias.')
    } finally {
      setLoading(false)
    }
  }

  const takePhotoAndUpload = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 80
      });

      if (!photo.base64String) return;

      setVisionMode(true); // Activa el loader magico de Gemni Vision

      const res = await fetch(`${API_URL}/api/prendas/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagen_b64: photo.base64String })
      });

      const data = await res.json();
      
      if (data.status === 'success') {
        alert(`¡Prenda guardada! 🚀\nCategoría: ${data.prenda.categoria}\nColor: ${data.prenda.color_hex}`);
        fetchRecommendation(); // Recargar recomendacion para usar la nueva prenda recien subida
      } else {
        alert("Error de la IA: " + data.message);
      }
    } catch (error) {
       // Usuario canceló u otro problema
       console.log("Cámara error", error);
    } finally {
      setVisionMode(false);
    }
  }

  useEffect(() => {
    fetchRecommendation()
  }, [])

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900 overflow-hidden font-sans">
      <div className="relative w-full max-w-[400px] h-full sm:h-[850px] sm:rounded-[3rem] sm:border-[14px] border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-3xl z-50 hidden sm:block"></div>

        <header className="px-6 pt-12 pb-6 text-center z-10 relative">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
            Quemepongo
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">AI Personal Shopper</p>
        </header>

        <main className="flex-1 px-6 py-4 flex flex-col items-center justify-center relative z-10 w-full overflow-y-auto">
          
          {(loading || visionMode) && (
            <div className="glass-panel p-8 rounded-3xl w-full text-center flex flex-col items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="w-12 h-12 border-4 border-t-cyan-400 border-slate-700 rounded-full animate-spin"></div>
              <p className="text-slate-300 font-medium tracking-wide">
                {visionMode ? "Ojo IA procesando ropa..." : "Analizando tu estilo..."}
              </p>
            </div>
          )}

          {error && !loading && !visionMode && (
             <div className="glass-panel p-8 rounded-3xl w-full text-center border-red-500/20 bg-red-500/5">
                <span className="text-4xl block mb-2">🤧</span>
                <p className="text-red-400 font-medium">{error}</p>
                <button onClick={fetchRecommendation} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-full transition-colors">
                  Reintentar
                </button>
             </div>
          )}

          {recommendation && !loading && !visionMode && (
            <div className="glass-panel p-8 rounded-[2rem] w-full text-center shadow-[0_0_50px_-12px_rgba(0,212,255,0.2)] animate-[fade-in_0.5s_ease-out] bg-white/5 backdrop-blur-xl border border-white/10">
              <span className="inline-block px-3 py-1 bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                Outfit del día
              </span>
              
              <div className="space-y-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Tu prenda base</p>
                  <p className="text-xl font-bold text-white mb-2">
                    {recommendation.prenda_base.split('(Color:')[0]}
                  </p>
                  <div className="flex flex-col items-center justify-center gap-3">
                     <img src={recommendation.prenda_base_imagen || `https://image.pollinations.ai/prompt/Flat vector minimal icon of ${recommendation.prenda_base}?nologo=true&seed=1`} alt="Prenda" className="w-24 h-24 rounded-2xl shadow-xl border-2 border-white/10 mx-auto" />
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full shadow-inner border border-white/20" style={{backgroundColor: recommendation.color_base_hex}}></div>
                        <span className="text-xs text-slate-400 font-mono">{recommendation.color_base_hex}</span>
                     </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="h-[1px] w-12 bg-slate-700"></div>
                  <span className="text-slate-500 font-medium text-sm">+</span>
                  <div className="h-[1px] w-12 bg-slate-700"></div>
                </div>

                <div>
                  <p className="text-cyan-400 text-sm font-semibold mb-1">Combinar con</p>
                  <p className="text-2xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-3">
                    {recommendation.sugerencia_prenda}
                  </p>
                  <div className="flex flex-col items-center justify-center gap-2">
                     <img src={`https://image.pollinations.ai/prompt/Flat vector minimal icon of ${recommendation.sugerencia_prenda} ${recommendation.sugerencia_color}?nologo=true&seed=2`} alt="Combination" className="w-24 h-24 rounded-2xl shadow-xl border-2 border-white/10 mx-auto" />
                     <div className="flex items-center gap-2 mt-2">
                        <span className="text-slate-400 font-medium text-sm">en tono</span>
                        <div className="w-4 h-4 rounded-full shadow-inner border border-white/20" style={{backgroundColor: recommendation.sugerencia_color}}></div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-500 mb-3 tracking-widest uppercase">
                  Tendencia: <span className="text-slate-300 font-semibold">{recommendation.estilo_recomendado}</span>
                </p>
                <div className="flex gap-3 justify-center">
                  <button onClick={fetchRecommendation} className="flex-1 py-3 px-4 rounded-xl font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-[1.02] active:scale-95">
                    👎 Otro
                  </button>
                  <button className="flex-1 py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40 active:scale-95">
                    👍 Usar
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

        <footer className="px-6 pb-8 pt-4 z-10 relative space-y-3">
          <button 
            onClick={updateTrends}
            disabled={loading || visionMode}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
          >
            <span>🛰️</span> Generar nueva IA Trend
          </button>
          
          <button 
             onClick={takePhotoAndUpload}
             disabled={loading || visionMode}
             className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
             <span className="text-xl">📷</span> Agregar prenda al ropero
          </button>
        </footer>

        {/* Ambient glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  )
}

export default App
