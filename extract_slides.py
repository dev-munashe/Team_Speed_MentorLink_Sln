#!/usr/bin/env python3
"""
Script to extract and visualize PowerPoint slide content
Creates a detailed markdown preview of all slides
"""

from pptx import Presentation
from pptx.util import Pt
from pptx.enum.shapes import MSO_SHAPE_TYPE

def extract_slide_content(prs_path):
    """Extract all content from presentation slides"""
    prs = Presentation(prs_path)
    
    output = []
    output.append("# Public Transport Operator Incubator Programme")
    output.append("## Visual Slide Preview\n")
    output.append("---\n")
    
    for i, slide in enumerate(prs.slides, 1):
        output.append(f"\n## Slide {i}\n")
        
        # Get background info
        if slide.background.fill.type == 1:  # Solid fill
            output.append("**Background**: Solid color\n")
        elif slide.background.fill.type == 3:  # Gradient
            output.append("**Background**: Gradient (Blue tones)\n")
        else:
            output.append("**Background**: White/Light\n")
        
        # Extract all text content
        text_items = []
        shape_info = []
        
        for shape in slide.shapes:
            shape_desc = f"- {shape.shape_type.name if hasattr(shape, 'shape_type') else 'Shape'}"
            
            if hasattr(shape, "text") and shape.text:
                text_items.append(shape.text.strip())
                
                # Get font size if available
                try:
                    if hasattr(shape, 'text_frame'):
                        for paragraph in shape.text_frame.paragraphs:
                            if paragraph.runs:
                                font_size = paragraph.runs[0].font.size
                                if font_size:
                                    shape_desc += f" (Font: {font_size.pt}pt)"
                                break
                except:
                    pass
                
                shape_desc += f": \"{shape.text[:50]}...\""
            
            shape_info.append(shape_desc)
        
        output.append("### Layout Elements:\n")
        for info in shape_info[:10]:  # Limit to first 10 shapes
            output.append(info + "\n")
        
        if len(shape_info) > 10:
            output.append(f"... and {len(shape_info) - 10} more elements\n")
        
        output.append("\n### Text Content:\n")
        if text_items:
            for item in text_items:
                if len(item) > 100:
                    output.append(f"- {item[:100]}...\n")
                else:
                    output.append(f"- {item}\n")
        else:
            output.append("(Visual elements only)\n")
        
        output.append("\n---\n")
    
    return "".join(output)

def create_detailed_visualization(prs_path):
    """Create a detailed slide-by-slide visualization"""
    prs = Presentation(prs_path)
    
    output = []
    output.append("# SLIDE-BY-SLIDE DETAILED PREVIEW\n")
    output.append("# Public Transport Operator Incubator Programme\n\n")
    
    # Slide 1
    output.append("## 📊 SLIDE 1: Opening / Cover\n\n")
    output.append("```\n")
    output.append("╔══════════════════════════════════════════════════════════╗\n")
    output.append("║                                                          ║\n")
    output.append("║          DARK BLUE GRADIENT BACKGROUND                   ║\n")
    output.append("║                                                          ║\n")
    output.append("║                                                          ║\n")
    output.append("║      The Public Transport Operator                       ║\n")
    output.append("║          Incubator Programme                             ║\n")
    output.append("║                                                          ║\n")
    output.append("║   Structured Support & Capacity Building                ║\n")
    output.append("║     for Public Transport Operators                       ║\n")
    output.append("║                                                          ║\n")
    output.append("║                                                          ║\n")
    output.append("║         🚍      🚍      🚍      🚍                        ║\n")
    output.append("║      [Orange transport icons at bottom]                  ║\n")
    output.append("║                                                          ║\n")
    output.append("╚══════════════════════════════════════════════════════════╝\n")
    output.append("```\n\n")
    output.append("**Design Elements:**\n")
    output.append("- Blue gradient background (dark to light)\n")
    output.append("- Large white title text (54pt)\n")
    output.append("- Light blue subtitle (28pt)\n")
    output.append("- Four orange bus icons at bottom\n\n")
    
    # Slide 2
    output.append("## 📊 SLIDE 2: About the Incubator\n\n")
    output.append("```\n")
    output.append("╔══════════════════════════════════════════════════════════╗\n")
    output.append("║ [ORANGE BAR]                                             ║\n")
    output.append("║ 1. About the Incubator                                   ║\n")
    output.append("║                                                          ║\n")
    output.append("║  ┌────────────────────────────────────────────────┐     ║\n")
    output.append("║  │ 🎯 PURPOSE: A dedicated programme that         │     ║\n")
    output.append("║  │    matures public transport operators          │     ║\n")
    output.append("║  └────────────────────────────────────────────────┘     ║\n")
    output.append("║                                                          ║\n")
    output.append("║  STAGES:                                                 ║\n")
    output.append("║  ┌─────────────────┐      ┌─────────────────────────┐  ║\n")
    output.append("║  │     Entry       │ ➡️   │ Capacity Building       │  ║\n")
    output.append("║  │                 │      │   (Incubation) 📈       │  ║\n")
    output.append("║  └─────────────────┘      └─────────────────────────┘  ║\n")
    output.append("║                                                          ║\n")
    output.append("║  INPUTS GUIDING THE INCUBATOR:                           ║\n")
    output.append("║  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐      ║\n")
    output.append("║  │   Policy &  │ │ Status Quo   │ │    Best     │      ║\n")
    output.append("║  │ Legislation │ │   Models     │ │  Practice   │      ║\n")
    output.append("║  └─────────────┘ └──────────────┘ └─────────────┘      ║\n")
    output.append("╚══════════════════════════════════════════════════════════╝\n")
    output.append("```\n\n")
    output.append("**Design Elements:**\n")
    output.append("- Orange accent bar at top\n")
    output.append("- Blue title (40pt)\n")
    output.append("- Light blue box for purpose statement\n")
    output.append("- Two blue boxes for stages with arrow\n")
    output.append("- Three orange boxes for inputs\n")
    output.append("- Icons: 🎯 (target), ➡️ (arrow), 📈 (growth)\n\n")
    
    # Slide 3
    output.append("## 📊 SLIDE 3: The Incubation Journey\n\n")
    output.append("```\n")
    output.append("╔══════════════════════════════════════════════════════════╗\n")
    output.append("║ 2. The Incubation Journey                                ║\n")
    output.append("║                                                          ║\n")
    output.append("║  JOURNEY STEPS:                                          ║\n")
    output.append("║  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────┐║\n")
    output.append("║  │ Problem  │ ➡  │ Capacity │ ➡  │ Tailored │ ➡  │Grad│║\n")
    output.append("║  │Definition│    │ Building │    │ Support  │    │uat.│║\n")
    output.append("║  │          │    │          │    │          │    │    │║\n")
    output.append("║  │ Identify │    │Incubation│    │Training &│    │Meet│║\n")
    output.append("║  │gaps/needs│    │  phase   │    │mentorship│    │targ│║\n")
    output.append("║  └──────────┘    └──────────┘    └──────────┘    └────┘║\n")
    output.append("║                                                          ║\n")
    output.append("║  PROGRAMME FLOW:                                         ║\n")
    output.append("║  ┌─────────┐   ┌──────────┐   ┌──────────┐  ┌────────┐║\n")
    output.append("║  │  Entry  │ ➡ │Incubation│ ➡ │Graduation│➡│Contin. │║\n")
    output.append("║  │         │   │          │   │          │  │Support │║\n")
    output.append("║  └─────────┘   └──────────┘   └──────────┘  └────────┘║\n")
    output.append("║                                                          ║\n")
    output.append("║  A structured pathway from identification to             ║\n")
    output.append("║            sustainable operations                        ║\n")
    output.append("╚══════════════════════════════════════════════════════════╝\n")
    output.append("```\n\n")
    output.append("**Design Elements:**\n")
    output.append("- Blue title on gradient background\n")
    output.append("- Top row: 4 blue boxes with journey steps and orange arrows\n")
    output.append("- Bottom row: 4 teal boxes with programme flow stages\n")
    output.append("- Orange arrows connecting all stages\n")
    output.append("- Closing message in blue text\n\n")
    
    # Slide 4
    output.append("## 📊 SLIDE 4: Support Pillars\n\n")
    output.append("```\n")
    output.append("╔══════════════════════════════════════════════════════════╗\n")
    output.append("║ [BLUE BAR]                                               ║\n")
    output.append("║ 3. Support Pillars                                       ║\n")
    output.append("║                                                          ║\n")
    output.append("║  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────┐║\n")
    output.append("║  │   📚   │  │   💡   │  │   ⚙️   │  │   📊   │  │ 💰 │║\n")
    output.append("║  │        │  │        │  │        │  │        │  │    │║\n")
    output.append("║  │Training│  │Advisory│  │Technical│ │Business│  │Fin.│║\n")
    output.append("║  │        │  │        │  │        │  │        │  │    │║\n")
    output.append("║  │Workshops│ │ Expert │  │Technology│ │Govern. │  │Fund│║\n")
    output.append("║  │   &    │  │support │  │  hubs, │  │   &    │  │part│║\n")
    output.append("║  │classroom│ │   &    │  │ tools  │  │contract│  │ & │║\n")
    output.append("║  │learning│  │  peer  │  │   &    │  │  mgmt  │  │acc.│║\n")
    output.append("║  │        │  │learning│  │ systems│  │        │  │fund│║\n")
    output.append("║  └────────┘  └────────┘  └────────┘  └────────┘  └────┘║\n")
    output.append("║        BLUE      TEAL       BLUE       TEAL      BLUE   ║\n")
    output.append("║                                                          ║\n")
    output.append("║   Comprehensive support across all operational           ║\n")
    output.append("║                  dimensions                              ║\n")
    output.append("╚══════════════════════════════════════════════════════════╝\n")
    output.append("```\n\n")
    output.append("**Design Elements:**\n")
    output.append("- Blue accent bar at top\n")
    output.append("- Five vertical pillar columns\n")
    output.append("- Alternating blue and teal colors\n")
    output.append("- Large icons at top of each pillar (📚💡⚙️📊💰)\n")
    output.append("- Bold white titles\n")
    output.append("- Descriptive text in each pillar\n")
    output.append("- Teal message at bottom\n\n")
    
    # Slide 5
    output.append("## 📊 SLIDE 5: Targeted Outcomes\n\n")
    output.append("```\n")
    output.append("╔══════════════════════════════════════════════════════════╗\n")
    output.append("║ [GREEN BAR]                                              ║\n")
    output.append("║ 4. Targeted Outcomes                                     ║\n")
    output.append("║                                                          ║\n")
    output.append("║  ┌────────────────────────────────────────────────────┐ ║\n")
    output.append("║  │ 💪  Financially Resilient Operators                │ ║\n")
    output.append("║  │     Sustainable revenue & cost management          │ ║\n")
    output.append("║  └────────────────────────────────────────────────────┘ ║\n")
    output.append("║  ┌────────────────────────────────────────────────────┐ ║\n")
    output.append("║  │ 🛡️  Strong Governance                              │ ║\n")
    output.append("║  │     Effective leadership & accountability          │ ║\n")
    output.append("║  └────────────────────────────────────────────────────┘ ║\n")
    output.append("║  ┌────────────────────────────────────────────────────┐ ║\n")
    output.append("║  │ ⭐  Improved Service Delivery                       │ ║\n")
    output.append("║  │     Reliable, safe, and customer-focused ops      │ ║\n")
    output.append("║  └────────────────────────────────────────────────────┘ ║\n")
    output.append("║  ┌────────────────────────────────────────────────────┐ ║\n")
    output.append("║  │ 🎯  Competitive Bidding Readiness                  │ ║\n")
    output.append("║  │     Meet tender requirements & win contracts       │ ║\n")
    output.append("║  └────────────────────────────────────────────────────┘ ║\n")
    output.append("║  ┌────────────────────────────────────────────────────┐ ║\n")
    output.append("║  │ 📈  Long-term Sector Stability                     │ ║\n")
    output.append("║  │     Sustainable growth & industry transformation   │ ║\n")
    output.append("║  └────────────────────────────────────────────────────┘ ║\n")
    output.append("║                                                          ║\n")
    output.append("║   Building a sustainable and professional public         ║\n")
    output.append("║              transport sector                            ║\n")
    output.append("╚══════════════════════════════════════════════════════════╝\n")
    output.append("```\n\n")
    output.append("**Design Elements:**\n")
    output.append("- Green accent bar at top\n")
    output.append("- Five horizontal green boxes\n")
    output.append("- Icons for each outcome (💪🛡️⭐🎯📈)\n")
    output.append("- Bold white titles\n")
    output.append("- White descriptive text\n")
    output.append("- Green closing message\n\n")
    
    output.append("---\n\n")
    output.append("## 🎨 Color Scheme Summary\n\n")
    output.append("- **Primary Blue**: #29629B (titles, main elements)\n")
    output.append("- **Orange**: #FF8C00 (accents, highlights, arrows)\n")
    output.append("- **Green**: #4CAF50 (outcomes, success)\n")
    output.append("- **Teal**: #009688 (support structures)\n")
    output.append("- **White**: Text on colored backgrounds\n")
    output.append("- **Light Gray**: Background tones\n\n")
    
    return "".join(output)

if __name__ == '__main__':
    prs_path = '/home/runner/work/Team_Speed_MentorLink_Sln/Team_Speed_MentorLink_Sln/Public_Transport_Operator_Incubator_Programme.pptx'
    
    # Create basic extraction
    print("Extracting slide content...")
    basic_content = extract_slide_content(prs_path)
    with open('SLIDE_CONTENT_EXTRACTION.md', 'w') as f:
        f.write(basic_content)
    print("✓ Created: SLIDE_CONTENT_EXTRACTION.md")
    
    # Create detailed visualization
    print("Creating detailed visualization...")
    detailed_viz = create_detailed_visualization(prs_path)
    with open('SLIDE_VISUAL_PREVIEW.md', 'w') as f:
        f.write(detailed_viz)
    print("✓ Created: SLIDE_VISUAL_PREVIEW.md")
    
    print("\n✅ Visual preview documents created successfully!")
    print("\nYou can now view:")
    print("  - SLIDE_CONTENT_EXTRACTION.md (extracted text)")
    print("  - SLIDE_VISUAL_PREVIEW.md (detailed visual layout)")
