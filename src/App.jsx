import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Day1Page from './pages/Day1Page'
import Day2Page from './pages/Day2Page'
import RegistrationModal from './components/RegistrationModal'

export default function App() {
  const pageFromPath = () => window.location.pathname === '/day-1' ? 'day1' : window.location.pathname === '/day-2' ? 'day2' : 'home'
  const [currentPage, setCurrentPage] = useState(pageFromPath)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [initialRegTab, setInitialRegTab] = useState('day1-performer')

  const handleOpenRegister = (tab = 'day1-performer') => {
    setInitialRegTab(tab)
    setIsRegisterOpen(true)
  }

  const navigate = (page) => {
    const path = page === 'day1' ? '/day-1' : page === 'day2' ? '/day-2' : '/'
    if (window.location.pathname !== path) window.history.pushState({}, '', path)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  useEffect(() => {
    const handlePopState = () => setCurrentPage(pageFromPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <div className="min-h-screen bg-[#070709] text-[#f1f1f6] flex flex-col font-['Plus_Jakarta_Sans'] antialiased selection:bg-[#f7d978] selection:text-black">
      {/* Top Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={navigate}
        onOpenRegister={() => handleOpenRegister(currentPage === 'day2' ? 'day2-wizard' : 'day1-performer')}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            setCurrentPage={navigate}
            onOpenRegister={() => handleOpenRegister('day1-performer')}
          />
        )}

        {currentPage === 'day1' && (
          <Day1Page
            onOpenRegister={() => handleOpenRegister('day1-performer')}
          />
        )}

        {currentPage === 'day2' && (
          <Day2Page
            onOpenRegister={() => handleOpenRegister('day2-wizard')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentPage={navigate}
        onOpenRegister={() => handleOpenRegister('day1-performer')}
      />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialTab={initialRegTab}
      />
    </div>
  )
}
