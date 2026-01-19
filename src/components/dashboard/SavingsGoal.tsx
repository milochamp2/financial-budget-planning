'use client';

import React from 'react';
import { Target, TrendingUp, AlertTriangle, Check } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { ProgressRing } from '../ui/ProgressRing';
import { useBudget } from '@/context/BudgetContext';

export function SavingsGoal() {
  const { state, summary, setSavingsGoal, formatCurrency } = useBudget();

  const goalProgress = summary.totalIncome > 0
    ? Math.min(100, (summary.savingsRate / state.savingsGoal) * 100)
    : 0;

  const isOnTrack = summary.savingsRate >= state.savingsGoal;
  const difference = summary.savingsRate - state.savingsGoal;

  const targetSavings = (summary.totalIncome * state.savingsGoal) / 100;
  const actualSavings = summary.totalSavings;

  return (
    <GlassCard className="p-6" glowColor={isOnTrack ? '#22c55e20' : '#f59e0b20'}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${isOnTrack ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
          <Target className={`w-5 h-5 ${isOnTrack ? 'text-emerald-400' : 'text-amber-400'}`} />
        </div>
        <h3 className="text-lg font-semibold text-white">Savings Goal</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <ProgressRing
            progress={goalProgress}
            size={160}
            strokeWidth={12}
            color={isOnTrack ? '#22c55e' : '#f59e0b'}
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{summary.savingsRate.toFixed(0)}%</p>
              <p className="text-sm text-gray-400">saved</p>
            </div>
          </ProgressRing>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            {isOnTrack ? (
              <>
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">On track!</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 font-medium">Below target</span>
              </>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target</span>
              <span className="text-white font-medium">{state.savingsGoal}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current</span>
              <span className="text-white font-medium">{summary.savingsRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Difference</span>
              <span className={`font-medium ${difference >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {difference >= 0 ? '+' : ''}{difference.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Target savings</span>
              <span className="text-white">{formatCurrency(targetSavings)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Actual savings</span>
              <span className={actualSavings >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {formatCurrency(actualSavings)}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-sm text-gray-400 mb-2">Adjust Goal (%)</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={state.savingsGoal}
              onChange={(e) => setSavingsGoal(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
