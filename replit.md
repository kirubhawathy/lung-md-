# Pulmonary Medicine Department Management App

## Overview
A comprehensive mobile-friendly web application for pulmonary medicine department management designed for postgraduates and consultants.

## Project Architecture
- **Frontend**: React with Vite, TypeScript, shadcn/ui components, Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Storage**: In-memory storage (MemStorage) for development
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation

## Key Features
1. **Report Upload System**
   - Biopsy reports upload
   - Bronchoscopy reports upload
   - Thoracoscopy reports upload
   - FNAC reports upload
   - Communication portal/comments for each upload

2. **Scheduling System**
   - Duty roster management
   - Academic roster
   - Day-to-day procedures posting

3. **CME Management**
   - Upcoming CME events
   - Voting system for attendance interest

4. **Clinical Decision Support Tools**
   - Electronic patient data maintenance
   - Clinical guidelines and protocols

5. **Census Management**
   - ENT Block Census
     - ICU Census
     - Non-ICU Census  
     - TB Wing Census
   - Backside TB Ward Census (separate)
   - Equipment tracking (ventilators, BiPAP, CPAP)

6. **Journal Club**
   - Article sharing platform
   - Post sharing functionality
   - Community discussion and engagement

7. **Notification System**
   - New admission alerts to respective wards
   - Real-time updates for ward assignments

8. **Educational Resources**
   - Medical reference library (guidelines and protocols)
   - Daily quiz with 5 questions and leaderboard
   - Procedure video library with links

9. **Communication Hub**
   - Department announcements board
   - Direct messaging between staff members

10. **Patient Management System**
    - Casualty section for emergency department admissions tracking
    - OP to ward admission updates  
    - Case takeover tracking from other departments
    - Interdepartmental ward shifting (ICU ↔ Non-ICU ↔ TB Wing ↔ Backside Ward)
    - Personal handover notes for ward transfers
    - End-of-duty admission summaries

## User Preferences
- Mobile-friendly interface
- Professional appearance with character - NOT bland
- User-friendly but visually rich (not minimalist)
- Good visual design with comprehensive functionality
- Target users: Fellow postgraduates and consultants

## Technical Decisions
- Using modern full-stack JavaScript architecture
- Mobile-first responsive design
- Component-based UI with shadcn/ui
- Type-safe development with TypeScript
- Form validation with Zod schemas

## Recent Changes
- Initial project setup and architecture planning (2025-08-19)