import { withDataProviders } from "@/lib/withProviders";
import { useState } from "react";
import { Link, useLocation } from "@/lib/router-shim";
import { Menu, X, ChevronDown } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.svg?url";
import { useI18n, type Lang } from "@/lib/i18n";
import { CATEGORY_IDS } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

interface NavChild {
  href: string;
  labelKey: string;
  external?: boolean;
  download?: boolean;
}

interface NavItem {
  href?: string;
  labelKey: string;
  children?: NavChild[];
  allLabelKey?: string;
}

const getNavLinks = (lang: Lang): NavItem[] => [
  {
    labelKey: "nav.about",
    children: [
      { href: "/about", labelKey: "nav.about.index" },
      { href: "/about/history", labelKey: "nav.about.history" },
      { href: "/about/values", labelKey: "nav.about.values" },
      { href: "/about/join", labelKey: "nav.about.join" },
    ],
  },
  {
    href: "/initiatives",
    labelKey: "nav.projects",
    allLabelKey: "nav.projects.all",
    children: [
      { href: "/initiatives/innovation", labelKey: "nav.projects.innovation" },
      { href: "/initiatives/democracy", labelKey: "nav.projects.democracy" },
      { href: "/initiatives/engagement", labelKey: "nav.projects.engagement" },
      { href: "/initiatives/media", labelKey: "nav.projects.media" },
      { href: "/initiatives/training", labelKey: "nav.projects.training" },
    ],
  },
  {
    labelKey: "nav.resources",
    children: [
      { href: "/resources/publications", labelKey: "nav.resources.publications" },
      { href: "/resources/toolkits", labelKey: "nav.resources.toolkits" },
      { href: "/resources/media", labelKey: "nav.resources.media" },
      { href: "/dossier-de-presse.pdf", labelKey: "nav.resources.presskit", external: true, download: true },
    ],
  },
  {
    href: "/blog",
    labelKey: "nav.news",
    allLabelKey: "nav.news.all",
    children: [
      { href: `/blog?cat=${CATEGORY_IDS.communiques[lang]}`, labelKey: "nav.news.communiques" },
      { href: `/blog?cat=${CATEGORY_IDS.plaidoyers[lang]}`, labelKey: "nav.news.plaidoyers" },
      { href: `/blog?cat=${CATEGORY_IDS.actualites[lang]}`, labelKey: "nav.news.actualites" },
      { href: `/blog?cat=${CATEGORY_IDS.contributions[lang]}`, labelKey: "nav.news.contributions" },
      { href: `/blog?cat=${CATEGORY_IDS.champions[lang]}`, labelKey: "nav.news.champions" },
    ],
  },
];

interface DropdownNavItemProps {
  link: NavItem;
  isActive: boolean;
  currentUrl: string;
  t: (key: string) => string;
}

const DropdownNavItem = ({ link, isActive, currentUrl, t }: DropdownNavItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 inline-flex items-center gap-1",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {t(link.labelKey)}
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full pt-2 z-50"
          >
            <div className="w-[220px] rounded-lg border border-border bg-background shadow-lg">
              <div className="p-2">
                {link.href && (
                  <>
                    <Link
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-primary/10 hover:text-primary",
                        currentUrl === link.href ? "text-primary" : "text-foreground"
                      )}
                    >
                      {t(link.allLabelKey || link.labelKey)}
                    </Link>
                    {!link.allLabelKey && <div className="h-px bg-border mx-2 my-1" />}
                  </>
                )}
                {link.children!.map((child) =>
                  child.external ? (
                    <a
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={child.download}
                      className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-primary text-muted-foreground"
                    >
                      {t(child.labelKey)}
                    </a>
                  ) : (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-primary",
                        currentUrl === child.href
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {t(child.labelKey)}
                    </Link>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const { lang, setLang, t } = useI18n();
  const navLinks = getNavLinks(lang);

  const isActive = (link: NavItem) => {
    const currentPath = location.pathname + location.search;
    if (link.href && (currentPath === link.href || location.pathname === link.href)) return true;
    if (link.children?.some((child) => currentPath === child.href)) return true;
    return link.href ? location.pathname.startsWith(link.href + "/") : false;
  };

  const toggleSubmenu = (key: string) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border" role="navigation" aria-label="Navigation principale">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2" aria-label="Retour à l'accueil AfricTivistes">
            <img
              src={logo}
              alt="AfricTivistes"
              className="h-10 lg:h-12 w-auto"
              width="134"
              height="60"
              decoding="async"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.children ? (
                <DropdownNavItem
                  key={link.href || link.labelKey}
                  link={link}
                  isActive={isActive(link)}
                  currentUrl={location.pathname + location.search}
                  t={t}
                />
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  aria-current={location.pathname === link.href ? "page" : undefined}
                >
                  {t(link.labelKey)}
                </Link>
              )
            )}
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={t("nav.contact")}
            >
              {t("nav.contact")}
            </Link>
            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="px-3 py-1.5 text-xs font-semibold border border-border rounded-md text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              data-testid="button-lang-toggle"
              aria-label={`Changer la langue vers ${lang === "fr" ? "l'anglais" : "le français"}`}
            >
              {lang === "fr" ? "EN" : "FR"}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="section-container py-4 flex flex-col gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.href || link.labelKey}>
                    <button
                      onClick={() => toggleSubmenu(link.href || link.labelKey)}
                      className={cn(
                        "w-full flex items-center justify-between text-base font-medium py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm px-1",
                        isActive(link) ? "text-primary" : "text-muted-foreground"
                      )}
                      aria-expanded={openSubmenu === (link.href || link.labelKey)}
                    >
                      {t(link.labelKey)}
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform duration-200",
                          openSubmenu === (link.href || link.labelKey) && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence>
                      {openSubmenu === (link.href || link.labelKey) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pb-2 flex flex-col gap-1">
                            {link.href && (
                              <Link
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "text-sm font-semibold py-1.5 transition-colors rounded-sm px-1",
                                  location.pathname === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                )}
                              >
                                {t(link.allLabelKey || link.labelKey)}
                              </Link>
                            )}
                            {link.children.map((child) =>
                              child.external ? (
                                <a
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setIsOpen(false)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={child.download}
                                  className="text-sm py-1.5 transition-colors rounded-sm px-1 text-muted-foreground"
                                >
                                  {t(child.labelKey)}
                                </a>
                              ) : (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  onClick={() => setIsOpen(false)}
                                  className={cn(
                                    "text-sm py-1.5 transition-colors rounded-sm px-1",
                                    (location.pathname + location.search) === child.href
                                      ? "text-primary font-medium"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {t(child.labelKey)}
                                </Link>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-base font-medium py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm px-1",
                      location.pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                    aria-current={location.pathname === link.href ? "page" : undefined}
                  >
                    {t(link.labelKey)}
                  </Link>
                )
              )}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-2"
              >
                {t("nav.contact")}
              </Link>
              <button
                onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                className="self-start px-3 py-1.5 text-xs font-semibold border border-border rounded-md text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="button-lang-toggle-mobile"
                aria-label={`Changer la langue vers ${lang === "fr" ? "l'anglais" : "le français"}`}
              >
                {lang === "fr" ? "EN" : "FR"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default withDataProviders(Navbar);
