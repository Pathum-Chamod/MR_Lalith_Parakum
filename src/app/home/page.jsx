import Hero2 from '@/components/Hero2'
import HeroSection from '@/components/HeroSection'
import HighlightedAchievements from '@/components/HighlightedAchievements'
import { InfiniteMovingCardsDemo } from '@/components/InfiniteMovingCardsDemo'
import ProfileSection from '@/components/ProfileSection'
import SuccessStories from '@/components/SuccessStories'
import React from 'react'

const HomePage = () => {
  return (
<div>
  {/* <HeroSection /> */}
  <Hero2 />
  <ProfileSection />
  <HighlightedAchievements />
  <SuccessStories   />
  <InfiniteMovingCardsDemo />
</div>
  )
}

export default HomePage