import React, { useEffect, useRef, useState } from 'react';
import '../target.css';
import { BASE_RADIUS } from '../utils/constants';

const TargetRenderer = ({ theme, gameMode, difficulty, difficultySettings, gameActive, isPaused, onTargetClick, onMissedTarget }) => {
  const containerRef = useRef(null);
  const [targets, setTargets] = useState([]);

  // Helper: derive circle size from BASE_RADIUS and difficulty
  const getCircleSize = (difficultyLevel) => {
    const base = BASE_RADIUS || 35;
    if (difficultyLevel === 'easy') return Math.round(base * 1.3);
    if (difficultyLevel === 'medium') return Math.round(base * 1.0);
    if (difficultyLevel === 'hard') return Math.round(base * 0.75);
    return Math.round(base);
  };

  useEffect(() => {
    if (!gameActive || isPaused) return;

    const spawnRate = difficultySettings?.initialSpawnRate ?? 1000;
    // enforce single-target gameplay: only one active target at a time
    const maxTargets = 1;

    const spawn = () => {
      setTargets(prev => {
        // only spawn if there are no existing targets
        if (prev.length >= maxTargets) return prev;
        const el = containerRef.current;
        if (!el) return prev;

        const areaWidth = el.clientWidth;
        const areaHeight = el.clientHeight;
        const size = getCircleSize(difficulty);

        const x = Math.random() * Math.max(0, areaWidth - size);
        const y = Math.random() * Math.max(0, areaHeight - size);
        const id = Date.now() + Math.random();

        // Life duration is influenced by shrinkSpeedFactor (higher => faster => shorter life)
        const baseLife = 2000; // ms
        const life = Math.max(400, Math.round(baseLife / (difficultySettings?.shrinkSpeedFactor || 1)));

        const target = { id, x, y, size, life };

        // Remove target after life expires and mark as missed when applicable
        const lifeTimer = setTimeout(() => {
          setTargets(curr => {
            const exists = curr.find(t => t.id === id);
            if (!exists) return curr;
            // call missed handler for survival mode
            if (gameMode === 'survival') {
              onMissedTarget && onMissedTarget();
            }
            return curr.filter(t => t.id !== id);
          });
        }, life);

        // attach a cleanup handle to the target so we can clear its timer if clicked
        // (we store the timer id on the returned target object)

        return [...prev, { ...target, lifeTimer }];
      });
    };

    // Spawn immediately and then at interval
    spawn();
    const iv = setInterval(spawn, spawnRate);
    return () => clearInterval(iv);
  }, [gameActive, isPaused, difficulty, difficultySettings, onMissedTarget, gameMode]);

  const handleClick = (id) => {
    setTargets(prev => {
      // clear any life timer for this target if present
      const found = prev.find(t => t.id === id);
      if (found && found.lifeTimer) clearTimeout(found.lifeTimer);
      return prev.filter(t => t.id !== id);
    });
    onTargetClick && onTargetClick();
  };

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
