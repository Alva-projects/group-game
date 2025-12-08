import React from 'react';
// ===== ICON IMPORTS =====
// Icons from lucide-react for visual UI elements
import { Heart, Clock, Settings, ShieldAlert, Skull, Gauge } from 'lucide-react';
// Settings modal component for theme selection
import SettingsModal from '../components/SettingsModal';
// Import difficulty level configurations
import { DIFFICULTY_LEVELS } from '../utils/constants';

// ===== MENU SCREEN COMPONENT =====
// This is the main hub after login
// Displays: user profile, difficulty selector, rival info, and game mode selection buttons
// Users select difficulty and game mode here before starting a game
const MenuScreen = ({ 
    theme,                    // Current theme object for styling
    user,                     // Currently logged-in username
    rival,                    // Rival object with name, avatar, and score to beat
    onStartGame,              // Callback function when game mode is selected
    onLogout,                 // Callback function when logout is clicked
    fetchRival,               // Function to fetch a new random rival
    showSettings,             // Boolean controlling settings modal visibility
    setShowSettings,          // Function to toggle settings modal
    currentThemeId,           // ID of currently selected theme
    changeTheme,              // Function to change the current theme
    difficulty,               // Currently selected difficulty level
    setDifficulty             // Function to change difficulty level
}) => {
    // ===== LOAD USER SCORE DATA =====
    // Load user's score history from localStorage
    // Format: { username: { survival: bestScore, scoreAttack: bestScore } }
    // Default to empty object if no data exists
    const data = JSON.parse(localStorage.getItem('aimTrainer_data') || '{}');
    // Get this specific user's data, default to empty object if user has no scores yet
    const userData = data[user] || {};
    // Determine whether to use the theme accent for mode titles/icons.
    // Per UX request: do NOT apply accent coloring for the Stealth Ops (default) and Clean Lab (light) themes;
    // Instead, use explicit colors for those two themes so the modes match their usual colors:
    // - Survival: `text-red-400`
    // - Score Attack: `text-blue-600`
    // For all other themes continue to use `theme.accentText`.
    const useAccentForModes = !(theme?.id === 'default' || theme?.id === 'light');
    const survivalTitleClass = useAccentForModes ? theme.accentText : 'text-red-400';
    const scoreAttackTitleClass = useAccentForModes ? theme.accentText : 'text-blue-600';

    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in p-8 relative">
           
           {/* ===== SETTINGS MODAL ===== */}
           {/* Conditionally renders settings modal overlay */}
           {/* Contains theme selection options */}
           {showSettings && (
               <SettingsModal 
                   theme={theme} 
                   setShowSettings={setShowSettings}    // Close settings when theme selected
                   currentThemeId={currentThemeId} 
                   changeTheme={changeTheme} 
               />
           )}
           
           {/* ===== HEADER AREA ===== */}
           {/* Displays user profile info and settings button */}
           <div className="w-full max-w-2xl flex items-center justify-between mb-4">
               {/* LEFT SIDE: User Avatar and Name */}
               <div className="flex items-center gap-4">
                   {/* User Avatar */}
                   {/* Generated from robohash service using username */}
                   {/* set=set1 gives character-style avatars */}
                   <img 
                      src={`https://robohash.org/${user}.png?set=set1&size=100x100`} 
                      alt="Player Avatar" 
                      className={`w-16 h-16 ${theme.panelBg} rounded-full border-2 ${theme.accentBorder}`}
                   />
                   <div className="text-left">
                      <p className={`${theme.textSec} text-xs uppercase font-bold`}>Welcome Back</p>
                      {/* Display username */}
                      <h2 className={`text-3xl font-bold ${theme.textMain} tracking-tight`}>{user}</h2>
                   </div>
               </div>
               
               {/* RIGHT SIDE: Settings Button */}
               {/* Opens settings modal to change theme */}
               <button 
                  onClick={() => setShowSettings(true)}
                        className={`p-3 rounded-full ${theme.panelBg} border ${theme.panelBorder} ${theme.textSec} hover:${theme.textMain} transition-colors cursor-pointer ${theme.accentBgHover}`}
                  title="Open Settings"
               >
                   <Settings size={24} />
               </button>
           </div>

           {/* ===== DIFFICULTY SELECTOR ===== */}
           {/* Panel showing all available difficulty levels */}
           {/* User must select a difficulty before starting a game */}
           <div className={`w-full max-w-2xl ${theme.panelBg} border ${theme.panelBorder} rounded-xl p-4 shadow-lg transition-colors duration-500`}>
              <h3 className={`text-lg font-bold ${theme.textMain} mb-3 flex items-center gap-2`}>
                <Gauge size={20} /> Difficulty Level
              </h3>
              
              {/* Grid of 3 difficulty buttons (Easy, Medium, Hard) */}
              <div className="grid grid-cols-3 gap-3">
                  {/* Map through all difficulty levels from constants */}
                  {Object.values(DIFFICULTY_LEVELS).map((level) => (
                      <button
                          key={level.id}
                          onClick={() => setDifficulty(level.id)}  // Update selected difficulty
                          className={`
                              p-3 rounded-lg text-left transition-all duration-300
                              ${theme.inputBg} border ${theme.panelBorder}
                              ${difficulty === level.id 
                                  ? `${theme.accentBg}/20 ${level.color} border-2 ${theme.accentBorder} shadow-lg`  // Styling when selected
                                  : `${theme.panelBg}/70 ${theme.textSec} ${theme.accentBgHover}`  // Styling when not selected (theme-aware hover)
                              }
                              cursor-pointer
                          `}
                      >
                          {/* Difficulty name in level-specific color */}
                          <p className={`font-bold text-sm ${level.color}`}>{level.label}</p>
                          {/* Difficulty description */}
                          <p className="text-xs mt-1 text-slate-500">{level.desc}</p>
                      </button>
                  ))}
              </div>
           </div>

           {/* ===== RIVAL DISPLAY ===== */}
           {/* Shows the current "rival" - a random user with a score to beat */}
           {/* Only renders if rival data exists */}
           {rival && (
              <div className={`w-full max-w-2xl ${theme.panelBg}/50 border ${theme.panelBorder} rounded-lg p-4 flex items-center justify-between shadow-lg relative overflow-hidden transition-colors duration-500`}>
                  {/* Red accent bar on left side */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                  
                  {/* LEFT SIDE: Rival Avatar and Info */}
                  <div className="flex items-center gap-4">
                      <div className="relative">
                          {/* Rival's avatar image */}
                          {rival.avatar ? (
                              <img src={rival.avatar} alt="Rival" className={`w-12 h-12 rounded-full border border-red-500 ${theme.inputBg}`} />
                          ) : (
                              /* Fallback if no avatar available */
                              <div className="w-12 h-12 rounded-full bg-red-900 flex items-center justify-center border border-red-500">
                                <Skull size={20} />
                              </div>
                          )}
                          {/* "RIVAL" badge */}
                          <div className="absolute -bottom-1 -right-1 bg-red-600 text-[10px] px-1 rounded text-white font-bold">RIVAL</div>
                      </div>
                      <div>
                          <p className="text-red-400 text-xs font-bold uppercase tracking-wider">Target To Beat</p>
                          {/* Rival's username */}
                          <p className={`${theme.textMain} font-mono`}>{rival.name}</p>
                      </div>
                  </div>
                  
                  {/* RIGHT SIDE: Score to Beat */}
                  <div className="text-right">
                      <p className={`${theme.textSec} text-xs uppercase`}>Bounty Score</p>
                      {/* Score player needs to beat rival */}
                      <p className="text-2xl font-mono text-red-500">{rival.scoreToBeat}</p>
                  </div>
              </div>
          )}

           {/* ===== GAME MODE SELECTION BUTTONS ===== */}
           {/* Two buttons for game modes: SURVIVAL and SCORE ATTACK */}
           {/* User clicks one to start the game with selected difficulty */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              
              {/* ===== SURVIVAL MODE BUTTON ===== */}
              <button 
                  onClick={() => onStartGame('survival')}
                  className={`group ${theme.panelBg} p-6 rounded-xl border ${theme.panelBorder} hover:shadow-lg transition-all text-left relative overflow-hidden cursor-pointer ${theme.accentBgHover} hover:${theme.accentText}`}
              >
                  {/* Background icon (large, faded) - uses theme accent so it updates with selected theme */}
                                                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                                                        <Heart size={100} className={survivalTitleClass} />
                                                                        </div>
                                                                        {/* Mode Title - uses theme accent for most themes, but explicit red/blue for the two named themes */}
                                                                        <h3 className={`text-2xl font-bold ${survivalTitleClass} mb-2 flex items-center gap-2`}>
                                                                                <Heart className={survivalTitleClass} /> SURVIVAL
                                                                        </h3>
                  {/* Mode Description */}
                  <p className={`${theme.textSec} text-sm mb-4`}>Lose lives on miss. Difficulty scales gradually.</p>
                  {/* Display Personal Best (PB) for this mode */}
                  <div className={`text-xs ${theme.inputBg} inline-block px-3 py-1 rounded ${theme.textSec} border ${theme.panelBorder}`}>
                      PB: {userData.survival || 0}
                  </div>
              </button>

              {/* ===== SCORE ATTACK MODE BUTTON ===== */}
              <button 
                  onClick={() => onStartGame('scoreAttack')}
                  className={`group ${theme.panelBg} p-6 rounded-xl border ${theme.panelBorder} hover:${theme.accentBorder} hover:shadow-lg transition-all text-left relative overflow-hidden cursor-pointer ${theme.accentBgHover} hover:${theme.accentText}`}
              >
                  {/* Background icon (large, faded) */}
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Clock size={100} className={scoreAttackTitleClass} />
                                    </div>
                                    {/* Mode Title - uses theme accent for most themes, but explicit red/blue for the two named themes */}
                                    <h3 className={`text-2xl font-bold ${scoreAttackTitleClass} mb-2 flex items-center gap-2`}>
                                        <Clock className={scoreAttackTitleClass} /> SCORE ATTACK
                                    </h3>
                  {/* Mode Description */}
                  <p className={`${theme.textSec} text-sm mb-4`}>60 Seconds. Infinite lives. Pure speed test.</p>
                  {/* Display Personal Best (PB) for this mode */}
                  <div className={`text-xs ${theme.inputBg} inline-block px-3 py-1 rounded ${theme.textSec} border ${theme.panelBorder}`}>
                      PB: {userData.scoreAttack || 0}
                  </div>
              </button>
           </div>
           
           {/* ===== FOOTER BUTTONS ===== */}
           {/* Find New Rival and Logout buttons */}
           <div className="flex gap-4">
              {/* Find New Rival Button */}
              {/* Fetches a random new rival to compete against */}
              <button onClick={fetchRival} className={`text-xs ${theme.textSec} hover:text-red-400 flex items-center gap-1 cursor-pointer ${theme.accentBgHover}`}>
                  <ShieldAlert size={12} /> Find New Rival
              </button>
              {/* Logout Button */}
              {/* Returns user to login screen */}
              <button onClick={onLogout} className={`text-xs ${theme.textSec} hover:${theme.textMain} cursor-pointer ${theme.accentBgHover}`}>
                  Logout
              </button>
           </div>
      </div>
    );
};

export default MenuScreen;