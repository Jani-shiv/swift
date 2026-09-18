import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "InfraForge – Free DevOps Tools & Calculators",
  description:
    "Free online DevOps tools, cloud calculators, and developer utilities. Dockerfile generator, Kubernetes YAML builder, CIDR calculator, Cron builder, JWT decoder and 15+ more tools. No signup required.",
  keywords:
    "devops tools, cloud calculator, dockerfile generator, kubernetes yaml, cidr calculator, cron expression builder, jwt decoder, chmod calculator",
  openGraph: {
    title: "InfraForge – Free DevOps Tools & Calculators",
    description:
      "20+ free DevOps tools, cloud calculators, and developer utilities. No signup. Open-source.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-animated">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
