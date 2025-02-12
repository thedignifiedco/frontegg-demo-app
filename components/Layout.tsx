import useTenantBranding from "@/hooks/useTenantBranding";
import AppNavbar from "./AppNavbar";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { branding } = useTenantBranding();

  useEffect(() => {
    if (branding) {
      const style = document.createElement("style");
      style.innerHTML = `
        .btn {
          background-color: ${branding.secondaryColor} !important;
          border-color: ${branding.secondaryColor} !important;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [branding]);

  if (!branding) {
    return <div>Loading...</div>; // Loading state while branding is being fetched
  }

  return (
    <div style={{ backgroundColor: branding.primaryColor }}>
      <header>
        <AppNavbar />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
