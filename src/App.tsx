import { useState, useEffect } from 'react';
import { UploadArea } from './components/UploadArea';
import { LoadingState } from './components/LoadingState';
import { OutputCard, type AnalysisResult } from './components/OutputCard';
import { HeartPulse } from 'lucide-react';

type AppState = 'UPLOAD' | 'PROCESSING' | 'OUTPUT' | 'ERROR';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('UPLOAD');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [resultData, setResultData] = useState<AnalysisResult | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  useEffect(() => {
    const checkConnection = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const res = await fetch(`${apiUrl}/api/status`);
        if (res.ok) {
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }
      } catch (e) {
        setIsBackendConnected(false);
      }
    };
    checkConnection();
  }, []);

  const handleFileSelect = async (file: File) => {
    setCurrentState('PROCESSING');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('document', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat menghubungi server.');
      }

      setResultData(data as AnalysisResult);
      setCurrentState('OUTPUT');

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Gagal memproses laporan. Pastikan koneksi internet Anda stabil.');
      setCurrentState('ERROR');
    }
  };

  const handleReset = () => {
    setCurrentState('UPLOAD');
    setResultData(null);
    setErrorMsg('');
  };

  return (
    <div className="container" style={{ padding: '0', maxWidth: '100%' }}>
      {!isBackendConnected && (
        <div style={{ backgroundColor: '#E63946', color: 'white', padding: '0.5rem', textAlign: 'center', fontSize: '0.875rem', width: '100%' }}>
          ⚠️ Peringatan: Gagal terhubung ke Backend API. Fitur analisa sedang tidak tersedia.
        </div>
      )}
      <div className="container">
        <nav>
          <div className="brand">
            <HeartPulse size={28} className="text-accent" />
            AwamPaham
          </div>
          <div className="disclaimer-nav">Bukan diagnosis medis</div>
        </nav>

        <main className="flex-col w-full" style={{ flex: 1, justifyContent: 'center' }}>
        {currentState === 'UPLOAD' && (
          <UploadArea onFileSelect={handleFileSelect} />
        )}

        {currentState === 'PROCESSING' && (
          <LoadingState />
        )}

        {currentState === 'OUTPUT' && resultData && (
          <OutputCard data={resultData} onReset={handleReset} />
        )}

        {currentState === 'ERROR' && (
          <div className="glass-card flex-col items-center text-center">
            <h3 className="text-warning mb-4">Oops, Ada Masalah</h3>
            <p className="mb-6 opacity-90">{errorMsg}</p>
            <button className="btn-primary" onClick={handleReset}>
              Coba Lagi
            </button>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}

export default App;
