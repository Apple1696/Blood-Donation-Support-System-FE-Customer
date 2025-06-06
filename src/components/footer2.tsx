import styles from '@/styles/custom-theme.module.css';

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };

  menuItems?: MenuItem[];
  isDark?: boolean;
}

const Footer2 = ({
  logo = {
    src: "/images/HomePage/HeartLogo.jpg",
    alt: "blocks for shadcn/ui",
    title: "BloodLink",
    url: "https://www.shadcnblocks.com",
  },
  menuItems = [
    {
      title: "Product",
      links: [
        { text: "Overview", url: "#" },
        { text: "Pricing", url: "#" },
        { text: "Marketplace", url: "#" },
        { text: "Features", url: "#" },
        { text: "Integrations", url: "#" },
        { text: "Pricing", url: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "#" },
        { text: "Team", url: "#" },
        { text: "Blog", url: "#" },
        { text: "Careers", url: "#" },
        { text: "Contact", url: "#" },
        { text: "Privacy", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Help", url: "#" },
        { text: "Sales", url: "#" },
        { text: "Advertise", url: "#" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Twitter", url: "#" },
        { text: "Instagram", url: "#" },
        { text: "LinkedIn", url: "#" },
      ],
    },
  ],
  isDark = false,
}: Footer2Props) => {
  return (
    <div className={`${styles.customTheme} ${isDark ? styles.dark : ''}`}>
      <section className="py-32 bg-background text-foreground">
        <div className="container  mx-auto">
          <footer>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
              <div className="col-span-2 mb-8 lg:mb-0">
                <div className="flex items-center gap-2 lg:justify-start">
                  <a href="https://shadcnblocks.com">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      title={logo.title}
                      className="h-10"
                    />
                  </a>
                  <p className="text-xl font-semibold text-foreground">{logo.title}</p>
                </div>
              </div>
              {menuItems.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 font-bold text-foreground">{section.title}</h3>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIdx) => (
                      <li
                        key={linkIdx}
                        className="font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        <a href={link.url}>{link.text}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export { Footer2 };
