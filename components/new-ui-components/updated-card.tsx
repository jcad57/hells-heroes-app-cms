export default function UpdatedCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#12121a] rounded-xl border border-border overflow-hidden">
      {children}
    </div>
  );
}
