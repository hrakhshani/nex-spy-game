import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SimulationResult } from '../utils/simulateRoles';
import { useI18n } from '../i18n';
import { colors, radius, shadows, spacing } from '../theme';

interface Props {
  visible: boolean;
  result: SimulationResult | null;
  onClose: () => void;
}

export default function SimulationModal({ visible, result, onClose }: Props) {
  const { t, formatNumber, isRTL } = useI18n();

  if (!result) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.backdrop} />
      </Modal>
    );
  }

  const max = Math.max(...result.spyCountsByPosition, 1);
  const expectedPct = (result.spies / result.totalPlayers) * 100;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.handle} />

          <Text style={styles.title}>{t.simResultsTitle}</Text>
          <Text style={styles.subtitle}>
            {t.simResultsSubtitle(
              formatNumber(result.iterations),
              formatNumber(result.totalPlayers),
              formatNumber(result.spies)
            )}
          </Text>

          <View style={styles.expectedPill}>
            <Text style={styles.expectedText}>
              {t.simExpected(
                formatNumber(Math.round(expectedPct)),
                formatNumber(Math.round(result.expected))
              )}
            </Text>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {result.spyCountsByPosition.map((count, idx) => {
              const pct = (count / result.iterations) * 100;
              const widthPct = (count / max) * 100;
              return (
                <View
                  key={idx}
                  style={[
                    styles.row,
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                >
                  <Text
                    style={[
                      styles.position,
                      { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {t.simPlayer(formatNumber(idx + 1))}
                  </Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { width: `${widthPct}%` }]} />
                  </View>
                  <Text
                    style={[
                      styles.count,
                      { textAlign: isRTL ? 'left' : 'right' },
                    ]}
                  >
                    {formatNumber(count)} ({formatNumber(Math.round(pct))}
                    {t.percentSign})
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.notesBox}>
            <Text style={styles.note}>{t.simEngineNote}</Text>
            <Text style={styles.note}>
              {t.simSampleNote(result.randomSampleSeed.toFixed(6))}
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.closeText}>{t.close}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(54,39,24,0.42)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    width: '100%',
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  expectedPill: {
    alignSelf: 'center',
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoftBorder,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginBottom: spacing.lg,
  },
  expectedText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  scroll: {
    maxHeight: 320,
    marginBottom: spacing.md,
  },
  row: {
    alignItems: 'center',
    marginVertical: 5,
    gap: spacing.sm,
  },
  position: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    width: 70,
  },
  barContainer: {
    flex: 1,
    height: 16,
    backgroundColor: colors.bgInset,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  count: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    width: 80,
  },
  notesBox: {
    backgroundColor: colors.bgInset,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  note: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  closeBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    ...shadows.button,
  },
  closeText: {
    color: colors.textOnAccent,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
