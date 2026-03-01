export default function MainContentWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col ">
      {/* ── Header ── */}
      <header className="px-4 lg:px-10 py-6 lg:py-8 border-b border-border flex flex-col sm:flex-row sm:items-end justify-between">
        <div>
          <h1 className="font-bebas-neue font-bold text-5xl lg:text-6xl tracking-[3px] leading-none bg-gradient-to-br from-[#006CB3] via-[#3A97D4] to-white bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <div className="sm:text-right text-muted-foreground text-sm font-light leading-relaxed"></div>
      </header>
      <main className="p-4 lg:p-10">{children}</main>
    </div>
  );
}
