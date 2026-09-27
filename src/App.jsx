import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserProfile, saveUserProfile } from './services/db';

// Componentes Core
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';

// Páginas
import DashboardPage from './pages/DashboardPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Theme States
  const [displayMode, setDisplayMode] = useState('light'); // 'light', 'dark', 'night'
  const [themeColor, setThemeColor] = useState('blue');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
        if (userProfile?.themeColor) setThemeColor(userProfile.themeColor);
        if (userProfile?.displayMode) {
          setDisplayMode(userProfile.displayMode);
        } else if (userProfile?.darkMode !== undefined) {
          // Migración antigua
          setDisplayMode(userProfile.darkMode ? 'dark' : 'light');
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeColor);
    
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-mode');

    if (displayMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (displayMode === 'night') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-mode', 'night');
    }
  }, [themeColor, displayMode]);

  const saveSettings = async (updates) => {
    if (!user || !profile) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    await saveUserProfile(user.uid, newProfile);
  };

  const handleModeChange = (mode) => {
    setDisplayMode(mode);
    if (profile) saveSettings({ displayMode: mode });
  };

  const handleThemeChange = (color) => {
    setThemeColor(color);
    if (profile) saveSettings({ themeColor: color });
  };

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
          <Route path="profile" element={
            <ProfilePage 
              user={user} 
              profile={profile} 
              onProfileUpdate={setProfile}
              currentTheme={themeColor}
              onThemeChange={handleThemeChange}
              currentMode={displayMode}
              onModeChange={handleModeChange}
            />
          } />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
