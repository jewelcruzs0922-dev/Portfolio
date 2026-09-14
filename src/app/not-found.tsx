import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{
      background: "linear-gradient(135deg, #b8ddef 0%, #c8e4f4 25%, #dcd8f0 50%, #ecd0e8 75%, #f4c0d8 100%)"
    }}>
      <div className="text-center">
        <h1 className="text-7xl md:text-9xl font-extralight tracking-[0.1em] text-[#1a3a5a] mb-4">
          404
        </h1>
        <p className="text-lg md:text-xl text-[#1a3a5a] opacity-60 mb-8 tracking-wide">
          This page could not be found.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-3 px-8 py-3 border border-[#7ad8f0] text-[11px] tracking-[0.2em] text-[#1a3a5a] hover:bg-[#7ad8f0] hover:text-white transition-all duration-300">
          <span className="w-1.5 h-1.5 rotate-45 bg-[#7ad8f0] opacity-50" />
          BACK HOME
        </Link>
      </div>
    </div>
  );
}
