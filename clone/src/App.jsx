import { useRef, useState } from 'react'
import { useCinematicScroll } from './hooks/useCinematicScroll.js'
import { scenes } from './data.js'
import { CinematicBackground } from './components/CinematicBackground.jsx'
import { Header } from './components/Header.jsx'
import { SideIndex } from './components/SideIndex.jsx'
import { NavigationOverlay } from './components/NavigationOverlay.jsx'
import { ContactModal } from './components/ContactModal.jsx'
import { HeroScene } from './components/HeroScene.jsx'
import { AutomationsScene } from './components/AutomationsScene.jsx'
import { AgentsScene } from './components/AgentsScene.jsx'
import { FeaturedScene } from './components/FeaturedScene.jsx'

export default function App() {
  const mainRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const activeScene = useCinematicScroll(mainRef)

  const scrollToScene = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  return (
    <>
      <CinematicBackground />
      <Header onMenu={() => setMenuOpen(true)} onChat={() => setChatOpen(true)} />
      <SideIndex scenes={scenes} active={activeScene} onSelect={scrollToScene} />
      <NavigationOverlay
        scenes={scenes}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={scrollToScene}
      />
      <ContactModal open={chatOpen} onClose={() => setChatOpen(false)} />

      <main ref={mainRef} className="cinematic-scroll">
        <HeroScene />
        <AutomationsScene />
        <AgentsScene />
        <FeaturedScene />
      </main>
    </>
  )
}
