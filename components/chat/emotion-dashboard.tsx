"use client";

import { EmotionStats } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Smile, Trophy, Lightbulb, Sparkles, MessageCircle } from "lucide-react";

interface EmotionDashboardProps {
  stats: EmotionStats;
}

const emotionConfig = {
  motivation: {
    label: "Motivation",
    icon: Lightbulb,
    colorClass: "text-emotion-motivation",
    bgClass: "bg-emotion-motivation/10",
  },
  sadness: {
    label: "Sadness",
    icon: Heart,
    colorClass: "text-emotion-sadness",
    bgClass: "bg-emotion-sadness/10",
  },
  success: {
    label: "Success",
    icon: Trophy,
    colorClass: "text-emotion-success",
    bgClass: "bg-emotion-success/10",
  },
  life: {
    label: "Life",
    icon: Sparkles,
    colorClass: "text-emotion-life",
    bgClass: "bg-emotion-life/10",
  },
  love: {
    label: "Love",
    icon: Heart,
    colorClass: "text-emotion-love",
    bgClass: "bg-emotion-love/10",
  },
  greeting: {
    label: "Greetings",
    icon: Smile,
    colorClass: "text-emotion-greeting",
    bgClass: "bg-emotion-greeting/10",
  },
};

export function EmotionDashboard({ stats }: EmotionDashboardProps) {
  const totalDetections = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <Card className="border-sidebar-border bg-sidebar">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-sidebar-foreground flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Detected Emotions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {totalDetections === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">
            Start chatting to see emotion analysis
          </p>
        ) : (
          <div className="space-y-2">
            {Object.entries(stats).map(([emotion, count]) => {
              const config = emotionConfig[emotion as keyof typeof emotionConfig];
              const Icon = config.icon;
              const percentage = totalDetections > 0 ? (count / totalDetections) * 100 : 0;

              return (
                <div key={emotion} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${config.bgClass}`}>
                        <Icon className={`h-3 w-3 ${config.colorClass}`} />
                      </div>
                      <span className="text-sidebar-foreground">{config.label}</span>
                    </div>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${config.bgClass.replace('/10', '')}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
