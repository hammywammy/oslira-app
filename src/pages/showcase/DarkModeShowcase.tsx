/**
 * @file Dark Mode Showcase
 * @description Complete dark/light mode demo with smooth transitions
 */

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function DarkModeShowcase() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const stats = [
    { icon: 'mdi:trending-up', label: 'Revenue', value: '$127.5K', change: '+12.5%' },
    { icon: 'mdi:account', label: 'Active Users', value: '2,847', change: '+8.2%' },
    { icon: 'mdi:lightning-bolt', label: 'Conversions', value: '94.3%', change: '+2.1%' },
    { icon: 'mdi:shield-check', label: 'Security Score', value: '98/100', change: '+5' },
  ];

  const activities = [
    { icon: 'mdi:email', text: 'New message from Sarah Chen', time: '2m ago' },
    { icon: 'mdi:heart', text: 'John liked your post', time: '15m ago' },
    { icon: 'mdi:star', text: 'You earned a new achievement', time: '1h ago' },
    { icon: 'mdi:bell', text: 'System update completed', time: '3h ago' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
          theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'
        }`} style={{ animationDuration: '4s' }} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
          theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
        }`} style={{ animationDuration: '6s' }} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              OSLIRA
            </div>
            <nav className="hidden md:flex gap-1">
              {['Dashboard', 'Analytics', 'Settings'].map(item => (
                <button
                  key={item}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-gray-100 border border-gray-200'
            }`}>
              <Icon icon="mdi:magnify" className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              <input
                type="text"
                placeholder="Search..."
                className={`bg-transparent border-none outline-none w-32 sm:w-48 ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Notifications */}
            <button className={`relative p-2 rounded-xl transition-all duration-300 ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Icon icon="mdi:bell" className="text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`relative p-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-900 text-yellow-300 hover:bg-gray-800'
              }`}
            >
              <div className="relative w-6 h-6">
                <Icon 
                  icon="mdi:white-balance-sunny"
                  className={`absolute inset-0 transition-all duration-500 text-2xl ${
                    theme === 'light' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                  }`}
                />
                <Icon 
                  icon="mdi:moon-waning-crescent"
                  className={`absolute inset-0 transition-all duration-500 text-2xl ${
                    theme === 'dark' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`}
                />
              </div>
            </button>

            {/* Profile */}
            <button className={`p-2 rounded-xl transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}>
              <Icon icon="mdi:account" className="text-xl text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        
        {/* Hero Section */}
        <div className={`mb-8 p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-white/50 border-gray-200 shadow-xl'
        }`}>
          <h1 className={`text-4xl md:text-5xl font-black mb-4 transition-colors duration-500 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back, Sarah 👋
          </h1>
          <p className={`text-lg transition-colors duration-500 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50'
                  : 'bg-white/50 border-gray-200 hover:border-blue-400/50 shadow-lg hover:shadow-xl'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
                }`}>
                  <Icon icon={stat.icon} className={`text-2xl ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <span className="text-sm font-semibold text-green-500">{stat.change}</span>
              </div>
              <div className={`text-3xl font-bold mb-1 transition-colors duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-sm transition-colors duration-500 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Activity Feed */}
          <div className={`lg:col-span-2 p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white/50 border-gray-200 shadow-xl'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700/50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <Icon icon={activity.icon} className={`text-xl ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium mb-1 transition-colors duration-500 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {activity.text}
                    </p>
                    <p className={`text-sm transition-colors duration-500 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white/50 border-gray-200 shadow-xl'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Quick Actions
            </h2>
            <div className="space-y-3">
              {[
                { icon: 'mdi:email', label: 'Send Message', color: 'blue' },
                { icon: 'mdi:cog', label: 'Settings', color: 'purple' },
                { icon: 'mdi:star', label: 'Favorites', color: 'yellow' },
                { icon: 'mdi:bell', label: 'Notifications', color: 'red' },
              ].map((action, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 hover:bg-gray-700 text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-${action.color}-500/20`}>
                    <Icon icon={action.icon} className={`text-xl text-${action.color}-500`} />
                  </div>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className={`mt-8 p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/20'
            : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-xl'
        }`}>
          <div className="text-center">
            <h2 className={`text-3xl font-black mb-4 transition-colors duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Smooth Dark Mode Transitions ✨
            </h2>
            <p className={`text-lg mb-6 transition-colors duration-500 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Every element transitions smoothly between themes with CSS variables and Tailwind
            </p>
            <button
              onClick={toggleTheme}
              className={`px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 transform ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              }`}
            >
              Toggle Theme
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
