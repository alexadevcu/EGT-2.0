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

export default function App() {
  const [currentPage, setCurrentPageState] = useState('home')

  // Support URL path navigation & 404 catch-all
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '')
      
      if (path === '' || path === '/') {
        setCurrentPageState('home')
      } else if (path === '/day1') {
        setCurrentPageState('day1')
      } else if (path === '/day2') {
        setCurrentPageState('day2')
      } else if (path === '/register-day1') {
        setCurrentPageState('register-day1')
      } else if (path === '/register-day2') {
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

  // Scroll to top of window whenever currentPage state changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  const setCurrentPage = (page) => {
    setCurrentPageState(page)
    window.scrollTo(0, 0)
    const newPath = page === 'home' ? '/' : `/${page}`
    try {
      window.history.pushState({}, '', newPath)
    } catch (e) {
      // Fallback
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

  return (
    <div className="min-h-screen bg-[#070709] text-[#f1f1f6] flex flex-col font-['Plus_Jakarta_Sans'] antialiased selection:bg-[#f7d978] selection:text-black">
      {/* Top Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenRegister={() => handleOpenRegister(currentPage === 'day2' ? 'day2-wizard' : 'day1-performer')}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            setCurrentPage={setCurrentPage}
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
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'register-day2' && (
          <Day2RegistrationPage
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'guidelines' && (
          <GuidelinesPage
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === '404' && (
          <NotFoundPage
            setCurrentPage={setCurrentPage}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
        onOpenRegister={() => handleOpenRegister('day1-performer')}
      />
    </div>
  )
}
