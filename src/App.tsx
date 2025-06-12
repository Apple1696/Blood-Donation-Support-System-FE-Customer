import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ThemeProvider } from './components/DarkMode/theme-provider'
import { AuthProvider } from './providers/AuthProvider'

function App() {
  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
