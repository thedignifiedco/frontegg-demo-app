import { useAuth } from "@frontegg/nextjs";
import { brandingConfig } from "../brandingConfig";
import AppNavbar from "./AppNavbar";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const tenantId = user?.tenantId || "defaultTenant"; // Use defaultTenant if tenantId not found
  const branding = brandingConfig[tenantId] || brandingConfig.defaultTenant; // Fallback to default branding if no match

  // Inject dynamic styles for buttons
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
          .btn {
            background-color: ${branding.secondaryColor} !important;
            border-color: ${branding.secondaryColor} !important;
          }
        `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style); // Clean up when the component unmounts
    };
  }, [branding.secondaryColor]);

  return (
    <div style={{ backgroundColor: branding.primaryColor }}>
      <header>
        <AppNavbar logo={branding.logo} /> {/* Pass the logo to AppNavbar */}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
