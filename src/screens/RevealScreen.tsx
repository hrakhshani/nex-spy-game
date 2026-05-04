import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GameCard from '../components/GameCard';
import { GemPip } from '../components/GameIcon';
import { Player } from '../types/game';
import { useI18n } from '../i18n';
import { lookupWord } from '../data/words';
import { colors, radius, spacing } from '../theme';

interface Props {
  players: Player[];
  wordKey: string;
  onComplete: () => void;
}

export default function RevealScreen({ players, wordKey, onComplete }: Props) {
  const { t, lang, formatNumber } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const player = players[currentIndex];
  const word = lookupWord(wordKey, lang);

  const handlePress = () => {
    if (!revealed) {
      setRevealed(true);
    } else {
      setRevealed(false);
      if (currentIndex + 1 >= players.length) {
        onComplete();
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.progressPill}>
          <View style={styles.progressDot} />
          <Text style={styles.progressText}>
            {t.playerProgress(
              formatNumber(currentIndex + 1),
              formatNumber(players.length)
            )}
          </Text>
          <View style={styles.progressDot} />
        </View>
        <View style={styles.dots}>
          {players.map((_, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            return (
              <View key={i} style={styles.gemSlot}>
                <GemPip
                  size={active ? 14 : 10}
                  color={
                    done
                      ? colors.accent
                      : active
                      ? colors.primary
                      : 'rgba(255,255,255,0.2)'
                  }
                  hollow={!done && !active}
                />
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.cardWrap}>
        <GameCard
          key={currentIndex}
          revealed={revealed}
          isSpy={player.role === 'spy'}
          word={word}
          playerNumber={t.playerLabel(formatNumber(player.number))}
          onPress={handlePress}
        />
      </View>

      <View style={styles.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  top: {
    alignItems: 'center',
    gap: spacing.md,
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bgCard,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  progressText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 280,
  },
  gemSlot: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bottom: {
    height: spacing.md,
  },
});
