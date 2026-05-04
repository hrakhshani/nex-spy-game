import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import CharacterAvatar from './CharacterAvatar';
import GameIcon, { GemPip, HudCorners } from './GameIcon';
import { useI18n } from '../i18n';
import { colors, radius, shadows, spacing } from '../theme';

interface Props {
  revealed: boolean;
  isSpy: boolean;
  word: string;
  playerNumber: string;
  onPress: () => void;
}

export default function GameCard({
  revealed,
  isSpy,
  word,
  playerNumber,
  onPress,
}: Props) {
  const { t } = useI18n();
  const flipAnim = useRef(new Animated.Value(0)).current;
  const enterAnim = useRef(new Animated.Value(0)).current;

  // Card "deals into" the screen on mount.
  useEffect(() => {
    enterAnim.setValue(0);
    Animated.spring(enterAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 70,
    }).start();
  }, []);

  useEffect(() => {
    if (revealed) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    Animated.spring(flipAnim, {
      toValue: revealed ? 1 : 0,
      useNativeDriver: true,
      friction: 9,
      tension: 65,
    }).start();
  }, [revealed]);

  const frontRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  const enterScale = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });
  const enterTranslate = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const backShadow = isSpy ? shadows.cardSpy : shadows.cardCitizen;
  const accentColor = isSpy ? colors.spy : colors.citizen;

  return (
    <Pressable onPress={onPress} style={styles.outer}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: enterAnim,
            transform: [
              { scale: enterScale },
              { translateY: enterTranslate },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.card,
            styles.front,
            shadows.card,
            {
              transform: [{ rotateY: frontRotation }],
              opacity: frontOpacity,
            },
          ]}
        >
          {/* HUD corner brackets */}
          <HudCorners color={colors.accent} size={18} thickness={2} inset={14} />

          <View style={styles.frontInner}>
            {/* Top: small player tag */}
            <View style={styles.topTag}>
              <View style={styles.topTagDot} />
              <Text style={styles.topTagText}>{playerNumber}</Text>
              <View style={styles.topTagDot} />
            </View>

            {/* Center: framed mystery sigil */}
            <View style={styles.sigilWrap}>
              <View style={styles.sigilOuter}>
                <View style={styles.sigilInner}>
                  <Text style={styles.sigilQ}>?</Text>
                </View>
              </View>
              {/* Decorative gems orbiting the sigil */}
              <View style={[styles.orbitGem, styles.orbitTop]}>
                <GemPip size={10} color={colors.accent} />
              </View>
              <View style={[styles.orbitGem, styles.orbitBottom]}>
                <GemPip size={10} color={colors.accent} hollow />
              </View>
              <View style={[styles.orbitGem, styles.orbitLeft]}>
                <GemPip size={8} color={colors.accent} hollow />
              </View>
              <View style={[styles.orbitGem, styles.orbitRight]}>
                <GemPip size={8} color={colors.accent} hollow />
              </View>
            </View>

            {/* Bottom: tap hint */}
            <View style={styles.hintWrap}>
              <Text style={styles.hint}>{t.tapToReveal}</Text>
              <View style={styles.hintRow}>
                <View style={styles.hintTri} />
                <View style={styles.hintBar} />
                <View style={styles.hintTri} />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            isSpy ? styles.backSpy : styles.backCitizen,
            backShadow,
            {
              transform: [{ rotateY: backRotation }],
              opacity: backOpacity,
            },
          ]}
        >
          <HudCorners color={accentColor} size={18} thickness={2} inset={14} />

          <CharacterAvatar
            variant={isSpy ? 'shadow' : 'hero'}
            size="lg"
            showName
            name={isSpy ? t.shadowName : t.heroName}
            glow
            style={styles.backAvatar}
          />

          {isSpy ? (
            <Text style={[styles.roleText, { color: colors.spy }]}>
              {t.youAreSpy}
            </Text>
          ) : (
            <>
              <Text style={[styles.roleKicker, { color: colors.textSecondary }]}>
                {t.yourWord}
              </Text>
              <Text style={styles.wordText}>{word}</Text>
            </>
          )}

          <View style={styles.dividerRow}>
            <GemPip size={6} color={accentColor} />
            <View style={styles.divider} />
            <GemPip size={6} color={accentColor} />
          </View>
          <Text style={styles.hideHint}>{t.tapToHide}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const CARD_W = 320;
const CARD_H = 440;

const CARD_BASE: ViewStyle = {
  width: CARD_W,
  height: CARD_H,
  borderRadius: radius.xxl,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: spacing.xl,
  paddingVertical: spacing.xxl,
  backfaceVisibility: 'hidden',
  position: 'absolute',
};

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: CARD_W,
    height: CARD_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { ...CARD_BASE },
  front: {
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  frontInner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  topTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  topTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  topTagText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,
  sigilWrap: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigilOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigilInner: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1,
    borderColor: 'rgba(201,150,66,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigilQ: {
    color: colors.accent,
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 70,
    marginTop: -4,
  } as TextStyle,
  orbitGem: {
    position: 'absolute',
  },
  orbitTop: { top: 0, alignSelf: 'center' },
  orbitBottom: { bottom: 0, alignSelf: 'center' },
  orbitLeft: { left: 0, top: '50%' },
  orbitRight: { right: 0, top: '50%' },
  hintWrap: {
    alignItems: 'center',
    gap: 8,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintTri: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.accent,
  },
  hintBar: {
    width: 24,
    height: 2,
    backgroundColor: 'rgba(201,150,66,0.45)',
  },

  backCitizen: {
    backgroundColor: colors.citizenDeep,
    borderWidth: 1.5,
    borderColor: colors.citizen,
  },
  backSpy: {
    backgroundColor: colors.spyDeep,
    borderWidth: 1.5,
    borderColor: colors.spy,
  },
  backAvatar: {
    marginBottom: spacing.lg,
  },
  roleKicker: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  roleText: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  } as TextStyle,
  wordText: {
    color: colors.citizen,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
  } as TextStyle,
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    width: 60,
    backgroundColor: colors.divider,
  },
  hideHint: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 20,
    fontWeight: '600',
  },
});
