interface PlantPhotoProps {
  src: string;
  alt: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizes: Record<NonNullable<PlantPhotoProps["size"]>, string> = {
  xs: "h-7 w-7 rounded-lg",
  sm: "h-10 w-10 rounded-xl",
  md: "h-14 w-14 rounded-2xl",
  lg: "h-16 w-16 rounded-2xl",
  xl: "h-28 w-28 rounded-3xl",
};

export function PlantPhoto({ src, alt, className = "", size = "md" }: PlantPhotoProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden bg-[#0c1a14] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] ${sizes[size]} ${className}`}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </span>
  );
}
