import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layout/app.layout';
import LandingPage from './pages/landing.jsx';
import Dashboard from './pages/dashboard.jsx';
import Auth from './pages/auth.jsx';
import Link from './pages/link.jsx';
import RedirectLink from './pages/redirect-link.jsx';
import UrlProvider from './context.jsx';
import RequireAuth from './components/require-auth.jsx';

const router = createBrowserRouter([

  // 🔥 PUBLIC SHORT LINK (NO AUTH, NO LAYOUT)
  {
    path: '/:id',
    element: <RedirectLink />,
  },

  // NORMAL WEBSITE
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '/dashboard',
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        )
      },
      {
        path: '/link/:id',
        element: (
          <RequireAuth>
            <Link />
          </RequireAuth>
        )
      },
    ]
  },
]);

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;
