import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, shadows, spacing } from '../theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'md' | 'lg';
  icon?: string;
  style?: ViewStyle;
}

const DEPTH = 3;

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  size = 'lg',
  icon,
  style,
}: Props) {
  // Translate the cap downward on press to "compress" onto the depth plate.
  const press = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.spring(press, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 260,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(press, {
      toValue: 0,
      useNativeDriver: true,
      friction: 6,
      tension: 200,
    }).start();
  };
  const handlePress = () => {
    if (disabled) return;
    Haptics.selectionAsync().catch(() => {});
    onPress();
  };

  const v = getVariant(variant, disabled);

  const translateY = press.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DEPTH],
  });

  return (
    <View
      style={[
        fullWidth && { width: '100%' },
        { paddingBottom: DEPTH },
        style,
      ]}
    >
      <View
        style={[
          styles.depth,
          size === 'md' && styles.depthMd,
          { backgroundColor: v.depth },
        ]}
      />

      <Animated.View
        style={[
          v.shadow,
          { transform: [{ translateY }] },
        ]}
      >
        <Pressable
          onPress={handlePress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled}
          style={[
            styles.cap,
            size === 'md' && styles.capMd,
            {
              backgroundColor: v.bg,
              borderColor: v.border,
              borderWidth: v.borderWidth,
            },
          ]}
        >
          {!disabled && variant !== 'ghost' && <View style={styles.gloss} />}
          {!disabled && variant !== 'ghost' && (
            <>
              <View style={[styles.cornerGem, styles.cornerLeft]} />
              <View style={[styles.cornerGem, styles.cornerRight]} />
            </>
          )}
          <View style={styles.contentRow}>
            {icon ? (
              <Text style={[styles.icon, { color: v.fg }]}>{icon}</Text>
            ) : null}
            <Text
              style={[
                styles.text,
                size === 'md' && styles.textMd,
                { color: v.fg },
              ]}
            >
              {title}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function getVariant(variant: Variant, disabled: boolean) {
  if (disabled) {
    return {
      bg: colors.surfaceDisabled,
      fg: 'rgba(245,240,218,0.45)',
      border: 'transparent',
      borderWidth: 0,
      depth: colors.bgInset,
      shadow: undefined as ViewStyle | undefined,
    };
  }
  switch (variant) {
    case 'primary':
      return {
        bg: colors.accent,
        fg: colors.textOnAccent,
        border: '#F8E4A9',
        borderWidth: 1.5,
        depth: colors.accentDepth,
        shadow: shadows.button,
      };
    case 'danger':
      return {
        bg: colors.danger,
        fg: colors.white,
        border: 'rgba(255,255,255,0.25)',
        borderWidth: 1.5,
        depth: colors.dangerDepth,
        shadow: shadows.buttonDanger,
      };
    case 'secondary':
      return {
        bg: colors.bgCardElevated,
        fg: colors.textPrimary,
        border: colors.borderStrong,
        borderWidth: 1.5,
        depth: colors.bgInset,
        shadow: undefined,
      };
    case 'ghost':
    default:
      return {
        bg: 'transparent',
        fg: colors.textSecondary,
        border: colors.border,
        borderWidth: 1.5,
        depth: colors.ghostDepth,
        shadow: undefined,
      };
  }
}

const styles = StyleSheet.create({
  depth: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: DEPTH,
    bottom: 0,
    borderRadius: radius.pill,
  },
  depthMd: {
    borderRadius: radius.pill,
  },
  cap: {
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    overflow: 'hidden',
  } as ViewStyle,
  capMd: {
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    minWidth: 120,
    borderRadius: radius.pill,
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: '38%',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  cornerGem: {
    position: 'absolute',
    top: '50%',
    width: 8,
    height: 8,
    marginTop: -4,
    backgroundColor: 'rgba(255,255,255,0.42)',
    transform: [{ rotate: '45deg' }],
  },
  cornerLeft: {
    left: 16,
  },
  cornerRight: {
    right: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '100%',
  },
  icon: {
    fontSize: 18,
  },
  text: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  } as TextStyle,
  textMd: {
    fontSize: 15,
  },
});
