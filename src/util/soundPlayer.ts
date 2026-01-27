import { AudioPlayer, createAudioPlayer } from 'expo-audio';

export enum SoundEffect {
  ACCEPTED = 'accepted',
  ACTION_SUCCESS = 'action_success',
  ALERT_POP_UP = 'alert_pop_up',
  DONE_SUCCESS = 'done_success',
  GOAL_ACHIEVE = 'goal_achieve',
  REJECTED = 'rejected',
  TAP = 'tap',
}

class SoundPlayer {
  private isAudioEnabled = true;
  private players: Record<SoundEffect, AudioPlayer> | undefined = undefined;

  init() {
    this.players = {
      [SoundEffect.ACCEPTED]: createAudioPlayer(require('../../assets/audio/accepted.mp3')),
      [SoundEffect.ACTION_SUCCESS]: createAudioPlayer(require('../../assets/audio/action_success.mp3')),
      [SoundEffect.ALERT_POP_UP]: createAudioPlayer(require('../../assets/audio/alert_pop_up.mp3')),
      [SoundEffect.DONE_SUCCESS]: createAudioPlayer(require('../../assets/audio/done_success.mp3')),
      [SoundEffect.GOAL_ACHIEVE]: createAudioPlayer(require('../../assets/audio/goal_achieve.mp3')),
      [SoundEffect.REJECTED]: createAudioPlayer(require('../../assets/audio/rejected.mp3')),
      [SoundEffect.TAP]: createAudioPlayer(require('../../assets/audio/tap.mp3')),
    };
  }

  setAudioEnabled(enabled: boolean) {
    this.isAudioEnabled = enabled;
  }

  playEffect(effectName: SoundEffect) {
    const player = this.players?.[effectName];
    if (!this.isAudioEnabled || !player) return;

    if (player.playing) {
      player.pause();
    }

    player.seekTo(0);
    player.volume = 0.5;
    player.play();
  }
}

export const soundPlayer = new SoundPlayer();


