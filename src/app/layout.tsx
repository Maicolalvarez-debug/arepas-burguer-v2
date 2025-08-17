export const metadata = {
  title: 'Arepas Burguer',
  description: 'Starter Next.js + Prisma',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
