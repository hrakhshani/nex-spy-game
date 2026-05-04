import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

export type GameIconKind =
  | 'crest'
  | 'triforce'
  | 'diamond'
  | 'blade'
  | 'rune'
  | 'crystal';

interface Props {
  kind: GameIconKind;
  size?: number;
  color?: string;
  accent?: string;
  style?: ViewStyle;
}

// Pure geometric icons built from Views — no emoji, no images.
// Crisp at every pixel density and visually consistent across platforms.
export default function GameIcon({
  kind,
  size = 48,
  color,
  accent,
  style,
}: Props) {
  const wrap: ViewStyle = {
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
  };

  switch (kind) {
    case 'crest':
    case 'triforce':
      return (
        <View style={[wrap, style]}>
          <RelicCrest size={size} color={color ?? colors.accent} />
        </View>
      );
    case 'diamond':
      return (
        <View style={[wrap, style]}>
          <Diamond size={size} color={color ?? colors.citizen} accent={accent} />
        </View>
      );
    case 'blade':
      return (
        <View style={[wrap, style]}>
          <Blade size={size} color={color ?? colors.spy} />
        </View>
      );
    case 'rune':
      return (
        <View style={[wrap, style]}>
          <Rune size={size} color={color ?? colors.accent} />
        </View>
      );
    case 'crystal':
    default:
      return (
        <View style={[wrap, style]}>
          <Crystal size={size} color={color ?? colors.primary} />
        </View>
      );
  }
}

function Triangle({
  width,
  height,
  color,
  pointDown = false,
}: {
  width: number;
  height: number;
  color: string;
  pointDown?: boolean;
}) {
  return (
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: width / 2,
        borderRightWidth: width / 2,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        ...(pointDown
          ? { borderTopWidth: height, borderTopColor: color }
          : { borderBottomWidth: height, borderBottomColor: color }),
      }}
    />
  );
}

function RelicCrest({ size, color }: { size: number; color: string }) {
  // Three small upward-pointing shards arranged as a compact fantasy crest.
  const u = size / 2; // unit triangle width
  const h = u * 0.866; // equilateral height
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: u * 2, height: h * 2, position: 'relative' }}>
        {/* top */}
        <View style={{ position: 'absolute', top: 0, left: u / 2 }}>
          <Triangle width={u} height={h} color={color} />
        </View>
        {/* bottom-left */}
        <View style={{ position: 'absolute', top: h, left: 0 }}>
          <Triangle width={u} height={h} color={color} />
        </View>
        {/* bottom-right */}
        <View style={{ position: 'absolute', top: h, left: u }}>
          <Triangle width={u} height={h} color={color} />
        </View>
      </View>
    </View>
  );
}

function Diamond({
  size,
  color,
  accent,
}: {
  size: number;
  color: string;
  accent?: string;
}) {
  // Top + bottom triangles forming a diamond/leaf.
  const w = size * 0.78;
  const h = size * 0.5;
  return (
    <View style={{ width: w, height: h * 2, alignItems: 'center' }}>
      <Triangle width={w} height={h} color={color} />
      <Triangle width={w} height={h} color={accent ?? color} pointDown />
    </View>
  );
}

function Blade({ size, color }: { size: number; color: string }) {
  // Stylized X-blade: two thin rotated rectangles forming a saltire,
  // with a small dark gem in the center.
  const len = size * 0.95;
  const thick = Math.max(4, size * 0.13);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          width: len,
          height: thick,
          backgroundColor: color,
          borderRadius: thick / 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: len,
          height: thick,
          backgroundColor: color,
          borderRadius: thick / 2,
          transform: [{ rotate: '-45deg' }],
        }}
      />
      <View
        style={{
          width: thick * 1.4,
          height: thick * 1.4,
          borderRadius: thick,
          backgroundColor: colors.bgDeep,
          borderWidth: 1.5,
          borderColor: color,
        }}
      />
    </View>
  );
}

function Rune({ size, color }: { size: number; color: string }) {
  // Square frame rotated 45° (rhombus) with a smaller filled diamond inside.
  const outer = size * 0.78;
  const inner = size * 0.36;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: outer,
          height: outer,
          borderWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: inner,
          height: inner,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

function Crystal({ size, color }: { size: number; color: string }) {
  // Hex-like crystal: top triangle + middle band + bottom triangle.
  const w = size * 0.7;
  const cap = size * 0.22;
  const mid = size * 0.34;
  return (
    <View style={{ width: w, alignItems: 'center' }}>
      <Triangle width={w} height={cap} color={color} />
      <View
        style={{
          width: w,
          height: mid,
          backgroundColor: color,
          opacity: 0.92,
        }}
      />
      <Triangle width={w} height={cap} color={color} pointDown />
    </View>
  );
}

// HUD-style corner frame brackets — wrap any component to add game UI feel.
export function HudCorners({
  color = colors.accent,
  size = 14,
  thickness = 2,
  inset = 8,
}: {
  color?: string;
  size?: number;
  thickness?: number;
  inset?: number;
}) {
  const corner: ViewStyle = {
    position: 'absolute',
    width: size,
    height: size,
    borderColor: color,
  };
  return (
    <>
      <View
        pointerEvents="none"
        style={[
          corner,
          {
            top: inset,
            left: inset,
            borderTopWidth: thickness,
            borderLeftWidth: thickness,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          corner,
          {
            top: inset,
            right: inset,
            borderTopWidth: thickness,
            borderRightWidth: thickness,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          corner,
          {
            bottom: inset,
            left: inset,
            borderBottomWidth: thickness,
            borderLeftWidth: thickness,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          corner,
          {
            bottom: inset,
            right: inset,
            borderBottomWidth: thickness,
            borderRightWidth: thickness,
          },
        ]}
      />
    </>
  );
}

// Small filled diamond, used as a progress/HUD pip.
export function GemPip({
  size = 10,
  color,
  hollow = false,
}: {
  size?: number;
  color: string;
  hollow?: boolean;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        transform: [{ rotate: '45deg' }],
        backgroundColor: hollow ? 'transparent' : color,
        borderWidth: hollow ? 1.5 : 0,
        borderColor: color,
      }}
    />
  );
}

const styles = StyleSheet.create({});
