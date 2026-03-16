import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  slug: string;
  icon?: React.ReactNode;
  colorClass: string;
}

export default function CategoryCard({ title, slug, icon, colorClass }: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`} className="group block h-full">
      <div className={`h-full relative overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6 flex flex-col items-center justify-center gap-4 w-full transition-all duration-300 hover:scale-[1.03] hover:bg-slate-800 ${colorClass}`}>
        <div className="relative z-10 text-slate-300 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <h3 className="relative z-10 font-bold text-center text-sm sm:text-base md:text-lg text-slate-200 group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* Subtle background glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-current"></div>
      </div>
    </Link>
  );
}
