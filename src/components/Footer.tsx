import { withI18n } from "@/lib/providers/withI18n";
import { Link } from "@/lib/router-shim";
import { Phone, Mail, MapPin, Twitter, Facebook, Linkedin, Youtube, Instagram } from "lucide-react";
import logo from "@/assets/logo.svg?url";
import { useI18n } from "@/lib/i18n";
import NewsletterForm from "@/components/NewsletterForm";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-foreground text-background" role="contentinfo">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <div>
            <img
              src={logo}
              alt="AfricTivistes"
              className="h-10 mb-5 brightness-0 invert"
              width="134"
              height="60"
              loading="lazy"
              decoding="async"
            />
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              {t("footer.desc")}
            </p>
            <div className="flex gap-3" role="list" aria-label="Réseaux sociaux">
              {[
                { icon: Twitter, href: "https://twitter.com/AfricTivistes", label: "Twitter" },
                { icon: Facebook, href: "https://facebook.com/AfricTivistes", label: "Facebook" },
                { icon: Linkedin, href: "https://linkedin.com/company/africtivistes", label: "LinkedIn" },
                { icon: Youtube, href: "https://youtube.com/@AfricTivistes", label: "YouTube" },
                { icon: Instagram, href: "https://instagram.com/africtivistes", label: "Instagram" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Suivez-nous sur ${label}`}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid={`link-social-${label.toLowerCase()}`}
                >
                  <Icon size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold mb-5 text-white/90 uppercase tracking-wider">{t("footer.newsletter")}</h4>
            <p className="text-sm text-white/60 mb-4">{t("footer.receiveNewsletter")}</p>
              <NewsletterForm variant="footer" idPrefix="footer-newsletter" />
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold mb-5 text-white/90 uppercase tracking-wider">{t("footer.navigation")}</h4>
            <nav aria-label="Navigation du pied de page">
              <ul className="space-y-2.5">
                {[
                  { labelKey: "nav.home", to: "/" },
                  { labelKey: "nav.about", to: "/about" },
                  { labelKey: "nav.news", to: "/blog" },
                  { labelKey: "nav.projects", to: "/initiatives" },
                  { labelKey: "nav.contact", to: "/contact" },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-sm text-white/60 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
                      data-testid={`link-footer-${item.labelKey}`}
                    >
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold mb-5 text-white/90 uppercase tracking-wider">{t("footer.contact")}</h4>
            <address className="not-italic">
              <ul className="space-y-3 text-sm text-white/60">
                <li>
                  <a href="tel:+221338375124" className="flex items-start gap-2.5 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded-sm" data-testid="link-footer-phone">
                    <Phone size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>(+221) 33 837 51 24</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@africtivistes.org" className="flex items-start gap-2.5 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded-sm" data-testid="link-footer-email">
                    <Mail size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>info@africtivistes.org</span>
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>Liberté 6 extension villa N°263, Dakar, Sénégal</span>
                </li>
              </ul>
            </address>

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">{t("footer.equivalency")}</p>
              <a
                href="https://www.ngosource.org/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-ngosource"
              >
                <img
                  src="/NGOsource-ED.webp"
                  alt="NGOsource Equivalency Determination"
                  className="h-10 w-28 object-contain opacity-80 transition-opacity hover:opacity-100"
                  loading="lazy"
                  decoding="async"
                  width="112"
                  height="40"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} AfricTivistes. {t("footer.rights")}
          </p>
          <p className="text-xs text-white/40">
            {t("footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default withI18n(Footer);
