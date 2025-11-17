from PIL import Image, ImageDraw
import os

# Create favicon images
def create_favicon():
    # Create a blue background with resume + matching design
    sizes = [16, 32, 180]
    
    for size in sizes:
        img = Image.new('RGBA', (size, size), (59, 130, 246, 255))  # Blue background
        draw = ImageDraw.Draw(img)
        
        # Scale for size
        scale = size / 64
        
        # Draw document (white rectangle)
        doc_x1, doc_y1 = int(12 * scale), int(9 * scale)
        doc_x2, doc_y2 = int(27 * scale), int(30 * scale)
        draw.rectangle([doc_x1, doc_y1, doc_x2, doc_y2], fill='white', outline='white')
        
        # Draw lines on document
        line_color = (59, 130, 246)
        for i, y_offset in enumerate([6, 11, 16]):
            y = int(9 * scale + y_offset * scale)
            x1 = int(12 * scale + 3 * scale)
            x2 = int(27 * scale - 3 * scale) if i < 2 else int(24 * scale)
            draw.line([(x1, y), (x2, y)], fill=line_color, width=max(1, int(scale)))
        
        # Draw check mark (green circle)
        check_cx, check_cy = int(32 * scale), int(44 * scale)
        check_r = int(6 * scale)
        draw.ellipse([check_cx - check_r, check_cy - check_r, check_cx + check_r, check_cy + check_r], fill=(16, 185, 129))
        
        # Save files
        if size == 16:
            img.save('frontend/public/favicon-16x16.png')
        elif size == 32:
            img.save('frontend/public/favicon-32x32.png')
        elif size == 180:
            img.save('frontend/public/apple-touch-icon.png')
        
        print(f'Created favicon-{size}x{size}.png')

if __name__ == '__main__':
    create_favicon()
