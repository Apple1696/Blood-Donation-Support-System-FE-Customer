import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "/",
    src: "/images/navbar/2.png",
    alt: "logo",
    title: "Blood Donation"
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "About us", url: "#" },
    {
      title: "Eligibility ",
      url: "#",
      items: [
        {
          title: "Who Can Donate?",
          description: "A simple breakdown of general eligibility so users quickly know if they're likely to qualify.",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Health Requirements",
          description: " List conditions that may prevent or delay donations.",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Travel & Medication Restrictions",
          description: "This helps people who've traveled recently or are on medications understand their status.",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "FAQs",
          description:
            "This is your support hub. Include short, reassuring answers to common concerns.",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Schedule Appointment",
      url: "#",
      items: [
        {
          title: "Find a Donation Center",
          description: "Get all the answers you need right here",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Book Appointment",
          description: "We are here to help you with any questions you have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "/book-appointment",
        },
        {
          title: "First-Time Donor Info",
          description: "Check the current status of our services and APIs",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        // {
        //   title: "Terms of Service",
        //   description: "Our terms and conditions for using our services",
        //   icon: <Book className="size-5 shrink-0" />,
        //   url: "#",
        // },
      ],
    },
  
    {
      title: "Blog",
      url: "#",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/login?signup=true" },
  },
}: Navbar1Props) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  const UserAvatar = () => {
    if (!user) return null;

    const initials = user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user.emailAddresses[0].emailAddress[0].toUpperCase();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-2">
            {/* <span>Signed in as</span> */}
            <span className="font-medium">{`${user.firstName} ${user.lastName}`}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/profile">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <section className="py-4" style={{ backgroundColor: '#B03F4A' }}>
      <div className="container  mx-auto">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-12 transform scale-350" alt={logo.alt} />
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {user ? (
              <UserAvatar />
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <a href={auth.login.url}>{auth.login.title}</a>
                </Button>
                <Button asChild size="sm" className="bg-white text-[#B03F4A] hover:bg-white/90">
                  <a href={auth.signup.url}>{auth.signup.title}</a>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-12 transform scale-350" alt={logo.alt} />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <img src={logo.src} className="max-h-12 transform scale-125" alt={logo.alt} />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {user ? (
                      <UserAvatar />
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <a href={auth.login.url}>{auth.login.title}</a>
                        </Button>
                        <Button asChild>
                          <a href={auth.signup.url}>{auth.signup.title}</a>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  const { user } = useUser();

  // Special handling for Book Appointment submenu item
  const handleBookAppointmentClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      window.location.href = '/login';
    }
  };

  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="text-white bg-transparent hover:bg-white/10">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-white text-foreground">
          <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
            {item.items.map((subItem) => (
              <NavigationMenuLink asChild key={subItem.title}>
                <a
                  className="flex select-none flex-row gap-4 rounded-md p-4 no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                  href={subItem.url}
                  onClick={subItem.title === "Book Appointment" ? handleBookAppointmentClick : undefined}
                >
                  <div className="text-foreground">{subItem.icon}</div>
                  <div className="flex flex-col gap-1">
                    <div className="text-base font-medium leading-none">{subItem.title}</div>
                    {subItem.description && (
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {subItem.description}
                      </p>
                    )}
                  </div>
                </a>
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  const { user } = useUser();

  // Special handling for Book Appointment submenu item
  const handleBookAppointmentClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      window.location.href = '/login';
    }
  };

  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              href={subItem.url}
              onClick={subItem.title === "Book Appointment" ? handleBookAppointmentClick : undefined}
              className="flex select-none flex-row gap-4 rounded-md p-4 no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
            >
              <div className="text-foreground">{subItem.icon}</div>
              <div className="flex flex-col gap-1">
                <div className="text-base font-medium leading-none">{subItem.title}</div>
                {subItem.description && (
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};


export { Navbar1 };
