import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import CharacterAvatar from './CharacterAvatar';
import { useI18n } from '../i18n';
import { colors, radius, spacing } from '../theme';

interface Props {
  showNames?: boolean;
}

export default function CharacterLineup({ showNames = true }: Props) {
  const { t } = useI18n();
  const float = useRef(new Animated.Value(0)).current;
  const championPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(championPulse, {
          toValue: 1.06,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(championPulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const offsetCenter = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });
  const offsetSide = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  return (
    <View style={styles.stage}>
      <View style={styles.backdrop}>
        <View style={styles.sunDisc} />
        <View style={[styles.lightBeam, styles.lightBeamLeft]} />
        <View style={[styles.lightBeam, styles.lightBeamRight]} />
        <View style={styles.horizonLine} />
        <View style={styles.archLeft} />
        <View style={styles.archRight} />
      </View>

      <Animated.View
        style={[styles.side, styles.leftSide, { transform: [{ translateY: offsetSide }] }]}
      >
        <CharacterAvatar
          variant="hero"
          size="sm"
          showName={showNames}
          name={t.heroName}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.center,
          {
            transform: [
              { translateY: offsetCenter },
              { scale: championPulse },
            ],
          },
        ]}
      >
        <CharacterAvatar
          variant="champion"
          size="md"
          glow
          showName={showNames}
          name={t.championName}
        />
      </Animated.View>

      <Animated.View
        style={[styles.side, styles.rightSide, { transform: [{ translateY: offsetSide }] }]}
      >
        <CharacterAvatar
          variant="shadow"
          size="sm"
          showName={showNames}
          name={t.shadowName}
        />
      </Animated.View>

      <View style={styles.floor}>
        <View style={styles.floorGlow} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    minHeight: 170,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    height: 124,
    borderRadius: radius.xxl,
    backgroundColor: 'rgba(255,248,232,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(201,150,66,0.28)',
    overflow: 'hidden',
  },
  sunDisc: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(201,150,66,0.18)',
  },
  lightBeam: {
    position: 'absolute',
    top: -20,
    width: 44,
    height: 170,
    backgroundColor: 'rgba(94,167,216,0.16)',
    transform: [{ rotate: '16deg' }],
  },
  lightBeamLeft: {
    left: '20%',
  },
  lightBeamRight: {
    right: '20%',
    transform: [{ rotate: '-16deg' }],
  },
  horizonLine: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 20,
    height: 1,
    backgroundColor: 'rgba(201,150,66,0.28)',
  },
  archLeft: {
    position: 'absolute',
    left: 16,
    bottom: 0,
    width: 34,
    height: 86,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(201,150,66,0.16)',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  archRight: {
    position: 'absolute',
    right: 16,
    bottom: 0,
    width: 34,
    height: 86,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(201,150,66,0.16)',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  side: {
    paddingBottom: 2,
    zIndex: 2,
  },
  leftSide: {
    transform: [{ rotate: '-2deg' }],
  },
  rightSide: {
    transform: [{ rotate: '2deg' }],
  },
  center: {
    paddingBottom: 0,
    zIndex: 3,
  },
  floor: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 14,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,248,232,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(201,150,66,0.30)',
    zIndex: 1,
  },
  floorGlow: {
    position: 'absolute',
    left: '25%',
    right: '25%',
    top: 2,
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    opacity: 0.55,
  },
});
