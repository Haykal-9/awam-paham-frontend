import React from 'react';
import { Copy, RefreshCw, AlertCircle } from 'lucide-react';

export interface AnalysisResult {
  summary: string;
  definitions: { term: string; meaning: string }[];
  questions: string[];
}

interface OutputCardProps {
  data: AnalysisResult;
  onReset: () => void;
}

export const OutputCard: React.FC<OutputCardProps> = ({ data, onReset }) => {

  const handleCopy = () => {
    let copyText = `Ringkasan Laporan:\n${data.summary}\n\n`;
    copyText += `Apa Artinya Ini?\n`;
    data.definitions.forEach(d => {
      copyText += `- ${d.term}: ${d.meaning}\n`;
    });
    copyText += `\nYang Perlu Ditanyakan ke Dokter:\n`;
    data.questions.forEach(q => {
      copyText += `- ${q}\n`;
    });

    navigator.clipboard.writeText(copyText);
    alert('Penjelasan berhasil disalin ke clipboard!');
  };

  return (
    <div className="glass-card flex-col">
      <div className="mb-6 border-b border-[var(--card-border)] pb-4">
        <h3 className="text-accent mb-2">Section A — Ringkasan Laporan</h3>
        <p>{data.summary}</p>
      </div>

      <div className="mb-6 border-b border-[var(--card-border)] pb-4">
        <h3 className="text-accent mb-2">Section B — Apa Artinya Ini?</h3>
        <ul className="pl-4" style={{ listStyleType: 'disc' }}>
          {data.definitions.map((def, idx) => (
            <li key={idx} className="mb-2">
              <strong className="text-supporting">{def.term}</strong>: {def.meaning}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-accent mb-2">Section C — Yang Perlu Kamu Tanyakan ke Dokter</h3>
        <ul className="pl-4 ml-2" style={{ listStyleType: 'decimal' }}>
          {data.questions.map((q, idx) => (
            <li key={idx} className="mb-1 pl-2">{q}</li>
          ))}
        </ul>
      </div>

      <div className="bg-[#E63946] bg-opacity-10 border border-[#E63946] rounded-lg p-3 text-sm flex gap-2 items-start mt-4 mb-6">
        <AlertCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
        <p className="text-warning opacity-90">
          ⚠️ Penjelasan ini hanya untuk membantu kamu memahami laporan, bukan pengganti diagnosis dokter. Diskusikan hasil ini dengan tenaga medis.
        </p>
      </div>

      <div className="flex gap-4">
        <button className="btn-secondary w-full" onClick={handleCopy}>
          <Copy size={18} />
          Salin Penjelasan
        </button>
        <button className="btn-primary w-full" onClick={onReset}>
          <RefreshCw size={18} />
          Analisa Laporan Lain
        </button>
      </div>
    </div>
  );
};
