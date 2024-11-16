import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "XS Fast Quote",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="image-logo">
          <Image
            className="image-logo d-flex justify-content-end"
            src="/img/logo.png"
            width={120}
            height={70}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
