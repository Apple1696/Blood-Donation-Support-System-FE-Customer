import { Outlet } from 'react-router-dom'
import { Navbar1 } from '@/components/navbar1'
import { Footer2 } from '@/components/footer2'

export default function CustomerLayout() {
  return (
    <>
      <Navbar1 />
      <main>
        <Outlet />
      </main>
      <Footer2 />
    </>
  )
}
