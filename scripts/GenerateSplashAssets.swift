import AppKit
import Foundation

struct Palette {
    static let bgDeep = NSColor(hex: "#6FAED8")
    static let bgBase = NSColor(hex: "#B9DEF2")
    static let bgElevated = NSColor(hex: "#F4E8CF")
    static let bgCard = NSColor(hex: "#FFF8E8")
    static let bgInset = NSColor(hex: "#EFE0C4")
    static let textPrimary = NSColor(hex: "#3A2A1F")
    static let textMuted = NSColor(hex: "#927C5E")
    static let primary = NSColor(hex: "#5EA7D8")
    static let primaryDark = NSColor(hex: "#2F75A8")
    static let accent = NSColor(hex: "#C99642")
    static let accentDepth = NSColor(hex: "#8D6426")
    static let citizen = NSColor(hex: "#4FAD72")
    static let spy = NSColor(hex: "#B756C8")
}

struct CharacterLook {
    let frame: NSColor
    let frameBg: NSColor
    let aura: NSColor
    let hair: NSColor
    let hairShade: NSColor
    let skin: NSColor
    let eye: NSColor
    let tunic: NSColor
    let tunicShade: NSColor
    let trim: NSColor
    let pants: NSColor
    let boots: NSColor
    let belt: NSColor
    let metal: NSColor
    let shield: NSColor
    let shieldMark: NSColor
    let weapon: NSColor
    let duel: Bool
}

extension NSColor {
    convenience init(hex: String, alpha: CGFloat = 1) {
        let raw = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        var value: UInt64 = 0
        Scanner(string: raw).scanHexInt64(&value)
        self.init(
            calibratedRed: CGFloat((value >> 16) & 0xff) / 255,
            green: CGFloat((value >> 8) & 0xff) / 255,
            blue: CGFloat(value & 0xff) / 255,
            alpha: alpha
        )
    }
}

final class Canvas {
    let width: CGFloat
    let height: CGFloat
    private let rep: NSBitmapImageRep
    private let context: NSGraphicsContext

    init(width: Int, height: Int, transparent: Bool = false) {
        self.width = CGFloat(width)
        self.height = CGFloat(height)
        rep = NSBitmapImageRep(
            bitmapDataPlanes: nil,
            pixelsWide: width,
            pixelsHigh: height,
            bitsPerSample: 8,
            samplesPerPixel: 4,
            hasAlpha: true,
            isPlanar: false,
            colorSpaceName: .deviceRGB,
            bytesPerRow: 0,
            bitsPerPixel: 0
        )!
        context = NSGraphicsContext(bitmapImageRep: rep)!
        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = context
        context.cgContext.setAllowsAntialiasing(true)
        context.cgContext.setShouldAntialias(true)
        if transparent {
            clear()
        }
    }

    deinit {
        NSGraphicsContext.restoreGraphicsState()
    }

    func writePNG(to path: String) throws {
        guard let data = rep.representation(using: .png, properties: [:]) else {
            throw NSError(domain: "GenerateSplashAssets", code: 1)
        }
        try data.write(to: URL(fileURLWithPath: path))
    }

    func clear() {
        NSColor.clear.setFill()
        NSRect(x: 0, y: 0, width: width, height: height).fill()
    }

    func rect(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat) -> NSRect {
        NSRect(x: x, y: height - y - h, width: w, height: h)
    }

    func point(_ x: CGFloat, _ y: CGFloat) -> NSPoint {
        NSPoint(x: x, y: height - y)
    }

    func fillRect(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat, _ color: NSColor) {
        color.setFill()
        rect(x, y, w, h).fill()
    }

    func roundedRect(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat, radius: CGFloat, fill: NSColor, stroke: NSColor? = nil, lineWidth: CGFloat = 1) {
        let path = NSBezierPath(roundedRect: rect(x, y, w, h), xRadius: radius, yRadius: radius)
        fill.setFill()
        path.fill()
        if let stroke {
            stroke.setStroke()
            path.lineWidth = lineWidth
            path.stroke()
        }
    }

    func ellipse(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat, fill: NSColor, stroke: NSColor? = nil, lineWidth: CGFloat = 1) {
        let path = NSBezierPath(ovalIn: rect(x, y, w, h))
        fill.setFill()
        path.fill()
        if let stroke {
            stroke.setStroke()
            path.lineWidth = lineWidth
            path.stroke()
        }
    }

    func line(_ points: [CGPoint], color: NSColor, width lineWidth: CGFloat) {
        guard let first = points.first else { return }
        let path = NSBezierPath()
        path.move(to: point(first.x, first.y))
        for p in points.dropFirst() {
            path.line(to: point(p.x, p.y))
        }
        color.setStroke()
        path.lineWidth = lineWidth
        path.lineCapStyle = .round
        path.stroke()
    }

    func polygon(_ points: [CGPoint], fill: NSColor, stroke: NSColor? = nil, lineWidth: CGFloat = 1) {
        guard let first = points.first else { return }
        let path = NSBezierPath()
        path.move(to: point(first.x, first.y))
        for p in points.dropFirst() {
            path.line(to: point(p.x, p.y))
        }
        path.close()
        fill.setFill()
        path.fill()
        if let stroke {
            stroke.setStroke()
            path.lineWidth = lineWidth
            path.stroke()
        }
    }

    func diamond(centerX: CGFloat, centerY: CGFloat, size: CGFloat, fill: NSColor, stroke: NSColor? = nil, lineWidth: CGFloat = 1) {
        polygon([
            CGPoint(x: centerX, y: centerY - size / 2),
            CGPoint(x: centerX + size / 2, y: centerY),
            CGPoint(x: centerX, y: centerY + size / 2),
            CGPoint(x: centerX - size / 2, y: centerY),
        ], fill: fill, stroke: stroke, lineWidth: lineWidth)
    }

    func shadow(color: NSColor, blur: CGFloat, x: CGFloat = 0, y: CGFloat = -6, draw: () -> Void) {
        NSGraphicsContext.saveGraphicsState()
        let shadow = NSShadow()
        shadow.shadowColor = color
        shadow.shadowBlurRadius = blur
        shadow.shadowOffset = NSSize(width: x, height: y)
        shadow.set()
        draw()
        NSGraphicsContext.restoreGraphicsState()
    }

    func text(_ value: String, x: CGFloat, y: CGFloat, w: CGFloat, h: CGFloat, size: CGFloat, weight: NSFont.Weight, color: NSColor, tracking: CGFloat = 0, uppercase: Bool = false) {
        let paragraph = NSMutableParagraphStyle()
        paragraph.alignment = .center
        let font = NSFont.systemFont(ofSize: size, weight: weight)
        let attrs: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: color,
            .paragraphStyle: paragraph,
            .kern: tracking,
        ]
        let string = uppercase ? value.uppercased() : value
        NSAttributedString(string: string, attributes: attrs).draw(in: rect(x, y, w, h))
    }
}

func scale(_ value: CGFloat, _ factor: CGFloat) -> CGFloat {
    value * factor
}

func drawBackground(on c: Canvas) {
    let w = c.width
    let h = c.height
    c.fillRect(0, 0, w, h * 0.64, Palette.bgBase)
    c.fillRect(0, h * 0.64, w, h * 0.36, NSColor(hex: "#E7D4AF"))

    c.polygon([
        CGPoint(x: -w * 0.12, y: h * 0.55),
        CGPoint(x: w * 0.34, y: h * 0.43),
        CGPoint(x: w * 0.80, y: h * 0.66),
        CGPoint(x: -w * 0.12, y: h * 0.72),
    ], fill: NSColor(hex: "#E8D7B6", alpha: 0.92))
    c.polygon([
        CGPoint(x: w * 0.54, y: h * 0.68),
        CGPoint(x: w * 1.05, y: h * 0.50),
        CGPoint(x: w * 1.12, y: h * 0.72),
    ], fill: NSColor(hex: "#E8D7B6", alpha: 0.88))
    c.fillRect(0, h * 0.63, w, h * 0.014, NSColor(hex: "#FFF8E8", alpha: 0.82))

    c.roundedRect(-w * 0.08, h * 0.08, w * 0.25, h * 0.03, radius: h * 0.015, fill: NSColor.white.withAlphaComponent(0.48))
    c.roundedRect(w * 0.78, h * 0.12, w * 0.18, h * 0.028, radius: h * 0.014, fill: NSColor.white.withAlphaComponent(0.50))

    c.line([CGPoint(x: -20, y: h * 0.39), CGPoint(x: w + 20, y: h * 0.36)], color: Palette.accent.withAlphaComponent(0.18), width: max(1, w * 0.002))
    c.line([CGPoint(x: -20, y: h * 0.58), CGPoint(x: w + 20, y: h * 0.60)], color: NSColor.white.withAlphaComponent(0.28), width: max(1, w * 0.002))
    c.fillRect(w * 0.13, h * 0.74, w * 0.74, max(1, h * 0.002), Palette.accent.withAlphaComponent(0.45))
}

func drawStage(on c: Canvas, centerX: CGFloat, topY: CGFloat, width: CGFloat, scale: CGFloat) {
    let stageH = width * 0.48
    c.shadow(color: NSColor(hex: "#6F4E22", alpha: 0.15), blur: 24 * scale, y: -8 * scale) {
        c.roundedRect(centerX - width / 2, topY, width, stageH, radius: 24 * scale, fill: Palette.bgCard.withAlphaComponent(0.82), stroke: Palette.accent.withAlphaComponent(0.32), lineWidth: 1.4 * scale)
    }
    c.ellipse(centerX - 27 * scale, topY + 11 * scale, 54 * scale, 54 * scale, fill: NSColor.white.withAlphaComponent(0.42), stroke: Palette.accent.withAlphaComponent(0.18), lineWidth: 1 * scale)
    c.polygon([
        CGPoint(x: centerX - 64 * scale, y: topY - 22 * scale),
        CGPoint(x: centerX - 18 * scale, y: topY + stageH - 8 * scale),
        CGPoint(x: centerX - 96 * scale, y: topY + stageH - 8 * scale),
    ], fill: Palette.primary.withAlphaComponent(0.12))
    c.polygon([
        CGPoint(x: centerX + 64 * scale, y: topY - 22 * scale),
        CGPoint(x: centerX + 18 * scale, y: topY + stageH - 8 * scale),
        CGPoint(x: centerX + 96 * scale, y: topY + stageH - 8 * scale),
    ], fill: Palette.primary.withAlphaComponent(0.12))
    c.line([CGPoint(x: centerX - width * 0.40, y: topY + stageH - 25 * scale), CGPoint(x: centerX + width * 0.40, y: topY + stageH - 25 * scale)], color: Palette.accent.withAlphaComponent(0.28), width: 1.2 * scale)

    c.roundedRect(centerX - width * 0.39, topY + stageH - 94 * scale, 34 * scale, 86 * scale, radius: 18 * scale, fill: NSColor.white.withAlphaComponent(0.16), stroke: Palette.accent.withAlphaComponent(0.16), lineWidth: 1 * scale)
    c.roundedRect(centerX + width * 0.39 - 34 * scale, topY + stageH - 94 * scale, 34 * scale, 86 * scale, radius: 18 * scale, fill: NSColor.white.withAlphaComponent(0.16), stroke: Palette.accent.withAlphaComponent(0.16), lineWidth: 1 * scale)
    c.roundedRect(centerX - width * 0.42, topY + stageH - 18 * scale, width * 0.84, 10 * scale, radius: 999, fill: NSColor(hex: "#FFF8E8", alpha: 0.95), stroke: Palette.accent.withAlphaComponent(0.28), lineWidth: 1 * scale)
    c.roundedRect(centerX - width * 0.18, topY + stageH - 15 * scale, width * 0.36, 2.2 * scale, radius: 999, fill: Palette.accent.withAlphaComponent(0.56))
}

func drawCharacter(on c: Canvas, centerX: CGFloat, baseY: CGFloat, scale s: CGFloat, look: CharacterLook) {
    let frameW = 72 * s
    let frameH = 96 * s
    let x = centerX - frameW / 2
    let y = baseY - frameH
    c.shadow(color: look.frame.withAlphaComponent(0.22), blur: 18 * s, y: -5 * s) {
        c.roundedRect(x, y, frameW, frameH, radius: 14 * s, fill: look.frameBg, stroke: look.frame, lineWidth: 2 * s)
    }
    c.fillRect(x + 10 * s, y, frameW - 20 * s, 5 * s, look.frame)
    for i in 0..<5 {
        c.diamond(centerX: x + 22 * s + CGFloat(i) * 7 * s, centerY: y + 14 * s, size: 4 * s, fill: look.frame)
    }
    c.ellipse(centerX - 27 * s, y + 26 * s, 54 * s, 54 * s, fill: look.aura)
    c.diamond(centerX: centerX, centerY: y + 57 * s, size: 48 * s, fill: NSColor.clear, stroke: look.frame.withAlphaComponent(0.34), lineWidth: 1.2 * s)

    let fx = centerX - 32 * s
    let fy = y + 20 * s
    let shieldSide: CGFloat = look.duel ? 53 : 13
    let swordSide: CGFloat = look.duel ? 10 : 54

    c.roundedRect(fx + swordSide * s, fy + 22 * s, 5 * s, 48 * s, radius: 3 * s, fill: look.weapon)
    c.roundedRect(fx + (swordSide - 7) * s, fy + 65 * s, 19 * s, 5 * s, radius: 3 * s, fill: look.trim)

    c.roundedRect(fx + 22 * s, fy + 66 * s, 10 * s, 25 * s, radius: 5 * s, fill: look.pants)
    c.roundedRect(fx + 40 * s, fy + 66 * s, 10 * s, 25 * s, radius: 5 * s, fill: look.pants)
    c.roundedRect(fx + 16 * s, fy + 87 * s, 18 * s, 9 * s, radius: 5 * s, fill: look.boots)
    c.roundedRect(fx + 38 * s, fy + 87 * s, 18 * s, 9 * s, radius: 5 * s, fill: look.boots)

    c.roundedRect(fx + 13 * s, fy + 42 * s, 11 * s, 30 * s, radius: 6 * s, fill: look.tunicShade)
    c.roundedRect(fx + 49 * s, fy + 42 * s, 11 * s, 30 * s, radius: 6 * s, fill: look.tunicShade)
    c.roundedRect(fx + 24 * s, fy + 38 * s, 28 * s, 36 * s, radius: 9 * s, fill: look.tunic, stroke: look.trim, lineWidth: 1.2 * s)
    c.fillRect(fx + 24 * s, fy + 58 * s, 28 * s, 5 * s, look.belt)
    c.diamond(centerX: fx + 38 * s, centerY: fy + 60.5 * s, size: 7 * s, fill: look.metal)

    c.ellipse(fx + 23 * s, fy + 12 * s, 30 * s, 30 * s, fill: look.skin, stroke: look.hairShade, lineWidth: 1.1 * s)
    c.polygon([
        CGPoint(x: fx + 21 * s, y: fy + 19 * s),
        CGPoint(x: fx + 31 * s, y: fy + 6 * s),
        CGPoint(x: fx + 52 * s, y: fy + 17 * s),
        CGPoint(x: fx + 48 * s, y: fy + 30 * s),
        CGPoint(x: fx + 27 * s, y: fy + 27 * s),
    ], fill: look.hair)
    c.ellipse(fx + 31 * s, fy + 27 * s, 4 * s, 5 * s, fill: look.eye)
    c.ellipse(fx + 43 * s, fy + 27 * s, 4 * s, 5 * s, fill: look.eye)

    c.roundedRect(fx + shieldSide * s, fy + 45 * s, 24 * s, 28 * s, radius: 7 * s, fill: look.shield, stroke: look.trim, lineWidth: 1.2 * s)
    c.diamond(centerX: fx + (shieldSide + 12) * s, centerY: fy + 58 * s, size: 11 * s, fill: look.shieldMark)
    c.roundedRect(centerX - 19 * s, y + frameH - 8 * s, 38 * s, 5 * s, radius: 999, fill: look.frame.withAlphaComponent(0.82))
}

func heroLook() -> CharacterLook {
    CharacterLook(
        frame: Palette.citizen,
        frameBg: NSColor(hex: "#EDF8EF"),
        aura: NSColor(hex: "#7BC65A", alpha: 0.18),
        hair: NSColor(hex: "#D7A345"),
        hairShade: NSColor(hex: "#8E662B"),
        skin: NSColor(hex: "#F5D2A9"),
        eye: NSColor(hex: "#213348"),
        tunic: Palette.citizen,
        tunicShade: NSColor(hex: "#2E8553"),
        trim: NSColor(hex: "#FFF6D8"),
        pants: NSColor(hex: "#C39A4A"),
        boots: NSColor(hex: "#3B211C"),
        belt: NSColor(hex: "#603622"),
        metal: NSColor(hex: "#D6DFEA"),
        shield: NSColor(hex: "#263E8C"),
        shieldMark: Palette.accent,
        weapon: NSColor(hex: "#C8D9F2"),
        duel: false
    )
}

func championLook() -> CharacterLook {
    CharacterLook(
        frame: Palette.accent,
        frameBg: NSColor(hex: "#EDF7FC"),
        aura: Palette.primary.withAlphaComponent(0.26),
        hair: NSColor(hex: "#E2A94D"),
        hairShade: NSColor(hex: "#9C6B2E"),
        skin: NSColor(hex: "#F7D8B5"),
        eye: NSColor(hex: "#13365A"),
        tunic: Palette.primary,
        tunicShade: Palette.primaryDark,
        trim: Palette.accent,
        pants: NSColor(hex: "#C6B38B"),
        boots: NSColor(hex: "#32241D"),
        belt: NSColor(hex: "#6A3E27"),
        metal: NSColor(hex: "#C7D4DF"),
        shield: NSColor(hex: "#294D95"),
        shieldMark: Palette.accent,
        weapon: NSColor(hex: "#BBD8F5"),
        duel: false
    )
}

func shadowLook() -> CharacterLook {
    CharacterLook(
        frame: Palette.spy,
        frameBg: NSColor(hex: "#F7ECFA"),
        aura: Palette.spy.withAlphaComponent(0.20),
        hair: NSColor(hex: "#7A5030"),
        hairShade: NSColor(hex: "#46301F"),
        skin: NSColor(hex: "#F2CDA8"),
        eye: NSColor(hex: "#F3F0E5"),
        tunic: NSColor(hex: "#7B67C8"),
        tunicShade: NSColor(hex: "#4B3D95"),
        trim: NSColor(hex: "#EFE7FF"),
        pants: NSColor(hex: "#4B4363"),
        boots: NSColor(hex: "#2B1B19"),
        belt: NSColor(hex: "#5E3427"),
        metal: NSColor(hex: "#A9B6C4"),
        shield: NSColor(hex: "#6752AD"),
        shieldMark: Palette.spy,
        weapon: NSColor(hex: "#AFC2E6"),
        duel: true
    )
}

func drawTitle(on c: Canvas, centerX: CGFloat, y: CGFloat, width: CGFloat, scale: CGFloat) {
    c.text("NEXSPY", x: centerX - width / 2 + 2 * scale, y: y + 2 * scale, w: width, h: 40 * scale, size: 30 * scale, weight: .black, color: NSColor.white.withAlphaComponent(0.88), tracking: 0.6 * scale, uppercase: true)
    c.text("NEXSPY", x: centerX - width / 2, y: y, w: width, h: 40 * scale, size: 30 * scale, weight: .black, color: Palette.textPrimary, tracking: 0.6 * scale, uppercase: true)
    c.line([CGPoint(x: centerX - 58 * scale, y: y + 44 * scale), CGPoint(x: centerX - 10 * scale, y: y + 44 * scale)], color: Palette.accent.withAlphaComponent(0.78), width: 2 * scale)
    c.diamond(centerX: centerX, centerY: y + 44 * scale, size: 9 * scale, fill: Palette.accent)
    c.line([CGPoint(x: centerX + 10 * scale, y: y + 44 * scale), CGPoint(x: centerX + 58 * scale, y: y + 44 * scale)], color: Palette.accent.withAlphaComponent(0.78), width: 2 * scale)
    c.text("HIDDEN REALM", x: centerX - width / 2, y: y + 53 * scale, w: width, h: 18 * scale, size: 10 * scale, weight: .heavy, color: Palette.textMuted, tracking: 2.0 * scale, uppercase: true)
}

func drawBrandMark(on c: Canvas, centerX: CGFloat, centerY: CGFloat, radius r: CGFloat) {
    c.shadow(color: NSColor(hex: "#6F4E22", alpha: 0.18), blur: r * 0.14, y: -r * 0.04) {
        c.ellipse(centerX - r, centerY - r, r * 2, r * 2, fill: NSColor.white, stroke: Palette.accent, lineWidth: r * 0.035)
    }
    c.ellipse(centerX - r * 0.84, centerY - r * 0.84, r * 1.68, r * 1.68, fill: NSColor.clear, stroke: Palette.accent.withAlphaComponent(0.88), lineWidth: r * 0.012)
    c.polygon([
        CGPoint(x: centerX, y: centerY - r * 0.72),
        CGPoint(x: centerX + r * 0.16, y: centerY - r * 0.18),
        CGPoint(x: centerX, y: centerY - r * 0.04),
        CGPoint(x: centerX - r * 0.16, y: centerY - r * 0.18),
    ], fill: Palette.accent)
    c.polygon([
        CGPoint(x: centerX, y: centerY + r * 0.72),
        CGPoint(x: centerX + r * 0.16, y: centerY + r * 0.18),
        CGPoint(x: centerX, y: centerY + r * 0.04),
        CGPoint(x: centerX - r * 0.16, y: centerY + r * 0.18),
    ], fill: Palette.accent)
    c.roundedRect(centerX - r * 0.13, centerY - r * 0.84, r * 0.26, r * 0.26, radius: r * 0.015, fill: Palette.accent)
    c.roundedRect(centerX - r * 0.13, centerY + r * 0.58, r * 0.26, r * 0.26, radius: r * 0.015, fill: Palette.bgCard)
    c.roundedRect(centerX - r * 0.82, centerY - r * 0.14, r * 0.52, r * 0.16, radius: r * 0.012, fill: Palette.accentDepth)
    c.roundedRect(centerX + r * 0.30, centerY - r * 0.14, r * 0.52, r * 0.16, radius: r * 0.012, fill: Palette.accentDepth)
    c.ellipse(centerX - r * 0.41, centerY - r * 0.30, r * 0.82, r * 0.60, fill: Palette.bgCard, stroke: Palette.accentDepth, lineWidth: r * 0.035)
    c.ellipse(centerX - r * 0.20, centerY - r * 0.20, r * 0.40, r * 0.40, fill: Palette.primaryDark)
    c.ellipse(centerX - r * 0.15, centerY - r * 0.15, r * 0.30, r * 0.30, fill: Palette.primary)
    c.ellipse(centerX - r * 0.04, centerY + r * 0.01, r * 0.16, r * 0.16, fill: NSColor.white)
    c.ellipse(centerX - r * 0.02, centerY + r * 0.08, r * 0.16, r * 0.16, fill: NSColor(hex: "#1E2945"))
    c.diamond(centerX: centerX - r * 0.58, centerY: centerY + r * 0.47, size: r * 0.23, fill: Palette.citizen)
    c.diamond(centerX: centerX + r * 0.58, centerY: centerY + r * 0.47, size: r * 0.23, fill: Palette.spy)
    c.diamond(centerX: centerX - r * 0.58, centerY: centerY + r * 0.47, size: r * 0.11, fill: NSColor.white)
    c.diamond(centerX: centerX + r * 0.58, centerY: centerY + r * 0.47, size: r * 0.11, fill: NSColor.white)
}

func drawFullSplash(width: Int, height: Int, path: String) throws {
    let c = Canvas(width: width, height: height)
    let s = CGFloat(width) / 414
    drawBackground(on: c)

    let stageTop = CGFloat(height) * 0.265
    let stageWidth = min(CGFloat(width) * 0.82, 360 * s)
    drawStage(on: c, centerX: CGFloat(width) / 2, topY: stageTop, width: stageWidth, scale: s)
    let baseY = stageTop + stageWidth * 0.48 - 20 * s
    drawCharacter(on: c, centerX: CGFloat(width) / 2 - 78 * s, baseY: baseY - 4 * s, scale: 0.88 * s, look: heroLook())
    drawCharacter(on: c, centerX: CGFloat(width) / 2, baseY: baseY - 10 * s, scale: 1.12 * s, look: championLook())
    drawCharacter(on: c, centerX: CGFloat(width) / 2 + 78 * s, baseY: baseY - 4 * s, scale: 0.88 * s, look: shadowLook())

    drawBrandMark(on: c, centerX: CGFloat(width) / 2, centerY: CGFloat(height) * 0.575, radius: 72 * s)
    drawTitle(on: c, centerX: CGFloat(width) / 2, y: CGFloat(height) * 0.715, width: 260 * s, scale: s)
    try c.writePNG(to: path)
}

func drawSplashIcon(path: String) throws {
    let c = Canvas(width: 1024, height: 1024, transparent: true)
    drawStage(on: c, centerX: 512, topY: 134, width: 760, scale: 2.35)
    drawCharacter(on: c, centerX: 316, baseY: 474, scale: 2.1, look: heroLook())
    drawCharacter(on: c, centerX: 512, baseY: 452, scale: 2.55, look: championLook())
    drawCharacter(on: c, centerX: 708, baseY: 474, scale: 2.1, look: shadowLook())
    drawBrandMark(on: c, centerX: 512, centerY: 628, radius: 185)
    drawTitle(on: c, centerX: 512, y: 830, width: 580, scale: 2.2)
    try c.writePNG(to: path)
}

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
try FileManager.default.createDirectory(at: root.appendingPathComponent("assets"), withIntermediateDirectories: true)
try FileManager.default.createDirectory(at: root.appendingPathComponent("ios/NexSpy/Images.xcassets/SplashScreenLegacy.imageset"), withIntermediateDirectories: true)

try drawSplashIcon(path: root.appendingPathComponent("assets/splash-icon.png").path)
try drawFullSplash(width: 414, height: 736, path: root.appendingPathComponent("ios/NexSpy/Images.xcassets/SplashScreenLegacy.imageset/image.png").path)
try drawFullSplash(width: 828, height: 1472, path: root.appendingPathComponent("ios/NexSpy/Images.xcassets/SplashScreenLegacy.imageset/image@2x.png").path)
try drawFullSplash(width: 1242, height: 2208, path: root.appendingPathComponent("ios/NexSpy/Images.xcassets/SplashScreenLegacy.imageset/image@3x.png").path)

print("Generated splash assets.")
