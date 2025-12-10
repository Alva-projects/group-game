/**
 * TARGET RENDERER COMPONENT
 * =========================
 * 
 * ACTIVE TARGET SYSTEM — This is the component currently used in GameScreen.
 * Handles all target spawning, positioning, lifecycle, and event propagation.
 * 
 * KEY RESPONSIBILITIES:
 * 1. Spawn targets at randomized positions within a ref-based game area
 * 2. Manage target lifetime (based on difficulty shrinkSpeedFactor)
 * 3. Handle click events (remove target, call onTargetClick)
 * 4. Handle missed targets (when lifetime expires, call onMissedTarget)
 * 5. Scale target sizes based on global difficulty setting
 * 
 * INTEGRATION:
 * - Parent: GameScreen.jsx (passes props for theme, gameMode, difficulty, etc.)
 * - Handlers: onTargetClick (increment score), onMissedTarget (decrease lives in survival)
 * - Styling: src/target.css (.game-area, .target-circle)
 * - Constants: src/utils/constants.js (BASE_RADIUS, DIFFICULTY_LEVELS)
 * 
 * TO MODIFY/EXTEND:
 * - Add multiple simultaneous targets: change maxTargets logic
 * - Add visual shrink animation: animate width/height as lifetime expires
 * - Add powerups: mix powerup objects into targets array
 * - Add progressive difficulty: scale spawn rate based on score
 * - Add target patterns/groups: modify random position logic
 */

import React, { useEffect, useRef, useState } from 'react';
import '../target.css';
import { BASE_RADIUS } from '../utils/constants';


/**
 * TargetRenderer({ theme, gameMode, difficulty, difficultySettings, gameActive, isPaused, onTargetClick, onMissedTarget })
 * 
 * PROPS:
 * ------
 * theme              : (object) Theme config for styling (not currently used by targets, reserved for future)
 * gameMode           : (string) 'survival' or 'scoreAttack' — determines if missed targets cost lives
 * difficulty         : (string) 'easy', 'medium', or 'hard' — determines target size via BASE_RADIUS scaling
 * difficultySettings : (object) Contains spawn rate, max targets, shrink speed factor from DIFFICULTY_LEVELS
 * gameActive         : (boolean) If false, targets stop spawning
 * isPaused           : (boolean) If true, no new targets spawn, existing targets remain visible
 * onTargetClick      : (function) Callback when player clicks a target (typically increments score)
 * onMissedTarget     : (function) Callback when a target lifetime expires without being clicked (survival mode: decrease lives)
 */
const TargetRenderer = ({ theme, gameMode, difficulty, difficultySettings, gameActive, isPaused, onTargetClick, onMissedTarget }) => {

    // ===== REFS & STATE =====
  // containerRef: attached to the #game-area div, used to query dimensions for random position generation
  const containerRef = useRef(null);
  // targets: array of active target objects
  // Each target object: { id, x, y, size, life, lifeTimer }
  // - id: unique identifier (Date.now() + Math.random())
  // - x, y: pixel coordinates (top-left of circle)
  // - size: radius in pixels
  // - life: milliseconds until target despawns (based on shrinkSpeedFactor)
  // - lifeTimer: setTimeout ID (stored so we can clear it on click before it fires missed callback)
  const [targets, setTargets] = useState([]);

  // ===== HELPER: GET TARGET SIZE =====
  /**
   * getCircleSize(difficultyLevel)
   * 
   * Returns the target radius (px) scaled by difficulty.
   * Uses BASE_RADIUS from constants.js as the base (default: 35px for medium).
   * 
   * SCALING:
   *   - easy:   BASE_RADIUS * 1.3 (larger, more forgiving)
   *   - medium: BASE_RADIUS * 1.0 (baseline)
   *   - hard:   BASE_RADIUS * 0.75 (smaller, tighter)
   * 
   * TO MODIFY:
   *   - Adjust multipliers to change size gaps between difficulties
   *   - Add non-linear scaling (e.g., quadratic based on score)
   *   - Mix sizes: return random multiplier instead of fixed per-difficulty
   */
  const getCircleSize = (difficultyLevel) => {
    const base = BASE_RADIUS || 35;
    if (difficultyLevel === 'easy') return Math.round(base * 1.3);
    if (difficultyLevel === 'medium') return Math.round(base * 1.0);
    if (difficultyLevel === 'hard') return Math.round(base * 0.75);
    return Math.round(base);
  };


  // ===== MAIN EFFECT: SPAWN & MANAGE TARGETS =====
  /**
   * useEffect (Target Spawning & Lifetime Management)
   * 
   * Runs when gameActive, isPaused, difficulty, difficultySettings, or handlers change.
   * Responsible for:
   *   1. Spawning a new target immediately on mount
   *   2. Spawning additional targets on a timed interval (spawnRate)
   *   3. Enforcing single-target max (maxTargets = 1)
   *   4. Setting a lifetime timer for each target (removes on expiry, calls missed handler)
   * 
   * EXITS EARLY IF:
   *   - gameActive === false (game over, don't spawn)
   *   - isPaused === true (paused, don't spawn)
   * 
   * CLEANUP:
   *   - Clears the spawn interval on unmount or dependency change
   */
  useEffect(() => {
    // Early exit: don't spawn targets if game is not active or is paused
    if (!gameActive || isPaused) return;

    // Get difficulty-driven spawn rate (ms between spawns) and max concurrent targets
    const spawnRate = difficultySettings?.initialSpawnRate ?? 1000;
    // ENFORCED: Only allow 1 target at a time (can be modified.)
    const maxTargets = 1;


    /**
     * spawn()
     * 
     * Spawns a single new target at a random position.
     * 
     * LOGIC:
     *   1. Check if we're at max targets; if so, return (don't spawn)
     *   2. Query container dimensions (#game-area ref)
     *   3. Calculate target size based on current difficulty
     *   4. Generate random x, y within bounds (so circle doesn't overflow)
     *   5. Create unique ID
     *   6. Calculate life duration (baseLife / shrinkSpeedFactor)
     *      - shrinkSpeedFactor = 0.7 (easy) → longer life
     *      - shrinkSpeedFactor = 1.0 (medium) → baseline life
     *      - shrinkSpeedFactor = 1.3 (hard) → shorter life
     *   7. Set a timeout that:
     *      - Removes the target after [life] ms
     *      - Calls onMissedTarget if it's in survival mode
     *   8. Store the timeout ID on the target object so we can clear it if clicked
     * 
     * TO MODIFY:
     *   - Add non-random positioning (corners, edges, center bias, patterns)
     *   - Add animation frames instead of instant spawn
     *   - Vary target appearance (color, shape, glow effect)
     *   - Add difficulty-based modifiers (target density, spread, etc.)
     */
    const spawn = () => {
      setTargets(prev => {
        // only spawn if there are no existing targets
        if (prev.length >= maxTargets) return prev;
        const el = containerRef.current;
        if (!el) return prev;

        const areaWidth = el.clientWidth;
        const areaHeight = el.clientHeight;
        const size = getCircleSize(difficulty);

        // Generate random position, ensuring circle stays within bounds
        const x = Math.random() * Math.max(0, areaWidth - size);
        const y = Math.random() * Math.max(0, areaHeight - size);

        // Unique ID for this target instance
        const id = Date.now() + Math.random();

        // Life duration (in ms) inversely scaled by shrinkSpeedFactor
        // Higher factor = faster shrink = shorter life = harder difficulty
        const baseLife = 2000; // milliseconds
        const life = Math.max(400, Math.round(baseLife / (difficultySettings?.shrinkSpeedFactor || 1)));

        const target = { id, x, y, size, life };

        /**
         * Lifetime Timer: Remove target after [life] milliseconds
         * 
         * WHY STORE THE TIMER ID?
         * If player clicks target, we clear this timeout before it fires.
         * Otherwise, the timeout would fire after the target is already removed (state inconsistency).
         * 
         * MISSED TARGET BEHAVIOR:
         * - In 'survival' mode: call onMissedTarget (decrements lives)
         * - In 'scoreAttack' mode: silently remove (no life penalty)
         */
        const lifeTimer = setTimeout(() => {
          setTargets(curr => {
            const exists = curr.find(t => t.id === id);
            if (!exists) return curr; // Already removed (e.g., via click)

            // call missed handler for survival mode
            if (gameMode === 'survival') {
              onMissedTarget && onMissedTarget();
            }

            // Remove the target
            return curr.filter(t => t.id !== id);
          });
        }, life);

        // Return new target list with the freshly spawned target
        // Store lifeTimer on target so we can cancel it on click
        return [...prev, { ...target, lifeTimer }];
      });
    };

    // Spawn first target immediately
    spawn();

    // Set up recurring spawn on an interval
    const iv = setInterval(spawn, spawnRate);

    // Cleanup: clear interval on unmount or dependency change
    return () => clearInterval(iv);
  }, [gameActive, isPaused, difficulty, difficultySettings, onMissedTarget, gameMode]);


  // ===== CLICK HANDLER =====
  /**
   * handleClick(id)
   * 
   * Fired when player clicks a target circle.
   * 
   * FLOW:
   *   1. Find the target by ID
   *   2. Clear its lifetime timeout (so missed callback doesn't fire)
   *   3. Remove it from the targets array
   *   4. Call onTargetClick (typically increments score)
   * 
   * TIMING NOTE:
   * The new target won't spawn until the next interval tick (spawnRate).
   * This creates a brief gap where the game area is empty.
   * You can modify spawn() to spawn on-demand instead of purely interval-based.
   * 
   * TO MODIFY:
   *   - Add hit feedback (visual, sound, particle effect)
   *   - Track multi-clicks (fast-click bonus)
   *   - Add combo counter
   *   - Spawn multiple targets on hit (difficulty modifier)
   */
  const handleClick = (id) => {
    setTargets(prev => {
      // clear any life timer for this target if present
      const found = prev.find(t => t.id === id);
      if (found && found.lifeTimer) {
        clearTimeout(found.lifeTimer); // Prevent missed callback
      }
      
      // Remove target from array
      return prev.filter(t => t.id !== id);
    });

    // Notify parent (GameScreen) that a target was clicked
    onTargetClick && onTargetClick();
  };


  // ===== RENDER =====
  /**
   * JSX Structure:
   * - <div id="game-area" ref={containerRef}>
   *     Flex container matching parent height.
   *     Ref allows querying dimensions for random position generation.
   *     
   * - {targets.map(t => (...))}
   *     For each target, render a circle div with:
   *       - Absolute position (x, y)
   *       - Size (width, height)
   *       - Click handler
   *       - .target-circle class (CSS: radial gradient, shadow, border-radius: 50%)
   * 
   * TO MODIFY:
   *   - Add animation classes (fade-in, pulse, shrink)
   *   - Render target metadata (score value, glow, etc.)
   *   - Add nested child elements (target center dot, ring, particles)
   *   - Use SVG instead of div for more control
   *   - Add visual progress bar showing remaining lifetime
   */
  return (
    <div id="game-area" ref={containerRef} className={`game-area`}>
      {targets.map(t => (
        <div
          key={t.id}
          className={`target-circle`}
          onClick={() => handleClick(t.id)}
          style={{ left: t.x, top: t.y, width: t.size, height: t.size }}
        />
      ))}
    </div>
  );
};

export default TargetRenderer;
