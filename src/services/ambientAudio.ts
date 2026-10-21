import { AmbientSoundType } from '../types/quran';

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentType: AmbientSoundType = 'none';
  private isPlaying: boolean = false;
  private nodes: Array<{ stop?: () => void; disconnect: () => void }> = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAudioContext(): AudioContext | null {
    return this.ctx;
  }

  public getMasterGain(): GainNode | null {
    return this.masterGain;
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, volume));
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    this.nodes.forEach((n) => {
      try {
        if (n.stop) n.stop();
        n.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.nodes = [];
    this.isPlaying = false;
    this.currentType = 'none';
  }

  public play(type: AmbientSoundType, volume: number = 0.25) {
    if (type === 'none') {
      this.stop();
      return;
    }

    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.setVolume(volume);
    this.currentType = type;
    this.isPlaying = true;

    if (type === 'rain') {
      this.createRainSound();
    } else if (type === 'breeze') {
      this.createBreezeSound();
    } else if (type === 'water') {
      this.createWaterSound();
    } else if (type === 'makkah') {
      this.createMakkahTone();
    }
  }

  private createNoiseBuffer(duration: number = 5): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pinkish noise filter
      lastOut = (lastOut * 0.95) + (white * 0.05);
      data[i] = lastOut * 3;
    }
    return buffer;
  }

  private createRainSound() {
    if (!this.ctx || !this.masterGain) return;

    const buffer = this.createNoiseBuffer(4);
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Bandpass filter for rain effect
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    this.nodes.push(source, filter, gain);
  }

  private createBreezeSound() {
    if (!this.ctx || !this.masterGain) return;

    const buffer = this.createNoiseBuffer(5);
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Resonant bandpass with slow LFO modulation
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    // LFO for breeze wavering
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // 0.2 Hz slow breath
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    lfo.start();
    this.nodes.push(source, lfo, lfoGain, filter, gain);
  }

  private createWaterSound() {
    if (!this.ctx || !this.masterGain) return;

    const buffer = this.createNoiseBuffer(4);
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter1.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    source.connect(filter1);
    filter1.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    this.nodes.push(source, filter1, gain);
  }

  private createMakkahTone() {
    if (!this.ctx || !this.masterGain) return;

    // Spiritual warm ambient chord (D minor - 432 tuning / peaceful frequencies)
    const freqs = [108, 162, 216, 324];
    const groupGain = this.ctx.createGain();
    groupGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    freqs.forEach((f) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(groupGain);
      osc.start();
      this.nodes.push(osc, filter);
    });

    groupGain.connect(this.masterGain);
    this.nodes.push(groupGain);
  }
}

export const ambientEngine = new AmbientSoundEngine();
