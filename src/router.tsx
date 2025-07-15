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
import BloodDonationHistory from './pages/Campaign/Dashboard'
import BloodDonationFAQ from './pages/FAQ'
import BloodInfoPage from './pages/BloodTypes/BloodInfoPage'
import BloodComponents from './pages/BloodComponents/BloodComponents'
import { Blog } from './components/Blog'
import { BlogDetail } from './components/BlogDetail'
import BloodInfoPage2 from './pages/BloodInfo/BloodInfo'
import RequestEmergency from './pages/Emergency/RequestEmergency'
import EmergencyList from './pages/Emergency/EmergencyList'
import EmergencyDetail from './pages/Emergency/EmergencyDetail'
import BloodTypeDetail from './pages/BloodTypes/BloodTypeDetail'

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
              <CardCampaign />
           
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
      },
      {
        path: 'donation-history',
        element: <BloodDonationHistory />
      },
      {
        path: 'faq',
        element: <BloodDonationFAQ />
      },
      {
        path: 'blood-types',
        element: <BloodInfoPage />
      },
      {
        path: 'blood-types/:group/:rh',
        element: <BloodTypeDetail />
      },
      {
        path: 'blood-components',
        element: <BloodComponents />
      },
      {
        path: 'blog',
        element: <Blog/>
      },
      {
        path: 'blog/:slug',
        element: <BlogDetail />
      },
      {
        path: 'blood-info',
        element: <BloodInfoPage2 />
      },
      {
        path: 'request-emergency',
        element: <RequestEmergency />
      },
      {
        path: 'view-requests',
        element: <EmergencyList />
      },
      {
        path: 'emergency/:id',
        element: <EmergencyDetail />
      }
    
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
 
 
]) 