import React, { useState, useEffect } from 'react';
// ===== IMPORTS =====
// Import THEMES and DIFFICULTY_LEVELS from constants
// These utility files must be present in their respective paths for the application to compile
import { THEMES, DIFFICULTY_LEVELS } from './utils/constants';

// ===== PAGE COMPONENTS =====
// Import all screen/page components that will be rendered based on app state
import LoginScreen from './pages/LoginScreen';      // First screen - user authentication
import MenuScreen from './pages/MenuScreen';        // Main menu - select game mode and difficulty
import GameScreen from './pages/GameScreen';        // Gameplay screen - where targets appear
import GameOverScreen from './pages/GameOverScreen'; // End game screen - shows final score

// ===== MAIN APP COMPONENT =====
// This is the root component that manages navigation between different screens
// It handles all global state including user, theme, difficulty, and game progress
export default function App() {
  // ===== NAVIGATION STATE =====
  // currentScreen: Tracks which screen to display ('login', 'menu', 'game', 'gameover')
  const [currentScreen, setCurrentScreen] = useState('login');

  // ===== USER STATE =====
  // user: Stores the logged-in username
  const [user, setUser] = useState(null);

  // ===== THEME STATE =====
  // currentThemeId: Stores the current theme ID (e.g., 'default', 'light', 'crimson', 'matrix')
  const [currentThemeId, setCurrentThemeId] = useState('default');
  // showSettings: Boolean to toggle the settings modal visibility
  const [showSettings, setShowSettings] = useState(false);

  // ===== GAME STATE =====
  // gameMode: Stores the selected game mode ('survival' or 'scoreAttack')
  const [gameMode, setGameMode] = useState('survival');
  // difficulty: Stores the selected difficulty level ('easy', 'medium', or 'hard')
  const [difficulty, setDifficulty] = useState('medium');

  // ===== RIVAL STATE =====
  // rival: Object containing rival information (name, avatar, score to beat)
  // Used for displaying competitive element on menu and game over screens
  const [rival, setRival] = useState(null);

  // ===== SCORE STATE =====
  // lastScore: Stores the score from the most recent game for displaying on game over screen
  const [lastScore, setLastScore] = useState(0);

  // Get the current theme object from THEMES constant
  const theme = THEMES[currentThemeId];

  // ===== INITIALIZATION AND DATA PERSISTENCE EFFECTS =====
  // This effect runs once when the component mounts
  // It loads saved data from localStorage and initializes the app state
  useEffect(() => {
    // 1. LOAD USER DATA
    // Check if a user was previously logged in and stored in localStorage
    // If yes, load the username and navigate directly to menu screen
    const savedUser = localStorage.getItem('aimTrainer_currentUser');
    if (savedUser) {
        setUser(savedUser);
        setCurrentScreen('menu'); 
    }

    // 2. LOAD THEME PREFERENCE
    // Check if user previously selected a theme and stored it in localStorage
    // If yes and it's a valid theme, load it
    const savedTheme = localStorage.getItem('aimTrainer_theme');
    if (savedTheme && THEMES[savedTheme]) {
        setCurrentThemeId(savedTheme);
    }

    // 3. LOAD DIFFICULTY PREFERENCE
    // Check if user previously selected a difficulty and stored it in localStorage
    // If yes and it's a valid difficulty, load it
    const savedDifficulty = localStorage.getItem('aimTrainer_difficulty');
    if (savedDifficulty && DIFFICULTY_LEVELS[savedDifficulty]) {
        setDifficulty(savedDifficulty);
    }
    
    // 4. FETCH INITIAL RIVAL
    // Fetch a random rival to display on the menu screen
    fetchRival();
  }, []);

  // ===== DIFFICULTY SYNC EFFECT =====
  // This effect runs whenever the difficulty state changes
  // It saves the selected difficulty to localStorage so it persists across sessions
  useEffect(() => {
      localStorage.setItem('aimTrainer_difficulty', difficulty);
  }, [difficulty]);

  // ===== RIVAL FETCHING FUNCTION =====
  // Fetches a random user from the Random User API to serve as a "rival"
  // The rival displays their username and a random score to beat
  // This creates a competitive element in the game
  const fetchRival = async () => {
    try {
      // Fetch random user data from external API
      // Requesting only login and name fields to minimize data transfer
      const res = await fetch('https://randomuser.me/api/?inc=login,name&noinfo');
      const data = await res.json();
      const result = data.results[0];
      const username = result.login.username;
      
      // Generate a unique avatar URL for the rival using robohash service
      // Using set=set2 for monster-style avatars
      const monsterAvatar = `https://robohash.org/${username}.png?set=set2&size=100x100`;
      
      // Generate a random score between 60-500 for the rival to beat (more reasonable range)
      const minScore = 60;
      const maxScore = 500;
      const randomScore = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;

      // Update rival state with fetched data
      setRival({
        name: username,                                      // Rival's username
        realName: `${result.name.first} ${result.name.last}`, // Rival's real name
        avatar: monsterAvatar,                               // Rival's avatar image URL
        scoreToBeat: randomScore                             // Score to challenge player
      });
    } catch (err) {
      // If API fails, use fallback rival data
      // This ensures the app continues to function even without internet
      setRival({
        name: "Glitch_Entity",
        avatar: `https://robohash.org/glitch.png?set=set2&size=100x100`,
        scoreToBeat: 1000
      });
    }
  };

  // ===== EVENT HANDLERS =====

  // ===== LOGIN HANDLER =====
  // Called when user successfully logs in
  // Saves username to localStorage and navigates to menu screen
  const handleLoginSuccess = (username) => {
    setUser(username);                                              // Update user state
    localStorage.setItem('aimTrainer_currentUser', username);      // Persist to localStorage
    setCurrentScreen('menu');                                       // Navigate to menu
  };

  // ===== LOGOUT HANDLER =====
  // Called when user clicks logout button
  // Clears user data and returns to login screen
  const handleLogout = () => {
      setUser(null);                                                // Clear user state
      localStorage.removeItem('aimTrainer_currentUser');           // Remove from localStorage
      setCurrentScreen('login');                                    // Navigate to login
  };

  // ===== THEME CHANGE HANDLER =====
  // Called when user selects a new theme
  // Updates theme state and saves preference to localStorage
  const changeTheme = (themeId) => {
      setCurrentThemeId(themeId);                                  // Update current theme
      localStorage.setItem('aimTrainer_theme', themeId);           // Persist to localStorage
  };

  // ===== START GAME HANDLER =====
  // Called when user selects a game mode (survival or score attack)
  // Sets the game mode and navigates to game screen
  const startGame = (mode) => {
      setGameMode(mode);                                           // Store selected game mode
      setCurrentScreen('game');                                    // Navigate to game screen
  };

  // ===== GAME OVER HANDLER =====
  // Called when a game ends (either lives reach 0 or timer expires)
  // Handles score saving and displays game over screen
  const handleGameOver = (finalScore) => {
      setLastScore(finalScore);                                    // Store final score for display
      
      // ===== SAVE SCORE LOGIC =====
      // Only save if user is logged in
      if (user) {
        // Load existing score data from localStorage
        // Format: { username: { survival: highScore, scoreAttack: highScore } }
        const data = JSON.parse(localStorage.getItem('aimTrainer_data') || '{}');
        
        // Initialize user entry if it doesn't exist
        if (!data[user]) data[user] = { survival: 0, scoreAttack: 0 };

        // Get user's current best score for this game mode
        const currentBest = data[user][gameMode] || 0;
        
        // Only update if new score is better than previous personal best
        if (finalScore > currentBest) {
            data[user][gameMode] = finalScore;                     // Update with new high score
            localStorage.setItem('aimTrainer_data', JSON.stringify(data)); // Save to localStorage
        }
      }
      
      setCurrentScreen('gameover');                                // Navigate to game over screen
  };

  // ===== RENDER LOGIC =====
  // The main app container with full-screen layout
  // Changes background based on current theme
  // Contains conditional rendering for each screen
  return (
    <div className={`w-full h-screen ${theme.appBg} font-sans overflow-hidden transition-colors duration-500`}>
      
      {/* ===== LOGIN SCREEN ===== */}
      {/* Displays when user is not logged in */}
      {/* Allows user to register new account or login to existing account */}
      {currentScreen === 'login' && (
        <LoginScreen 
            theme={theme} 
            onLoginSuccess={handleLoginSuccess} 
        />
      )}
      
      {/* ===== MENU SCREEN ===== */}
      {/* Displays after successful login */}
      {/* Shows user profile, difficulty selector, rival info, and game mode options */}
      {currentScreen === 'menu' && (
        <MenuScreen 
            theme={theme}
            user={user}                         // Current logged-in user
            rival={rival}                       // Rival data for competitive display
            onStartGame={startGame}             // Callback when game mode is selected
            onLogout={handleLogout}             // Callback when logout is clicked
            fetchRival={fetchRival}             // Function to fetch new rival
            showSettings={showSettings}         // Boolean to show/hide settings modal
            setShowSettings={setShowSettings}   // Function to toggle settings modal
            currentThemeId={currentThemeId}     // Current selected theme
            changeTheme={changeTheme}           // Function to change theme
            difficulty={difficulty}            // Current selected difficulty
            setDifficulty={setDifficulty}       // Function to change difficulty
        />
      )}
      
      {/* ===== GAME SCREEN ===== */}
      {/* Displays during active gameplay */}
      {/* Contains HUD and game area where targets appear */}
      {currentScreen === 'game' && (
        <GameScreen 
            theme={theme}
            gameMode={gameMode}                 // Current game mode (survival or scoreAttack)
            difficulty={difficulty}            // Current difficulty level
            onGameOver={handleGameOver}         // Callback when game ends
            onQuit={() => { setCurrentScreen('menu'); }} // Callback to return to menu
        />
      )}
      
      {/* ===== GAME OVER SCREEN ===== */}
      {/* Displays after game ends */}
      {/* Shows final score, high score, and rival comparison */}
      {currentScreen === 'gameover' && (
        <GameOverScreen 
            theme={theme}
            score={lastScore}                   // Final score from last game
            gameMode={gameMode}                 // Game mode that was just played
            user={user}                         // Current user for score lookup
            rival={rival}                       // Rival for score comparison
            onMenu={() => setCurrentScreen('menu')}      // Navigate back to menu
            onRetry={() => startGame(gameMode)}         // Retry same game mode
        />
      )}

      {/* ===== GLOBAL STYLES ===== */}
      {/* Fade-in animation used across all screens for smooth transitions */}
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}