import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mugon-background">
      <nav className="border-b border-mugon-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <Link href="/admin" className="font-mugon-heading text-mugon-lg text-mugon-text">
            Explore With Kaira Admin
          </Link>
          <Link href="/admin/kanshi" className="text-mugon-sm text-mugon-muted hover:text-mugon-text">
            Kanshi Timeline
          </Link>
          <div className="flex-1" />
          <Link href="/" className="text-mugon-sm text-mugon-muted hover:text-mugon-text">
            &larr; Site
          </Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}
