import { createBrowserRouter } from 'react-router-dom'
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Navigate } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import Home from '@/pages/Home'
import LoginPage from '@/pages/Login'
import BookAppointment from '@/pages/BookAppointment'
import Profile from './pages/Profile'
import CardCampaign from './components/CardCampaign'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'book-appointment',
        element: (
          <>
            <SignedIn>
              <CardCampaign />
            </SignedIn>
            <SignedOut>
              <Navigate to="/login" replace />
            </SignedOut>
          </>
        ),
      },
      {
        path: 'profile',
        element: (
          <>
            <SignedIn>
              <Profile />
            </SignedIn>
            <SignedOut>
              <Navigate to="/login" replace />
            </SignedOut>
          </>
        ),
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
]) 