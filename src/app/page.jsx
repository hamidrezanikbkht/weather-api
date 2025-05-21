'use client'
import React, { useEffect, useState } from 'react'

export default function ClimaLux() {
  const [datafetch, setDatafetch] = useState(null)
  const [input, setInput] = useState('')
  const [city, setCity] = useState('تهران')
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [darkMode, setDarkMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [favoriteCity, setFavoriteCity] = useState(() => localStorage.getItem('favoriteCity') || '')

  const token = '908907:680a3be23f7a8'

  useEffect(() => {
    if (!city) return

    const fetchWeatherData = async () => {
      setError(null)
      setDatafetch(null)
      setLoading(true)
      try {
        const response = await fetch(
          `https://one-api.ir/weather/?token=${token}&action=current&city=${encodeURIComponent(city)}`
        )
        if (!response.ok) {
          throw new Error('شهر مورد نظر پیدا نشد')
        }
        const data = await response.json()
        if (data.result && data.result.weather) {
          setDatafetch(data)
          setLastUpdated(new Date())
        } else {
          throw new Error('اطلاعات هواشناسی موجود نیست')
        }
      } catch (err) {
        setError(err.message)
        setDatafetch(null)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [city])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // ذخیره شهر مورد علاقه در localStorage
  const saveFavoriteCity = () => {
    if (!city) return
    localStorage.setItem('favoriteCity', city)
    setFavoriteCity(city)
  }

  const handleSearch = () => {
    if (!input.trim() || loading) return
    setCity(input.trim())
  }

  const resetSearch = () => {
    setInput('')
    setError(null)
    setCity('تهران')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') setInput('')
  }

  return (
    <div
      className={`min-h-screen px-6 py-10 flex flex-col items-center font-sans relative overflow-hidden transition-colors duration-700
      ${darkMode ? 'bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364] text-white' : 'bg-gradient-to-b from-[#e0f7fa] via-[#b2ebf2] to-[#80deea] text-gray-900'}`}
    >
      <div
  className="
    absolute top-8 left-8
    bg-gradient-to-r from-purple-400 via-pink-500 to-red-500
    bg-clip-text text-transparent
    font-extrabold text-3xl italic
    drop-shadow-[0_2px_10px_rgba(255,0,128,0.7)]
    select-none
    animate-gradient-x
  "
  style={{
    backgroundSize: '200% 200%',
  }}
>
  Hamid Reza Nikbakht
</div>


      {/* دکمه تغییر تم */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-8 right-8 px-5 py-2 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition-transform duration-300 z-20"
        aria-label="تغییر حالت تاریک و روشن"
      >
        {darkMode ? 'حالت روشن' : 'حالت تاریک'}
      </button>

      {/* بکگراند ذرات */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          viewBox="0 0 800 600"
        >
          <circle cx="100" cy="100" r="60" stroke="white" strokeOpacity={darkMode ? '0.1' : '0.2'} />
          <circle cx="700" cy="400" r="90" stroke="white" strokeOpacity={darkMode ? '0.07' : '0.15'} />
          <circle cx="400" cy="300" r="120" stroke="white" strokeOpacity={darkMode ? '0.05' : '0.1'} />
        </svg>
      </div>

      <h1
        className={`text-7xl font-extrabold tracking-tight mb-12 drop-shadow-[0_5px_15px_rgba(132,251,176,0.8)] ${
          darkMode
            ? 'bg-gradient-to-r from-[#84fab0] to-[#8fd3f4] text-transparent bg-clip-text'
            : 'bg-gradient-to-r from-[#0575E6] to-[#00F260] text-transparent bg-clip-text'
        }`}
      >
        ClimaLux ☁️
      </h1>

      <div className="flex gap-4 w-full max-w-xl mb-12">
        <input
          type="text"
          placeholder="مثلاً مشهد..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 px-6 py-4 rounded-3xl backdrop-blur-md shadow-inner focus:outline-none focus:ring-4 transition duration-300
          ${
            darkMode
              ? 'bg-[#1f1f1f] text-white focus:ring-[#84fab0]/70'
              : 'bg-white text-gray-900 focus:ring-[#00c9ff]/70'
          }`}
          disabled={loading}
          aria-label="ورودی نام شهر"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !input.trim()}
          className={`px-8 py-4 rounded-3xl text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-tr from-[#84fab0] to-[#8fd3f4]'
          }`}
          aria-label="دکمه جستجوی شهر"
        >
          {loading ? 'در حال جستجو...' : 'جستجو'}
        </button>
        <button
          onClick={resetSearch}
          className="px-6 py-4 bg-red-500 rounded-3xl text-white font-semibold shadow-md hover:bg-red-600 transition-colors"
          title="پاک کردن"
          aria-label="دکمه پاک کردن ورودی"
        >
          ریست
        </button>
      </div>

      

      {error && (
        <div
          className="max-w-xl w-full bg-red-600/80 rounded-xl p-4 mb-10 text-center font-semibold shadow-lg animate-fade-in"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {datafetch && !error && (
        <div
          className={`w-full max-w-3xl p-12 space-y-10 rounded-3xl shadow-2xl backdrop-blur-xl border ${
            darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white/80 border-gray-300 text-gray-900'
          } animate-fade-in-slow`}
          aria-live="polite"
        >
          <div className="text-center space-y-3">
            <h2 className="text-5xl font-extrabold">{city}</h2>
            <p className="text-lg text-gray-300 dark:text-gray-200">{datafetch.result.weather[0].description}</p>
            <p className="text-xs text-gray-400 dark:text-gray-300">
              بروزرسانی: {lastUpdated?.toLocaleTimeString('fa-IR')} - {lastUpdated?.toLocaleDateString('fa-IR')}
            </p>
           
          </div>

          <div className="flex justify-center">
            <img
              src={`https://openweathermap.org/img/wn/${datafetch.result.weather[0].icon}@4x.png`}
              alt={datafetch.result.weather[0].description}
              className="w-32 h-32 drop-shadow-[0_10px_15px_rgba(255,255,255,0.5)]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-center">
            {[
              { label: 'دما', value: `${datafetch.result.main.temp}°C` },
              { label: 'احساس', value: `${datafetch.result.main.feels_like}°C` },
              { label: 'رطوبت', value: `${datafetch.result.main.humidity}%` },
              { label: 'باد', value: `${datafetch.result.wind.speed} m/s` },
              { label: 'پوشش ابر', value: `${datafetch.result.clouds.all}%` },
              { label: 'فشار هوا', value: `${datafetch.result.main.pressure} hPa` },
              { label: 'طلوع خورشید', value: new Date(datafetch.result.sys.sunrise * 1000).toLocaleTimeString('fa-IR') },
              { label: 'غروب خورشید', value: new Date(datafetch.result.sys.sunset * 1000).toLocaleTimeString('fa-IR') },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 rounded-xl bg-white/20 dark:bg-black/20 shadow-lg">
                <h3 className="text-lg font-semibold mb-1">{label}</h3>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* انیمیشن بارگذاری */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
