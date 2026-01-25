import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function OpportunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050B1A]">
        {children}
      </main>
      <Footer />
    </>
  );
}
