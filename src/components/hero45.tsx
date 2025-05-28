import { HandHelping, Calendar, Activity, AlertCircle } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Hero45Props {
  badge?: string;
  heading: string;
  imageSrc?: string;
  imageAlt?: string;
  features?: Feature[];
}

const Hero45 = ({
  badge = "Blood Donation Support System",
  heading = "Your Blood Donation Journey Starts Here",
  imageSrc = "/images/HomePage/Hands.jpg",
  imageAlt = "Blood donation illustration",
  features = [
    {
      icon: <Calendar className="h-auto w-5" />,
      title: "Easy Appointment Scheduling",
      description: "Book your donation slots with just a few clicks, at your convenience."
    },
    {
      icon: <Activity className="h-auto w-5" />,
      title: "Real-time Blood Bank Inventory",
      description: "Stay informed about blood type availability and urgent needs in your area."
    },
    {
      icon: <HandHelping className="h-auto w-5" />,
      title: "Donation Tracking and Rewards",
      description: "Monitor your donation history and earn rewards for your lifesaving contributions."
    },
    {
      icon: <AlertCircle className="h-auto w-5" />,
      title: "Emergency Blood Requests",
      description: "Respond quickly to urgent blood needs and help save lives in critical situations."
    }
  ],
}: Hero45Props) => {
  return (
    <section className="py-32" style={{ backgroundColor: '#BB404B' }}>
      <div className="container overflow-hidden  mx-auto">
        <div className="mb-20 flex flex-col items-center gap-6 text-center">
          <Badge variant="outline" className="border-white text-white">{badge}</Badge>
          <h1 className="text-4xl font-semibold lg:text-5xl text-white">{heading}</h1>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="aspect-video max-h-[500px] w-full rounded-xl object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#BB404B] via-transparent to-transparent"></div>
          <div className="absolute -top-28 -right-28 -z-10 aspect-video h-72 w-96 [background-size:12px_12px] opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] sm:bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)]"></div>
          <div className="absolute -top-28 -left-28 -z-10 aspect-video h-72 w-96 [background-size:12px_12px] opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] sm:bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)]"></div>
        </div>
        <div className="mx-auto mt-10 flex max-w-5xl flex-col md:flex-row">
          {features.map((feature, index) => (
            <React.Fragment key={feature.title}>
              {index > 0 && (
                <Separator
                  orientation="vertical"
                  className="mx-6 hidden h-auto w-[2px] bg-gradient-to-b from-white/20 via-white/10 to-white/20 md:block"
                />
              )}
              <div
                key={index}
                className="flex grow basis-0 flex-col rounded-md bg-white/10 backdrop-blur-sm p-4"
              >
                <div className="mb-6 flex size-10 items-center justify-center rounded-full bg-white/20 text-white drop-shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-white/80">
                  {feature.description}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Hero45 };
