import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ThemeProvider } from './components/DarkMode/theme-provider'

function App() {
  return (
  <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
    <RouterProvider router={router} />
  </ThemeProvider>
  )
}

export default App
