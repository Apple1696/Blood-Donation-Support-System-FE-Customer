import { createBrowserRouter } from 'react-router-dom'
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Navigate } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import Home from '@/pages/Home'
import LoginPage from '@/pages/Login'
import Profile from './pages/Profile'
import CardCampaign from './pages/Campaign/CardCampaign'
import CampaignDetail from './pages/Campaign/CampaignDetail'
import BookAppointment from './pages/Campaign/BookAppointment'

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
        path: 'campaigns',
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
      },
      {
        path: 'campaigns/:id',
        element: <CampaignDetail />
      },
      {
        path: 'book-appointment/:id',
        element: (
          <>
            <SignedIn>
              <BookAppointment />
            </SignedIn>
            <SignedOut>
              <Navigate to="/login" replace />
            </SignedOut>
          </>
        )
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
]) 