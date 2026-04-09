import { useState, useEffect } from 'react'

function App() {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // API Endpoint (usando localhost para desarrollo y relative si Vercel con rewrites proxy)
  // Como estamos desacoplados, para demo usamos localhost:8000 harcoded o env.
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

  const fetchRecommendation = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/recomendacion`)
      if (!res.ok) throw new Error('API Response was not OK')
      const data = await res.json()
      if (data.status === 'success') {
        setRecommendation(data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Problema al conectar con la API central.')
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
        fetchRecommendation() // Refrescar recomendación
      } else {
        setError(data.message)
        setLoading(false)
      }
    } catch (err) {
      setError('No se pudo conectar con la red de IA.')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendation()
  }, [])

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900 overflow-hidden">
      {/* Mobile Wrapper Simulator (To look amazing in PC and 100% in real mobile) */}
      <div className="relative w-full max-w-[400px] h-full sm:h-[850px] sm:rounded-[3rem] sm:border-[14px] border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Notch simulator (PC only) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-3xl z-50 hidden sm:block"></div>

        {/* Header */}
        <header className="px-6 pt-12 pb-6 text-center z-10 relative">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
            Quemepongo
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">AI Personal Shopper</p>
        </header>

        {/* Contenido Principal */}
        <main className="flex-1 px-6 py-4 flex flex-col items-center justify-center relative z-10 w-full overflow-y-auto">
          
          {loading && (
            <div className="glass-panel p-8 rounded-3xl w-full text-center animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-t-cyan-400 border-slate-700 rounded-full animate-spin"></div>
              <p className="text-slate-300 font-medium tracking-wide">Analizando tu estilo...</p>
            </div>
          )}

          {error && !loading && (
             <div className="glass-panel p-8 rounded-3xl w-full text-center border-red-500/20 bg-red-500/5">
                <span className="text-4xl block mb-2">🤧</span>
                <p className="text-red-400 font-medium">{error}</p>
                <button onClick={fetchRecommendation} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-full transition-colors">
                  Reintentar
                </button>
             </div>
          )}

          {recommendation && !loading && (
            <div className="glass-panel p-8 rounded-[2rem] w-full text-center shadow-[0_0_50px_-12px_rgba(0,212,255,0.2)] animate-[fade-in_0.5s_ease-out]">
              <span className="inline-block px-3 py-1 bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                Outfit del día
              </span>
              
              <div className="space-y-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Tu prenda base</p>
                  <p className="text-xl font-bold text-white selection:bg-cyan-500/30">
                    {recommendation.prenda_base}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="h-[1px] w-12 bg-slate-700"></div>
                  <span className="text-slate-500 font-medium text-sm">+</span>
                  <div className="h-[1px] w-12 bg-slate-700"></div>
                </div>

                <div>
                  <p className="text-cyan-400 text-sm font-semibold mb-1">Combinar con</p>
                  <p className="text-2xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                    {recommendation.sugerencia_prenda}
                  </p>
                  <p className="text-slate-400 mt-2 font-medium">
                    en tono <span className="text-white px-2 py-0.5 bg-slate-800 rounded shadow-inner">{recommendation.sugerencia_color}</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-500 mb-3 tracking-widest uppercase">
                  Tendencia: <span className="text-slate-300 font-semibold">{recommendation.estilo_recomendado}</span>
                </p>
                <div className="flex gap-3 justify-center">
                  <button className="flex-1 py-3 px-4 rounded-xl font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-[1.02] active:scale-95">
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

        {/* Footer Actions */}
        <footer className="px-6 pb-8 pt-4 z-10 relative">
          <button 
            onClick={updateTrends}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="group-hover:rotate-180 transition-transform duration-500">🛰️</span>
            Generar nueva IA Trend
          </button>
        </footer>

        {/* Ambient background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[30%] bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  )
}

export default App
