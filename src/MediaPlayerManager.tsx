export interface MediaPlayer {
  id?: string; // Optional unique identifier - if provided, enables external control
  pause: () => void;
  play?: () => void; // Add play method for external control
  isDestroyed?: boolean;
  managerPause?: () => void;
}

class MediaPlayerManager {
  private players: Map<string, MediaPlayer> = new Map();
  private playersWithoutIds: Set<MediaPlayer> = new Set();

  registerPlayer(player: MediaPlayer) {
    if (player.id) {
      this.players.set(player.id, player);
    } else {
      this.playersWithoutIds.add(player);
    }
  }

  unregisterPlayer(player: MediaPlayer) {
    if (player.id) {
      this.players.delete(player.id);
    } else {
      this.playersWithoutIds.delete(player);
    }
  }

  // Get player by ID
  getPlayer(id: string): MediaPlayer | undefined {
    return this.players.get(id);
  }

  // Play specific player by ID
  playPlayer(id: string): boolean {
    const player = this.players.get(id);
    if (player && !player.isDestroyed && player.play) {
      try {
        player.play();
        return true;
      } catch (error) {
        console.warn(`Error playing media player ${id}:`, error);
        return false;
      }
    }
    return false;
  }

  // Pause specific player by ID
  pausePlayer(id: string): boolean {
    const player = this.players.get(id);
    if (player && !player.isDestroyed) {
      try {
        if (player.managerPause) {
          player.managerPause();
        } else {
          player.pause();
        }
        return true;
      } catch (error) {
        console.warn(`Error pausing media player ${id}:`, error);
        return false;
      }
    }
    return false;
  }

  pauseAllExcept(activePlayer: MediaPlayer | string) {
    const isActiveById = typeof activePlayer === 'string';
    const activePlayerId = isActiveById ? activePlayer : activePlayer.id;
    
    // Pause players with IDs
    this.players.forEach((player, id) => {
      if (id !== activePlayerId && !player.isDestroyed) {
        try {
          if (player.managerPause) {
            player.managerPause();
          } else {
            player.pause();
          }
        } catch (error) {
          console.warn(`Error pausing media player ${id}:`, error);
        }
      }
    });

    // Pause players without IDs (unless the active player is one of them)
    this.playersWithoutIds.forEach((player) => {
      if ((!isActiveById && player !== activePlayer) && !player.isDestroyed) {
        try {
          if (player.managerPause) {
            player.managerPause();
          } else {
            player.pause();
          }
        } catch (error) {
          console.warn('Error pausing media player:', error);
        }
      }
    });
  }

  pauseAll() {
    // Pause players with IDs
    this.players.forEach((player, id) => {
      if (!player.isDestroyed) {
        try {
          if (player.managerPause) {
            player.managerPause();
          } else {
            player.pause();
          }
        } catch (error) {
          console.warn(`Error pausing media player ${id}:`, error);
        }
      }
    });

    // Pause players without IDs
    this.playersWithoutIds.forEach((player) => {
      if (!player.isDestroyed) {
        try {
          if (player.managerPause) {
            player.managerPause();
          } else {
            player.pause();
          }
        } catch (error) {
          console.warn('Error pausing media player:', error);
        }
      }
    });
  }

  // Get list of all registered player IDs
  getPlayerIds(): string[] {
    return Array.from(this.players.keys()).filter(id => {
      const player = this.players.get(id);
      return player && !player.isDestroyed;
    });
  }
}

// Export singleton instance
export const mediaPlayerManager = new MediaPlayerManager();

// Make it globally accessible for webpage JS
if (typeof window !== 'undefined') {
  (window as any).mediaPlayerManager = mediaPlayerManager;
}