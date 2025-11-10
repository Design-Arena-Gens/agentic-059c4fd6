'use client'

import { useEffect, useState, useRef } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [currentScene, setCurrentScene] = useState(0)
  const [showText, setShowText] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const scenes = [
    {
      text: "रात के दो बजे मेरे कमरे के दरवाज़े पे किसी ने knock किया…",
      duration: 4000,
      sound: 'knock1'
    },
    {
      text: "मैं अकेला था घर में।",
      duration: 3000,
      sound: null
    },
    {
      text: "पहले लगा हवा होगी… लेकिन फिर knock फिर से हुआ — इस बार ज़्यादा ज़ोर से।",
      duration: 5000,
      sound: 'knock2'
    },
    {
      text: "मैंने flashlight उठाई, और दरवाज़े के पास गया।",
      duration: 4000,
      sound: 'footsteps'
    },
    {
      text: "अंदर से आवाज़ आई… एक लड़की की हल्की सी फुसफुसी हुई आवाज़ —",
      duration: 4000,
      sound: null
    },
    {
      text: "'Please… मदद करो…'",
      duration: 3000,
      sound: 'whisper'
    },
    {
      text: "दरवाज़ा खोलते ही एक ठंडी हवा का झोंका आया… लेकिन कोई नहीं था।",
      duration: 5000,
      sound: 'wind'
    },
    {
      text: "सिर्फ़ floor पे एक पुरानी polaroid photo पड़ी थी… मेरी।",
      duration: 4000,
      sound: 'heartbeat'
    },
    {
      text: "लेकिन उस photo में मैं दरवाज़े के बाहर खड़ा था।",
      duration: 5000,
      sound: 'heartbeat'
    },
    {
      text: "मुझे अब तक समझ नहीं आया… उस रात knock किसने किया था — मैं तो अंदर था।",
      duration: 6000,
      sound: null
    },
    {
      text: "👁️ Sometimes… the one knocking isn't outside.",
      duration: 4000,
      sound: 'glitch',
      final: true
    }
  ]

  const startExperience = () => {
    setIsPlaying(true)
    setCurrentScene(0)
    setShowText(true)
  }

  useEffect(() => {
    if (!isPlaying) return

    const scene = scenes[currentScene]

    // Play sound effect
    if (scene.sound) {
      playSound(scene.sound)
    }

    const timer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setShowText(false)
        setTimeout(() => {
          setCurrentScene(currentScene + 1)
          setShowText(true)
        }, 500)
      } else {
        // End of story
        setTimeout(() => {
          setIsPlaying(false)
          setCurrentScene(0)
          setShowText(false)
        }, 2000)
      }
    }, scene.duration)

    return () => clearTimeout(timer)
  }, [currentScene, isPlaying])

  const playSound = (soundType: string) => {
    // Web Audio API for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    switch(soundType) {
      case 'knock1':
      case 'knock2':
        // Create knock sound
        const knockOsc = audioContext.createOscillator()
        const knockGain = audioContext.createGain()
        knockOsc.connect(knockGain)
        knockGain.connect(audioContext.destination)
        knockOsc.frequency.value = 80
        knockGain.gain.setValueAtTime(0.3, audioContext.currentTime)
        knockGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        knockOsc.start(audioContext.currentTime)
        knockOsc.stop(audioContext.currentTime + 0.1)
        if (soundType === 'knock2') {
          setTimeout(() => {
            const knockOsc2 = audioContext.createOscillator()
            const knockGain2 = audioContext.createGain()
            knockOsc2.connect(knockGain2)
            knockGain2.connect(audioContext.destination)
            knockOsc2.frequency.value = 80
            knockGain2.gain.setValueAtTime(0.4, audioContext.currentTime)
            knockGain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
            knockOsc2.start(audioContext.currentTime)
            knockOsc2.stop(audioContext.currentTime + 0.1)
          }, 200)
        }
        break

      case 'heartbeat':
        // Create heartbeat sound
        const beatOsc = audioContext.createOscillator()
        const beatGain = audioContext.createGain()
        beatOsc.connect(beatGain)
        beatGain.connect(audioContext.destination)
        beatOsc.frequency.value = 60
        beatGain.gain.setValueAtTime(0.5, audioContext.currentTime)
        beatGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        beatOsc.start(audioContext.currentTime)
        beatOsc.stop(audioContext.currentTime + 0.3)
        break
    }
  }

  const scene = scenes[currentScene]

  return (
    <main className={styles.container}>
      {!isPlaying ? (
        <div className={styles.startScreen}>
          <h1 className={styles.title}>रात के दो बजे</h1>
          <p className={styles.subtitle}>A Horror Experience</p>
          <button onClick={startExperience} className={styles.startButton}>
            Begin Story
          </button>
          <p className={styles.warning}>⚠️ Best experienced with sound</p>
        </div>
      ) : (
        <>
          <div className={`${styles.scene} ${scene.final ? styles.finalScene : ''}`}>
            <div className={styles.hallway}>
              <div className={`${styles.light} ${currentScene >= 3 ? styles.flickering : ''}`}></div>
              {currentScene >= 6 && (
                <div className={styles.photo}>
                  <div className={styles.polaroid}>
                    <div className={styles.photoContent}>📸</div>
                  </div>
                </div>
              )}
            </div>

            {showText && (
              <div className={`${styles.textBox} ${scene.final ? styles.glitchText : ''}`}>
                <p className={styles.storyText}>{scene.text}</p>
              </div>
            )}
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
            ></div>
          </div>
        </>
      )}
    </main>
  )
}
