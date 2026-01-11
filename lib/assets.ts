export const ASSETS = {
  images: {
    logo: "/icon.svg", // Kept at root
    backgrounds: {
      classroomSpring: "/images/backgrounds/classroom-spring.jpg",
      classroomSummer: "/images/backgrounds/classroom-summer.jpg",
      classroomAutumn: "/images/backgrounds/classroom-autumn.jpg",
      classroomWinter: "/images/backgrounds/classroom-winter.jpg",
      abstractDark: "/images/backgrounds/abstract-neural-network-visualization-dark-theme.jpg",
      abstractMemory: "/images/backgrounds/abstract-memory-storage-visualization.jpg",
      futuristicDashboard: "/images/backgrounds/futuristic-data-dashboard-dark-minimal.jpg",
      soundWave: "/images/backgrounds/sound-wave-visualization-dark-theme.jpg",
    },
    textures: {
      maze: "/images/textures/maze.png",
      labyrinth: "/images/textures/labyrinth.png",
    },
    placeholders: {
      logo: "/images/placeholders/placeholder-logo.svg",
      logoPng: "/images/placeholders/placeholder-logo.png",
      user: "/images/placeholders/placeholder-user.jpg",
      generic: "/images/placeholders/placeholder.jpg",
      genericSvg: "/images/placeholders/placeholder.svg",
    }
  },
  audio: {
    bgm: {
      // Add background music files here
    },
    voices: {
      // Add voice files here
    }
  },
  videos: {
      demoReel: "/videos/demo-reel.mp4",
      feedOffline: "/videos/feed-offline.mp4", // Placeholder for tech showcase
  }
} as const;
