export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-navy text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* LEFT */}
        <p className="text-sm font-medium">
          Garuda Shuttlecocks ©
        </p>

        {/* RIGHT */}
        <div className="text-sm text-white/60 flex flex-col items-center md:items-end">
          <p>contact@yourdomain.com</p>
          <p className="mt-2">+1 (000) 000-0000</p>
        </div>

      </div>
    </footer>
  );
}