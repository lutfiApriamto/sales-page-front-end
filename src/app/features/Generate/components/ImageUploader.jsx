import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../api';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 2 * 1024 * 1024;

const ImageUploader = ({ label, type, value, onChange, disabled }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Format harus JPG, PNG, atau WEBP.');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('Ukuran gambar maksimal 2MB.');
      return;
    }
    setUploading(true);
    try {
      const res = await uploadImage(file, type);
      const url = res?.url;
      if (typeof url === 'string' && /^https?:\/\//.test(url)) {
        onChange(url);
        toast.success('Gambar berhasil diunggah.');
      } else {
        toast.error('URL gambar tidak valid.');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <p className="text-xs font-semibold text-slate-700 mb-1.5">{label}</p>
      {value ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-slate-200">
          <img src={value} alt={label} className="w-full h-full object-contain bg-slate-50" />
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="absolute top-1.5 right-1.5 bg-white/90 rounded-full p-1 shadow hover:bg-white transition-colors"
          >
            <X className="w-3.5 h-3.5 text-slate-700" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs font-medium">Mengunggah...</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-5 h-5" />
              <span className="text-xs font-medium">Pilih gambar (maks 2MB)</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
};

export default ImageUploader;
