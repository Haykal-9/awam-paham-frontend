import React, { useRef, useState } from 'react';
import { Upload, Camera, FileImage } from 'lucide-react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Mohon unggah file format JPG, PNG, atau PDF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 10MB.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="glass-card flex-col items-center">
      <h2 className="text-center mb-6">Foto atau unggah laporan radiologi / lab Anda</h2>
      
      <div 
        className={`upload-zone w-full ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={48} className="text-accent mx-auto mb-4" />
        <p className="mb-2">Tarik & lepas file ke sini</p>
        <p className="text-sm text-supporting opacity-80">atau klik untuk memilih file dari perangkat</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden-input" 
          accept=".jpg,.jpeg,.png,.pdf" 
          onChange={handleFileChange} 
        />
        <input 
          type="file" 
          ref={cameraInputRef} 
          className="hidden-input" 
          accept="image/*" 
          capture="environment" 
          onChange={handleFileChange} 
        />
      </div>

      <div className="flex gap-4 mt-6 w-full">
        <button 
          className="btn-primary w-full"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera size={20} />
          Buka Kamera
        </button>
        <button 
          className="btn-secondary w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileImage size={20} />
          Pilih File
        </button>
      </div>

      <p className="disclaimer-nav text-center mt-6">
        AwamPaham tidak menyimpan data Anda. <br/>
        Penjelasan ini bukan diagnosis medis.
      </p>
    </div>
  );
};
