import "@/styles/globals.css";

export const metadata = {
  title: 'Arepas Burguer',
  description: 'Starter Next.js + Prisma',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
