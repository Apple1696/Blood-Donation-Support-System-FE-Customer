// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '@/components/ui/button';

// const BloodDonationDiagram = () => {
//   const [selectedDonor, setSelectedDonor] = useState(null);
  
//   const bloodTypes = ['O', 'A', 'B', 'AB'];
  
//   // Define compatibility rules
//   const compatibility = {
//     'O': ['O', 'A', 'B', 'AB'], // O can donate to all
//     'A': ['A', 'AB'],           // A can donate to A and AB
//     'B': ['B', 'AB'],           // B can donate to B and AB
//     'AB': ['AB']                // AB can only donate to AB
//   };

//   const getCompatibleRecipients = (donor) => {
//     return compatibility[donor] || [];
//   };

//   const BloodBag = ({ type, isSelected, onClick, isDonor = false }) => (
//     <div className="flex flex-col items-center">
//       <Button
//         variant={isSelected ? "default" : "outline"}
//         onClick={onClick}
//         className={`
//           relative w-20 h-24 rounded-t-full rounded-b-sm transition-all duration-300
//           ${isSelected 
//             ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg scale-105' 
//             : 'bg-red-500 hover:bg-red-600 text-white'
//           }
//           ${isDonor ? 'cursor-pointer' : 'cursor-default'}
//         `}
//         disabled={!isDonor}
//       >
//         <span className="text-lg font-bold">{type}</span>
//         {/* Blood bag tube */}
//         <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-1 h-4 bg-gray-400"></div>
//       </Button>
//     </div>
//   );

//   const RecipientCircle = ({ type, isHighlighted }) => (
//     <motion.div
//       className={`
//         w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500
//         ${isHighlighted 
//           ? 'bg-red-500 text-white shadow-lg' 
//           : 'bg-white border-2 border-gray-300 text-gray-700'
//         }
//       `}
//       animate={{
//         scale: isHighlighted ? 1.1 : 1,
//         boxShadow: isHighlighted ? "0 0 20px rgba(239, 68, 68, 0.5)" : "none"
//       }}
//       transition={{ duration: 0.3 }}
//     >
//       {type}
//     </motion.div>
//   );

//   const ConnectionLine = ({ fromIndex, toIndex, isActive }) => {
//     // Calculate path for curved lines
//     const startX = 80 + (fromIndex * 200); // Donor position
//     const startY = 120; // Bottom of blood bag
//     const endX = 80 + (toIndex * 200); // Recipient position  
//     const endY = 280; // Top of recipient circle
    
//     const midY = (startY + endY) / 2 + 20; // Curve point
    
//     return (
//       <motion.svg
//         className="absolute inset-0 pointer-events-none"
//         style={{ zIndex: 1 }}
//       >
//         <motion.path
//           d={`M ${startX} ${startY} Q ${startX} ${midY} ${endX} ${endY}`}
//           fill="none"
//           stroke={isActive ? "#ef4444" : "#d1d5db"}
//           strokeWidth={isActive ? "3" : "2"}
//           initial={{ pathLength: 0, opacity: 0.3 }}
//           animate={{ 
//             pathLength: isActive ? 1 : 0,
//             opacity: isActive ? 1 : 0.3,
//             stroke: isActive ? "#ef4444" : "#d1d5db"
//           }}
//           transition={{ duration: 0.8, ease: "easeInOut" }}
//         />
        
//         {/* Animated blood drops */}
//         <AnimatePresence>
//           {isActive && (
//             <motion.circle
//               r="3"
//               fill="#ef4444"
//               initial={{ opacity: 0 }}
//               animate={{ 
//                 opacity: [0, 1, 1, 0],
//                 offsetDistance: ["0%", "100%"]
//               }}
//               exit={{ opacity: 0 }}
//               transition={{ 
//                 duration: 1.5, 
//                 repeat: Infinity,
//                 ease: "linear"
//               }}
//               style={{
//                 offsetPath: `path("M ${startX} ${startY} Q ${startX} ${midY} ${endX} ${endY}")`,
//                 offsetRotate: "0deg"
//               }}
//             />
//           )}
//         </AnimatePresence>
//       </motion.svg>
//     );
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-8 bg-gray-50 rounded-lg">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-700 mb-2">
//           Blood Type Compatibility
//         </h2>
//         <p className="text-gray-600">
//           Click on a blood type below to learn more.
//         </p>
//       </div>

//       <div className="relative">
//         {/* Donor Section */}
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold text-gray-600 mb-4">DONOR</h3>
//           <div className="flex justify-center space-x-12">
//             {bloodTypes.map((type, index) => (
//               <BloodBag
//                 key={`donor-${type}`}
//                 type={type}
//                 isSelected={selectedDonor === type}
//                 onClick={() => setSelectedDonor(selectedDonor === type ? null : type)}
//                 isDonor={true}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Connection Lines */}
//         <div className="relative h-40">
//           {selectedDonor && bloodTypes.map((donorType, donorIndex) => (
//             donorType === selectedDonor && 
//             getCompatibleRecipients(donorType).map((recipientType, _) => {
//               const recipientIndex = bloodTypes.indexOf(recipientType);
//               return (
//                 <ConnectionLine
//                   key={`line-${donorIndex}-${recipientIndex}`}
//                   fromIndex={donorIndex}
//                   toIndex={recipientIndex}
//                   isActive={true}
//                 />
//               );
//             })
//           ))}
          
//           {/* Show all lines when nothing is selected */}
//           {!selectedDonor && bloodTypes.map((_, donorIndex) => 
//             bloodTypes.map((_, recipientIndex) => (
//               <ConnectionLine
//                 key={`line-inactive-${donorIndex}-${recipientIndex}`}
//                 fromIndex={donorIndex}
//                 toIndex={recipientIndex}
//                 isActive={false}
//               />
//             ))
//           )}
//         </div>

//         {/* Recipient Section */}
//         <div className="mt-4">
//           <h3 className="text-lg font-semibold text-gray-600 mb-4">RECIPIENT</h3>
//           <div className="flex justify-center space-x-12">
//             {bloodTypes.map((type, index) => (
//               <RecipientCircle
//                 key={`recipient-${type}`}
//                 type={type}
//                 isHighlighted={
//                   selectedDonor && 
//                   getCompatibleRecipients(selectedDonor).includes(type)
//                 }
//               />
//             ))}
//           </div>
//         </div>

//         {/* Information Display */}
//         <AnimatePresence>
//           {selectedDonor && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="mt-8 p-4 bg-white rounded-lg shadow-md text-center"
//             >
//               <p className="text-lg">
//                 <span className="font-bold text-red-600">Group {selectedDonor}</span> can donate red blood cells to{' '}
//                 <span className="font-semibold">
//                   {getCompatibleRecipients(selectedDonor).join(', ')}
//                 </span>
//                 {selectedDonor === 'O' && (
//                   <span className="block mt-2 text-sm text-gray-600 font-medium">
//                     It's the universal donor!
//                   </span>
//                 )}
//               </p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default BloodDonationDiagram;