import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing } from '../theme';
import { GemPip } from './GameIcon';

interface Props {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

// Premium fantasy title treatment: dark ink text, gold underlines,
// and small crest details without requiring a custom font.
export default function GameTitle({ title, subtitle, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.titleStack}>
        <Text
          style={[styles.title, styles.titleShadow]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
        >
          {title}
        </Text>
        <Text
          style={[styles.title, styles.titleCap]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
        >
          {title}
        </Text>
      </View>
      <View style={styles.titleRule}>
        <View style={styles.ruleWing} />
        <View style={styles.ruleGem} />
        <View style={styles.ruleWing} />
      </View>
      {subtitle ? (
        <View style={styles.subRow}>
          <View style={styles.subBar} />
          <GemPip size={8} color={colors.accent} />
          <Text
            style={styles.subtitle}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
          >
            {subtitle}
          </Text>
          <GemPip size={8} color={colors.accent} />
          <View style={styles.subBar} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '100%',
  },
  titleStack: {
    position: 'relative',
    width: '100%',
    minHeight: 44,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'center',
  } as TextStyle,
  titleShadow: {
    color: 'rgba(255,255,255,0.92)',
    position: 'absolute',
    top: 2,
    left: 2,
    right: 0,
    opacity: 0.95,
  } as TextStyle,
  titleCap: {
    color: colors.textPrimary,
  } as TextStyle,
  titleRule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  ruleWing: {
    width: 54,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.accent,
    opacity: 0.78,
  },
  ruleGem: {
    width: 9,
    height: 9,
    backgroundColor: colors.accent,
    transform: [{ rotate: '45deg' }],
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    maxWidth: '100%',
  },
  subBar: {
    width: 28,
    height: 1.5,
    backgroundColor: 'rgba(201,150,66,0.45)',
  },
  subtitle: {
    flexShrink: 1,
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  } as TextStyle,
});
