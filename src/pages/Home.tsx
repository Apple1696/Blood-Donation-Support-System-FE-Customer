import { Hero151 } from '@/components/hero151'
import { Hero45 } from '@/components/hero45'
import { Gallery6 } from '@/components/gallery6'

export default function Home() {
  return (
    <>
      <Hero151 
        images={{
          first: "/images/HomePage/Doctor.jpg",
          second: "/images/HomePage/Syringe.jpg",
          third: "/images/HomePage/Phlebotomy.jpg",
          fourth: "/images/HomePage/BedPatient.jpg",
        }}
      />
      <Hero45 heading="Your Blood Donation Journey Starts Here" />
      <Gallery6/>
    </>
  )
}