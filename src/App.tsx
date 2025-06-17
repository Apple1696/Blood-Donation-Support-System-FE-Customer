import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ThemeProvider } from './components/DarkMode/theme-provider'
import { AuthProvider } from './providers/AuthProvider'
import { Toaster } from 'sonner'

function App() {
  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
