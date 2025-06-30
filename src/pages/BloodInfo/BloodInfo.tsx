import BloodDonationAnimation from "./BloodDiagram";
import BloodTypeCalculator from "./BloodTypeCalculator";
import BloodTypeInterface from "./BloodTypeInterface";

export default function BloodInfoPage2() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Blood Type Interface */}
        <BloodTypeInterface />
        
        {/* Blood Donation Animation */}
        <BloodDonationAnimation />
        
        {/* Blood Type Calculator */}
        <BloodTypeCalculator />
      </div>
    </div>
  );
}