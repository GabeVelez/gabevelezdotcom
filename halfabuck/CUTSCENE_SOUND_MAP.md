# Cutscene Sound Mapping
## Abduction Sequence Audio Design

### Complete Sound Timeline:

```
Frame 1: Leaving Home (2.0s)
├─ Visuals: Gabe leaving apartment
├─ Text: "MAY 25TH, 7:42 PM" / "EN ROUTE TO BIRTHDAY PARTY"
└─ Sound: [SILENCE]

Frame 2: The Ride (2.0s)
├─ Visuals: Getting in Guber car
├─ Text: "GUBER BLACK - CONFIRMED"
└─ Sound: [SILENCE]

Frame 3: On the Major Deegan (2.5s)
├─ Visuals: Interior car view, highway
├─ Text: "ON THE MAJOR DEEGAN"
└─ Sound: 🔊 CAR_DRIVING.mp3 [STARTS - loops through frame 10]

Frame 4: On My Way (2.0s)
├─ Visuals: Still relaxed in car
├─ Text: "ON MY WAY TO THE PARTY!"
└─ Sound: 🔊 car_driving (continues)

Frame 5: The Button (1.5s)
├─ Visuals: Hand pressing red button
├─ Text: [NONE]
└─ Sound: 🔊 car_driving (continues)
           + DOOR_LOCK.mp3 [ONE-SHOT]

Frame 6: Partition Raising (1.5s)
├─ Visuals: Partition starting to rise
├─ Text: [NONE]
└─ Sound: 🔊 car_driving (continues)
           + PARTITION_RAISE.mp3 [ONE-SHOT]

Frame 7: Partition Sealed (1.5s)
├─ Visuals: Partition fully sealed
├─ Text: [NONE]
└─ Sound: 🔊 car_driving (continues)

Frame 8: Shocked Reaction (1.5s)
├─ Visuals: Close-up shocked face
├─ Text: "WHAT THA HELL! LET ME OUT!"
└─ Sound: 🔊 car_driving (continues)
           + ALARM.mp3 [STARTS - loops through frame 9]

Frame 9: Gas Attack (1.5s)
├─ Visuals: Gas filling car, hand on partition
├─ Text: [NONE]
└─ Sound: 🔊 car_driving (continues)
           🔊 alarm (continues)
           + GAS_FLOW.mp3 [STARTS - loops through frame 10]
           + MAN_COUGHING.mp3 [ONE-SHOT - starts 500ms after gas]

Frame 10: Blackout (1.5s)
├─ Visuals: Unconscious, slumped over
├─ Text: "LOSING CONSCIOUSNESS..."
└─ Sound: 🔊 car_driving (continues)
           🔊 alarm (FADES OUT over 1.5s)
           🔊 gas_flow (continues)

[BLACK SCREEN] (2.0s)
└─ Sound: [ALL SOUNDS STOP]

[AWAKENING TEXT] (4.0s)
└─ Sound: [SILENCE]
```

---

## Sound File Details:

| File | Type | Frames | Volume | Notes |
|------|------|--------|--------|-------|
| `random_car_driving.mp3` | Loop | 3-10 | 40% | Background ambient |
| `door_lock.mp3` | One-shot | 5 | 80% | Heavy metallic chunk |
| `partition_raise.mp3` | One-shot | 6 | 70% | Mechanical slide/seal |
| `alarm.mp3` | Loop | 8-9 | 60% | Danger alert, fades in frame 10 |
| `gas_flow.mp3` | Loop | 9-10 | 50% | Toxic gas hissing |
| `man coughing.mp3` | One-shot | 9 | 70% | Plays 500ms after gas starts |

---

## Audio Layers by Frame:

**Frames 1-2:** Silence
**Frame 3-4:** 1 layer (car)
**Frame 5:** 2 layers (car + door lock)
**Frame 6-7:** 2 layers (car + partition)
**Frame 8:** 2 layers (car + alarm)
**Frame 9:** 4 layers! (car + alarm + gas + coughing)
**Frame 10:** 3 layers fading (car + alarm fading + gas)

---

## Implementation Notes:

- **Looping sounds** (car, alarm, gas) are stored in `activeSounds` object for cleanup
- **One-shot sounds** (door lock, partition, coughing) play once and auto-cleanup
- **Coughing** uses 500ms delay to start AFTER gas sound establishes
- **Alarm fade** uses Phaser tween on volume property (1.5s fade to 0)
- **Skip function** stops all active sounds immediately
- All sounds respect global `soundEnabled` setting from registry

---

## File Locations:

All sound files are in: `halfabuck/public/assets/sounds/cutscenes/`

✅ door_lock.mp3
✅ gas_flow.mp3
✅ man coughing.mp3
✅ partition_raise.mp3
✅ random_car_driving.mp3
✅ alarm.mp3

---

**Total Cutscene Duration:** ~20 seconds (frames) + 6 seconds (transitions) = ~26 seconds
**Total Audio Duration:** ~14.5 seconds (frame 3 to end of frame 10)
