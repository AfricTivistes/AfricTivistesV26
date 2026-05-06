import { type ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  mainClassName?: string;
}

/**
 * Transparent wrapper kept for backward compatibility with React page
 * components that still call <PageLayout>...</PageLayout>. The `<main>`
 * element, navbar offset, and overall layout chrome are now provided by
 * `BaseLayout.astro`. New pages should not depend on this component.
 */
const PageLayout = ({ children, mainClassName }: PageLayoutProps) => {
  if (mainClassName) {
    return <div className={mainClassName}>{children}</div>;
  }
  return <>{children}</>;
};

export default PageLayout;
