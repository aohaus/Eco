import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShatominAvatar } from './ShatominAvatar';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Language } from '../utils/i18n';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  Heart, 
  Trophy, 
  Zap, 
  ShieldAlert, 
  Sun, 
  Wind, 
  Droplet, 
  HelpCircle, 
  ArrowUp, 
  ArrowDown, 
  Award,
  Volume2,
  VolumeX,
  BookOpen,
  Compass
} from 'lucide-react';

interface EcoRunawayGameProps {
  onAddPoints?: (pts: number) => void;
  setActiveTab: (tab: string) => void;
  language?: Language;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'sunflower' | 'solar' | 'wind' | 'water' | 'shuttlecock' | 'smog_cloud' | 'smoke_stack' | 'plastic_pile' | 'oil_spill';
  collected?: boolean;
}

const TRIVIA_QUESTIONS = [
  {
    qJa: '短距離の移動で最もCO₂排出が少ない手段はどれ？',
    qEn: 'Which mode of transport produces the lowest carbon emissions for short trips?',
    optionsJa: ['徒歩または自転車', 'ガソリン車', '大型SUV', 'バイク'],
    optionsEn: ['Walking / Cycling', 'Gasoline Car', 'Large SUV', 'Motorcycle'],
    correct: 0,
    explanationJa: '徒歩や自転車は移動中の直接CO₂排出がゼロです！',
    explanationEn: 'Walking and cycling produce zero direct tailpipe carbon emissions!',
  },
  {
    qJa: 'エアコンの設定温度を1℃緩和すると、どれくらい節電できる？',
    qEn: 'Relaxing the AC temperature by 1°C can save approximately how much energy?',
    optionsJa: ['約10%', '約1%', '約50%', '変化なし'],
    optionsEn: ['About 10%', 'About 1%', 'About 50%', 'No change'],
    correct: 0,
    explanationJa: '冷房を1℃上げると約10%の消費電力を削減できます！',
    explanationEn: 'Adjusting AC by 1°C saves ~10% of electricity consumption!',
  },
  {
    qJa: '使い捨てペットボトルをマイボトルに変えると減らせるものは？',
    qEn: 'Switching from disposable plastic bottles to a reusable bottle reduces:',
    optionsJa: ['プラスチックごみと製造時のCO₂', '水道水', 'ビタミン', '太陽光'],
    optionsEn: ['Plastic waste & production CO₂', 'Tap water', 'Vitamins', 'Sunlight'],
    correct: 0,
    explanationJa: 'ペットボトルの消費を抑えることで、資源とCO₂を同時に守れます！',
    explanationEn: 'Reusable bottles prevent single-use waste and eliminate manufacturing emissions!',
  },
];

export const EcoRunawayGame: React.FC<EcoRunawayGameProps> = ({ 
  onAddPoints, 
  setActiveTab,
  language = 'ja'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game states
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [co2SavedKg, setCo2SavedKg] = useState<number>(0);
  const [sunflowersCollected, setSunflowersCollected] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isInvincible, setIsInvincible] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // High score in localStorage
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('eco_runner_high_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Trivia bonus at game over
  const [trivia, setTrivia] = useState<typeof TRIVIA_QUESTIONS[0] | null>(null);
  const [triviaAnswered, setTriviaAnswered] = useState<boolean>(false);
  const [triviaCorrect, setTriviaCorrect] = useState<boolean | null>(null);
  const [pointsClaimed, setPointsClaimed] = useState<boolean>(false);

  // Internal mutable game loop references
  const gameRef = useRef<{
    animationFrameId: number;
    player: {
      x: number;
      y: number;
      vy: number;
      width: number;
      height: number;
      isJumping: boolean;
      isSliding: boolean;
      jumpCount: number;
      groundY: number;
    };
    objects: GameObject[];
    speed: number;
    invincibleTimer: number;
    spawnTimer: number;
    cloudOffset: number;
    hillOffset: number;
    lastTime: number;
  }>({
    animationFrameId: 0,
    player: {
      x: 80,
      y: 220,
      vy: 0,
      width: 46,
      height: 52,
      isJumping: false,
      isSliding: false,
      jumpCount: 0,
      groundY: 220,
    },
    objects: [],
    speed: 5,
    invincibleTimer: 0,
    spawnTimer: 0,
    cloudOffset: 0,
    hillOffset: 0,
    lastTime: 0,
  });

  // Handle jump
  const handleJump = useCallback(() => {
    if (gameState !== 'playing') return;
    const p = gameRef.current.player;
    if (p.jumpCount < 2) {
      p.vy = -12;
      p.isJumping = true;
      p.isSliding = false;
      p.jumpCount += 1;
      if (soundEnabled) sounds.playJump();
    }
  }, [gameState, soundEnabled]);

  // Handle slide
  const handleSlide = useCallback((isDown: boolean) => {
    if (gameState !== 'playing') return;
    const p = gameRef.current.player;
    if (isDown && !p.isJumping) {
      p.isSliding = true;
      p.height = 30;
      p.y = p.groundY + 22;
    } else {
      p.isSliding = false;
      p.height = 52;
      if (!p.isJumping) {
        p.y = p.groundY;
      }
    }
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (gameState === 'idle' || gameState === 'gameover') {
          startGame();
        } else {
          handleJump();
        }
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        handleSlide(true);
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        setGameState(prev => prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        handleSlide(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, handleJump, handleSlide]);

  // Start game
  const startGame = () => {
    if (soundEnabled) sounds.playSparkle();
    const g = gameRef.current;
    g.player.y = 220;
    g.player.vy = 0;
    g.player.isJumping = false;
    g.player.isSliding = false;
    g.player.jumpCount = 0;
    g.player.height = 52;
    g.objects = [];
    g.speed = 5;
    g.invincibleTimer = 0;
    g.spawnTimer = 0;
    g.lastTime = performance.now();

    setScore(0);
    setDistance(0);
    setCo2SavedKg(0);
    setSunflowersCollected(0);
    setLives(3);
    setMultiplier(1);
    setIsInvincible(false);
    setPointsClaimed(false);
    setTrivia(null);
    setTriviaAnswered(false);
    setTriviaCorrect(null);
    setGameState('playing');
  };

  // Main Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localScore = score;
    let localDistance = distance;
    let localLives = lives;
    let localSunflowers = sunflowersCollected;

    const loop = (time: number) => {
      const g = gameRef.current;
      const dt = Math.min(32, time - (g.lastTime || time));
      g.lastTime = time;

      // Update speed & distance
      g.speed += 0.0008 * dt;
      localDistance += Math.floor(g.speed * 0.4);
      localScore += Math.floor(g.speed * 0.1 * (g.invincibleTimer > 0 ? 2 : 1));

      // CO2 avoided calculation (0.015kg per meter approx + items)
      const co2Calc = parseFloat(((localDistance * 0.008) + (localSunflowers * 0.05)).toFixed(2));

      // Player Physics
      const p = g.player;
      if (p.isJumping) {
        p.vy += 0.55; // gravity
        p.y += p.vy;
        if (p.y >= p.groundY) {
          p.y = p.groundY;
          p.vy = 0;
          p.isJumping = false;
          p.jumpCount = 0;
        }
      }

      // Invincibility countdown
      if (g.invincibleTimer > 0) {
        g.invincibleTimer -= dt;
        if (g.invincibleTimer <= 0) {
          setIsInvincible(false);
          setMultiplier(1);
        }
      }

      // Spawn Objects
      g.spawnTimer += dt;
      if (g.spawnTimer > Math.max(900, 1800 - g.speed * 100)) {
        g.spawnTimer = 0;
        const rand = Math.random();
        
        if (rand < 0.55) {
          // Spawn Eco Item
          const itemTypes: GameObject['type'][] = ['sunflower', 'solar', 'wind', 'water', 'shuttlecock'];
          const chosen = rand < 0.05 ? 'shuttlecock' : itemTypes[Math.floor(Math.random() * (itemTypes.length - 1))];
          const isHigh = Math.random() > 0.45;
          g.objects.push({
            x: 750,
            y: isHigh ? 175 : 228,
            width: 28,
            height: 28,
            type: chosen,
          });
        } else {
          // Spawn Obstacle
          const isSmog = Math.random() > 0.6;
          const obstacleTypes: GameObject['type'][] = isSmog ? ['smog_cloud'] : ['smoke_stack', 'plastic_pile', 'oil_spill'];
          const chosen = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
          
          g.objects.push({
            x: 750,
            y: chosen === 'smog_cloud' ? 190 : 230,
            width: chosen === 'smog_cloud' ? 44 : 32,
            height: chosen === 'smog_cloud' ? 30 : 36,
            type: chosen,
          });
        }
      }

      // Move & filter objects + collision check
      for (let i = g.objects.length - 1; i >= 0; i--) {
        const obj = g.objects[i];
        obj.x -= g.speed;

        // Collision logic
        const pBox = {
          x: p.x + 6,
          y: p.y + 4,
          w: p.width - 12,
          h: p.height - 8,
        };

        const isColliding = 
          pBox.x < obj.x + obj.width &&
          pBox.x + pBox.w > obj.x &&
          pBox.y < obj.y + obj.height &&
          pBox.y + pBox.h > obj.y;

        if (isColliding && !obj.collected) {
          obj.collected = true;

          // Item vs Hazard
          if (['sunflower', 'solar', 'wind', 'water', 'shuttlecock'].includes(obj.type)) {
            let pts = 10;
            if (obj.type === 'sunflower') {
              pts = 10;
              localSunflowers += 1;
              if (soundEnabled) sounds.playCollect();
            } else if (obj.type === 'solar') {
              pts = 15;
              if (soundEnabled) sounds.playCollect(true);
            } else if (obj.type === 'wind') {
              pts = 20;
              if (soundEnabled) sounds.playCollect(true);
            } else if (obj.type === 'water') {
              pts = 5;
              if (soundEnabled) sounds.playCollect();
            } else if (obj.type === 'shuttlecock') {
              pts = 50;
              g.invincibleTimer = 6000;
              setIsInvincible(true);
              setMultiplier(2);
              if (soundEnabled) sounds.playPowerUp();
            }

            localScore += pts * (g.invincibleTimer > 0 ? 2 : 1);
          } else {
            // Hazard hit
            if (g.invincibleTimer > 0) {
              // Destroy obstacle safely in super mode
              localScore += 30;
              if (soundEnabled) sounds.playCollect(true);
            } else {
              localLives -= 1;
              if (soundEnabled) sounds.playHit();
              if (localLives <= 0) {
                // Game Over
                setLives(0);
                setGameState('gameover');
                const finalScore = localScore;
                if (finalScore > highScore) {
                  setHighScore(finalScore);
                  localStorage.setItem('eco_runner_high_score', finalScore.toString());
                }
                // Pick random trivia
                setTrivia(TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)]);
                return;
              }
            }
          }
        }

        // Remove offscreen objects
        if (obj.x < -60) {
          g.objects.splice(i, 1);
        }
      }

      // Sync React state periodically
      setScore(localScore);
      setDistance(localDistance);
      setCo2SavedKg(co2Calc);
      setSunflowersCollected(localSunflowers);
      setLives(localLives);

      // --- RENDERING CANVAS ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Sky & Sun
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#E0F2FE');
      skyGrad.addColorStop(0.7, '#BAE6FD');
      skyGrad.addColorStop(1, '#F0FDF4');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(620, 60, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 4;
      ctx.stroke();

      // 2. Parallax Clouds (Slow)
      g.cloudOffset = (g.cloudOffset + g.speed * 0.15) % 800;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      [100, 350, 600, 850].forEach(cx => {
        const x = (cx - g.cloudOffset + 800) % 800;
        ctx.beginPath();
        ctx.arc(x, 70, 24, 0, Math.PI * 2);
        ctx.arc(x + 20, 60, 30, 0, Math.PI * 2);
        ctx.arc(x + 45, 70, 22, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Parallax Distant Hills & Windmills
      g.hillOffset = (g.hillOffset + g.speed * 0.4) % 800;
      ctx.fillStyle = '#A7F3D0';
      ctx.beginPath();
      ctx.moveTo(0, 280);
      for (let x = 0; x <= canvas.width; x += 10) {
        const y = 220 + Math.sin((x + g.hillOffset) * 0.008) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();

      // Distant Wind Turbines
      [200, 480, 720].forEach(wx => {
        const x = (wx - g.hillOffset + 800) % 800;
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, 230);
        ctx.lineTo(x, 175);
        ctx.stroke();

        // Blades spinning
        const angle = (time * 0.004) % (Math.PI * 2);
        for (let b = 0; b < 3; b++) {
          const bAngle = angle + (b * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.moveTo(x, 175);
          ctx.lineTo(x + Math.cos(bAngle) * 18, 175 + Math.sin(bAngle) * 18);
          ctx.stroke();
        }
      });

      // 4. Ground Platform (Track)
      ctx.fillStyle = '#065F46'; // Emerald turf ground
      ctx.fillRect(0, 270, canvas.width, 50);

      // Track top grass line
      ctx.fillStyle = '#10B981';
      ctx.fillRect(0, 268, canvas.width, 5);

      // Track stripes moving
      const stripeOffset = (time * (g.speed * 0.1)) % 40;
      ctx.fillStyle = '#047857';
      for (let sx = -40; sx < canvas.width; sx += 40) {
        ctx.fillRect(sx - stripeOffset, 278, 18, 4);
      }

      // 5. Draw Objects
      g.objects.forEach(obj => {
        if (obj.collected) return;

        if (obj.type === 'sunflower') {
          // Yellow Sunflower
          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.arc(obj.x + 14, obj.y + 14, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#78350F';
          ctx.beginPath();
          ctx.arc(obj.x + 14, obj.y + 14, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (obj.type === 'solar') {
          // Solar Energy Orb
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(obj.x + 14, obj.y + 14, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText('⚡', obj.x + 8, obj.y + 18);
        } else if (obj.type === 'wind') {
          // Wind leaf
          ctx.fillStyle = '#34D399';
          ctx.beginPath();
          ctx.arc(obj.x + 14, obj.y + 14, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#065F46';
          ctx.fillText('🍃', obj.x + 7, obj.y + 18);
        } else if (obj.type === 'water') {
          // Water drop
          ctx.fillStyle = '#60A5FA';
          ctx.beginPath();
          ctx.arc(obj.x + 14, obj.y + 14, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText('💧', obj.x + 7, obj.y + 18);
        } else if (obj.type === 'shuttlecock') {
          // Golden Shuttlecock Powerup
          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(obj.x + 14, obj.y + 14, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#EAB308';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.font = '14px sans-serif';
          ctx.fillText('🏸', obj.x + 6, obj.y + 19);
        } else if (obj.type === 'smog_cloud') {
          // Dark Gray Carbon Smog Cloud (flying)
          ctx.fillStyle = '#4B5563';
          ctx.beginPath();
          ctx.arc(obj.x + 15, obj.y + 15, 14, 0, Math.PI * 2);
          ctx.arc(obj.x + 28, obj.y + 12, 16, 0, Math.PI * 2);
          ctx.arc(obj.x + 38, obj.y + 16, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#9CA3AF';
          ctx.font = '10px sans-serif';
          ctx.fillText('CO₂', obj.x + 16, obj.y + 17);
        } else if (obj.type === 'smoke_stack') {
          // Red/White Factory Smoke Stack (ground)
          ctx.fillStyle = '#DC2626';
          ctx.fillRect(obj.x + 6, obj.y + 8, 20, 28);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(obj.x + 6, obj.y + 16, 20, 6);
        } else if (obj.type === 'plastic_pile') {
          // Plastic Trash Pile
          ctx.fillStyle = '#9CA3AF';
          ctx.beginPath();
          ctx.arc(obj.x + 16, obj.y + 24, 14, Math.PI, 0);
          ctx.fill();
          ctx.fillStyle = '#EF4444';
          ctx.font = '12px sans-serif';
          ctx.fillText('🗑️', obj.x + 8, obj.y + 26);
        } else if (obj.type === 'oil_spill') {
          // Oil / Fossil Fuel Puddle
          ctx.fillStyle = '#18181B';
          ctx.beginPath();
          ctx.ellipse(obj.x + 16, obj.y + 30, 18, 6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 6. Draw Player (Shatomin Running / Jumping / Sliding)
      ctx.save();
      const px = p.x;
      const py = p.y;

      // Super invincible aura
      if (g.invincibleTimer > 0) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.beginPath();
        ctx.arc(px + 22, py + (p.isSliding ? 14 : 26), 34, 0, Math.PI * 2);
        ctx.fill();
      }

      if (p.isSliding) {
        // Sliding / Ducking pose (horizontal ellipse)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(px + 22, py + 14, 24, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#D1D5DB';
        ctx.stroke();

        // Green ribbon
        ctx.fillStyle = '#15803D';
        ctx.fillRect(px + 8, py + 8, 8, 12);

        // Face
        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.arc(px + 34, py + 12, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Normal Running / Jumping pose
        // 1. Feathers top
        ctx.fillStyle = '#F8FAFC';
        ctx.strokeStyle = '#D1D5DB';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(px + 10, py + 18);
        ctx.lineTo(px + 16, py + 2);
        ctx.lineTo(px + 22, py + 18);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px + 20, py + 18);
        ctx.lineTo(px + 26, py + 0);
        ctx.lineTo(px + 32, py + 18);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px + 30, py + 18);
        ctx.lineTo(px + 36, py + 3);
        ctx.lineTo(px + 40, py + 18);
        ctx.fill();
        ctx.stroke();

        // 2. Green Ribbon
        ctx.fillStyle = '#15803D';
        ctx.fillRect(px + 10, py + 17, 30, 5);

        // 3. Body
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px + 24, py + 34, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 4. Cheeks & Eyes
        ctx.fillStyle = '#FDA4AF';
        ctx.beginPath();
        ctx.arc(px + 16, py + 36, 3, 0, Math.PI * 2);
        ctx.arc(px + 32, py + 36, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.arc(px + 20, py + 32, 2.5, 0, Math.PI * 2);
        ctx.arc(px + 28, py + 32, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 5. Feet (Stepping movement)
        const step = Math.sin(time * 0.02) * 4;
        ctx.fillStyle = '#F97316';
        ctx.beginPath();
        ctx.ellipse(px + 18 + step, py + 50, 5, 3, 0, 0, Math.PI * 2);
        ctx.ellipse(px + 30 - step, py + 50, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      g.animationFrameId = requestAnimationFrame(loop);
    };

    gameRef.current.animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(gameRef.current.animationFrameId);
    };
  }, [gameState, score, distance, lives, sunflowersCollected, highScore, soundEnabled]);

  // Handle answering bonus trivia
  const handleAnswerTrivia = (optIdx: number) => {
    if (triviaAnswered || !trivia) return;
    setTriviaAnswered(true);
    const isRight = optIdx === trivia.correct;
    setTriviaCorrect(isRight);

    if (isRight) {
      if (soundEnabled) sounds.playEcoChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      // 50% score bonus!
      setScore(prev => Math.floor(prev * 1.5));
    } else {
      if (soundEnabled) sounds.playHit();
    }
  };

  // Convert Score to App Eco Points
  const handleClaimPoints = () => {
    if (pointsClaimed) return;
    const earnedBonus = Math.max(10, Math.floor(score / 15));
    if (onAddPoints) {
      onAddPoints(earnedBonus);
    }
    setPointsClaimed(true);
    if (soundEnabled) sounds.playEcoChime();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  return (
    <div id="eco-runaway-game-root" className="space-y-6 animate-fadeIn">
      {/* Return to Quest Map Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('map');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#d6c7b2] text-xs font-bold text-stone-700 transition-colors shadow-2xs"
        >
          <Compass className="w-4 h-4 text-[#387249]" />
          <span>{language === 'ja' ? '🗺️ 冒険マップへ戻る' : '🗺️ Back to World Map'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900">
            {language === 'ja' ? `ハイスコア: ${highScore} pts` : `High Score: ${highScore} pts`}
          </span>
        </div>
      </div>

      {/* Top Banner & Game Lore */}
      <div className="bg-gradient-to-r from-[#8a4e0a] via-[#b86d1b] to-[#733f06] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border-2 border-[#5c3205]">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold uppercase tracking-wider text-amber-200">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              {language === 'ja' ? 'エコ・アクションアーケード' : 'Eco Action Arcade Game'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {language === 'ja' ? 'シャトミンの脱出大作戦' : "Shatomin's Eco Runaway"}
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
              {language === 'ja'
                ? '煙突の煙やプラスチックごみを軽やかにジャンプ＆スライディングで回避！ひまわりやクリーンエネルギーを集めて、CO₂を削減しながらゴールを目指そう！'
                : 'Jump and slide to dodge smog clouds, smokestacks, and plastic hazards! Collect sunflowers and renewable power orbs to reduce CO₂!'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>{language === 'ja' ? `ハイスコア: ${highScore} pts` : `High Score: ${highScore} pts`}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <Sun className="w-4 h-4 text-yellow-300" />
                <span>{language === 'ja' ? `集めたひまわり: ${sunflowersCollected} 本` : `Sunflowers: ${sunflowersCollected}`}</span>
              </div>
            </div>
          </div>

          {/* Quick Mascot avatar */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/30 cursor-pointer hover:scale-105 transition-all shadow-inner"
              onClick={() => sounds.playShatominSqueak(1)}
              title={language === 'ja' ? 'シャトミンと走ろう！' : 'Run with Shatomin!'}
            >
              <ShatominAvatar expression="wink" size="lg" />
            </div>
            <span className="text-xs text-amber-100 mt-2 font-medium">
              {language === 'ja' ? 'ナイスショットで走ろうシャト！🏃‍♂️' : "Let's dash together! 🏃‍♂️"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Canvas Game Stage */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-[#e6dbc8] shadow-md space-y-4">
        {/* HUD Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fdfbf7] rounded-2xl p-3 sm:p-4 border border-[#e6dbc8]">
          <div className="flex items-center space-x-4">
            {/* Lives */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map(i => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${
                    i <= lives ? 'fill-rose-500 text-rose-500' : 'fill-stone-200 text-stone-300'
                  }`}
                />
              ))}
            </div>

            {/* Score & Multiplier */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black text-stone-900">{score}</span>
              <span className="text-xs text-stone-500 font-bold">PTS</span>
              {isInvincible && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] animate-pulse">
                  2X SUPER BOOST!
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-bold text-stone-700">
            <div>
              {language === 'ja' ? '距離' : 'Dist'}: <span className="text-emerald-700 font-mono">{distance}m</span>
            </div>
            <div>
              {language === 'ja' ? 'CO₂削減' : 'CO₂ Saved'}: <span className="text-teal-700 font-mono">{co2SavedKg}kg</span>
            </div>

            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 transition-colors"
              title={soundEnabled ? '音声をミュート' : '音声をON'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Canvas Game Area */}
        <div className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-[16/7] max-h-[360px] bg-sky-100 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={750}
            height={320}
            className="w-full h-full object-cover block"
          />

          {/* Idle / Start Overlay */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-6 space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold">{language === 'ja' ? 'シャトミンの脱出大作戦' : "Shatomin's Eco Runaway"}</h3>
                <p className="text-xs text-stone-200">
                  {language === 'ja' ? 'スペースキーまたは「スタート」ボタンで走りはじめるシャト！' : 'Press Space or click Start to begin running!'}
                </p>
              </div>
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm transition-all shadow-md transform hover:scale-105"
              >
                {language === 'ja' ? 'ゲームスタート！' : 'Start Game!'}
              </button>
            </div>
          )}

          {/* Paused Overlay */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-6 space-y-3">
              <h3 className="text-xl font-bold">{language === 'ja' ? '一時停止中 (PAUSED)' : 'Game Paused'}</h3>
              <button
                onClick={() => setGameState('playing')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs"
              >
                {language === 'ja' ? '再開する' : 'Resume'}
              </button>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 overflow-y-auto">
              <div className="max-w-md w-full bg-white text-stone-900 rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="text-xs font-bold text-rose-600 uppercase">Game Over</span>
                  <span className="text-xs font-semibold text-stone-500">{language === 'ja' ? 'ナイスラン！' : 'Great Run!'}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-black text-emerald-700">{score} <span className="text-sm font-bold">PTS</span></div>
                  <p className="text-xs text-stone-600">
                    {language === 'ja' ? `走行距離: ${distance}m | 削減CO₂: ${co2SavedKg}kg` : `Distance: ${distance}m | CO₂ Saved: ${co2SavedKg}kg`}
                  </p>
                </div>

                {/* Eco Trivia Bonus Challenge */}
                {trivia && !pointsClaimed && (
                  <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-left space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      {language === 'ja' ? 'エコクイズチャレンジ (スコア1.5倍チャンス！)' : 'Eco Trivia Challenge (1.5x Multiplier!)'}
                    </div>
                    <p className="text-xs text-stone-800 font-medium">
                      {language === 'ja' ? trivia.qJa : trivia.qEn}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {(language === 'ja' ? trivia.optionsJa : trivia.optionsEn).map((opt, idx) => (
                        <button
                          key={idx}
                          disabled={triviaAnswered}
                          onClick={() => handleAnswerTrivia(idx)}
                          className={`p-2 rounded-xl text-[11px] font-medium border text-left transition-colors ${
                            triviaAnswered
                              ? idx === trivia.correct
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                                : 'bg-stone-100 border-stone-200 text-stone-400'
                              : 'bg-white border-amber-200 hover:bg-amber-100/60 text-stone-800'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {triviaAnswered && (
                      <div className="text-[11px] font-bold text-emerald-800 pt-1">
                        {triviaCorrect 
                          ? (language === 'ja' ? '🎉 大正解！スコアが1.5倍になりました！' : '🎉 Correct! Score boosted 1.5x!')
                          : (language === 'ja' ? '惜しい！次回も頑張ろうシャト！' : 'Not quite! Better luck next time!')}
                      </div>
                    )}
                  </div>
                )}

                {/* Point Conversion Button */}
                <div className="pt-1">
                  <button
                    disabled={pointsClaimed}
                    onClick={handleClaimPoints}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                      pointsClaimed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                        : 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>
                      {pointsClaimed 
                        ? (language === 'ja' ? 'エコポイント獲得済み！' : 'Eco Points Claimed!') 
                        : (language === 'ja' ? `エコポイントに換算して保存 (+${Math.max(10, Math.floor(score / 15))} pts)` : `Convert to Eco Points (+${Math.max(10, Math.floor(score / 15))} pts)`)}
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={startGame}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {language === 'ja' ? 'もう一度プレイ' : 'Play Again'}
                  </button>
                  <button
                    onClick={() => setActiveTab('shatomin')}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                  >
                    {language === 'ja' ? 'シャトミンの部屋へ ❯' : "Shatomin's Room ❯"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile / Responsive On-Screen Controls */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onMouseDown={handleJump}
            onTouchStart={(e) => { e.preventDefault(); handleJump(); }}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95 select-none"
          >
            <ArrowUp className="w-5 h-5" />
            <span>{language === 'ja' ? 'ジャンプ (2段可)' : 'Jump (Double Jump)'}</span>
          </button>

          <button
            onMouseDown={() => handleSlide(true)}
            onMouseUp={() => handleSlide(false)}
            onTouchStart={(e) => { e.preventDefault(); handleSlide(true); }}
            onTouchEnd={(e) => { e.preventDefault(); handleSlide(false); }}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-teal-700 active:bg-teal-800 text-white font-bold text-sm shadow-md transition-transform active:scale-95 select-none"
          >
            <ArrowDown className="w-5 h-5" />
            <span>{language === 'ja' ? 'スライディング (かがむ)' : 'Slide / Duck'}</span>
          </button>
        </div>

        {/* Instructions & Game Rules */}
        <div className="bg-[#fdfbf7] rounded-2xl p-4 border border-[#e6dbc8] text-xs text-stone-700 space-y-2">
          <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            {language === 'ja' ? '操作方法とエコアイテム' : 'Controls & Items'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-stone-600">
            <div>
              <strong>⌨️ {language === 'ja' ? '操作' : 'Controls'}:</strong> {language === 'ja' ? 'スペース / ↑ (ジャンプ)、↓ (スライディング)' : 'Space / Up (Jump), Down (Slide)'}
            </div>
            <div>
              <strong>🏸 {language === 'ja' ? 'ゴールデンシャトル' : 'Golden Shuttle'}:</strong> {language === 'ja' ? '6秒間無敵＆スコア2倍のスーパーブースト！' : '6s invincibility & 2x score multiplier!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
