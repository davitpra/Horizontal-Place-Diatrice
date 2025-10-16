"use client";

import localFont from "next/font/local";
import "./globals.css";
import { Message } from "../components/ui/Footer";
import { Sidebar } from "../components/ui/Sidebar";
import { InitialDataProvider } from "@/components/providers/InitialDataProvider";
import { SyncProvider } from "@/components/providers/SyncProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { Loading } from "@/components/ui/Loading";
import { Toaster } from "react-hot-toast";

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

// Componente interno que maneja la lógica de autenticación
const AuthenticatedLayout = ({ children }) => {
  const { user, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <Loading message="Verifying authentication..." />;
  }

  // Si no está autenticado, mostrar solo el contenido sin sidebar ni providers
  if (!user) {
    return children;
  }

  // Si está autenticado, mostrar el layout completo con sidebar y providers
  return (
    <InitialDataProvider>
      <SyncProvider>
        <Sidebar>
          {children}
        </Sidebar>
      </SyncProvider>
    </InitialDataProvider>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthProvider>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
