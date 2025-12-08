import React, { useState, useEffect } from 'react';
import { Heart, Clock, Pause } from 'lucide-react';
import { DIFFICULTY_LEVELS, TIME_ATTACK_DURATION } from '../utils/constants';

const GameScreen = ({ 
    theme, 
    gameMode,
    difficulty,
    onGameOver,
    onQuit
}) => {
    // ===== DIFFICULTY SETTINGS =====
    // The difficulty parameter contains settings that affect gameplay balance
    // difficultySettings is used to configure game mechanics based on selected difficulty level
    // Reference DIFFICULTY_LEVELS from constants to see available difficulty options (easy, medium, hard)
    // Each difficulty level has properties like: initialLives, maxTargets, initialSpawnRate, shrinkSpeedFactor
    // These are passed here for your colleague to use when implementing target spawning logic
    const difficultySettings = DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS.medium;
    
    // ===== GAME STATE =====
    const [score, setScore] = useState(0);
    // SURVIVAL MODE: Lives represent remaining attempts before game over
    // SCORE ATTACK MODE: Lives are not used (infinite lives in time attack)
    const [lives, setLives] = useState(difficultySettings.initialLives);
    // SCORE ATTACK MODE: Timer countdown from TIME_ATTACK_DURATION (60 seconds)
    // SURVIVAL MODE: timeLeft remains null
    const [timeLeft, setTimeLeft] = useState(gameMode === 'scoreAttack' ? TIME_ATTACK_DURATION : null);
    const [gameActive, setGameActive] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    // ===== TIMER FOR SCORE ATTACK MODE =====
    // This effect handles the 60-second countdown for Score Attack mode
    // When timeLeft reaches 0, the game ends and onGameOver is called with the final score
    // The timer is paused when isPaused is true
    useEffect(() => {
        if (gameMode !== 'scoreAttack' || !gameActive || isPaused) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameActive(false);
                    onGameOver(score);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameActive, isPaused, gameMode, score, onGameOver]);

    // ===== TARGET HANDLING =====
    // COLLEAGUE: Add your target rendering logic here
    // You can create a separate component (e.g., TargetRenderer.jsx) and import it
    // Then call it here by passing required props: theme, gameMode, difficulty, difficultySettings, gameActive, isPaused, score, onTargetClick
    // 
    // Expected behavior from your target system:
    // 1. Spawn targets based on difficulty (use difficultySettings.initialSpawnRate and difficultySettings.maxTargets)
    // 2. Targets should shrink or despawn over time
    // 3. When target is missed (despawns without being clicked):
    //    - In SURVIVAL mode: decrease lives by 1
    //    - In SCORE ATTACK mode: no effect on lives
    // 4. Call onTargetClick when a target is clicked
    // 5. When lives reach 0 in SURVIVAL mode, call setGameActive(false) and onGameOver(score)
    //
    // You can use difficultySettings for:
    // - difficultySettings.initialSpawnRate: base spawn rate in milliseconds
    // - difficultySettings.maxTargets: maximum targets on screen
    // - difficultySettings.shrinkSpeedFactor: how fast targets shrink (1.0 = medium)
    // - difficultySettings.initialLives: starting lives for SURVIVAL mode
    //
    // PLACEHOLDER: Replace this comment with your target component
    const handleTargetClick = () => {
        setScore(s => s + 1);
    };

    // ===== SURVIVAL MODE LIVES HANDLING =====
    // COLLEAGUE: When a target is missed in SURVIVAL mode, call this function to decrease lives
    // If lives reach 0, the game ends automatically
    const handleMissedTarget = () => {
        if (gameMode === 'survival') {
            setLives(l => {
                const newLives = Math.max(0, l - 1);
                if (newLives === 0) {
                    setGameActive(false);
                    onGameOver(score);
                }
                return newLives;
            });
        }
    };

    return (
        <div className={`w-full h-full ${theme.appBg} relative overflow-hidden flex flex-col`}>
            {/* ===== HUD (Heads-Up Display) ===== */}
            <div className={`${theme.hudBg} border-b ${theme.panelBorder} p-4 flex justify-between items-center`}>
                {/* Lives Display - SURVIVAL MODE ONLY */}
                {/* Shows remaining lives with a heart icon */}
                {/* In SURVIVAL mode: lose lives when targets are missed */}
                {/* When lives reach 0: game ends and player is taken to game over screen */}
                <div className="flex gap-6">
                    {gameMode === 'survival' && (
                        <div className="flex items-center gap-2">
                            <Heart className="text-red-500 fill-red-500" size={24} />
                            <span className={`text-2xl font-bold ${theme.textMain}`}>{lives}</span>
                        </div>
                    )}
                    
                    {/* Timer Display - SCORE ATTACK MODE ONLY */}
                    {/* Shows remaining time in seconds */}
                    {/* Counts down from 60 seconds */}
                    {/* When timer reaches 0: game ends and player is taken to game over screen */}
                    {gameMode === 'scoreAttack' && (
                        <div className="flex items-center gap-2">
                            <Clock className={`${theme.accentText}`} size={24} />
                            <span className={`text-2xl font-bold ${theme.accentText}`}>{timeLeft}s</span>
                        </div>
                    )}
                </div>

                {/* Score Display - BOTH MODES */}
                {/* Shows current player score (increments by 1 with each target click) */}
                <div>
                    <p className={`${theme.textSec} text-sm uppercase tracking-wider`}>Score</p>
                    <p className={`text-3xl font-mono font-bold ${theme.accentText}`}>{score}</p>
                </div>

                {/* Pause Button */}
                {/* Pauses the game and displays pause menu with Resume/Quit options */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsPaused(true)}
                        className={`p-2 rounded ${theme.panelBg} border ${theme.panelBorder} ${theme.textSec} hover:${theme.textMain} transition-colors cursor-pointer ${theme.accentBgHover}`}
                        title="Pause Game"
                    >
                        <Pause size={20} />
                    </button>
                </div>
            </div>

            {/* ===== GAME AREA =====
                COLLEAGUE: Render your target system here
                This is the main gameplay area where targets (and powerups) should appear
                
                You can either:
                1. Render targets directly here with inline JSX
                2. Create a separate component file and import it
                
                Make sure to:
                - Use theme passed as prop for consistent styling
                - Stop rendering/updating when gameActive is false or isPaused is true
                - Call handleTargetClick() when a target is clicked (increments score)
                - Call handleMissedTarget() when a target is missed/despawned
                
                Example of what to render:
                {targets && targets.map(target => (
                    <TargetComponent 
                        key={target.id}
                        target={target}
                        theme={theme}
                        onClick={() => handleTargetClick()}
                    />
                ))}
            */}
            <div className="flex-1 relative flex items-center justify-center">
                {/* COLLEAGUE: Add your target rendering code here */}
                <div className={`${theme.textSec} text-center`}>
                    <p className="text-xl font-bold mb-2">Target System Area</p>
                    <p className="text-sm opacity-75">Colleague's custom targets and powerups will render here</p>
                </div>
            </div>

            {/* ===== PAUSE MENU ===== */}
            {isPaused && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-50">
                    <div className={`${theme.panelBg} p-8 rounded-2xl text-center border ${theme.panelBorder} space-y-6`}>
                        <p className={`text-3xl font-bold ${theme.textMain}`}>PAUSED</p>
                        <div className="space-y-2">
                            <p className={`${theme.textSec} text-sm uppercase`}>Current Score</p>
                            <p className={`text-4xl font-bold ${theme.accentText}`}>{score}</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsPaused(false)}
                                className={`flex-1 px-6 py-3 rounded ${theme.accentBg} text-white font-bold hover:opacity-80 transition-opacity cursor-pointer`}
                            >
                                RESUME
                            </button>
                            <button 
                                onClick={() => {
                                    setIsPaused(false);
                                    onQuit();
                                }}
                                className={`flex-1 px-6 py-3 rounded ${theme.panelBg} border ${theme.panelBorder} ${theme.textSec} hover:text-red-400 font-bold transition-colors cursor-pointer ${theme.accentBgHover}`}
                            >
                                QUIT
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== GAME OVER SCREEN ===== */}
            {!gameActive && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <div className={`${theme.panelBg} p-8 rounded-2xl text-center border ${theme.panelBorder}`}>
                        <p className={`${theme.textSec} text-sm uppercase mb-2`}>Game Ended</p>
                        <p className={`text-4xl font-bold ${theme.accentText} mb-4`}>{score}</p>
                        <p className={`${theme.textSec} mb-4`}>Final Score</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className={`px-6 py-2 rounded ${theme.accentBg} text-white font-bold hover:opacity-80 transition-opacity cursor-pointer ${theme.accentBgHover}`}
                        >
                            Redirecting...
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameScreen;