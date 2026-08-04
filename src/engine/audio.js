let context = null;

function getContext(muted) {
  if (muted) return null;
  if (!context) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) context = new AudioContext();
  }
  if (context?.state === 'suspended') context.resume();
  return context;
}

function tone(muted, frequency, duration, type='sine', volume=.05, delay=0) {
  const ctx = getContext(muted);
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = ctx.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + .02);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + .03);
}

export const sounds = {
  click: (m) => tone(m, 260, .05, 'square', .025),
  pickup: (m) => { tone(m, 440, .12, 'triangle', .05); tone(m, 690, .2, 'triangle', .04, .08); },
  alarm: (m) => { for (let i=0;i<8;i+=1) tone(m, i%2?370:530, .14, 'square', .04, i*.16); },
  bell: (m) => { tone(m, 128, 1.6, 'sine', .08); tone(m, 256, 1.1, 'sine', .035); },
  gull: (m) => { tone(m, 950, .08, 'sawtooth', .035); tone(m, 700, .12, 'sawtooth', .03, .1); },
  foghorn: (m) => { tone(m, 82, 1.4, 'sawtooth', .08); tone(m, 123, 1.25, 'sine', .055); }
};
