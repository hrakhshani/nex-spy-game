import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, radius, shadows } from '../theme';

export type CharacterVariant = 'hero' | 'shadow' | 'champion';
export type CharacterSize = 'sm' | 'md' | 'lg';

interface Props {
  variant: CharacterVariant;
  size?: CharacterSize;
  showName?: boolean;
  name?: string;
  glow?: boolean;
  style?: ViewStyle;
}

type CharacterLook = {
  frame: string;
  frameBg: string;
  aura: string;
  nameColor: string;
  hair: string;
  hairShade: string;
  skin: string;
  eye: string;
  tunic: string;
  tunicShade: string;
  trim: string;
  pants: string;
  boots: string;
  belt: string;
  metal: string;
  shield: string;
  shieldMark: string;
  weapon: string;
  pose: 'ready' | 'guard' | 'duel';
  glow: ViewStyle | undefined;
};

const SIZES: Record<
  CharacterSize,
  { frameW: number; frameH: number; scale: number; name: number }
> = {
  sm: { frameW: 72, frameH: 96, scale: 0.62, name: 10 },
  md: { frameW: 104, frameH: 138, scale: 0.9, name: 11 },
  lg: { frameW: 146, frameH: 188, scale: 1.22, name: 12 },
};

function getVariantStyle(variant: CharacterVariant): CharacterLook {
  switch (variant) {
    case 'shadow':
      return {
        frame: colors.spy,
        frameBg: '#F7ECFA',
        aura: 'rgba(183,86,200,0.20)',
        nameColor: colors.spy,
        hair: '#7A5030',
        hairShade: '#46301F',
        skin: '#F2CDA8',
        eye: '#F3F0E5',
        tunic: '#7B67C8',
        tunicShade: '#4B3D95',
        trim: '#EFE7FF',
        pants: '#4B4363',
        boots: '#2B1B19',
        belt: '#5E3427',
        metal: '#A9B6C4',
        shield: '#6752AD',
        shieldMark: colors.spy,
        weapon: '#AFC2E6',
        pose: 'duel',
        glow: shadows.cardSpy,
      };
    case 'hero':
      return {
        frame: colors.citizen,
        frameBg: '#EDF8EF',
        aura: 'rgba(123,198,90,0.18)',
        nameColor: colors.citizen,
        hair: '#D7A345',
        hairShade: '#8E662B',
        skin: '#F5D2A9',
        eye: '#213348',
        tunic: colors.citizen,
        tunicShade: '#2E8553',
        trim: '#FFF6D8',
        pants: '#C39A4A',
        boots: '#3B211C',
        belt: '#603622',
        metal: '#D6DFEA',
        shield: '#263E8C',
        shieldMark: colors.accent,
        weapon: '#C8D9F2',
        pose: 'guard',
        glow: shadows.cardCitizen,
      };
    case 'champion':
    default:
      return {
        frame: colors.accent,
        frameBg: '#EDF7FC',
        aura: 'rgba(94,167,216,0.26)',
        nameColor: colors.accent,
        hair: '#E2A94D',
        hairShade: '#9C6B2E',
        skin: '#F7D8B5',
        eye: '#13365A',
        tunic: colors.primary,
        tunicShade: colors.primaryDark,
        trim: colors.accent,
        pants: '#C6B38B',
        boots: '#32241D',
        belt: '#6A3E27',
        metal: '#C7D4DF',
        shield: '#294D95',
        shieldMark: colors.accent,
        weapon: '#BBD8F5',
        pose: 'ready',
        glow: shadows.buttonAccent,
      };
  }
}

export default function CharacterAvatar({
  variant,
  size = 'md',
  showName = false,
  name,
  glow = false,
  style,
}: Props) {
  const dim = SIZES[size];
  const look = getVariantStyle(variant);

  return (
    <View style={[styles.wrap, style]}>
      <View
        style={[
          styles.frame,
          {
            width: dim.frameW,
            height: dim.frameH,
            borderColor: look.frame,
            backgroundColor: look.frameBg,
          },
          glow && look.glow,
        ]}
      >
        <View style={[styles.frameTop, { backgroundColor: look.frame }]} />
        <View style={styles.starRow}>
          {[0, 1, 2, 3, 4].map((star) => (
            <View
              key={star}
              style={[styles.star, { backgroundColor: look.frame }]}
            />
          ))}
        </View>
        <View style={[styles.aura, { backgroundColor: look.aura }]} />
        <View style={[styles.backPlate, { borderColor: look.frame }]} />
        <CharacterFigure scale={dim.scale} look={look} />
        <View style={[styles.platform, { backgroundColor: look.frame }]} />
      </View>

      {showName && name ? (
        <View
          style={[
            styles.namePlate,
            { width: dim.frameW },
            { borderColor: look.frame, backgroundColor: colors.bgCardElevated },
          ]}
        >
          <Text
            style={[
              styles.nameText,
              { color: look.nameColor, fontSize: dim.name },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            {name}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function CharacterFigure({ scale, look }: { scale: number; look: CharacterLook }) {
  const s = scale;
  const shieldSide = look.pose === 'duel' ? 72 : 18;
  const swordSide = look.pose === 'duel' ? 8 : 78;
  const armTilt = look.pose === 'duel' ? '-24deg' : '18deg';

  return (
    <View style={[styles.figure, { width: 92 * s, height: 132 * s }]}>
      <View
        style={[
          styles.weaponBlade,
          {
            left: swordSide * s,
            top: 39 * s,
            width: 5 * s,
            height: 62 * s,
            borderRadius: 3 * s,
            backgroundColor: look.weapon,
          },
        ]}
      />
      <View
        style={[
          styles.weaponHilt,
          {
            left: (swordSide - 8) * s,
            top: 94 * s,
            width: 21 * s,
            height: 5 * s,
            borderRadius: 3 * s,
            backgroundColor: look.trim,
          },
        ]}
      />

      <View
        style={[
          styles.leg,
          {
            left: 31 * s,
            top: 86 * s,
            width: 12 * s,
            height: 32 * s,
            borderRadius: 6 * s,
            backgroundColor: look.pants,
          },
        ]}
      />
      <View
        style={[
          styles.leg,
          {
            right: 31 * s,
            top: 86 * s,
            width: 12 * s,
            height: 32 * s,
            borderRadius: 6 * s,
            backgroundColor: look.pants,
          },
        ]}
      />
      <View
        style={[
          styles.boot,
          {
            left: 25 * s,
            top: 112 * s,
            width: 22 * s,
            height: 13 * s,
            borderRadius: 7 * s,
            backgroundColor: look.boots,
          },
        ]}
      />
      <View
        style={[
          styles.boot,
          {
            right: 25 * s,
            top: 112 * s,
            width: 22 * s,
            height: 13 * s,
            borderRadius: 7 * s,
            backgroundColor: look.boots,
          },
        ]}
      />

      <View
        style={[
          styles.arm,
          {
            left: 20 * s,
            top: 54 * s,
            width: 13 * s,
            height: 38 * s,
            borderRadius: 7 * s,
            backgroundColor: look.tunicShade,
            transform: [{ rotate: look.pose === 'duel' ? '22deg' : '-18deg' }],
          },
        ]}
      />
      <View
        style={[
          styles.arm,
          {
            right: 20 * s,
            top: 54 * s,
            width: 13 * s,
            height: 38 * s,
            borderRadius: 7 * s,
            backgroundColor: look.tunicShade,
            transform: [{ rotate: armTilt }],
          },
        ]}
      />

      <View
        style={[
          styles.torso,
          {
            left: 29 * s,
            top: 49 * s,
            width: 34 * s,
            height: 43 * s,
            borderRadius: 10 * s,
            backgroundColor: look.tunic,
            borderColor: look.trim,
          },
        ]}
      >
        <View style={[styles.tunicShade, { backgroundColor: look.tunicShade }]} />
        <View
          style={[
            styles.belt,
            {
              top: 25 * s,
              height: 6 * s,
              backgroundColor: look.belt,
            },
          ]}
        />
        <View
          style={[
            styles.buckle,
            {
              top: 23 * s,
              width: 9 * s,
              height: 9 * s,
              borderColor: look.metal,
            },
          ]}
        />
        <View
          style={[
            styles.crestLine,
            {
              width: 2 * s,
              height: 18 * s,
              backgroundColor: look.trim,
            },
          ]}
        />
      </View>

      <View
        style={[
          styles.shield,
          {
            left: shieldSide * s,
            top: 64 * s,
            width: 24 * s,
            height: 32 * s,
            borderRadius: 9 * s,
            backgroundColor: look.shield,
            borderColor: look.metal,
          },
        ]}
      >
        <View
          style={[
            styles.shieldMark,
            {
              width: 9 * s,
              height: 14 * s,
              borderRadius: 5 * s,
              backgroundColor: look.shieldMark,
            },
          ]}
        />
      </View>

      <View
        style={[
          styles.neck,
          {
            left: 41 * s,
            top: 42 * s,
            width: 10 * s,
            height: 10 * s,
            backgroundColor: look.skin,
          },
        ]}
      />
      <View
        style={[
          styles.hairBack,
          {
            left: 28 * s,
            top: 14 * s,
            width: 37 * s,
            height: 40 * s,
            borderRadius: 17 * s,
            backgroundColor: look.hairShade,
          },
        ]}
      />
      <View
        style={[
          styles.capTail,
          {
            left: 48 * s,
            top: 10 * s,
            width: 36 * s,
            height: 14 * s,
            borderRadius: 10 * s,
            backgroundColor: look.tunicShade,
          },
        ]}
      />
      <View
        style={[
          styles.face,
          {
            left: 31 * s,
            top: 20 * s,
            width: 31 * s,
            height: 31 * s,
            borderRadius: 15.5 * s,
            backgroundColor: look.skin,
          },
        ]}
      />
      <View
        style={[
          styles.hairCap,
          {
            left: 28 * s,
            top: 16 * s,
            width: 37 * s,
            height: 16 * s,
            borderTopLeftRadius: 18 * s,
            borderTopRightRadius: 18 * s,
            backgroundColor: look.hair,
          },
        ]}
      />
      <View
        style={[
          styles.bang,
          {
            left: 34 * s,
            top: 28 * s,
            width: 12 * s,
            height: 12 * s,
            borderRadius: 8 * s,
            backgroundColor: look.hair,
          },
        ]}
      />
      <View
        style={[
          styles.bang,
          {
            left: 45 * s,
            top: 27 * s,
            width: 14 * s,
            height: 12 * s,
            borderRadius: 8 * s,
            backgroundColor: look.hair,
          },
        ]}
      />
      <View
        style={[
          styles.eye,
          {
            left: 39 * s,
            top: 34 * s,
            width: 4 * s,
            height: 3 * s,
            borderRadius: 2 * s,
            backgroundColor: look.eye,
          },
        ]}
      />
      <View
        style={[
          styles.eye,
          {
            right: 39 * s,
            top: 34 * s,
            width: 4 * s,
            height: 3 * s,
            borderRadius: 2 * s,
            backgroundColor: look.eye,
          },
        ]}
      />
      <View
        style={[
          styles.mouth,
          {
            left: 43 * s,
            top: 43 * s,
            width: 7 * s,
            backgroundColor: 'rgba(80,35,28,0.45)',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  frame: {
    borderWidth: 2,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  frameTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    opacity: 0.92,
  },
  starRow: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
    zIndex: 3,
  },
  star: {
    width: 5,
    height: 5,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  aura: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    top: '12%',
    bottom: '18%',
    borderRadius: radius.lg,
  },
  backPlate: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 8,
    bottom: 12,
    borderWidth: 1,
    borderRadius: radius.md,
    opacity: 0.34,
  },
  platform: {
    position: 'absolute',
    bottom: 8,
    width: '62%',
    height: 5,
    borderRadius: radius.pill,
    opacity: 0.45,
  },
  figure: {
    marginBottom: 8,
    position: 'relative',
  },
  weaponBlade: {
    position: 'absolute',
    transform: [{ rotate: '42deg' }],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  weaponHilt: {
    position: 'absolute',
    transform: [{ rotate: '42deg' }],
  },
  leg: {
    position: 'absolute',
  },
  boot: {
    position: 'absolute',
  },
  arm: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  torso: {
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
  },
  tunicShade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '38%',
    opacity: 0.7,
  },
  belt: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  buckle: {
    position: 'absolute',
    borderWidth: 1.4,
    borderRadius: 3,
  },
  crestLine: {
    position: 'absolute',
    top: 5,
    borderRadius: 2,
    opacity: 0.9,
  },
  shield: {
    position: 'absolute',
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  shieldMark: {
    opacity: 0.95,
  },
  neck: {
    position: 'absolute',
    borderRadius: 4,
  },
  hairBack: {
    position: 'absolute',
  },
  capTail: {
    position: 'absolute',
    transform: [{ rotate: '-24deg' }],
  },
  face: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(71,39,25,0.18)',
  },
  hairCap: {
    position: 'absolute',
  },
  bang: {
    position: 'absolute',
    transform: [{ rotate: '18deg' }],
  },
  eye: {
    position: 'absolute',
  },
  mouth: {
    position: 'absolute',
    height: 1.5,
    borderRadius: 2,
  },
  namePlate: {
    marginTop: -10,
    width: '100%',
    maxWidth: 150,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  nameText: {
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  } as TextStyle,
});
