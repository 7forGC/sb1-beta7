import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmail } from './pages/VerifyEmail';
import { HomePage } from './pages/HomePage';
import { MessagesPage } from './pages/MessagesPage';
import { CallsPage } from './pages/CallsPage';
import { FeedPage } from './pages/FeedPage';
import { ProfilePage } from './pages/ProfilePage';
import { PrivacyPage } from './pages/privacy/PrivacyPage';
import { SecurityPage } from './pages/security/SecurityPage';
import { GroupsPage } from './pages/groups/GroupsPage';
import { ListsPage } from './pages/lists/ListsPage';
import { InvitePage } from './pages/invite/InvitePage';
import { ThemesPage } from './pages/themes/ThemesPage';
import { ChatWallpapersPage } from './pages/wallpapers/ChatWallpapersPage';
import { ChatHistoryPage } from './pages/history/ChatHistoryPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { MessageNotificationsPage } from './pages/notifications/MessageNotificationsPage';
import { GroupNotificationsPage } from './pages/notifications/GroupNotificationsPage';
import { CallTonesPage } from './pages/notifications/CallTonesPage';
import { StorageUsagePage } from './pages/storage/StorageUsagePage';
import { NetworkUsagePage } from './pages/network/NetworkUsagePage';
import { AutoDownloadPage } from './pages/auto-download/AutoDownloadPage';
import { AppInfoPage } from './pages/about/AppInfoPage';
import { UpdatesPage } from './pages/updates/UpdatesPage';
import { SupportPage } from './pages/support/SupportPage';
import { useAuth } from './hooks/useAuth';
import { LoadingScreen } from './components/LoadingScreen';
import { MobileNavbar } from './components/MobileNavbar';
import { MobileFooter } from './components/MobileFooter';

export default function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const setAppHeight = () => {
      const vh = window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };

    setAppHeight();

    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(setAppHeight, 100);
    });

    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-container">
      {user && <MobileNavbar />}
      <div className="content-area">
        <Routes>
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/feed" /> : <AuthPage />} 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/feed" /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/feed" /> : <RegisterPage />} 
          />
          <Route 
            path="/verify-email" 
            element={<VerifyEmail />} 
          />
          <Route 
            path="/feed" 
            element={user ? <FeedPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/messages" 
            element={user ? <MessagesPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/calls" 
            element={user ? <CallsPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/privacy" 
            element={user ? <PrivacyPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/security" 
            element={user ? <SecurityPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/groups" 
            element={user ? <GroupsPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/lists" 
            element={user ? <ListsPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/invite" 
            element={user ? <InvitePage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/themes" 
            element={user ? <ThemesPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/wallpapers" 
            element={user ? <ChatWallpapersPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/history" 
            element={user ? <ChatHistoryPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/notifications" 
            element={user ? <NotificationsPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/notifications/messages" 
            element={user ? <MessageNotificationsPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/notifications/groups" 
            element={user ? <GroupNotificationsPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/notifications/calls" 
            element={user ? <CallTonesPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/storage" 
            element={user ? <StorageUsagePage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/network" 
            element={user ? <NetworkUsagePage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/auto-download" 
            element={user ? <AutoDownloadPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/about" 
            element={user ? <AppInfoPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/updates" 
            element={user ? <UpdatesPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/support" 
            element={user ? <SupportPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/*" 
            element={user ? <HomePage /> : <Navigate to="/auth" />} 
          />
        </Routes>
      </div>
      {user && <MobileFooter />}
    </div>
  );
}