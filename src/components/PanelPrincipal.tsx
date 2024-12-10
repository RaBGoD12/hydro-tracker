// src/components/PanelPrincipal.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../hooks/userWeather';
import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface Props {
  metaDiaria: number;
}

export default function PanelPrincipal({ metaDiaria }: Props) {
  const [consumoTotal, setConsumoTotal] = useState(
    Number(localStorage.getItem('consumoTotal')) || 0
  );
  const [streak, setStreak] = useState(
    Number(localStorage.getItem('streak')) || 0
  );
  const [lastResetDate, setLastResetDate] = useState(
    localStorage.getItem('lastResetDate') || new Date().toDateString()
  );
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-goal',
      title: '¡Primera Meta!',
      description: 'Alcanzaste tu primera meta diaria',
      unlocked: false
    },
    {
      id: 'streak-3',
      title: 'Constancia',
      description: '3 días seguidos alcanzando tu meta',
      unlocked: false
    },
    {
      id: 'overachiever',
      title: 'Superlogro',
      description: 'Superaste tu meta en un 150%',
      unlocked: false
    }
  ]);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [metaAlcanzada, setMetaAlcanzada] = useState(false);
  const [metaActual, setMetaActual] = useState(metaDiaria * 1000);
  const navigate = useNavigate();
  const { weather, loading: weatherLoading } = useWeather();

  useEffect(() => {
    // Check if it's a new day
    const today = new Date().toDateString();
    if (today !== lastResetDate) {
      if (metaAlcanzada) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }
      resetearConsumo();
      setLastResetDate(today);
    }

    // Save state
    localStorage.setItem('streak', streak.toString());
    localStorage.setItem('lastResetDate', lastResetDate);
  }, [lastResetDate, metaAlcanzada]);

  useEffect(() => {
    localStorage.setItem('consumoTotal', consumoTotal.toString());
    
    // Check if goal is reached
    if (!metaAlcanzada && consumoTotal >= metaActual) {
      setShowSuccess(true);
      setMetaAlcanzada(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    
    // Update current goal if exceeded
    if (consumoTotal > metaActual) {
      const newMeta = Math.ceil(consumoTotal / 1000) * 1000;
      setMetaActual(newMeta);
    }
  }, [consumoTotal, metaActual, metaAlcanzada]);

  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = [...achievements];
      let unlocked = false;

      if (metaAlcanzada && !newAchievements[0].unlocked) {
        newAchievements[0].unlocked = true;
        unlocked = true;
        setShowAchievement(newAchievements[0]);
      }

      if (streak >= 3 && !newAchievements[1].unlocked) {
        newAchievements[1].unlocked = true;
        unlocked = true;
        setShowAchievement(newAchievements[1]);
      }

      if (consumoTotal >= metaActual * 1.5 && !newAchievements[2].unlocked) {
        newAchievements[2].unlocked = true;
        unlocked = true;
        setShowAchievement(newAchievements[2]);
      }

      if (unlocked) {
        setAchievements(newAchievements);
        setTimeout(() => setShowAchievement(null), 3000);
      }
    };

    checkAchievements();
  }, [consumoTotal, streak, metaAlcanzada]);

  const agregarAgua = (cantidad: number) => {
    const now = new Date();
    const hour = now.getHours();
    
    // Bonus for good hydration habits
    let bonusCantidad = cantidad;
    if (hour >= 6 && hour <= 9) { // Morning bonus
      bonusCantidad *= 1.1;
    }
    
    setConsumoTotal(prev => prev + bonusCantidad);
  };

  const resetearConsumo = () => {
    setConsumoTotal(0);
    setMetaAlcanzada(false);
    setMetaActual(metaDiaria * 1000);
  };

  const progreso = (consumoTotal / metaActual) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 space-y-8">
        {/* Achievement Animation */}
        <AnimatePresence>
          {showAchievement && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg"
            >
              <h3 className="font-bold">🏆 {showAchievement.title}</h3>
              <p className="text-sm">{showAchievement.description}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
            >
              <p className="text-center">
                🎉 ¡Felicitaciones! Has alcanzado tu meta diaria
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streak Display */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Panel de Control</h2>
          {streak > 0 && (
            <p className="text-orange-500 mt-2">
              🔥 Racha actual: {streak} {streak === 1 ? 'día' : 'días'}
            </p>
          )}
          <p className="text-gray-600 mt-2">
            {metaAlcanzada 
              ? "¡Meta alcanzada! Sigue así" 
              : "Seguimiento de hidratación diaria"}
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-blue-50/50 rounded-xl p-6">
          <div className="flex justify-between mb-3">
            <span className="font-semibold text-gray-700">Progreso Diario</span>
            <span className={`font-bold ${metaAlcanzada ? 'text-green-600' : 'text-blue-600'}`}>
              {Math.min(100, parseFloat(progreso.toFixed(1)))}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                metaAlcanzada ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, progreso)}%` }}
            />
          </div>
          <div className="mt-3 text-center font-medium text-gray-600">
            {consumoTotal}ml / {metaActual}ml
            {metaAlcanzada && (
              <span className="text-green-600 block text-sm mt-1">
                Meta original: {metaDiaria * 1000}ml
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => agregarAgua(250)}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105"
          >
            <span className="text-xl">💧</span> +250ml
          </button>
          <button
            onClick={() => agregarAgua(500)}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105"
          >
            <span className="text-xl">💧</span> +500ml
          </button>
        </div>

        {/* Weather Info */}
        {weather && !weatherLoading && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>🌡️</span> Clima en {weather.location}
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">Temperatura: {weather.temp.toFixed(1)}°C</p>
              <p className="text-gray-700">Humedad: {weather.humidity}%</p>
              <p className="text-blue-700 font-medium mt-3">{weather.recommendation}</p>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Logros</h3>
          <div className="space-y-2">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`flex items-center gap-2 ${
                  achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <span>{achievement.unlocked ? '🏆' : '🔒'}</span>
                <span>{achievement.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-4">
          <button
            onClick={resetearConsumo}
            className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-200 hover:scale-105"
          >
            Resetear Consumo
          </button>
          <button
            onClick={() => navigate('/configuracion')}
            className="w-full py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 hover:scale-105"
          >
            Ajustar Meta
          </button>
        </div>
      </div>
    </div>
  );
}