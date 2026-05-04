import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import NumberStepper from '../components/NumberStepper';
import AppButton from '../components/AppButton';
import SimulationModal from '../components/SimulationModal';
import LanguagePicker from '../components/LanguagePicker';
import CharacterLineup from '../components/CharacterLineup';
import GameTitle from '../components/GameTitle';
import { GemPip, HudCorners } from '../components/GameIcon';
import { GameConfig } from '../types/game';
import {
  simulateSpyDistribution,
  SimulationResult,
} from '../utils/simulateRoles';
import { useI18n } from '../i18n';
import { colors, radius, shadows, spacing } from '../theme';

interface Props {
  onStart: (config: GameConfig) => void;
}

export default function SetupScreen({ onStart }: Props) {
  const { t, isRTL, formatNumber } = useI18n();
  const [totalPlayers, setTotalPlayers] = useState(5);
  const [spies, setSpies] = useState(1);
  const [duration, setDuration] = useState(10);
  const [error, setError] = useState('');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simVisible, setSimVisible] = useState(false);
  const citizens = totalPlayers - spies;

  // Staggered fade-up entrance for each section.
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 480,
      useNativeDriver: true,
    }).start();
  }, []);

  const stagger = (delay: number) => {
    const opacity = enter.interpolate({
      inputRange: [0, Math.min(1, delay / 600 + 0.1), 1],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });
    const translateY = enter.interpolate({
      inputRange: [0, 1],
      outputRange: [16 + delay / 30, 0],
    });
    return { opacity, transform: [{ translateY }] };
  };

  const handleDebugSimulate = () => {
    const result = simulateSpyDistribution(4, 1, 100);
    setSimResult(result);
    setSimVisible(true);
  };

  const validate = (): string | null => {
    if (totalPlayers < 3) return t.errMinPlayers;
    if (spies < 1) return t.errMinSpies;
    if (citizens < 1) return t.errMinCitizens;
    if (duration < 1) return t.errMinDuration;
    return null;
  };

  const handleStart = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    onStart({ totalPlayers, citizens, spies, duration });
  };

  const setTotal = (v: number) => {
    setTotalPlayers(v);
    setSpies(Math.min(spies, v - 1));
  };
  const setSpyCount = (v: number) => {
    setSpies(v);
  };

  const textAlign = isRTL ? 'right' : 'left';
  const cleanTitle = t.appTitle.replace(/[^\p{L}\p{N} ]/gu, '').trim();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[styles.topHud, stagger(0)]}>
        <View style={styles.rankSeal}>
          <Text style={styles.rankText}>{formatNumber(totalPlayers)}</Text>
        </View>
        <View style={styles.hudPill}>
          <GemPip size={7} color={colors.citizen} />
          <Text style={styles.hudText}>{formatNumber(citizens)}</Text>
        </View>
        <View style={styles.hudPill}>
          <GemPip size={7} color={colors.spy} />
          <Text style={styles.hudText}>{formatNumber(spies)}</Text>
        </View>
        <View style={styles.hudPill}>
          <GemPip size={7} color={colors.primary} />
          <Text style={styles.hudText}>{formatNumber(duration)}</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.header, stagger(0)]}>
        <CharacterLineup />
        <GameTitle title={cleanTitle} subtitle={t.realmTagline} />
      </Animated.View>

      <Animated.View style={[styles.card, stagger(80)]}>
        <HudCorners color={colors.accent} size={10} thickness={1.5} inset={6} />
        <LanguagePicker />
      </Animated.View>

      <Animated.View style={[styles.card, stagger(160)]}>
        <HudCorners color={colors.accent} size={10} thickness={1.5} inset={6} />
        <View style={styles.sectionHeader}>
          <GemPip size={8} color={colors.accent} />
          <Text style={[styles.sectionLabel, { textAlign }]}>
            {t.totalPlayers}
          </Text>
        </View>
        <View style={styles.sectionBody}>
          <NumberStepper
            label={t.totalPlayers}
            value={totalPlayers}
            min={3}
            max={20}
            onChange={setTotal}
          />
          <View style={styles.divider} />
          <NumberStepper
            label={t.spies}
            value={spies}
            min={1}
            max={totalPlayers - 1}
            onChange={setSpyCount}
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.card, stagger(240)]}>
        <HudCorners color={colors.accent} size={10} thickness={1.5} inset={6} />
        <NumberStepper
          label={t.durationMinutes}
          value={duration}
          min={1}
          max={60}
          onChange={setDuration}
        />
      </Animated.View>

      {error !== '' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={[styles.errorText, { textAlign }]}>{error}</Text>
        </View>
      )}

      <Animated.View style={[styles.startWrap, stagger(320)]}>
        <AppButton title={t.startGame} onPress={handleStart} fullWidth />
      </Animated.View>

      <Pressable
        onPress={handleDebugSimulate}
        style={({ pressed }) => [
          styles.debugLink,
          pressed && { opacity: 0.6 },
        ]}
      >
        <Text style={styles.debugLinkText}>{t.simulateButton}</Text>
      </Pressable>

      <SimulationModal
        visible={simVisible}
        result={simResult}
        onClose={() => setSimVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  topHud: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255,248,232,0.70)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  rankSeal: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F8E4A9',
  },
  rankText: {
    color: colors.textOnAccent,
    fontSize: 14,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  hudPill: {
    minWidth: 48,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  hudText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: 'rgba(255,248,232,0.92)',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    position: 'relative',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  sectionBody: {},
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoftBorder,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  errorIcon: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
  },
  errorText: {
    flex: 1,
    color: colors.dangerText,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  startWrap: {
    marginTop: spacing.md,
  },
  debugLink: {
    alignSelf: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  debugLinkText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
