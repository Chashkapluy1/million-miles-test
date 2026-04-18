import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Million Miles — Premium Car Listings",
  description:
    "International premium vehicle delivery service. Find your perfect car from Korea's largest marketplace.",
  keywords: ["cars", "Korea", "import", "premium", "encar", "used cars"],
  openGraph: {
    title: "Million Miles",
    description: "Premium international car delivery service",
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
