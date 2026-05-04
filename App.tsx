import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SetupScreen from './src/screens/SetupScreen';
import RevealScreen from './src/screens/RevealScreen';
import ReadyScreen from './src/screens/ReadyScreen';
import TimerScreen from './src/screens/TimerScreen';
import { GameConfig, GamePhase, Player } from './src/types/game';
import { generatePlayers } from './src/utils/generateRoles';
import { getRandomWord } from './src/data/words';
import { I18nProvider, useI18n } from './src/i18n';
import { colors } from './src/theme';

function AppShell() {
  const { lang } = useI18n();
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [wordKey, setWordKey] = useState('');
  const [usedKeys, setUsedKeys] = useState<Set<string>>(new Set());

  // Slow ambient drift for the scene lighting.
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 9000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const driftA = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-12, 12],
  });
  const driftB = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -10],
  });

  // Phase transition fade.
  const phaseFade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    phaseFade.setValue(0);
    Animated.timing(phaseFade, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [phase]);

  const handleStart = (cfg: GameConfig) => {
    setConfig(cfg);
    setPlayers(generatePlayers(cfg.citizens, cfg.spies));
    const { key } = getRandomWord(usedKeys, lang);
    setWordKey(key);
    setUsedKeys((prev) => new Set(prev).add(key));
    setPhase('reveal');
  };

  const handleRevealComplete = () => {
    setPhase('ready');
  };

  const handleStartTimer = () => {
    setPhase('timer');
  };

  const handleRestart = () => {
    setPhase('setup');
    setConfig(null);
    setPlayers([]);
    setWordKey('');
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      {/* Layered atmospheric background */}
      <View pointerEvents="none" style={styles.bgLayer}>
        <View style={styles.skyBand} />
        <Animated.View
          style={[
            styles.lightShaft,
            styles.lightShaftA,
            { transform: [{ translateY: driftA }, { rotate: '-16deg' }] },
          ]}
        />
        <Animated.View
          style={[
            styles.lightShaft,
            styles.lightShaftB,
            { transform: [{ translateY: driftB }, { rotate: '14deg' }] },
          ]}
        />
        <View style={styles.cloudA} />
        <View style={styles.cloudB} />
        <View style={styles.mountainBack} />
        <View style={styles.mountainFront} />
        <View style={styles.ruinLineTop} />
        <View style={styles.ruinLineMid} />
        <View style={styles.groundBand} />
        <View style={styles.groundEdge} />
      </View>

      <Animated.View style={[styles.content, { opacity: phaseFade }]}>
        {phase === 'setup' && <SetupScreen onStart={handleStart} />}
        {phase === 'reveal' && (
          <RevealScreen
            players={players}
            wordKey={wordKey}
            onComplete={handleRevealComplete}
          />
        )}
        {phase === 'ready' && config && (
          <ReadyScreen
            duration={config.duration}
            onStartTimer={handleStartTimer}
          />
        )}
        {phase === 'timer' && config && (
          <TimerScreen duration={config.duration} onRestart={handleRestart} />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <I18nProvider initialLang="fa">
      <AppShell />
    </I18nProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  skyBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '62%',
    backgroundColor: colors.bgBase,
  },
  lightShaft: {
    position: 'absolute',
    top: -80,
    width: 78,
    height: '78%',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  lightShaftA: {
    left: '18%',
  },
  lightShaftB: {
    right: '16%',
    backgroundColor: 'rgba(255,248,232,0.24)',
  },
  cloudA: {
    position: 'absolute',
    top: '11%',
    left: -30,
    width: 210,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.34)',
  },
  cloudB: {
    position: 'absolute',
    top: '19%',
    right: -42,
    width: 250,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  mountainBack: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: '34%',
    height: 120,
    backgroundColor: '#8AC0D8',
    opacity: 0.55,
    transform: [{ rotate: '-3deg' }],
  },
  mountainFront: {
    position: 'absolute',
    left: -60,
    right: -60,
    bottom: '27%',
    height: 110,
    backgroundColor: '#E8D7B6',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.55)',
    transform: [{ rotate: '4deg' }],
  },
  ruinLineTop: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: '38%',
    height: 1,
    backgroundColor: 'rgba(201,150,66,0.18)',
    transform: [{ rotate: '-3deg' }],
  },
  ruinLineMid: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: '58%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.28)',
    transform: [{ rotate: '2deg' }],
  },
  groundBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '36%',
    backgroundColor: '#E7D4AF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(174,128,56,0.18)',
  },
  groundEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '35%',
    height: 18,
    backgroundColor: 'rgba(255,248,232,0.82)',
  },
  content: {
    flex: 1,
  },
});
