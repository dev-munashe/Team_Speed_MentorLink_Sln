#!/usr/bin/env python3
"""
Script to create the Public Transport Operator Incubator Programme presentation
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Define color palette based on infographic requirements
COLORS = {
    'blue_primary': RGBColor(41, 98, 155),      # #29629B - Primary blue
    'blue_dark': RGBColor(25, 60, 100),          # Darker blue for backgrounds
    'blue_light': RGBColor(100, 150, 200),       # Light blue for accents
    'orange': RGBColor(255, 140, 0),             # #FF8C00 - Orange highlight
    'green': RGBColor(76, 175, 80),              # #4CAF50 - Green for outcomes
    'teal': RGBColor(0, 150, 136),               # #009688 - Teal for support
    'white': RGBColor(255, 255, 255),
    'light_gray': RGBColor(240, 240, 240),
    'dark_gray': RGBColor(80, 80, 80),
}

def create_presentation():
    """Create the main presentation"""
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)
    
    # Create all 5 slides
    create_slide_1_cover(prs)
    create_slide_2_about(prs)
    create_slide_3_journey(prs)
    create_slide_4_pillars(prs)
    create_slide_5_outcomes(prs)
    
    # Save the presentation
    filename = 'Public_Transport_Operator_Incubator_Programme.pptx'
    prs.save(filename)
    print(f"✓ Presentation created: {filename}")
    return filename

def add_gradient_background(slide, color1, color2):
    """Add a gradient background to a slide"""
    background = slide.background
    fill = background.fill
    fill.gradient()
    fill.gradient_angle = 90.0
    fill.gradient_stops[0].color.rgb = color1
    fill.gradient_stops[1].color.rgb = color2

def add_title_shape(slide, title_text, top, height, font_size=44, color=None):
    """Add a title text box"""
    left = Inches(0.5)
    width = Inches(9)
    
    title_box = slide.shapes.add_textbox(left, top, width, height)
    title_frame = title_box.text_frame
    title_frame.word_wrap = True
    
    p = title_frame.paragraphs[0]
    p.text = title_text
    p.font.size = Pt(font_size)
    p.font.bold = True
    p.font.color.rgb = color or COLORS['white']
    p.alignment = PP_ALIGN.CENTER
    
    return title_box

def add_text_box(slide, text, left, top, width, height, font_size=18, bold=False, color=None, align=PP_ALIGN.LEFT):
    """Add a text box with specified properties"""
    text_box = slide.shapes.add_textbox(left, top, width, height)
    text_frame = text_box.text_frame
    text_frame.word_wrap = True
    
    p = text_frame.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.bold = bold
    p.font.color.rgb = color or COLORS['dark_gray']
    p.alignment = align
    
    return text_box

def add_shape_with_text(slide, shape_type, left, top, width, height, text, bg_color, text_color=None, font_size=14):
    """Add a shape with text inside"""
    shape = slide.shapes.add_shape(
        shape_type,
        left, top, width, height
    )
    
    # Set fill color
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    
    # Set line color
    shape.line.color.rgb = bg_color
    
    # Add text
    text_frame = shape.text_frame
    text_frame.word_wrap = True
    text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
    
    p = text_frame.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = text_color or COLORS['white']
    p.alignment = PP_ALIGN.CENTER
    
    return shape

def create_slide_1_cover(prs):
    """
    Slide 1 - Opening / Cover
    Blue background with transport theme
    """
    slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(slide_layout)
    
    # Add gradient background
    add_gradient_background(slide, COLORS['blue_dark'], COLORS['blue_primary'])
    
    # Add main title
    add_title_shape(
        slide,
        "The Public Transport Operator\nIncubator Programme",
        Inches(2),
        Inches(1.5),
        font_size=54,
        color=COLORS['white']
    )
    
    # Add subtitle
    add_title_shape(
        slide,
        "Structured Support & Capacity Building\nfor Public Transport Operators",
        Inches(3.5),
        Inches(1),
        font_size=28,
        color=COLORS['blue_light']
    )
    
    # Add decorative transport icons (using shapes)
    # Bus icon representation
    icon_y = Inches(6)
    icon_width = Inches(0.8)
    icon_height = Inches(0.5)
    
    positions = [Inches(2), Inches(4), Inches(6), Inches(8)]
    for pos in positions:
        add_shape_with_text(
            slide,
            MSO_SHAPE.ROUNDED_RECTANGLE,
            pos, icon_y, icon_width, icon_height,
            "🚍",
            COLORS['orange'],
            font_size=20
        )

def create_slide_2_about(prs):
    """
    Slide 2 - About the Incubator
    Orange accents, simple icons
    """
    slide_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(slide_layout)
    
    # White background
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = COLORS['white']
    
    # Title with orange accent bar
    title_bar = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(0), Inches(0), Inches(10), Inches(0.1)
    )
    title_bar.fill.solid()
    title_bar.fill.fore_color.rgb = COLORS['orange']
    title_bar.line.color.rgb = COLORS['orange']
    
    # Title
    add_text_box(
        slide,
        "1. About the Incubator",
        Inches(0.5), Inches(0.3), Inches(9), Inches(0.6),
        font_size=40, bold=True, color=COLORS['blue_primary']
    )
    
    # Purpose section
    purpose_box = add_shape_with_text(
        slide,
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(0.8), Inches(1.3), Inches(8.4), Inches(1),
        "PURPOSE: A dedicated programme that matures public transport operators",
        COLORS['blue_light'],
        COLORS['blue_dark'],
        font_size=18
    )
    
    # Stages section
    add_text_box(
        slide,
        "STAGES:",
        Inches(0.8), Inches(2.6), Inches(8.4), Inches(0.4),
        font_size=20, bold=True, color=COLORS['orange']
    )
    
    # Stage boxes
    stage_y = Inches(3.1)
    stage_width = Inches(4)
    
    add_shape_with_text(
        slide,
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(1.2), stage_y, stage_width, Inches(0.7),
        "Entry",
        COLORS['blue_primary'],
        font_size=16
    )
    
    add_shape_with_text(
        slide,
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(5.5), stage_y, stage_width, Inches(0.7),
        "Capacity Building (Incubation)",
        COLORS['blue_primary'],
        font_size=16
    )
    
    # Inputs section
    add_text_box(
        slide,
        "INPUTS GUIDING THE INCUBATOR:",
        Inches(0.8), Inches(4.3), Inches(8.4), Inches(0.4),
        font_size=20, bold=True, color=COLORS['orange']
    )
    
    # Input boxes
    inputs = ["Policy & Legislation", "Status Quo Models", "Best Practice"]
    input_y = Inches(4.9)
    input_width = Inches(2.6)
    
    for i, input_text in enumerate(inputs):
        add_shape_with_text(
            slide,
            MSO_SHAPE.ROUNDED_RECTANGLE,
            Inches(0.8 + i * 3), input_y, input_width, Inches(0.8),
            input_text,
            COLORS['orange'],
            font_size=14
        )
    
    # Add icons (using emoji/symbols)
    icon_positions = [
        (Inches(1.8), Inches(1.5), "🎯"),
        (Inches(2), Inches(3.3), "➡️"),
        (Inches(6.5), Inches(3.3), "📈"),
    ]
    
    for left, top, icon in icon_positions:
        icon_box = slide.shapes.add_textbox(left, top, Inches(0.5), Inches(0.5))
        p = icon_box.text_frame.paragraphs[0]
        p.text = icon
        p.font.size = Pt(24)
        p.alignment = PP_ALIGN.CENTER

def create_slide_3_journey(prs):
    """
    Slide 3 - The Incubation Journey
    Flow diagram with horizontal flow
    """
    slide_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(slide_layout)
    
    # Light blue gradient background
    add_gradient_background(slide, COLORS['white'], COLORS['light_gray'])
    
    # Title
    add_text_box(
        slide,
        "2. The Incubation Journey",
        Inches(0.5), Inches(0.3), Inches(9), Inches(0.6),
        font_size=40, bold=True, color=COLORS['blue_primary']
    )
    
    # Journey steps with flow
    steps = [
        ("Problem\nDefinition", "Identify gaps\n& needs"),
        ("Capacity\nBuilding", "Incubation\nphase"),
        ("Tailored\nSupport", "Training &\nmentorship"),
        ("Graduation", "Meet targets\n& exit")
    ]
    
    step_y = Inches(2)
    step_width = Inches(2)
    step_height = Inches(1.2)
    arrow_width = Inches(0.5)
    
    for i, (title, desc) in enumerate(steps):
        step_x = Inches(0.6 + i * 2.3)
        
        # Step box
        step_box = add_shape_with_text(
            slide,
            MSO_SHAPE.ROUNDED_RECTANGLE,
            step_x, step_y, step_width, step_height,
            f"{title}\n\n{desc}",
            COLORS['blue_primary'],
            font_size=12
        )
        
        # Arrow between steps
        if i < len(steps) - 1:
            arrow = slide.shapes.add_shape(
                MSO_SHAPE.RIGHT_ARROW,
                step_x + step_width + Inches(0.05),
                step_y + Inches(0.4),
                arrow_width,
                Inches(0.4)
            )
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = COLORS['orange']
            arrow.line.color.rgb = COLORS['orange']
    
    # Flow indicator section
    flow_y = Inches(4)
    add_text_box(
        slide,
        "PROGRAMME FLOW",
        Inches(0.5), flow_y, Inches(9), Inches(0.4),
        font_size=20, bold=True, color=COLORS['orange'], align=PP_ALIGN.CENTER
    )
    
    # Flow stages
    flow_stages = ["Entry", "Incubation", "Graduation", "Continuous\nSupport"]
    flow_y2 = Inches(4.6)
    stage_width = Inches(2)
    
    for i, stage in enumerate(flow_stages):
        stage_x = Inches(0.8 + i * 2.3)
        
        add_shape_with_text(
            slide,
            MSO_SHAPE.ROUNDED_RECTANGLE,
            stage_x, flow_y2, stage_width, Inches(0.8),
            stage,
            COLORS['teal'],
            font_size=13
        )
        
        # Arrow between stages
        if i < len(flow_stages) - 1:
            arrow = slide.shapes.add_shape(
                MSO_SHAPE.RIGHT_ARROW,
                stage_x + stage_width + Inches(0.05),
                flow_y2 + Inches(0.25),
                Inches(0.4),
                Inches(0.3)
            )
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = COLORS['orange']
            arrow.line.color.rgb = COLORS['orange']
    
    # Key message
    add_text_box(
        slide,
        "A structured pathway from identification to sustainable operations",
        Inches(1), Inches(6), Inches(8), Inches(0.5),
        font_size=16, color=COLORS['blue_primary'], align=PP_ALIGN.CENTER
    )

def create_slide_4_pillars(prs):
    """
    Slide 4 - Support Pillars
    Five pillars with icons, blue/teal tones
    """
    slide_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(slide_layout)
    
    # White background
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = COLORS['white']
    
    # Title with blue accent
    title_bar = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(0), Inches(0), Inches(10), Inches(0.1)
    )
    title_bar.fill.solid()
    title_bar.fill.fore_color.rgb = COLORS['blue_primary']
    title_bar.line.color.rgb = COLORS['blue_primary']
    
    add_text_box(
        slide,
        "3. Support Pillars",
        Inches(0.5), Inches(0.3), Inches(9), Inches(0.6),
        font_size=40, bold=True, color=COLORS['blue_primary']
    )
    
    # Five pillars
    pillars = [
        ("Training", "Workshops &\nclassroom learning", "📚"),
        ("Advisory", "Expert support &\npeer learning", "💡"),
        ("Technical", "Technology hubs,\ntools & systems", "⚙️"),
        ("Business", "Governance &\ncontract mgmt", "📊"),
        ("Financial", "Funding partners &\naccess to funders", "💰")
    ]
    
    pillar_width = Inches(1.6)
    pillar_height = Inches(3)
    start_x = Inches(0.6)
    pillar_y = Inches(2)
    spacing = Inches(0.15)
    
    colors = [COLORS['blue_primary'], COLORS['teal'], COLORS['blue_primary'], 
              COLORS['teal'], COLORS['blue_primary']]
    
    for i, (title, desc, icon) in enumerate(pillars):
        pillar_x = start_x + i * (pillar_width + spacing)
        
        # Pillar box
        pillar_box = add_shape_with_text(
            slide,
            MSO_SHAPE.ROUNDED_RECTANGLE,
            pillar_x, pillar_y, pillar_width, pillar_height,
            "",
            colors[i],
            font_size=14
        )
        
        # Icon
        icon_box = slide.shapes.add_textbox(
            pillar_x, pillar_y + Inches(0.2),
            pillar_width, Inches(0.6)
        )
        p = icon_box.text_frame.paragraphs[0]
        p.text = icon
        p.font.size = Pt(36)
        p.alignment = PP_ALIGN.CENTER
        
        # Title
        title_box = slide.shapes.add_textbox(
            pillar_x, pillar_y + Inches(1),
            pillar_width, Inches(0.5)
        )
        p = title_box.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = COLORS['white']
        p.alignment = PP_ALIGN.CENTER
        
        # Description
        desc_box = slide.shapes.add_textbox(
            pillar_x + Inches(0.1), pillar_y + Inches(1.6),
            pillar_width - Inches(0.2), Inches(1.2)
        )
        desc_frame = desc_box.text_frame
        desc_frame.word_wrap = True
        p = desc_frame.paragraphs[0]
        p.text = desc
        p.font.size = Pt(11)
        p.font.color.rgb = COLORS['white']
        p.alignment = PP_ALIGN.CENTER
    
    # Bottom message
    add_text_box(
        slide,
        "Comprehensive support across all operational dimensions",
        Inches(1), Inches(5.8), Inches(8), Inches(0.5),
        font_size=16, color=COLORS['teal'], align=PP_ALIGN.CENTER, bold=True
    )

def create_slide_5_outcomes(prs):
    """
    Slide 5 - Targeted Outcomes
    Green accents with outcome icons
    """
    slide_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(slide_layout)
    
    # Light gradient background
    add_gradient_background(slide, COLORS['white'], COLORS['light_gray'])
    
    # Title with green accent
    title_bar = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(0), Inches(0), Inches(10), Inches(0.1)
    )
    title_bar.fill.solid()
    title_bar.fill.fore_color.rgb = COLORS['green']
    title_bar.line.color.rgb = COLORS['green']
    
    add_text_box(
        slide,
        "4. Targeted Outcomes",
        Inches(0.5), Inches(0.3), Inches(9), Inches(0.6),
        font_size=40, bold=True, color=COLORS['green']
    )
    
    # Outcomes with icons
    outcomes = [
        ("💪", "Financially Resilient Operators", "Sustainable revenue & cost management"),
        ("🛡️", "Strong Governance", "Effective leadership & accountability structures"),
        ("⭐", "Improved Service Delivery", "Reliable, safe, and customer-focused operations"),
        ("🎯", "Competitive Bidding Readiness", "Meet tender requirements & win contracts"),
        ("📈", "Long-term Sector Stability", "Sustainable growth & industry transformation")
    ]
    
    outcome_y = Inches(1.5)
    outcome_height = Inches(1)
    outcome_spacing = Inches(0.15)
    
    for i, (icon, title, desc) in enumerate(outcomes):
        current_y = outcome_y + i * (outcome_height + outcome_spacing)
        
        # Outcome box
        outcome_box = add_shape_with_text(
            slide,
            MSO_SHAPE.ROUNDED_RECTANGLE,
            Inches(1), current_y, Inches(8), outcome_height,
            "",
            COLORS['green'],
            font_size=14
        )
        
        # Icon
        icon_box = slide.shapes.add_textbox(
            Inches(1.3), current_y + Inches(0.25),
            Inches(0.6), Inches(0.5)
        )
        p = icon_box.text_frame.paragraphs[0]
        p.text = icon
        p.font.size = Pt(32)
        p.alignment = PP_ALIGN.CENTER
        
        # Title
        title_box = slide.shapes.add_textbox(
            Inches(2.2), current_y + Inches(0.15),
            Inches(6.5), Inches(0.4)
        )
        p = title_box.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = COLORS['white']
        p.alignment = PP_ALIGN.LEFT
        
        # Description
        desc_box = slide.shapes.add_textbox(
            Inches(2.2), current_y + Inches(0.55),
            Inches(6.5), Inches(0.4)
        )
        p = desc_box.text_frame.paragraphs[0]
        p.text = desc
        p.font.size = Pt(13)
        p.font.color.rgb = COLORS['white']
        p.alignment = PP_ALIGN.LEFT
    
    # Closing message
    add_text_box(
        slide,
        "Building a sustainable and professional public transport sector",
        Inches(1), Inches(6.8), Inches(8), Inches(0.5),
        font_size=18, color=COLORS['green'], align=PP_ALIGN.CENTER, bold=True
    )

if __name__ == '__main__':
    create_presentation()
    print("\n✓ All slides created successfully!")
    print("✓ Presentation follows branding guidelines:")
    print("  • Blue primary color theme")
    print("  • Orange highlights and accents")
    print("  • Green for outcomes")
    print("  • Teal for support structures")
    print("  • Clear visual hierarchy")
    print("  • Professional, government-appropriate design")
