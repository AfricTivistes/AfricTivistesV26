interface SectionHeadingProps {
  title: string;
}

const SectionHeading = ({ title }: SectionHeadingProps) => (
  <div className="mb-8">
    <h2 className="text-xl lg:text-2xl font-bold text-foreground font-heading mb-2">
      {title}
    </h2>
    <div className="w-10 h-[3px] bg-secondary rounded-full" />
  </div>
);

export default SectionHeading;
