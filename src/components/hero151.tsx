import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatars: Array<{
    image: string;
    fallback: string;
  }>;
}

interface Hero151Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  testimonial?: Testimonial;
  images: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
}

const Hero151 = ({
  heading = "Tặng Món Quà Sự Sống: Hiến Máu Ngay Hôm Nay",
  description = "Mỗi giọt máu đều quý giá. Sự hiến máu của bạn có thể cứu sống tới ba người. Hãy tham gia cộng đồng của chúng tôi và tạo nên sự khác biệt trong cuộc đời của ai đó.",
  button = {
    text: "Hiến Máu Ngay",
    url: "/campaigns",
  },
  testimonial = {
    quote: "Hiến máu là một trong những trải nghiệm ý nghĩa nhất trong cuộc đời tôi",
    author: "Sarah Chen",
    role: "Người hiến máu thường xuyên",
    company: "Đã cứu sống 100+ người",
    avatars: [
      { image: "/images/HomePage/Sarah-Chen.jpg", fallback: "SC" },
    ],
  },
  images = {
    first: "/images/HomePage/Doctor.jpg",
    second: "/images/HomePage/Syringe.jpg",
    third: "/images/HomePage/Phlebotomy.jpg",
    fourth: "/images/HomePage/BedPatient.jpg",
  },
}: Hero151Props) => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto ">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex-1">
            <div className="flex flex-col gap-4 lg:gap-8">
              <h1 className="max-w-[80%] text-4xl leading-tight font-semibold text-foreground lg:text-5xl xl:text-7xl">
                {heading}
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground xl:text-2xl">
                {description}
              </p>
            </div>
            <div className="my-6 lg:my-10">
              <Button asChild size="lg">
                <a href={button.url}>{button.text}</a>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex -space-x-[1.5rem]">
                {testimonial.avatars.map((avatar, index) => (
                  <Avatar
                    key={index}
                    className={`relative z-${index + 1}0 flex h-12 w-12 shrink-0 rounded-full border-2 border-white object-cover`}
                  >
                    <AvatarImage src={avatar.image} alt="" />
                    <AvatarFallback>{avatar.fallback}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-2-foreground italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="text-sm font-medium text-muted-2-foreground">
                  {testimonial.author}, {testimonial.role} @
                  {testimonial.company}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full flex-1">
            <div className="w-full">
              <AspectRatio ratio={1 / 1} className="h-full w-full">
                <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-4">
                  <div className="overflow-hidden rounded-lg border border-muted bg-muted">
                    <img
                      src={images.first}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-muted bg-muted">
                    <img
                      src={images.second}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-muted bg-muted">
                    <img
                      src={images.third}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-muted bg-muted">
                    <img
                      src={images.fourth}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero151 };