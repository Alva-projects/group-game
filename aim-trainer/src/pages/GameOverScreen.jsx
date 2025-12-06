import React, { useEffect, useState } from "react";
// ===== ICON IMPORTS =====
import { Trophy, Skull } from "lucide-react";

// ===== GAME OVER SCREEN COMPONENT =====
// Displays after a game ends (either from losing all lives or timer expiring)
// Shows final score, best score, and rival comparison
// Provides options to return to menu or retry the same game mode
const GameOverScreen = ({
  theme,          // Current theme object for styling
  score,          // Final score from the just-completed game
  gameMode,       // Game mode that was just played ('survival' or 'scoreAttack')
  user,           // Currently logged-in username
  rival,          // Rival object for score comparison
  onMenu,         // Callback when menu button is clicked
  onRetry,        // Callback when retry button is clicked
}) => {
  // ===== BEST SCORE STATE =====
  // Stores this user's personal best score for the current game mode
  const [bestScore, setBestScore] = useState(0);

  // ===== LOAD BEST SCORE EFFECT =====
  // Runs once when component mounts
  // Loads user's best score for the current game mode from localStorage
  useEffect(() => {
    if (!user) return;  // Don't load if no user is logged in
    
    // Load score data from localStorage
    // Format: { username: { survival: score, scoreAttack: score } }
    const data = JSON.parse(localStorage.getItem("aimTrainer_data") || "{}");
    // Get this user's best score for the current mode, default to 0
    const userBest = data[user]?.[gameMode] || 0;
    setBestScore(userBest);
  }, [user, gameMode]);

  // ===== CALCULATED FLAGS =====
  // isNewHigh: True if current score is >= best score AND score is greater than 0
  // Used to show "New High Score!" banner
  const isNewHigh = score >= bestScore && score > 0;
  
  // beatRival: True if current score beats the rival's score
  // Used to show rival comparison and adjust styling
  const beatRival = rival && score > rival.scoreToBeat;

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in bg-black/60 backdrop-blur-sm z-50 p-4">
      {/* ===== MAIN GAME OVER PANEL ===== */}
      <div
        className={`${theme.panelBg} p-8 rounded-2xl shadow-2xl border ${theme.panelBorder} max-w-md w-full text-center relative overflow-hidden`}
      >
        
        {/* ===== NEW HIGH SCORE BANNER ===== */}
        {/* Only shows if player achieved a new personal best */}
        {isNewHigh && (
          <div className="absolute top-0 inset-x-0 bg-yellow-500 text-slate-900 font-bold text-xs py-1 uppercase tracking-widest animate-pulse">
            New High Score!
          </div>
        )}

        {/* ===== HEADER ===== */}
        <div className="mb-6 mt-4">
          <h2 className={`text-4xl font-black ${theme.textMain} mb-1`}>
            GAME OVER
          </h2>
          {/* Display which game mode was just played */}
          <p className={`${theme.textSec} uppercase tracking-widest text-sm`}>
            {gameMode} Mode
          </p>
        </div>

        {/* ===== SCORE DISPLAY PANEL ===== */}
        {/* Shows current score and best score */}
        <div
          className={`${theme.inputBg} rounded-xl p-6 mb-6 border ${theme.panelBorder}`}
        >
          {/* Current Score */}
          <div className="flex justify-between items-end mb-2">
            <span className={`${theme.textSec} font-bold`}>Score</span>
            <span className={`text-4xl font-mono ${theme.accentText}`}>
              {score}
            </span>
          </div>
          
          {/* Best Score Divider */}
          <div
            className={`flex justify-between items-end border-t ${theme.panelBorder} pt-2`}
          >
            <span className={`${theme.textSec} text-sm`}>Best</span>
            {/* Show the highest score between current and best */}
            <span className={`font-mono ${theme.textSec}`}>
              {Math.max(score, bestScore)}
            </span>
          </div>
        </div>

        {/* ===== RIVAL COMPARISON PANEL ===== */}
        {/* Shows if player beat rival or failed to beat rival */}
        {/* Only renders if rival data exists */}
        {rival && (
          <div
            className={`mb-8 border rounded-lg p-3 flex items-center gap-3 ${
              beatRival
                ? "bg-green-500/10 border-green-500/30"  // Green styling if beat rival
                : "bg-red-500/10 border-red-500/30"      // Red styling if didn't beat rival
            }`}
          >
            {/* Rival Avatar with Badge */}
            <div className="relative">
              <img
                src={rival.avatar}
                className={`w-10 h-10 rounded-full opacity-75 ${theme.inputBg}`}
              />
              
              {/* Badge icon - Trophy if beat rival, Skull if didn't */}
              {beatRival ? (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                  <Trophy size={10} className="text-slate-900" />
                </div>
              ) : (
                <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5">
                  <Skull size={10} className="text-white" />
                </div>
              )}
            </div>
            
            {/* Rival Comparison Text */}
            <div className="text-left flex-1">
              {/* Status text - changes based on if player beat rival */}
              <p
                className={`text-xs font-bold uppercase ${
                  beatRival ? "text-green-500" : "text-red-500"
                }`}
              >
                {beatRival ? "Target Neutralized" : "Mission Failed"}
              </p>
              {/* Comparison details */}
              <p className={`${theme.textSec} text-xs`}>
                {beatRival
                  ? `You surpassed ${rival.name}'s ${rival.scoreToBeat} pts.`
                  : `Failed to beat ${rival.name} (${rival.scoreToBeat}).`}
              </p>
            </div>
          </div>
        )}

        {/* ===== ACTION BUTTONS ===== */}
        {/* Menu button and Retry button */}
        <div className="flex gap-4">
          {/* MENU BUTTON - Returns to main menu */}
          <button
            onClick={onMenu}
            className={`flex-1 ${theme.inputBg} ${theme.accentBgHover} ${theme.textMain} border ${theme.panelBorder} font-bold py-3 rounded-lg transition-colors cursor-pointer`}
          >
            MENU
          </button>
          
          {/* RETRY BUTTON - Starts same game mode again with same difficulty */}
          <button
            onClick={onRetry}
            className={`flex-1 ${theme.accentBg} ${theme.accentBgHover} text-white font-bold py-3 rounded-lg transition-transform active:scale-95 cursor-pointer`}
          >
            RETRY
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
