#!/usr/bin/env python3
"""Original 130 BPM teen-pop instrumental for the chorus-study short.

This is NOT a reproduction of "Baby": no melody, lyric, or recording from the
original is used. It is an original 24-bar cue in E-flat major built to give the
edit a real build / drop / lift / breakdown / final-hit structure.
"""
from __future__ import annotations

import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
BPM = 130.0
BEAT = 60.0 / BPM
BAR = 4.0 * BEAT
BARS = 24
TAIL = 1.75
DUR = BARS * BAR + TAIL
N = int(round(DUR * SR))

rng = np.random.default_rng(20100118)  # release date of the era, not audio data


# ---------------------------------------------------------------- utilities
def t_axis(n):
    return np.arange(n) / SR


def midi_hz(m):
    return 440.0 * 2.0 ** ((m - 69) / 12.0)


def polyblep_saw(freq, n, phase0=0.0):
    dt = np.full(n, freq / SR)
    t = (phase0 + np.cumsum(dt)) % 1.0
    y = 2.0 * t - 1.0
    m = t < dt
    x = t[m] / dt[m]
    y[m] -= x + x - x * x - 1.0
    m = t > 1.0 - dt
    x = (t[m] - 1.0) / dt[m]
    y[m] -= x * x + x + x + 1.0
    return y


def env_adsr(n, a=0.01, d=0.1, s=0.8, r=0.2):
    e = np.full(n, s)
    ai = max(1, int(a * SR))
    di = max(1, int(d * SR))
    ri = max(1, int(r * SR))
    ai = min(ai, n)
    di = min(di, max(0, n - ai))
    ri = min(ri, n)
    e[:ai] = np.linspace(0.0, 1.0, ai) ** 0.7
    if di:
        e[ai:ai + di] = np.linspace(1.0, s, di)
    if ai + di < n:
        e[ai + di:n - ri] = s
    if ri:
        e[n - ri:] *= np.linspace(1.0, 0.0, ri) ** 1.5
    return e


def filt(x, kind, cutoff, order=2):
    sos = butter(order, np.asarray(cutoff) / (SR / 2.0), btype=kind, output="sos")
    return sosfilt(sos, x)


def pan2(x, p):
    """p in [-1, 1] -> equal-power stereo."""
    p = float(np.clip(p, -1, 1))
    a = (p + 1.0) * np.pi / 4.0
    return np.stack([x * np.cos(a), x * np.sin(a)], axis=1)


def add(bus, sig, at, gain=1.0, pan=0.0):
    i = int(round(at * SR))
    if sig.ndim == 1:
        sig = pan2(sig, pan)
    n = min(len(sig), len(bus) - i)
    if n <= 0:
        return
    bus[i:i + n] += sig[:n] * gain


def stereo_width(x, width=1.0):
    mid = (x[:, 0] + x[:, 1]) * 0.5
    side = (x[:, 0] - x[:, 1]) * 0.5 * width
    return np.stack([mid + side, mid - side], axis=1)


# ---------------------------------------------------------------- instruments
def kick(amp=1.0):
    n = int(0.42 * SR)
    t = t_axis(n)
    f = 44.0 + 118.0 * np.exp(-t * 34.0)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.0)
    click = rng.normal(0, 1, n) * np.exp(-t * 260.0)
    click = filt(click, "high", 1800.0) * 0.35
    return np.tanh((body + click) * 1.7) * amp


def snare(amp=1.0):
    n = int(0.24 * SR)
    t = t_axis(n)
    noise = rng.normal(0, 1, n)
    noise = filt(noise, "band", [1500.0, 7800.0]) * np.exp(-t * 20.0)
    tone = np.sin(2 * np.pi * 185.0 * t) * np.exp(-t * 28.0) * 0.55
    return np.tanh((noise * 0.9 + tone) * 1.2) * amp


def clap(amp=1.0):
    n = int(0.30 * SR)
    t = t_axis(n)
    out = np.zeros(n)
    for k, off in enumerate((0.0, 0.011, 0.022, 0.034)):
        i = int(off * SR)
        m = n - i
        tt = t_axis(m)
        burst = rng.normal(0, 1, m) * np.exp(-tt * (70.0 - 10.0 * k))
        out[i:] += burst
    out = filt(out, "band", [900.0, 3400.0])
    return np.tanh(out * 1.5) * amp


def hat(open_=False, amp=1.0):
    dur = 0.30 if open_ else 0.055
    n = int(dur * SR)
    t = t_axis(n)
    nz = rng.normal(0, 1, n)
    nz = filt(nz, "high", 7800.0)
    e = np.exp(-t * (13.0 if open_ else 90.0))
    return nz * e * amp


def crash(amp=1.0):
    n = int(1.3 * SR)
    t = t_axis(n)
    nz = filt(rng.normal(0, 1, n), "high", 4200.0)
    shimmer = sum(
        np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * (0.25 / i)
        for i, f in enumerate((3100, 4370, 5630, 7210), start=1)
    )
    return (nz * 0.9 + shimmer * 0.3) * np.exp(-t * 3.4) * amp


def riser(dur, amp=1.0):
    n = int(dur * SR)
    t = t_axis(n)
    nz = rng.normal(0, 1, n)
    swell = (t / max(t[-1], 1e-6)) ** 2.2
    body = filt(nz, "band", [500.0, 9000.0]) * swell
    sweep = np.sin(2 * np.pi * np.cumsum(180.0 + 900.0 * (t / t[-1]) ** 2) / SR)
    sweep *= swell * 0.25
    return (body * 0.8 + sweep) * amp


def impact(amp=1.0):
    n = int(1.4 * SR)
    t = t_axis(n)
    f = 28.0 + 45.0 * np.exp(-t * 5.0)
    low = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.9)
    nz = filt(rng.normal(0, 1, n), "low", 900.0) * np.exp(-t * 8.0) * 0.5
    return np.tanh((low + nz) * 1.4) * amp


def supersaw(midi, dur, amp=0.1, cutoff=3800.0, detune=0.16, voices=7,
             attack=0.03, release=0.35, spread=1.0):
    n = int(dur * SR)
    L = np.zeros(n)
    R = np.zeros(n)
    for v in range(voices):
        cents = (v - (voices - 1) / 2.0) * detune * 100.0 / max((voices - 1) / 2.0, 1)
        f = midi_hz(midi) * 2.0 ** (cents / 1200.0)
        ph = (v * 0.137) % 1.0
        s = polyblep_saw(f, n, ph)
        p = (v / (voices - 1)) * 2.0 - 1.0 if voices > 1 else 0.0
        a = (p + 1.0) * np.pi / 4.0
        L += s * np.cos(a)
        R += s * np.sin(a)
    e = env_adsr(n, attack, 0.12, 0.82, release)
    L = filt(L * e, "low", cutoff)
    R = filt(R * e, "low", cutoff * 1.06)
    s = np.stack([L, R], axis=1) / voices
    return stereo_width(s * amp, spread)


def bass_note(midi, dur, amp=0.2, cutoff=260.0):
    n = int(dur * SR)
    f = midi_hz(midi)
    saw = polyblep_saw(f, n)
    sine = np.sin(2 * np.pi * f * t_axis(n))
    x = saw * 0.55 + sine * 0.8
    x = filt(x, "low", cutoff, order=2)
    e = env_adsr(n, 0.004, 0.05, 0.85, 0.035)
    return x * e * amp


def pluck(midi, dur, amp=0.06, bright=2600.0):
    n = int(dur * SR)
    f = midi_hz(midi)
    x = polyblep_saw(f, n) * 0.45 + np.sin(2 * np.pi * f * t_axis(n)) * 0.8
    x = filt(x, "low", bright)
    e = env_adsr(n, 0.003, 0.09, 0.18, 0.10)
    return x * e * amp


def lead_note(midi, dur, amp=0.12, bright=4200.0):
    n = int(dur * SR)
    f = midi_hz(midi)
    t = t_axis(n)
    vib = 1.0 + 0.006 * np.sin(2 * np.pi * 5.3 * t) * np.clip((t - 0.08) / 0.18, 0, 1)
    x = np.zeros(n)
    for cents, w in ((-7, 0.45), (0, 0.7), (7, 0.4)):
        ff = f * 2.0 ** (cents / 1200.0)
        x += polyblep_saw(ff, n) * w
    x += np.sin(2 * np.pi * f * t * vib) * 0.55
    x = filt(x, "low", bright)
    e = env_adsr(n, 0.012, 0.07, 0.78, 0.14)
    return x * e * amp


def choir(midi, dur, amp=0.05):
    n = int(dur * SR)
    t = t_axis(n)
    base = np.zeros(n)
    for cents in (-12, -5, 0, 6, 12):
        base += polyblep_saw(midi_hz(midi) * 2.0 ** (cents / 1200.0), n)
    form = (filt(base, "band", [620.0, 1080.0]) * 0.7
            + filt(base, "band", [2300.0, 3200.0]) * 0.35
            + filt(base, "low", 1800.0) * 0.3)
    e = env_adsr(n, 0.10, 0.25, 0.75, 0.45)
    return form * e * amp


# ---------------------------------------------------------------- arrangement
chords = {
    "Eb": [63, 67, 70, 75],
    "Bb": [58, 62, 65, 70],
    "Cm": [60, 63, 67, 72],
    "Ab": [56, 60, 63, 68],
}
roots = {"Eb": 39, "Bb": 34, "Cm": 36, "Ab": 32}
prog = ["Eb", "Bb", "Cm", "Ab"]
chord_of_bar = [prog[b % 4] for b in range(BARS)]
bar_t = lambda b: b * BAR

# chorus melody: original contour, not the original song's topline
mel_a = [
    [(0.0, 67, 0.9), (1.0, 70, 0.8), (2.0, 75, 0.45), (2.5, 72, 0.45), (3.0, 70, 0.9)],
    [(0.0, 70, 0.9), (1.0, 74, 0.8), (2.0, 77, 0.45), (2.5, 75, 0.45), (3.0, 74, 0.9)],
    [(0.0, 75, 0.9), (1.0, 74, 0.4), (1.5, 72, 0.4), (2.0, 70, 0.9), (3.0, 67, 0.9)],
    [(0.0, 68, 0.9), (1.0, 70, 0.9), (2.0, 72, 0.9), (3.0, 75, 0.9)],
]

mix = np.zeros((N, 2), dtype=np.float64)
pad_bus = np.zeros((N, 2))
music_bus = np.zeros((N, 2))
drum_bus = np.zeros((N, 2))

# --- intro bars 0..3 -------------------------------------------------------
for b in range(4):
    ch = chord_of_bar[b]
    cut = 900.0 + 420.0 * b
    for i, m in enumerate(chords[ch]):
        add(pad_bus, supersaw(m, BAR * 0.98, amp=0.052, cutoff=cut,
                              attack=0.18, release=0.5), bar_t(b) + i * 0.004, pan=(-0.5 + i * 0.33))
    add(music_bus, bass_note(roots[ch], BAR * 0.95, amp=0.13, cutoff=180), bar_t(b))
    # sparse arp
    tones = chords[ch] + [chords[ch][1] + 12]
    step = 0.5 if b < 2 else 0.25
    k = 0
    tt = bar_t(b)
    while tt < bar_t(b + 1) - 1e-6:
        note = tones[k % len(tones)] + (12 if (b >= 2 and k % 4 == 3) else 0)
        add(music_bus, pluck(note, 0.22, amp=0.040 if b >= 2 else 0.028), tt,
            pan=0.35 * np.sin(k * 1.3))
        tt += step * BEAT
        k += 1
    if b >= 2:
        for beat in range(4):
            add(drum_bus, kick(0.55), bar_t(b) + beat * BEAT)

# vinyl bed across intro and breakdown
vinyl = filt(rng.normal(0, 1, N), "band", [900.0, 7000.0]) * 0.004
pops = np.zeros(N)
for _ in range(90):
    i = rng.integers(0, N - 1000)
    pops[i:i + 40] += rng.normal(0, 1, 40) * np.exp(-np.arange(40) / 6.0) * 0.02
add(mix, vinyl + pops, 0.0)

# --- pre-chorus bars 4..7 --------------------------------------------------
pre_start = bar_t(4)
drop = bar_t(8)
for b in range(4, 8):
    ch = chord_of_bar[b]
    cut = 1300.0 + 520.0 * (b - 4)
    for i, m in enumerate(chords[ch]):
        add(pad_bus, supersaw(m, BAR * 0.95, amp=0.075, cutoff=cut,
                              attack=0.05, release=0.35), bar_t(b) + i * 0.004,
            pan=(-0.55 + i * 0.37))
    for e8 in range(8):
        tt = bar_t(b) + e8 * 0.5 * BEAT
        add(music_bus, bass_note(roots[ch] + (12 if e8 in (3, 7) else 0),
                                 0.42 * BEAT, amp=0.16, cutoff=300), tt)
        add(drum_bus, hat(False, 0.16 if e8 % 2 else 0.10), tt)
    for beat in range(4):
        tt = bar_t(b) + beat * BEAT
        add(drum_bus, kick(0.8), tt)
        if beat in (1, 3):
            add(drum_bus, clap(0.34), tt)
    for e4 in range(16):
        tones = chords[ch] + [chords[ch][2] + 12]
        note = tones[(e4 + b) % len(tones)]
        add(music_bus, pluck(note, 0.16, amp=0.028, bright=3200.0),
            bar_t(b) + e4 * 0.25 * BEAT, pan=0.5 * np.sin(e4 * 1.9))

# snare roll + riser into the drop
roll_start = bar_t(7) + 2 * BEAT
for k in range(16):
    tt = roll_start + k * 0.125 * BEAT * 2
    if tt < drop:
        add(drum_bus, snare(0.06 + 0.16 * (k / 15.0)), tt)
add(music_bus, riser(drop - bar_t(6), amp=0.16), bar_t(6))
add(drum_bus, riser(drop - bar_t(7), amp=0.10), bar_t(7))

# --- chorus A bars 8..15 ---------------------------------------------------
chorus_bars = range(8, 16)
for b in chorus_bars:
    ch = chord_of_bar[b]
    for i, m in enumerate(chords[ch]):
        add(pad_bus, supersaw(m, BAR * 0.92, amp=0.105, cutoff=4600.0,
                              detune=0.20, voices=9, attack=0.012, release=0.22),
            bar_t(b) + i * 0.003, pan=(-0.62 + i * 0.41))
    add(pad_bus, supersaw(chords[ch][0] + 12, BAR * 0.9, amp=0.035,
                          cutoff=5200.0, voices=5), bar_t(b), pan=0.12)
    for e8 in range(8):
        tt = bar_t(b) + e8 * 0.5 * BEAT
        octave = 12 if (b % 4 == 3 and e8 >= 4) else 0
        add(music_bus, bass_note(roots[ch] + octave, 0.40 * BEAT,
                                 amp=0.20, cutoff=360), tt)
        add(drum_bus, hat(False, 0.11 if e8 % 2 else 0.075), tt)
    for beat in range(4):
        tt = bar_t(b) + beat * BEAT
        add(drum_bus, kick(0.95), tt)
        if beat in (1, 3):
            add(drum_bus, clap(0.42), tt)
            add(drum_bus, snare(0.30), tt)
        add(drum_bus, hat(True, 0.10), tt + 0.5 * BEAT)
    for e4 in range(16):
        tones = chords[ch] + [chords[ch][2] + 12]
        add(music_bus, pluck(tones[e4 % len(tones)] + 12, 0.12, amp=0.018,
                             bright=3600.0), bar_t(b) + e4 * 0.25 * BEAT,
            pan=0.65 * np.sin(e4 * 1.7))

    notes = mel_a[b % 4]
    for off, m, ln in notes:
        add(music_bus, lead_note(m, ln * BEAT, amp=0.105), bar_t(b) + off * BEAT, pan=-0.05)
        add(music_bus, lead_note(m - 12, ln * BEAT, amp=0.035, bright=2200.0),
            bar_t(b) + off * BEAT, pan=0.1)

add(drum_bus, crash(0.5), drop)
add(drum_bus, impact(0.85), drop)
add(drum_bus, crash(0.32), bar_t(12))

# --- chorus B lift bars 16..19 --------------------------------------------
for b in range(16, 20):
    ch = chord_of_bar[b]
    for i, m in enumerate(chords[ch]):
        add(pad_bus, supersaw(m, BAR * 0.92, amp=0.115, cutoff=5200.0,
                              detune=0.22, voices=11, attack=0.010, release=0.20),
            bar_t(b) + i * 0.003, pan=(-0.65 + i * 0.43))
    add(pad_bus, choir(chords[ch][0], BAR * 0.9, amp=0.055), bar_t(b), pan=0.0)
    for e8 in range(8):
        tt = bar_t(b) + e8 * 0.5 * BEAT
        add(music_bus, bass_note(roots[ch] + (12 if e8 % 2 else 0), 0.40 * BEAT,
                                 amp=0.19, cutoff=400), tt)
        add(drum_bus, hat(False, 0.10), tt)
        add(drum_bus, hat(False, 0.07), tt + 0.25 * BEAT)
    for beat in range(4):
        tt = bar_t(b) + beat * BEAT
        add(drum_bus, kick(0.98), tt)
        if beat in (1, 3):
            add(drum_bus, clap(0.45), tt)
            add(drum_bus, snare(0.34), tt)
        add(drum_bus, hat(True, 0.115), tt + 0.5 * BEAT)
    notes = mel_a[b % 4]
    for off, m, ln in notes:
        add(music_bus, lead_note(m + 12, ln * BEAT, amp=0.055, bright=5600.0),
            bar_t(b) + off * BEAT, pan=0.25)
        add(music_bus, lead_note(m, ln * BEAT, amp=0.11), bar_t(b) + off * BEAT, pan=-0.08)
    for e4 in range(16):
        tones = chords[ch] + [chords[ch][2] + 12]
        add(music_bus, pluck(tones[e4 % len(tones)] + 12, 0.12, amp=0.020),
            bar_t(b) + e4 * 0.25 * BEAT, pan=0.7 * np.sin(e4 * 1.5))

add(drum_bus, crash(0.42), bar_t(16))
add(drum_bus, impact(0.55), bar_t(16))

# --- breakdown bars 20..21 ------------------------------------------------
for b in range(20, 22):
    ch = chord_of_bar[b]
    for i, m in enumerate(chords[ch]):
        add(pad_bus, supersaw(m, BAR * 0.98, amp=0.085, cutoff=1500.0 - 300 * (b - 20),
                              attack=0.08, release=0.5), bar_t(b) + i * 0.004,
            pan=(-0.4 + i * 0.27))
    add(pad_bus, choir(chords[ch][0], BAR * 0.95, amp=0.06), bar_t(b))
    add(music_bus, bass_note(roots[ch], BAR * 0.9, amp=0.12, cutoff=170), bar_t(b))
    if b == 20:
        for off, m, ln in mel_a[0][:3]:
            add(music_bus, lead_note(m, ln * BEAT, amp=0.09, bright=2400.0),
                bar_t(b) + off * BEAT)
        for beat in (0, 2):
            add(drum_bus, kick(0.55), bar_t(b) + beat * BEAT)
    else:
        for e4 in range(8):
            add(music_bus, pluck(chords[ch][e4 % 4] + 12, 0.18, amp=0.03),
                bar_t(b) + e4 * 0.5 * BEAT, pan=0.4 * np.sin(e4))

add(music_bus, riser(bar_t(22) - bar_t(21), amp=0.15), bar_t(21))
add(drum_bus, riser(bar_t(22) - bar_t(21.5), amp=0.10), bar_t(21.5))
for k in range(8):
    add(drum_bus, snare(0.05 + 0.18 * (k / 7.0)), bar_t(21.5) + k * 0.25 * BEAT)

# --- final hit bars 22..23 ------------------------------------------------
final = bar_t(22)
for b in range(22, 24):
    ch = chord_of_bar[b]
    for i, m in enumerate(chords[ch]):
        add(pad_bus, supersaw(m, BAR * 0.94, amp=0.12, cutoff=5600.0,
                              detune=0.22, voices=11, attack=0.008, release=0.25),
            bar_t(b) + i * 0.003, pan=(-0.65 + i * 0.43))
    add(pad_bus, choir(chords[ch][0], BAR * 0.9, amp=0.07), bar_t(b))
    for e8 in range(8):
        tt = bar_t(b) + e8 * 0.5 * BEAT
        add(music_bus, bass_note(roots[ch] + (12 if e8 % 2 else 0), 0.40 * BEAT,
                                 amp=0.20, cutoff=420), tt)
        add(drum_bus, hat(False, 0.11), tt)
    for beat in range(4):
        tt = bar_t(b) + beat * BEAT
        add(drum_bus, kick(1.0), tt)
        if beat in (1, 3):
            add(drum_bus, clap(0.46), tt)
            add(drum_bus, snare(0.35), tt)
        add(drum_bus, hat(True, 0.12), tt + 0.5 * BEAT)
    notes = mel_a[b % 4]
    for off, m, ln in notes:
        add(music_bus, lead_note(m, ln * BEAT, amp=0.11), bar_t(b) + off * BEAT)

add(drum_bus, impact(1.0), final)
add(drum_bus, crash(0.65), final)

# ---------------------------------------------------------------- mix
# sidechain pump on music + pad buses, driven by four-on-floor in loud sections
sc_times = []
for b in list(range(4, 20)) + list(range(22, 24)):
    for beat in range(4):
        sc_times.append(bar_t(b) + beat * BEAT)
sc_times = np.array(sorted(sc_times))
sc = np.ones(N)
for tk in sc_times:
    i = int(tk * SR)
    m = min(int(0.30 * SR), N - i)
    if m > 0:
        seg = np.arange(m)
        sc[i:i + m] *= 1.0 - 0.42 * np.exp(-seg / (0.11 * SR))
sc2 = sc[:, None]

mix += pad_bus * sc2 * 1.0
mix += music_bus * sc2 * 1.0
mix += drum_bus * 1.0

# stereo drum spread
# (drums were summed as mono-centered; add a touch of width to hats/crash via the bus itself)
mix[:, 1] += np.roll(drum_bus[:, 0], 11) * 0.06
mix[:, 0] += np.roll(drum_bus[:, 1], 13) * 0.06

# gentle bus glue / limiting
mix = np.tanh(mix * 1.15) * 0.92

# reverb send from a copy of music+pad (post sidechain) and transient-free content
send = (pad_bus * sc2 * 0.35 + music_bus * sc2 * 0.45)
send = send[:, 0] + send[:, 1]
ir_n = int(2.4 * SR)
ir_t = t_axis(ir_n)
ir_ir = rng.normal(0, 1, ir_n) * np.exp(-ir_t / 0.62)
ir_il = rng.normal(0, 1, ir_n) * np.exp(-ir_t / 0.58)
ir_ir = filt(ir_ir, "low", 6800.0)
ir_il = filt(ir_il, "low", 7000.0)
ir_ir /= np.sqrt(np.sum(ir_ir ** 2))
ir_il /= np.sqrt(np.sum(ir_il ** 2))
wetR = fftconvolve(send, ir_ir)[:N]
wetL = fftconvolve(send, ir_il)[:N]
mix[:, 0] += wetL * 0.16
mix[:, 1] += wetR * 0.16

# ping-pong dotted-eighth delay on the lead-ish bus
dly = int(0.75 * BEAT * SR)
wet = np.zeros_like(mix)
src = music_bus * sc2
for k in range(1, 6):
    g = 0.30 ** k
    idx = k * dly
    if idx >= N:
        break
    channel = k % 2
    wet[idx:, channel] += src[:N - idx, 0] * g
    wet[idx:, 1 - channel] += src[:N - idx, 1] * g
mix += wet * 0.10

# fade the very tail to silence so the render ends cleanly
fade_n = int(1.1 * SR)
mix[-fade_n:] *= np.linspace(1.0, 0.0, fade_n)[:, None] ** 1.4

# normalize to -1.4 dBFS
peak = np.max(np.abs(mix))
mix *= 0.85 / max(peak, 1e-9)
mix = np.clip(mix, -1.0, 1.0)

out = os.path.join(os.path.dirname(__file__), "..", "assets", "bgm.mp3")
os.makedirs(os.path.dirname(out), exist_ok=True)
tmp = os.path.join(os.path.dirname(__file__), "..", "assets", "bgm.wav")
wavfile.write(tmp, SR, (mix * 32767).astype(np.int16))
print(f"wrote {tmp}  duration={DUR:.3f}s  bpm={BPM}  bars={BARS}")
print(f"peak={np.max(np.abs(mix)):.3f}  rms={np.sqrt(np.mean(mix ** 2)):.4f}")
