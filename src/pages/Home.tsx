import { Hero151 } from '@/components/hero151'
import { Hero45 } from '@/components/hero45'

export default function Home() {
  return (
    <>
      <Hero151 images={{
        first: "https://shadcnblocks.com/images/block/placeholder-1.svg",
        second: "https://shadcnblocks.com/images/block/placeholder-dark-2.svg",
        third: "https://shadcnblocks.com/images/block/placeholder-dark-3.svg",
        fourth: "https://shadcnblocks.com/images/block/placeholder-dark-7-tall.svg"
      }} />
      <Hero45/>
    </>
  )
}