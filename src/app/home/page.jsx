import Hero2 from '@/components/Hero2';
import HighlightedAchievements from '@/components/HighlightedAchievements';
import { InfiniteMovingCardsDemo } from '@/components/InfiniteMovingCardsDemo';
import ProfileSection from '@/components/ProfileSection';
import UserReviewForm from '@/components/UserReviewForm'; // Import the new component
//import SuccessStories from '@/components/SuccessStories';


const HomePage = () => {
  return (
    <div>
      {/* <HeroSection /> */}
      <Hero2 />
      <ProfileSection />
      <HighlightedAchievements />
      {/* <SuccessStories /> */}
      <InfiniteMovingCardsDemo />
     <UserReviewForm /> {/* Add the new UserReviewSection */}
    </div>
  );
};

export default HomePage;
