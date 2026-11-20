import math
from PIL import Image, ImageDraw, ImageFilter

def create_icons():
    size = 512
    # Create high-res canvas at 4x for supersampling
    scale = 4
    w = size * scale
    h = size * scale
    
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx, cy = w / 2, h / 2
    r = 185 * scale  # radius of wax seal
    
    # Draw soft drop shadow below wax seal
    shadow_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_img)
    shadow_offset_y = 18 * scale
    shadow_r = r + 4 * scale
    s_draw.ellipse(
        [cx - shadow_r, cy - shadow_r + shadow_offset_y, cx + shadow_r, cy + shadow_r + shadow_offset_y],
        fill=(50, 12, 18, 110)
    )
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(radius=20 * scale))
    img.alpha_composite(shadow_img)
    
    # Draw wax seal circle with radial gradient
    # We can draw concentric circles or compute radial distance
    # For silky smooth gradient:
    seal_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    # Light source slightly top-left
    lx, ly = cx - 35 * scale, cy - 35 * scale
    
    # Generate radial gradient into an image
    # Color stops:
    # 0.0: (170, 52, 70)  # highlight
    # 0.45: (139, 38, 53) # crimson
    # 0.80: (105, 20, 32) # deep wine
    # 1.0: (72, 12, 22)   # dark rim
    import numpy as np
    
    y, x = np.ogrid[:h, :w]
    # Distance from center for circle mask
    dist_c = np.sqrt((x - cx)**2 + (y - cy)**2)
    # Distance from light source for gradient
    dist_l = np.sqrt((x - lx)**2 + (y - ly)**2)
    
    # Normalized gradient [0, 1]
    norm_l = np.clip(dist_l / (r * 1.5), 0.0, 1.0)
    
    # Interpolate colors
    # (170, 52, 70) -> (139, 38, 53) -> (90, 16, 26)
    r_chan = np.clip(170 - 85 * norm_l, 60, 180).astype(np.uint8)
    g_chan = np.clip(54 - 38 * norm_l, 10, 60).astype(np.uint8)
    b_chan = np.clip(72 - 50 * norm_l, 16, 80).astype(np.uint8)
    
    # Mask by circle with antialiasing
    alpha = np.clip((r - dist_c) * 1.5, 0, 255).astype(np.uint8)
    
    rgba = np.stack([r_chan, g_chan, b_chan, alpha], axis=-1)
    seal_base = Image.fromarray(rgba, 'RGBA')
    img.alpha_composite(seal_base)
    
    # Draw soft inner rim highlight (upper left) and inner shadow (lower right)
    # Now draw the Heart in the center
    # Heart center at cx, cy + 5*scale (optical center)
    heart_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(heart_img)
    
    # Define bezier points for a plump, rounded heart matching the image
    # Using polygon approximation of bezier
    def bezier_curve(p0, p1, p2, p3, steps=30):
        points = []
        for i in range(steps + 1):
            t = i / steps
            x = (1-t)**3 * p0[0] + 3*(1-t)**2 * t * p1[0] + 3*(1-t) * t**2 * p2[0] + t**3 * p3[0]
            y = (1-t)**3 * p0[1] + 3*(1-t)**2 * t * p1[1] + 3*(1-t) * t**2 * p2[1] + t**3 * p3[1]
            points.append((x, y))
        return points

    ox = cx
    oy = cy - 8 * scale  # optical center
    hw = 88 * scale      # half width
    hh = 150 * scale     # height
    
    # Heart path:
    # Bottom tip: (ox, oy + 78*scale)
    # Left lower curve to left lobe
    # Top dip: (ox, oy - 28*scale)
    tip = (ox, oy + 76 * scale)
    left_c1 = (ox - 45 * scale, oy + 42 * scale)
    left_c2 = (ox - 92 * scale, oy + 5 * scale)
    left_mid = (ox - 92 * scale, oy - 28 * scale)
    
    left_top_c1 = (ox - 92 * scale, oy - 70 * scale)
    left_top_c2 = (ox - 38 * scale, oy - 76 * scale)
    center_dip = (ox, oy - 38 * scale)
    
    right_top_c2 = (ox + 38 * scale, oy - 76 * scale)
    right_top_c1 = (ox + 92 * scale, oy - 70 * scale)
    right_mid = (ox + 92 * scale, oy - 28 * scale)
    right_c2 = (ox + 92 * scale, oy + 5 * scale)
    right_c1 = (ox + 45 * scale, oy + 42 * scale)
    
    pts = []
    pts.extend(bezier_curve(tip, left_c1, left_c2, left_mid))
    pts.extend(bezier_curve(left_mid, left_top_c1, left_top_c2, center_dip))
    pts.extend(bezier_curve(center_dip, right_top_c2, right_top_c1, right_mid))
    pts.extend(bezier_curve(right_mid, right_c2, right_c1, tip))
    
    # Draw soft heart shadow inside wax (subtle deboss/emboss effect)
    heart_shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    hs_draw = ImageDraw.Draw(heart_shadow)
    hs_draw.polygon([(px, py + 4*scale) for px, py in pts], fill=(45, 10, 16, 80))
    heart_shadow = heart_shadow.filter(ImageFilter.GaussianBlur(radius=4 * scale))
    img.alpha_composite(heart_shadow)
    
    # Draw crisp pure cream/white heart
    h_draw.polygon(pts, fill=(255, 255, 255, 255))
    img.alpha_composite(heart_img)
    
    # Resize down to 512x512 with high-quality Lanczos antialiasing
    final_512 = img.resize((size, size), Image.Resampling.LANCZOS)
    final_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    
    final_512.save("public/icon-512.png")
    final_192.save("public/icon-192.png")
    final_512.save("public/apple-touch-icon.png")
    print("PNG icons generated successfully!")

if __name__ == "__main__":
    create_icons()
