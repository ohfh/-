import React, { useEffect, useRef } from 'react';

interface AmbientCanvasProps {
  type: 'stars' | 'gold-dust' | 'clouds';
  className?: string;
}

export const AmbientCanvas: React.FC<AmbientCanvasProps> = ({ type, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle setup
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      maxAlpha: number;
      dAlpha: number;
    }

    const particles: Particle[] = [];
    const count = type === 'stars' ? 80 : type === 'gold-dust' ? 55 : 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === 'stars' ? Math.random() * 2 + 0.8 : Math.random() * 3.5 + 1.2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: type === 'gold-dust' ? -(Math.random() * 0.4 + 0.2) : (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.8 + 0.2,
        maxAlpha: Math.random() * 0.6 + 0.4,
        dAlpha: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric background gradient
      if (type === 'stars') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#020617');
        bgGrad.addColorStop(1, '#090d16');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (type === 'gold-dust') {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#0c0a09');
        bgGrad.addColorStop(1, '#1c1917');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Clouds / Sky
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#022c22');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += p.dAlpha;

        if (p.alpha > p.maxAlpha || p.alpha < 0.1) {
          p.dAlpha = -p.dAlpha;
        }

        // Loop boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (type === 'stars') {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, p.alpha)})`;
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = '#93c5fd';
        } else if (type === 'gold-dust') {
          ctx.fillStyle = `rgba(234, 179, 8, ${Math.max(0.1, p.alpha)})`;
          ctx.shadowBlur = p.size * 4;
          ctx.shadowColor = '#fbbf24';
        } else {
          ctx.fillStyle = `rgba(52, 211, 153, ${Math.max(0.05, p.alpha * 0.7)})`;
          ctx.shadowBlur = p.size * 5;
          ctx.shadowColor = '#10b981';
        }

        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [type]);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />;
};
