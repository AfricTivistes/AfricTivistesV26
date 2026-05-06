import { Link } from "@/lib/router-shim";
import { ArrowLeft, Target } from "lucide-react";

export const ProjetSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-[420px] lg:h-[520px] bg-muted" />
    <div className="section-container -mt-12 relative z-10">
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="h-4 bg-muted rounded w-24 mb-4" />
        <div className="h-5 bg-muted rounded w-3/4" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 h-24 bg-card rounded-xl border border-border" />
        ))}
      </div>
    </div>
    <div className="section-container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 bg-muted rounded w-40 mb-8" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded" style={{ width: `${55 + Math.random() * 45}%` }} />
          ))}
        </div>
        <div className="space-y-5">
          <div className="h-28 bg-muted rounded-2xl" />
          <div className="h-44 bg-muted rounded-2xl" />
          <div className="h-28 bg-muted rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

interface ProjetNotFoundProps {
  notFoundLabel: string;
  notFoundDesc: string;
  backLabel: string;
}

export const ProjetNotFound = ({ notFoundLabel, notFoundDesc, backLabel }: ProjetNotFoundProps) => (
  <div className="pt-28 section-container text-center py-20">
    <div className="max-w-md mx-auto">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
        <Target size={32} className="text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-4 font-heading">{notFoundLabel}</h1>
      <p className="text-muted-foreground mb-8">{notFoundDesc}</p>
      <Link
        to="/initiatives"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <ArrowLeft size={16} />
        {backLabel}
      </Link>
    </div>
  </div>
);
