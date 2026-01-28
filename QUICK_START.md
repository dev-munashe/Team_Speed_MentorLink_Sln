# Quick Start Guide

## Viewing the Presentation

### Option 1: Microsoft PowerPoint
1. Download `Public_Transport_Operator_Incubator_Programme.pptx`
2. Open with PowerPoint 2010 or newer
3. View in presentation mode (F5)

### Option 2: Google Slides
1. Go to [slides.google.com](https://slides.google.com)
2. Click "File" → "Open" → "Upload"
3. Upload `Public_Transport_Operator_Incubator_Programme.pptx`
4. Present or edit as needed

### Option 3: LibreOffice Impress (Free)
1. Download LibreOffice from [libreoffice.org](https://www.libreoffice.org/)
2. Open the `.pptx` file in Impress
3. View in presentation mode (F5)

## Regenerating the Presentation

If you need to modify or regenerate the presentation:

```bash
# Ensure Python 3 and pip are installed
python3 --version

# Install the required library
pip3 install python-pptx

# Run the generation script
python3 create_presentation.py
```

This will create/overwrite `Public_Transport_Operator_Incubator_Programme.pptx` with a fresh copy.

## Validating the Presentation

To verify the presentation meets all requirements:

```bash
python3 validate_presentation.py
```

This will check:
- All 5 slides exist
- Each slide has required content
- Proper structure and formatting
- All design requirements are met

## File Structure

```
.
├── Public_Transport_Operator_Incubator_Programme.pptx  # Main presentation
├── create_presentation.py                               # Generation script
├── validate_presentation.py                             # Validation script
├── PRESENTATION_README.md                               # Full documentation
├── DELIVERABLE_SUMMARY.md                               # Detailed summary
└── QUICK_START.md                                       # This file
```

## Need Help?

- **Full documentation**: See `PRESENTATION_README.md`
- **Detailed summary**: See `DELIVERABLE_SUMMARY.md`
- **Customization**: Edit the Python script or the .pptx file directly

---

**Pro Tip**: The presentation is fully editable in PowerPoint/Google Slides. Feel free to:
- Change colors to match your branding
- Add your organization's logo
- Modify text content
- Add additional slides
- Export to PDF for distribution
