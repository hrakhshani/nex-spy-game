import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AppButton from '../components/AppButton';
import CharacterAvatar from '../components/CharacterAvatar';
import { GemPip, HudCorners } from '../components/GameIcon';
import { useI18n } from '../i18n';
import { colors, radius, spacing } from '../theme';

interface Props {
  duration: number;
  onStartTimer: () => void;
}

export default function ReadyScreen({ duration, onStartTimer }: Props) {
  const { t, formatNumber } = useI18n();
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringSpin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 80,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(ringSpin, {
        toValue: 1,
        duration: 9000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spinDeg = ringSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconWrap,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View
          style={[styles.glow, { transform: [{ scale: pulseAnim }] }]}
        />
        {/* Slowly rotating gem ring around the champion */}
        <Animated.View
          style={[styles.gemRing, { transform: [{ rotate: spinDeg }] }]}
        >
          <View style={[styles.gemSlot, styles.gemTop]}>
            <GemPip size={10} color={colors.accent} />
          </View>
          <View style={[styles.gemSlot, styles.gemBottom]}>
            <GemPip size={10} color={colors.accent} />
          </View>
          <View style={[styles.gemSlot, styles.gemLeft]}>
            <GemPip size={8} color={colors.accent} hollow />
          </View>
          <View style={[styles.gemSlot, styles.gemRight]}>
            <GemPip size={8} color={colors.accent} hollow />
          </View>
        </Animated.View>
        <CharacterAvatar
          variant="champion"
          size="lg"
          glow
          showName
          name={t.championName}
        />
      </Animated.View>

      <Animated.View style={{ opacity: opacityAnim, alignItems: 'center' }}>
        <View style={styles.titleStack}>
          <Text style={[styles.title, styles.titleShadow]}>
            {t.rolesDistributed}
          </Text>
          <Text style={[styles.title, styles.titleCap]}>
            {t.rolesDistributed}
          </Text>
        </View>

        <View style={styles.durationPill}>
          <HudCorners color={colors.accent} size={8} thickness={1.5} inset={4} />
          <Text style={styles.durationIcon}>⏱</Text>
          <Text style={styles.durationText}>
            {t.gameDuration(formatNumber(duration))}
          </Text>
        </View>
      </Animated.View>

      <View style={styles.actionWrap}>
        <AppButton title={t.startTimer} onPress={onStartTimer} fullWidth />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  iconWrap: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accentSoft,
  },
  gemRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gemSlot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gemTop: { top: 0 },
  gemBottom: { bottom: 0 },
  gemLeft: { left: 0, top: '50%', marginTop: -5 },
  gemRight: { right: 0, top: '50%', marginTop: -5 },
  titleStack: {
    position: 'relative',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  titleShadow: {
    color: 'rgba(255,255,255,0.92)',
    position: 'absolute',
    top: 3,
    left: 2,
    right: 2,
    opacity: 0.85,
  },
  titleCap: {
    color: colors.textPrimary,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bgCard,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    position: 'relative',
  },
  durationIcon: {
    fontSize: 16,
  },
  durationText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  actionWrap: {
    width: '100%',
    marginTop: spacing.md,
  },
});
