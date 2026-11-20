import math
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

def generate_exact_icons():
    # 512x512 target
    size = 512
    scale = 4  # 4x supersampling (2048x2048)
    W = size * scale
    H = size * scale
    
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    
    cx = W / 2
    cy = H / 2
    # Radius of circle
    r = 186 * scale
    
    # 1. Soft Drop Shadow
    # Light comes from top-left, shadow falls bottom-right
    shadow_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_img)
    shadow_offset_x = 4 * scale
    shadow_offset_y = 18 * scale
    s_draw.ellipse(
        [
            cx - r + shadow_offset_x,
            cy - r + shadow_offset_y,
            cx + r + shadow_offset_x,
            cy + r + shadow_offset_y
        ],
        fill=(60, 15, 22, 115)
    )
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(radius=22 * scale))
    img.alpha_composite(shadow_img)
    
    # 2. 3D Wax Seal Button
    # Radial/spherical gradient with light source at top-left
    # Colors matching reference:
    # Top-left highlight: (158, 52, 68) -> #9E3444
    # Mid-tone: (138, 38, 52) -> #8A2634
    # Bottom-right shadow: (102, 24, 38) -> #661826
    # Edge shadow: (80, 16, 28) -> #50101C
    
    y, x = np.ogrid[:H, :W]
    dist_c = np.sqrt((x - cx)**2 + (y - cy)**2)
    
    # Light source offset
    lx = cx - 55 * scale
    ly = cy - 55 * scale
    dist_l = np.sqrt((x - lx)**2 + (y - ly)**2)
    
    # Normalized light distance [0, 1] across circle
    norm_l = np.clip(dist_l / (r * 1.65), 0.0, 1.0)
    
    # Color interpolation
    r_chan = np.clip(160 - 80 * norm_l, 75, 165).astype(np.uint8)
    g_chan = np.clip(54 - 36 * norm_l, 18, 58).astype(np.uint8)
    b_chan = np.clip(69 - 46 * norm_l, 23, 72).astype(np.uint8)
    
    # Circle alpha with smooth antialiasing
    alpha = np.clip((r - dist_c) * 1.8, 0, 255).astype(np.uint8)
    
    seal_rgba = np.stack([r_chan, g_chan, b_chan, alpha], axis=-1)
    seal_base = Image.fromarray(seal_rgba, 'RGBA')
    img.alpha_composite(seal_base)
    
    # 3. Heart at the EXACT center of the circle
    # Ratio: width ~ 142*scale, height ~ 130*scale
    # Bounding box of heart centered at cx, cy
    hw = 71 * scale   # half width (total width 142*scale)
    hh = 65 * scale   # half height (total height 130*scale)
    
    # Center of heart bounding box is (cx, cy)
    top_y = cy - hh
    bottom_y = cy + hh
    
    # Cubic bezier points for a perfectly shaped rounded heart:
    # Tip at bottom: (cx, bottom_y)
    # Center notch at top: (cx, cy - 20*scale)
    # Lobes peaks at top_y
    def get_heart_curve(steps=120):
        # We can construct the heart using two symmetric halves
        # Left half from tip (cx, bottom_y) to notch (cx, cy - 20*scale)
        pts_left = []
        # Segment 1: from bottom tip to left outer lobe
        p0 = (cx, bottom_y)
        p1 = (cx - 42 * scale, cy + 28 * scale)
        p2 = (cx - hw, cy + 2 * scale)
        p3 = (cx - hw, cy - 22 * scale)
        for i in range(steps // 3):
            t = i / (steps // 3)
            px = (1-t)**3 * p0[0] + 3*(1-t)**2*t * p1[0] + 3*(1-t)*t**2 * p2[0] + t**3 * p3[0]
            py = (1-t)**3 * p0[1] + 3*(1-t)**2*t * p1[1] + 3*(1-t)*t**2 * p2[1] + t**3 * p3[1]
            pts_left.append((px, py))
            
        # Segment 2: round the left lobe to top
        p0 = (cx - hw, cy - 22 * scale)
        p1 = (cx - hw, cy - hh - 4 * scale)
        p2 = (cx - 24 * scale, top_y - 2 * scale)
        p3 = (cx, cy - 22 * scale)
        for i in range(steps // 3):
            t = i / (steps // 3)
            px = (1-t)**3 * p0[0] + 3*(1-t)**2*t * p1[0] + 3*(1-t)*t**2 * p2[0] + t**3 * p3[0]
            py = (1-t)**3 * p0[1] + 3*(1-t)**2*t * p1[1] + 3*(1-t)*t**2 * p2[1] + t**3 * p3[1]
            pts_left.append((px, py))
            
        # Right half is mirrored
        pts_right = [(2 * cx - px, py) for px, py in reversed(pts_left)]
        return pts_left + pts_right

    heart_pts = get_heart_curve()
    
    # Calculate actual bounding box to ensure it's centered to 0.01 precision
    min_x = min(p[0] for p in heart_pts)
    max_x = max(p[0] for p in heart_pts)
    min_y = min(p[1] for p in heart_pts)
    max_y = max(p[1] for p in heart_pts)
    
    curr_cx = (min_x + max_x) / 2
    curr_cy = (min_y + max_y) / 2
    
    # Re-center heart points exactly to (cx, cy)
    dx = cx - curr_cx
    dy = cy - curr_cy
    heart_pts = [(p[0] + dx, p[1] + dy) for p in heart_pts]
    
    # 4. Draw Heart
    # In the reference:
    # - Solid white border (stroke width ~ 10-12px at 512, so 44px at scale=4)
    # - Pale blush-cream interior: #E8D4D7 (232, 212, 215)
    
    heart_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(heart_layer)
    
    # Fill interior
    h_draw.polygon(heart_pts, fill=(232, 212, 215, 255))
    
    # Draw crisp white stroke
    stroke_w = int(11 * scale)
    h_draw.line(heart_pts + [heart_pts[0]], fill=(255, 255, 255, 255), width=stroke_w, joint="curve")
    
    # For extra smooth round corners on stroke, draw circles on joints
    for pt in heart_pts:
        h_draw.ellipse(
            [pt[0] - stroke_w/2, pt[1] - stroke_w/2, pt[0] + stroke_w/2, pt[1] + stroke_w/2],
            fill=(255, 255, 255, 255)
        )
        
    img.alpha_composite(heart_layer)
    
    # Supersampled resize to target sizes with Lanczos
    icon_512 = img.resize((size, size), Image.Resampling.LANCZOS)
    icon_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    
    icon_512.save("public/icon-512.png")
    icon_192.save("public/icon-192.png")
    icon_512.save("public/apple-touch-icon.png")
    print("Exact matching PNG icons generated successfully!")

if __name__ == "__main__":
    generate_exact_icons()
