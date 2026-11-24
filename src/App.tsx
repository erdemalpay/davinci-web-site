import { AnimatePresence } from 'framer-motion'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import { EmbedModalProvider } from './components/ui/EmbedModal'
import { GroupEventFormProvider } from './components/ui/GroupEventForm'

export default function App() {
  return (
    <EmbedModalProvider>
      <GroupEventFormProvider>
        <AnimatePresence mode="wait">
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <HomePage />
            </main>
            <Footer />
          </div>
        </AnimatePresence>
      </GroupEventFormProvider>
    </EmbedModalProvider>
  )
}
