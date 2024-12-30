import localFont from "next/font/local";
import { Header } from "../components/Header"
import "./globals.css";
import { Message } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";

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
  title: "Dietitian Guide",
  description: "A guide to help you get familiar with the residents and their preferences",
};

export default function RootLayout({ children }) {

  let footerTitle = "IMPORTANT NOTE";
  let footerMessage = "This information is only to help you get familiar with the residents and their preferences. There is no harm in asking them and offering other choices (especially their drink choices can change from time to time)";

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        {/* <Header /> */}
        <Sidebar>
          {children}
          <Message title={footerTitle} message={footerMessage}/>
        </Sidebar>
      </body>
    </html>
  );
}
