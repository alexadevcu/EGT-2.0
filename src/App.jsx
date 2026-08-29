import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Day1Page from './pages/Day1Page'
import Day2Page from './pages/Day2Page'
import Day1RegistrationPage from './pages/Day1RegistrationPage'
import Day2RegistrationPage from './pages/Day2RegistrationPage'
import GuidelinesPage from './pages/GuidelinesPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

import PageTransitionOverlay from './components/PageTransitionOverlay'
import CurtainOverlay from './components/CurtainOverlay'
import ContactModal from './components/ContactModal'

export default function App() {
  const [currentPage, setCurrentPageState] = useState('home')
  const [transitionType, setTransitionType] = useState('idle')
  const [isContactOpen, setIsContactOpen] = useState(false)

  // Support URL path navigation & 404 catch-all
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '')
      
      if (path === '' || path === '/') {
        setCurrentPageState('home')
      } else if (path === '/day1' || path === '/day-1') {
        setCurrentPageState('day1')
      } else if (path === '/day2' || path === '/day-2') {
        setCurrentPageState('day2')
      } else if (path === '/register-day1' || path === '/register-day-1') {
        setCurrentPageState('register-day1')
      } else if (path === '/register-day2' || path === '/register-day-2') {
        setCurrentPageState('register-day2')
      } else if (path === '/guidelines' || path === '/rules') {
        setCurrentPageState('guidelines')
      } else if (path === '/admin') {
        setCurrentPageState('admin')
      } else {
        // Unknown path -> Render 404 page
        setCurrentPageState('404')
      }
    }

    handleLocation()
    window.addEventListener('popstate', handleLocation)
    return () => window.removeEventListener('popstate', handleLocation)
  }, [])

  // Ensure browser scroll restoration is set to manual and page reloads always reset to top (0, 0)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, 50)

    const handleUnload = () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
    }
  }, [])

  // Scroll to top of window whenever currentPage state changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, 10)
    return () => clearTimeout(t)
  }, [currentPage])

  const setCurrentPage = (page) => {
    if (page === 'day1' || page === 'register-day1') {
      setTransitionType('day1-spotlight')
      setTimeout(() => {
        setCurrentPageState(page)
        window.scrollTo(0, 0)
        const newPath = page === 'home' ? '/' : `/${page}`
        try { window.history.pushState({}, '', newPath) } catch (e) {}
      }, 200)
      setTimeout(() => {
        setTransitionType('idle')
      }, 450)
    } else if (page === 'day2' || page === 'register-day2') {
      setTransitionType('day2-magic')
      setTimeout(() => {
        setCurrentPageState(page)
        window.scrollTo(0, 0)
        const newPath = page === 'home' ? '/' : `/${page}`
        try { window.history.pushState({}, '', newPath) } catch (e) {}
      }, 220)
      setTimeout(() => {
        setTransitionType('idle')
      }, 480)
    } else {
      setCurrentPageState(page)
      window.scrollTo(0, 0)
      const newPath = page === 'home' ? '/' : `/${page}`
      try { window.history.pushState({}, '', newPath) } catch (e) {}
    }
  }

  const handleOpenRegister = (track = 'day1-performer') => {
    if (track === 'day2-wizard' || track === 'day2') {
      setCurrentPage('register-day2')
    } else if (track === 'day1-audience') {
      window.open('https://luma.com/j4pp1jbv', '_blank', 'noopener,noreferrer')
    } else {
      setCurrentPage('register-day1')
    }
  }

  const navigate = (page) => {
    const path = page === 'day1' ? '/day-1' : page === 'day2' ? '/day-2' : '/'
    if (window.location.pathname !== path) window.history.pushState({}, '', path)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <div className="min-h-screen bg-[#070709] text-[#f1f1f6] flex flex-col font-['Plus_Jakarta_Sans'] antialiased selection:bg-[#f7d978] selection:text-black relative">
      {/* Real Grand Theatre Curtain Opening Overlay (Highest Z-Index) */}
      <CurtainOverlay />

      {/* Cinematic Transition Overlay */}
      <PageTransitionOverlay transitionType={transitionType} />

      {/* Top Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={navigate}
        onOpenRegister={() => handleOpenRegister(currentPage === 'day2' ? 'day2-wizard' : 'day1-performer')}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <div key={currentPage} className="page-transition">
          {currentPage === 'home' && (
            <HomePage
              setCurrentPage={navigate}
              onOpenRegister={(track) => handleOpenRegister(track)}
            />
          )}

          {currentPage === 'day1' && (
            <Day1Page
              onOpenRegister={(track) => handleOpenRegister(track || 'day1-performer')}
            />
          )}

          {currentPage === 'day2' && (
            <Day2Page
              onOpenRegister={(track) => handleOpenRegister(track || 'day2-wizard')}
            />
          )}

          {currentPage === 'register-day1' && (
            <Day1RegistrationPage
              setCurrentPage={navigate}
            />
          )}

          {currentPage === 'register-day2' && (
            <Day2RegistrationPage
              setCurrentPage={navigate}
            />
          )}

          {currentPage === 'guidelines' && (
            <GuidelinesPage
              setCurrentPage={navigate}
            />
          )}

          {currentPage === 'admin' && (
            <AdminPage
              setCurrentPage={navigate}
            />
          )}

          {currentPage === '404' && (
            <NotFoundPage
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer
        setCurrentPage={navigate}
        onOpenRegister={() => handleOpenRegister('day1-performer')}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Contact Us Modal Popup */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  )
}
