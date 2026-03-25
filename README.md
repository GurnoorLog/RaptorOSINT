# RAPTOROSINT: CYBER_PREDATOR

**Created by:** Gurnoor Tamber

## Overview

RAPTOROSINT is an AI-powered learning tool designed for Capture The Flag (CTF) enthusiasts. It provides intelligent advice, suggests strategies for flag retrieval, and helps users understand complex security challenges through guided reconnaissance.

Developed to help users learn the ropes of vulnerability discovery and flag retrieval, RAPTOROSINT provides comprehensive guidance on solving challenges in competitive CTF arenas.

## Features

- **Intelligent CTF Advice** - Leverage AI to receive advice and guidance on how to approach complex security challenges.
- **Flag Retrieval Suggestions** - Get actionable suggestions and strategies for finding and capturing flags in CTF competitions.
- **Educational Reconnaissance** - Learn the techniques of OSINT and vulnerability discovery through guided workflows.
- **Interactive Learning** - Engage with an AI assistant to analyze targets and understand security weaknesses in real-time.
- **Vulnerability Insights** - Gain a deeper understanding of security flaws and how they can be addressed for educational purposes.

## Installation

```bash
npm install
```

## Usage

```bash
npm run dev
```

This launches the development server. The application provides an intuitive interface for conducting reconnaissance operations and analyzing security vulnerabilities.

## Project Structure

```
├── components/           # React components
│   ├── ChallengeForm.tsx
│   ├── ChatInterface.tsx
│   ├── KnowledgeBase.tsx
│   ├── SenpaiOverlay.tsx
│   ├── Sidebar.tsx
│   └── VulnerabilityReport.tsx
├── services/            # API and service integrations
│   └── geminiService.ts # Google Gemini AI integration
├── App.tsx              # Main application component
├── index.tsx            # Entry point
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Technologies Used

- **Frontend:** React, TypeScript
- **Build Tool:** Vite
- **AI Integration:** Google Gemini API
- **UI Framework:** Modern CSS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your environment variables (API keys for services)
4. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
5. Start the development server: `npm run dev`
6. Access the application and begin your reconnaissance operations

## Disclaimer

RAPTOROSINT is intended for authorized security testing and educational purposes only. Users are responsible for ensuring compliance with all applicable laws and regulations when using this tool. Unauthorized access to computer systems is illegal.

## License

Proprietary - All rights reserved

---

**For cybersecurity professionals, penetration testers, and CTF competitors.**
