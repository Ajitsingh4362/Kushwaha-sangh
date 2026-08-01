import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import About from './pages/About'
import Committee from './pages/Committee'
import Welfare from './pages/Welfare'
import Membership from './pages/Membership'
import Donate from './pages/Donate'
import Gallery from './pages/Gallery'
import Programs from './pages/Programs'
import News from './pages/News'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import RefundPolicy from './pages/RefundPolicy'
import AdminLogin from './pages/AdminLogin'
import AdminOverview from './pages/AdminOverview'
import AdminApplications from './pages/AdminApplications'
import AdminMembers from './pages/AdminMembers'
import AdminDues from './pages/AdminDues'
import AdminDonations from './pages/AdminDonations'
import AdminCommittee from './pages/AdminCommittee'
import AdminGallery from './pages/AdminGallery'
import AdminPrograms from './pages/AdminPrograms'
import AdminNoticeBoard from './pages/AdminNoticeBoard'
import AdminLayout from './components/AdminLayout'
import NotFound from './pages/NotFound'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './lib/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { DonateModalProvider } from './lib/DonateModalContext'
import DonateModal from './components/DonateModal'
import NoticePopup from './components/NoticePopup'
import { LanguageProvider } from './lib/LanguageContext'

function PublicChrome({ children }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <DonateModal />
      <NoticePopup />
    </>
  )
}

export default function App() {
  const location = useLocation()
  const isAdminSection = location.pathname.startsWith('/admin') && location.pathname !== '/admin-login'

  return (
    <AuthProvider>
      <LanguageProvider>
        <DonateModalProvider>
        <div className="flex min-h-screen flex-col">
          {isAdminSection ? (
            <Routes>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="dues" element={<AdminDues />} />
                <Route path="donations" element={<AdminDonations />} />
                <Route path="committee" element={<AdminCommittee />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="notices" element={<AdminNoticeBoard />} />
              </Route>
            </Routes>
          ) : (
            <PublicChrome>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/committee" element={<Committee />} />
                <Route path="/welfare" element={<Welfare />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/news" element={<News />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PublicChrome>
          )}
        </div>
      </DonateModalProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}
