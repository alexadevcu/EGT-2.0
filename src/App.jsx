import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Day1Page from './pages/Day1Page'
import Day2Page from './pages/Day2Page'
import RegistrationModal from './components/RegistrationModal'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [initialRegTab, setInitialRegTab] = useState('day1-performer')

  const handleOpenRegister = (tab = 'day1-performer') => {
    setInitialRegTab(tab)
    setIsRegisterOpen(true)
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
        setCurrentPage={setCurrentPage}
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
