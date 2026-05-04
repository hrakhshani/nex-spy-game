import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import AppButton from '../components/AppButton';
import CharacterAvatar from '../components/CharacterAvatar';
import { GemPip, HudCorners } from '../components/GameIcon';
import { useI18n } from '../i18n';
import { colors, radius, shadows, spacing } from '../theme';

interface Props {
  duration: number; // minutes
  onRestart: () => void;
}

const SEGMENTS = 12; // HUD segmented progress bar count

export default function TimerScreen({ duration, onRestart }: Props) {
  const { t, formatTime } = useI18n();
  const totalSeconds = duration * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(true);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tickAnim = useRef(new Animated.Value(1)).current; // each-second pulse
  const lowPulse = useRef(new Animated.Value(0)).current; // shake/flash on low time
  const finishedScale = useRef(new Animated.Value(0.6)).current;
  const finishedOpacity = useRef(new Animated.Value(0)).current;
  const liveBlink = useRef(new Animated.Value(1)).current;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (running && !finished) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setRunning(false);
            setFinished(true);
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [running, finished, clearTimer]);

  // Tick pulse on every second tick.
  useEffect(() => {
    if (finished) return;
    Animated.sequence([
      Animated.timing(tickAnim, {
        toValue: 1.04,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(tickAnim, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [remaining, finished]);

  // Live indicator blink.
  useEffect(() => {
    if (!running || finished) {
      liveBlink.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(liveBlink, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(liveBlink, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [running, finished]);

  // Low-time pulse.
  useEffect(() => {
    if (finished) return;
    if (remaining <= 30) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(lowPulse, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(lowPulse, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      lowPulse.setValue(0);
    }
  }, [remaining, finished]);

  useEffect(() => {
    if (finished) {
      Animated.parallel([
        Animated.spring(finishedScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 90,
        }),
        Animated.timing(finishedOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [finished]);

  const togglePause = () => {
    setRunning((prev) => !prev);
  };

  const isLowTime = !finished && remaining <= 30;
  const progress = remaining / totalSeconds;
  const filledSegments = Math.ceil(progress * SEGMENTS);

  return (
    <View style={styles.container}>
      {finished ? (
        <Animated.View
          style={[
            styles.finishedWrap,
            {
              opacity: finishedOpacity,
              transform: [{ scale: finishedScale }],
            },
          ]}
        >
          <View style={styles.finishedIconWrap}>
            <HudCorners color={colors.danger} size={14} thickness={2} inset={10} />
            <Text style={styles.finishedEmoji}>⏰</Text>
          </View>
          <View style={styles.titleStack}>
            <Text style={[styles.finishedText, styles.finishedShadow]}>
              {t.timeUp}
            </Text>
            <Text style={[styles.finishedText, styles.finishedCap]}>
              {t.timeUp}
            </Text>
          </View>
          <View style={{ height: spacing.xl }} />
          <AppButton title={t.newGame} onPress={onRestart} variant="danger" fullWidth />
        </Animated.View>
      ) : (
        <>
          <View style={styles.timerCard}>
            <HudCorners
              color={isLowTime ? colors.danger : colors.accent}
              size={18}
              thickness={2}
              inset={12}
            />

            <View style={styles.companionRow}>
              <CharacterAvatar variant="hero" size="sm" />
              <View style={styles.statusPill}>
                <Animated.View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: running ? colors.citizen : colors.warning,
                      opacity: running ? liveBlink : 1,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: running ? colors.citizen : colors.warning },
                  ]}
                >
                  {running ? 'LIVE' : 'PAUSED'}
                </Text>
              </View>
              <CharacterAvatar variant="shadow" size="sm" />
            </View>

            <Animated.Text
              style={[
                styles.timer,
                isLowTime && { color: colors.danger },
                { transform: [{ scale: tickAnim }] },
              ]}
            >
              {formatTime(remaining)}
            </Animated.Text>

            {/* HUD segmented progress */}
            <View style={styles.segments}>
              {Array.from({ length: SEGMENTS }).map((_, i) => {
                const isOn = i < filledSegments;
                return (
                  <View
                    key={i}
                    style={[
                      styles.segment,
                      {
                        backgroundColor: isOn
                          ? isLowTime
                            ? colors.danger
                            : colors.primary
                          : 'rgba(255,255,255,0.52)',
                        borderColor: isOn
                          ? isLowTime
                            ? colors.dangerSoftBorder
                            : colors.primaryLight
                          : colors.border,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Bottom HUD label row */}
            <View style={styles.metaRow}>
              <GemPip size={6} color={colors.accent} />
              <Text style={styles.metaText}>
                {t.gameDuration(String(duration))}
              </Text>
              <GemPip size={6} color={colors.accent} />
            </View>
          </View>

          <View style={styles.buttons}>
            <AppButton
              title={running ? t.pause : t.resume}
              onPress={togglePause}
              variant="secondary"
              icon={running ? '⏸' : '▶'}
              fullWidth
            />
            <AppButton
              title={t.newGame}
              onPress={onRestart}
              variant="ghost"
              fullWidth
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xxl,
  },
  timerCard: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.xxl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    ...shadows.card,
    position: 'relative',
  },
  companionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.lg,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  timer: {
    color: colors.textPrimary,
    fontSize: 88,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
    marginBottom: spacing.xl,
    lineHeight: 96,
  },
  segments: {
    flexDirection: 'row',
    gap: 4,
    width: '100%',
    marginBottom: spacing.lg,
  },
  segment: {
    flex: 1,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  buttons: {
    width: '100%',
    gap: spacing.md,
    alignItems: 'center',
  },
  finishedWrap: {
    width: '100%',
    alignItems: 'center',
  },
  finishedIconWrap: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.dangerSoft,
    borderWidth: 2,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.buttonDanger,
  },
  finishedEmoji: {
    fontSize: 64,
  },
  titleStack: {
    position: 'relative',
  },
  finishedText: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  finishedShadow: {
    color: 'rgba(255,255,255,0.88)',
    position: 'absolute',
    top: 3,
    left: 2,
    opacity: 0.85,
  },
  finishedCap: {
    color: colors.danger,
  },
});
