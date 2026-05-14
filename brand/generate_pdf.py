#!/usr/bin/env python3
"""Generate a brand deck PDF for Johnson Performance Co."""

from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF
import os

BRAND_DIR = "/home/user/johnson-performance-co/brand"
PDF_SVG_DIR = "/home/user/johnson-performance-co/brand/pdf"
OUTPUT = "/home/user/johnson-performance-co/brand/JPC-Brand-Deck.pdf"

BLACK = HexColor("#0A0A0A")
DARK = HexColor("#111111")
GOLD = HexColor("#C9A94E")
WHITE = HexColor("#FFFFFF")
GRAY = HexColor("#999999")

def draw_page_bg(c, w, h):
    c.setFillColor(BLACK)
    c.rect(0, 0, w, h, fill=True, stroke=False)

def draw_gold_line(c, x1, y1, x2, y2):
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(x1, y1, x2, y2)

def draw_title_page(c, w, h):
    draw_page_bg(c, w, h)
    # Corner accents
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    m = 40
    l = 30
    c.line(m, h-m, m+l, h-m)
    c.line(m, h-m, m, h-m-l)
    c.line(w-m, h-m, w-m-l, h-m)
    c.line(w-m, h-m, w-m, h-m-l)
    c.line(m, m, m+l, m)
    c.line(m, m, m, m+l)
    c.line(w-m, m, w-m-l, m)
    c.line(w-m, m, w-m, m+l)
    # JP Mark
    svg_path = os.path.join(PDF_SVG_DIR, "logo-mark-flat.svg")
    drawing = svg2rlg(svg_path)
    if drawing:
        scale = 2.0
        drawing.width *= scale
        drawing.height *= scale
        drawing.scale(scale, scale)
        renderPDF.draw(drawing, c, w/2 - drawing.width/2, h/2 - 20)
    # Title text
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(w/2, h/2 - 160, "JOHNSON PERFORMANCE CO.")
    c.setFillColor(GOLD)
    c.setFont("Helvetica", 14)
    c.drawCentredString(w/2, h/2 - 185, "BRAND IDENTITY DECK")
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 9)
    c.drawCentredString(w/2, 60, "Prepared by NeuralFlow AI  |  2026")

def draw_asset_page(c, w, h, svg_file, title, description, usage):
    draw_page_bg(c, w, h)
    # Gold top line
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.line(40, h-50, w-40, h-50)
    # Title
    c.setFillColor(GOLD)
    c.setFont("Helvetica", 9)
    c.drawString(40, h-40, "JOHNSON PERFORMANCE CO.")
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(40, h-85, title)
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 10)
    c.drawString(40, h-105, description)
    # SVG rendering — use flat versions for PDF compatibility
    flat_file = svg_file.replace(".svg", "-flat.svg")
    svg_path = os.path.join(PDF_SVG_DIR, flat_file)
    if not os.path.exists(svg_path):
        svg_path = os.path.join(BRAND_DIR, svg_file)
    drawing = svg2rlg(svg_path)
    if drawing:
        # Determine scale to fit in display area
        max_w = w - 120
        max_h = h - 280
        scale_x = max_w / drawing.width
        scale_y = max_h / drawing.height
        scale = min(scale_x, scale_y, 2.5)
        drawing.width *= scale
        drawing.height *= scale
        drawing.scale(scale, scale)
        # Center it
        x = (w - drawing.width) / 2
        y = (h - 280 - drawing.height) / 2 + 100
        # Draw dark card behind it
        c.setFillColor(DARK)
        c.setStrokeColor(HexColor("#222222"))
        c.setLineWidth(0.5)
        pad = 20
        c.roundRect(x - pad, y - pad, drawing.width + pad*2, drawing.height + pad*2, 4, fill=True, stroke=True)
        renderPDF.draw(drawing, c, x, y)
    # Usage info at bottom
    c.setStrokeColor(HexColor("#333333"))
    c.setLineWidth(0.5)
    c.line(40, 90, w-40, 90)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(40, 72, "RECOMMENDED USE:")
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 9)
    c.drawString(40, 55, usage)

def draw_colors_page(c, w, h):
    draw_page_bg(c, w, h)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.line(40, h-50, w-40, h-50)
    c.setFillColor(GOLD)
    c.setFont("Helvetica", 9)
    c.drawString(40, h-40, "JOHNSON PERFORMANCE CO.")
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(40, h-85, "Brand Colors & Typography")
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 10)
    c.drawString(40, h-105, "Core palette and font specifications")

    colors = [
        ("#0A0A0A", "Primary Black", "Backgrounds, base"),
        ("#111111", "Dark", "Cards, sections"),
        ("#C9A94E", "Gold", "Accents, CTAs, highlights"),
        ("#D4BA6A", "Gold Light", "Hover states, gradients"),
        ("#A88B3A", "Gold Dark", "Gradient stops, depth"),
        ("#FFFFFF", "White", "Headlines, primary text"),
        ("#E8E8E3", "Off-White", "Body text"),
        ("#999999", "Light Gray", "Secondary text, labels"),
    ]

    y = h - 160
    swatch_size = 50
    for hex_val, name, use in colors:
        c.setFillColor(HexColor(hex_val))
        c.setStrokeColor(HexColor("#333333"))
        c.setLineWidth(0.5)
        c.roundRect(60, y, swatch_size, swatch_size, 4, fill=True, stroke=True)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(130, y + 32, name)
        c.setFillColor(GOLD)
        c.setFont("Helvetica", 9)
        c.drawString(130, y + 16, hex_val)
        c.setFillColor(GRAY)
        c.setFont("Helvetica", 9)
        c.drawString(130, y + 2, use)
        y -= 65

    # Typography section
    y -= 20
    c.setStrokeColor(HexColor("#333333"))
    c.line(40, y+10, w-40, y+10)
    y -= 30
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(60, y, "Typography")
    y -= 30
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(60, y, "DISPLAY FONT:")
    c.setFillColor(WHITE)
    c.setFont("Helvetica", 10)
    c.drawString(160, y, "Cormorant Garamond — Headlines, titles, monogram")
    y -= 22
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(60, y, "BODY FONT:")
    c.setFillColor(WHITE)
    c.setFont("Helvetica", 10)
    c.drawString(160, y, "DM Sans — Body copy, labels, navigation, buttons")

def main():
    w, h = letter  # 612 x 792

    c = canvas.Canvas(OUTPUT, pagesize=letter)
    c.setTitle("Johnson Performance Co. — Brand Identity Deck")
    c.setAuthor("NeuralFlow AI")

    # Page 1: Title
    draw_title_page(c, w, h)
    c.showPage()

    # Page 2: Primary Logo (Dark)
    draw_asset_page(c, w, h, "logo-primary.svg",
        "Primary Logo — Dark",
        "Horizontal lockup on dark background with barbell accent lines",
        "Website header, email signatures, letterhead, proposals, invoices")
    c.showPage()

    # Page 3: Primary Logo (Light)
    draw_asset_page(c, w, h, "logo-white.svg",
        "Primary Logo — Light",
        "Horizontal lockup on white background for light contexts",
        "Print materials, light-background documents, contracts, business cards")
    c.showPage()

    # Page 4: Logo Mark
    draw_asset_page(c, w, h, "logo-mark.svg",
        "Logo Mark / Icon",
        "Square JP monogram with gold border, corner accents, and barbell detail",
        "Profile pictures, app icons, watermarks, merch embroidery, favicons")
    c.showPage()

    # Page 5: Stacked Logo
    draw_asset_page(c, w, h, "logo-stacked.svg",
        "Stacked Logo",
        "Vertical lockup with JP mark, barbell divider, and full name",
        "Signage, apparel, merchandise, vertical placements, social profile")
    c.showPage()

    # Page 6: Social Banner
    draw_asset_page(c, w, h, "banner-social.svg",
        "Social Media Banner (1200x630)",
        "Open Graph / social share image with grid texture and corner brackets",
        "Facebook cover, LinkedIn banner, Open Graph image, link previews")
    c.showPage()

    # Page 7: Wide Banner
    draw_asset_page(c, w, h, "banner-wide.svg",
        "Wide Banner (1500x500)",
        "Panoramic banner with noise texture and dumbbell accents",
        "Twitter/X header, YouTube channel banner, website hero section")
    c.showPage()

    # Page 8: Favicon
    draw_asset_page(c, w, h, "favicon.svg",
        "Favicon",
        "Minimal 64x64 JP mark for browser tabs",
        "Browser tab icon, bookmark icon, PWA icon")
    c.showPage()

    # Page 9: Colors & Typography
    draw_colors_page(c, w, h)
    c.showPage()

    c.save()
    print(f"PDF saved to: {OUTPUT}")

if __name__ == "__main__":
    main()
