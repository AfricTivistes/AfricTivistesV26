import PartnerCard from "@/components/projet/PartnerCard";
import type { PartnerOrg } from "@/lib/wordpress";

interface PartnersSectionProps {
  porteurOrgs: PartnerOrg[];
  soutienOrgs: PartnerOrg[];
  partenaireOrgs: PartnerOrg[];
  projectByLabel: string;
  supportedByLabel: string;
  partnersWithLabel: string;
}

const PartnersSection = ({
  porteurOrgs,
  soutienOrgs,
  partenaireOrgs,
  projectByLabel,
  supportedByLabel,
  partnersWithLabel,
}: PartnersSectionProps) => {
  if (porteurOrgs.length === 0 && soutienOrgs.length === 0 && partenaireOrgs.length === 0) return null;

  const visibleCount =
    (porteurOrgs.length > 0 ? 1 : 0) +
    (soutienOrgs.length > 0 ? 1 : 0) +
    (partenaireOrgs.length > 0 ? 1 : 0);

  return (
    <section className="py-16 lg:py-20 border-t border-border">
      <div className="section-container">
        <div
          className={`flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-16 ${
            visibleCount < 3 ? "lg:justify-center" : "lg:justify-between"
          }`}
        >
          {porteurOrgs.length > 0 && (
            <PartnerCard title={projectByLabel} orgs={porteurOrgs} delay={0.1} />
          )}
          {soutienOrgs.length > 0 && (
            <PartnerCard title={supportedByLabel} orgs={soutienOrgs} delay={0.15} />
          )}
          {partenaireOrgs.length > 0 && (
            <PartnerCard title={partnersWithLabel} orgs={partenaireOrgs} delay={0.2} />
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
