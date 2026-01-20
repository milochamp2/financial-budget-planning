'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Input } from './Input';
import { Button } from './Button';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsAnimating(true);
    setTimeout(() => {
      onComplete(name.trim());
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-950 transition-opacity duration-500 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-fuchsia-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        <GlassCard className="p-8" glowColor="#8b5cf640">
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30 mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to BudgetFlow
            </h1>
            <p className="text-gray-400">
              Your smart financial planning companion
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
                What should we call you?
              </label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center text-lg"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              icon={<ArrowRight className="w-5 h-5" />}
              disabled={!name.trim()}
            >
              Get Started
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Your data stays private and is stored locally on your device
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
