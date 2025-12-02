# Mentor Matcher

A React-based web application for automating mentor-mentee matching with transparent scoring, admin controls, and simple tracking.

## Features

###  Core Functionality
- **CSV Upload**: Upload mentor and mentee data via drag-and-drop interface
- **Smart Matching**: Transparent algorithm with configurable scoring weights
- **Admin Controls**: Review matches, swap pairs, adjust thresholds  
- **Message Generation**: Customizable templates with variable substitution
- **Status Tracking**: Kanban-style interface for tracking pair progress

###  Matching Algorithm
Uses weighted scoring across multiple dimensions:
- **Skills Overlap (40%)**: Jaccard index between mentor skills and mentee preferred skills
- **Interest Overlap (20%)**: Jaccard index between shared interests
- **Availability (20%)**: Boolean overlap of time slots
- **Location (10%)**: String match for proximity
- **Capacity (10%)**: Mentor availability and load balancing

## Quick Start

### Installation
`ash
# Install dependencies
npm install

# Start development server  
npm run dev

# Build for production
npm run build
`

### Usage Workflow
1. **Upload**: Add mentor and mentee CSV files (samples provided)
2. **Match**: Run algorithm with configurable threshold (40-80%)
3. **Review**: Examine pairs, swap if needed, view scoring rationale
4. **Messages**: Customize template, generate intro messages  
5. **Track**: Monitor pair status from Not Sent → Sent/Active

## CSV Data Format

### Mentors CSV
Required: 
ame, email, skills, capacity, vailability_slots
Optional: phone, 
ole, org, interests, location

### Mentees CSV  
Required: 
ame, email, preferred_skills, vailability_slots
Optional: phone, program_track, goals, interests, location, priority

## Sample Data

Use the included files:
- sample-mentors.csv - 5 mentors with diverse skills
- sample-mentees.csv - 8 mentees with various learning goals

## Technology Stack

- React + TypeScript + Vite
- TailwindCSS for styling
- Zustand for state management
- Papaparse for CSV processing
- Client-side only (no backend required)

## Demo Instructions

1. Upload the sample CSV files
2. Set matching threshold to 50% and run matching
3. Review match scores and try swapping pairs
4. Customize message template and preview results
5. Use Kanban board to track pair progress

Built for mentorship programs that need to scale with quality! 
