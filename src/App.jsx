import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserProfile } from './services/db';

// Componentes Core
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import { ThemeProvider } from './contexts/ThemeContext';

// Páginas
import DashboardPage from './pages/DashboardPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function AppContent() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        <Route 
          path="/" 
          element={
            !user ? <Navigate to="/login" /> : 
            !profile ? <Onboarding user={user} onComplete={setProfile} /> : 
            <MainLayout user={user} profile={profile} />
          }
        >
          <Route index element={<DashboardPage user={user} profile={profile} />} />
          <Route path="community" element={<CommunityPage user={user} profile={profile} onProfileUpdate={setProfile} />} />
          <Route path="profile" element={<ProfilePage user={user} profile={profile} onProfileUpdate={setProfile} />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
