import { useRef, useState } from 'react'
import { useCinematicScroll } from './hooks/useCinematicScroll.js'
import { CinematicBackground } from './components/CinematicBackground.jsx'
import { Header } from './components/Header.jsx'
import { ContactModal } from './components/ContactModal.jsx'
import { HeroScene } from './components/HeroScene.jsx'
import { AgentsScene } from './components/AgentsScene.jsx'

export default function App() {
  const mainRef = useRef(null)
  const [chatOpen, setChatOpen] = useState(false)
  useCinematicScroll(mainRef)

  return (
    <>
      <CinematicBackground />
      <Header onChat={() => setChatOpen(true)} />
      <ContactModal open={chatOpen} onClose={() => setChatOpen(false)} />

      <main ref={mainRef} className="cinematic-scroll">
        <HeroScene />
        <AgentsScene />
      </main>
    </>
  )
}
