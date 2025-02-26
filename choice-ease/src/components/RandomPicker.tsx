"use client";
import { useState } from 'react';
import { Task } from '@/types';

interface RandomPickerProps {
  tasks: Task[];
  onSelect: (task: Task | null) => void;
}

export default function RandomPicker({ tasks, onSelect }: RandomPickerProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  
  const pickRandom = () => {
    // 完了していないタスクだけをフィルタリング
    const incompleteTasks = tasks.filter(task => !task.completed);
    
    if (incompleteTasks.length === 0) {
      onSelect(null);
      return;
    }
    
    // スピンエフェクト開始
    setIsSpinning(true);
    
    // より視覚的なアニメーション
    const duration = 3000; // 3秒間
    const startTime = Date.now();
    const startRotation = rotationDeg;
    // 最終的に360度の倍数になるように調整（きれいな位置で止まる）
    const totalRotation = Math.ceil((1080 + Math.random() * 720) / 360) * 360;
    
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // イージング関数（より滑らかな減速）
      const easeOut = (t: number) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4);
      };
      const currentRotation = startRotation + totalRotation * easeOut(progress);
      setRotationDeg(currentRotation % 360); // 360度を超えないように正規化

      if (progress < 1) {
        // ランダムなインデックスを生成
        const randomIndex = Math.floor(Math.random() * incompleteTasks.length);
        onSelect(incompleteTasks[randomIndex]);
        
        requestAnimationFrame(animate);
      } else {
        // 最終選択
        const finalIndex = Math.floor(Math.random() * incompleteTasks.length);
        onSelect(incompleteTasks[finalIndex]);
        setIsSpinning(false);
        // アニメーション終了時に回転を0に戻す
        setRotationDeg(0);
      }
    };
    
    animate();
  };
  
  return (
    <div>
      <button
        onClick={pickRandom}
        disabled={isSpinning || tasks.filter(t => !t.completed).length === 0}
        className={`
          px-8 py-4 rounded-full text-white font-bold text-lg
          transform transition-all duration-200
          shadow-lg hover:shadow-xl
          ${isSpinning ? 'bg-gray-500 scale-95' : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-105'}
          ${tasks.filter(t => !t.completed).length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{
          transform: `rotate(${rotationDeg}deg)`,
        }}
      >
        <span className="inline-block" style={{ transform: `rotate(-${rotationDeg}deg)` }}>
          {isSpinning ? '選択中...' : '次にやることをランダムに選ぶ'}
        </span>
      </button>
    </div>
  );
}