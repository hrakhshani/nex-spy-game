import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useI18n, LANGUAGES, Lang } from '../i18n';
import { colors, radius, spacing } from '../theme';

export default function LanguagePicker() {
  const { lang, setLang, t, isRTL } = useI18n();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t.language}
      </Text>
      <View style={styles.row}>
        {LANGUAGES.map((l) => {
          const active = l.code === lang;
          return (
            <Pressable
              key={l.code}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setLang(l.code as Lang);
              }}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && !active && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {l.nativeLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.60)',
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  chipPressed: {
    backgroundColor: colors.bgCardElevated,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.textOnAccent,
  },
});
