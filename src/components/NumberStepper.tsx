import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useI18n } from '../i18n';
import { colors, radius, spacing } from '../theme';

interface Props {
  label: string;
  value: number;
  min?: number;
  max?: number;
  hint?: string;
  onChange: (v: number) => void;
}

export default function NumberStepper({
  label,
  value,
  min = 0,
  max = 99,
  hint,
  onChange,
}: Props) {
  const { formatNumber, isRTL } = useI18n();
  const valueAnim = useRef(new Animated.Value(1)).current;

  const bump = () => {
    Animated.sequence([
      Animated.timing(valueAnim, {
        toValue: 1.22,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(valueAnim, {
        toValue: 1,
        friction: 5,
        tension: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const decrement = () => {
    if (value > min) {
      Haptics.selectionAsync().catch(() => {});
      bump();
      onChange(value - 1);
    }
  };
  const increment = () => {
    if (value < max) {
      Haptics.selectionAsync().catch(() => {});
      bump();
      onChange(value + 1);
    }
  };

  const minDisabled = value <= min;
  const maxDisabled = value >= max;

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      >
        <View style={styles.labelCol}>
          <Text
            style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.86}
          >
            {label}
          </Text>
          {hint ? (
            <Text style={[styles.hint, { textAlign: isRTL ? 'right' : 'left' }]}>
              {hint}
            </Text>
          ) : null}
        </View>
        <View style={styles.controls}>
          <StepBtn symbol="−" onPress={decrement} disabled={minDisabled} />
          <View style={styles.valueWrap}>
            <Animated.Text
              style={[styles.value, { transform: [{ scale: valueAnim }] }]}
            >
              {formatNumber(value)}
            </Animated.Text>
          </View>
          <StepBtn symbol="+" onPress={increment} disabled={maxDisabled} />
        </View>
      </View>
    </View>
  );
}

const STEP_DEPTH = 3;

function StepBtn({
  symbol,
  onPress,
  disabled,
}: {
  symbol: string;
  onPress: () => void;
  disabled: boolean;
}) {
  const press = useRef(new Animated.Value(0)).current;

  const onPressIn = () =>
    Animated.spring(press, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 280,
    }).start();
  const onPressOut = () =>
    Animated.spring(press, {
      toValue: 0,
      useNativeDriver: true,
      friction: 6,
      tension: 200,
    }).start();

  const translateY = press.interpolate({
    inputRange: [0, 1],
    outputRange: [0, STEP_DEPTH],
  });

  return (
    <View style={styles.btnWrap}>
      {!disabled && <View style={styles.btnDepth} />}
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled}
          style={[styles.btn, disabled && styles.btnDisabled]}
        >
          <Text style={[styles.btnText, disabled && styles.btnTextDisabled]}>
            {symbol}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.md,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    minHeight: 52,
  },
  labelCol: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnWrap: {
    paddingBottom: STEP_DEPTH,
    width: 38,
  },
  btnDepth: {
    position: 'absolute',
    top: STEP_DEPTH,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.accentDepth,
    borderRadius: radius.pill,
  } as ViewStyle,
  btn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F8E4A9',
  },
  btnDisabled: {
    backgroundColor: colors.surfaceDisabled,
    borderColor: 'transparent',
  },
  btnText: {
    color: colors.textOnAccent,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 24,
    marginTop: -2,
  },
  btnTextDisabled: {
    color: colors.textMuted,
  },
  valueWrap: {
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  value: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
});
