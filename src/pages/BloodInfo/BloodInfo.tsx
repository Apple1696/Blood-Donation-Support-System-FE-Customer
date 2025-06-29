import BloodDonationAnimation from "./BloodDiagram";
import BloodTypeCalculator from "./BloodTypeCalculator";
import BloodTypeInterface from "./BloodTypeInterface";

export default function BloodInfoPage2() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Facts About Blood and Blood Types</h1>
        <p className="text-center text-gray-600 mb-12">
          Explore various aspects of blood donation, types, and compatibility.
        </p>
        
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