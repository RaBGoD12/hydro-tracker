// src/components/ConfiguracionUsuario.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  setMetaDiaria: (meta: number) => void;
}

export default function ConfiguracionUsuario({ setMetaDiaria }: Props) {
  const [meta, setMeta] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metaNumero = Number(meta);
    localStorage.setItem('metaDiaria', meta);
    setMetaDiaria(metaNumero);
    navigate('/panel');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-blue-100 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-blue-500"
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 2L4.5 9.5C3.5 10.5 3 11.8 3 13.2C3 16.9 7 20 12 20C17 20 21 16.9 21 13.2C21 11.8 20.5 10.5 19.5 9.5L12 2Z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Configura tu Meta</h2>
          <p className="text-gray-600">Establece tu objetivo diario de consumo de agua</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Meta diaria de agua (litros)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              placeholder="Ej: 2.5"
            />
            <div className="mt-2 text-sm text-gray-500">
              💡 Se recomienda consumir entre 2 y 3 litros diarios
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transform transition-all duration-200 hover:scale-105"
          >
            Guardar Meta
          </button>
        </form>
      </div>
    </div>
  );
}