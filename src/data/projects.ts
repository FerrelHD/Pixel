import { ProjectQuest } from '../types';

export const REAL_PROJECTS: ProjectQuest[] = [
  {
    id: 'global-seismic-tracker',
    title: 'NUSANTARA CRUSTAL OBSERVATORY',
    subtitle: 'Global Seismic Tracker & NASA FIRMS Telemetry',
    category: 'web',
    rank: 'S-CLASS',
    status: 'COMPLETED',
    description:
      'Real-time tectonic telemetry, NASA FIRMS wildfire satellite intelligence, and volcanic seismic monitoring across the Pacific Ring of Fire.',
    lore:
      'Engineered an event-driven geospatial dashboard integrating live USGS seismic APIs, NASA satellite FIRMS hotspot feeds, and interactive Leaflet map layers with retro cartographic aesthetics.',
    tech: ['React 19', 'TypeScript', 'NASA FIRMS API', 'Leaflet', 'Tailwind CSS', 'Vite'],
    repoUrl: 'https://github.com/FerrelHD/Global-Seismic-Tracker',
    demoUrl: 'https://global-seismic-tracker.vercel.app',
    badge: 'GEOSPATIAL TELEMETRY',
    accentColor: 'border-cyan-400 text-cyan-400',
  },
  {
    id: 'leclerc-redline',
    title: 'SCUDERIA FERRARI #16 SHOWCASE',
    subtitle: 'Charles Leclerc High-Octane Showcase',
    category: 'web',
    rank: 'S-CLASS',
    status: 'COMPLETED',
    description:
      'High-octane F1 interactive showcase dedicated to Charles Leclerc #16 featuring engine telemetry, sound design, and cinematic animations.',
    lore:
      'Designed a luxury motorsport aesthetic with custom Ferrari racing redlines, procedural chiptune engine audio, driver telemetry stats, and high-performance Framer Motion orchestrations.',
    tech: ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Web Audio API'],
    repoUrl: 'https://github.com/FerrelHD/leclerc-redline',
    demoUrl: 'https://leclerc-redline.vercel.app',
    badge: 'MOTORSPORT EXPERIENCE',
    accentColor: 'border-spidey-crimson text-spidey-crimson',
  },
  {
    id: 'persona',
    title: 'PERSONA 5 ROYAL PORTFOLIO',
    subtitle: 'The Phantom Developer Interface',
    category: 'web',
    rank: 'A-CLASS',
    status: 'COMPLETED',
    description:
      'Cinematic game-console developer portfolio inspired by the stylized, acid-jazz UI of Persona 5 Royal (ATLUS / SEGA).',
    lore:
      'Recreated the iconic jagged red-and-black Phantom Thieves aesthetic with angled menu transitions, kinetic button physics, comic book halftones, and all-out attack visual flourishes.',
    tech: ['React 18', 'TypeScript', 'Tailwind CSS', 'Game UI Design', 'Framer Motion'],
    repoUrl: 'https://github.com/FerrelHD/Persona',
    demoUrl: 'https://persona-lilac-mu.vercel.app',
    badge: 'CONSOLE GAME UI',
    accentColor: 'border-red-500 text-red-500',
  },
  {
    id: 'street-rush-unity',
    title: 'STREET RUSH 3D ENDLESS RUNNER',
    subtitle: 'Unity 3D URP Mobile Platformer',
    category: 'game',
    rank: 'A-CLASS',
    status: 'IN_PROGRESS',
    description:
      'High-speed 3D Endless Runner game developed with Unity Engine and Universal Render Pipeline (URP).',
    lore:
      'Built custom player movement momentum physics, procedural lane-switching algorithms, dynamic obstacle spawning, and optimized mobile shader pipelines in Unity C#.',
    tech: ['Unity 3D', 'C#', 'URP Pipeline', 'ShaderLab', 'Game Physics'],
    repoUrl: 'https://github.com/FerrelHD/Street-Rush-Unity',
    badge: '3D GAME ENGINE',
    accentColor: 'border-arcade-gold text-arcade-gold',
  },
  {
    id: 'macos-golden-gate',
    title: 'MACOS GOLDEN GATE SIMULATOR',
    subtitle: 'Web-Based macOS Desktop Environment',
    category: 'web',
    rank: 'A-CLASS',
    status: 'COMPLETED',
    description:
      'Interactive web-based macOS desktop simulation featuring liquid glass aesthetics, native dock physics, and draggable multi-window architecture.',
    lore:
      'Crafted a high-fidelity desktop experience with frosted glass backdrops, active window focus management, menu bar applets, and responsive viewport resizing.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Window Management', 'Lucide Icons'],
    repoUrl: 'https://github.com/FerrelHD/OS',
    badge: 'DESKTOP SIMULATOR',
    accentColor: 'border-blue-400 text-blue-400',
  },
  {
    id: 'roblox-sentiment-indobert',
    title: 'ROBLOX SENTIMENT NLP INDOBERT',
    subtitle: 'Deep Learning Review Intelligence',
    category: 'ai',
    rank: 'A-CLASS',
    status: 'COMPLETED',
    description:
      'End-to-end Deep Learning system analyzing Indonesian Roblox Google Play reviews using IndoBERT transformer fine-tuning.',
    lore:
      'Collected and preprocessed thousands of user reviews, benchmarked SVM baseline versus fine-tuned IndoBERT transformer architecture, and built interactive Streamlit evaluation dashboards.',
    tech: ['Python', 'IndoBERT', 'PyTorch', 'Hugging Face', 'Streamlit', 'Scikit-Learn'],
    repoUrl: 'https://github.com/FerrelHD/Roblox-Sentimen-With-IndoBert',
    badge: 'AI & TRANSFORMERS',
    accentColor: 'border-emerald-400 text-emerald-400',
  },
];
