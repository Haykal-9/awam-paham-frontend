import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  const [message, setMessage] = useState("Sedang membaca laporan...");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("Menyederhanakan dengan AI...");
    }, 4000); // Switch message after 4 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-card flex-col items-center justify-center text-center py-12">
      <Loader2 size={48} className="text-accent mx-auto mb-6" style={{ animation: 'spin 2s linear infinite' }} />
      <h3 className="animate-pulse">{message}</h3>
      <p className="text-sm text-supporting opacity-80 mt-4">Mohon bersabar, ini mungkin memakan waktu hingga satu menit.</p>
    </div>
  );
};
