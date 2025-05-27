import { createBrowserRouter } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"
import CustomerLayout from '@/layouts/CustomerLayout'
import Home from '@/pages/Home'
import LoginPage from '@/pages/Login'
import BookAppointment from '@/pages/BookAppointment'

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
              <BookAppointment />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
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