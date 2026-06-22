// App.jsx — root component: wraps app in AuthProvider + BrowserRouter + routes
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingMessengerButton from './components/FloatingMessengerButton';

// Pages are lazy-loaded so the shared layout stays mounted while route bundles
// are only downloaded when the user visits that section.
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Listings = lazy(() => import('./pages/Listings'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const PostListing = lazy(() => import('./pages/PostListing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Cart = lazy(() => import('./pages/Cart'));
const EditListing = lazy(() => import('./pages/EditListing'));
const Messages = lazy(() => import('./pages/Messages'));
const Orders = lazy(() => import('./pages/Orders'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Pages that should NOT show the Footer
const NO_FOOTER_ROUTES = ['/login', '/register'];

function PageFallback() {
  return (
    <main className="pt-20 pb-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="skeleton h-8 w-48" />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border border-[#ded6ca] bg-white p-4">
              <div className="skeleton h-44 w-full" />
              <div className="mt-4 space-y-3">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function AppLayout() {
  const location = useLocation();
  const showFooter = !NO_FOOTER_ROUTES.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />

            {/* Protected routes */}
            <Route
              path="/sell"
              element={
                <ProtectedRoute disallowAdmin>
                  <PostListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sell/:id/edit"
              element={
                <ProtectedRoute disallowAdmin>
                  <EditListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute disallowAdmin>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute disallowAdmin>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute disallowAdmin>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute disallowAdmin>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      {showFooter && <Footer />}
      <FloatingMessengerButton />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
