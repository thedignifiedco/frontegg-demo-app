import { useEffect, useState } from "react";
import { useAuth } from "@frontegg/nextjs";

type TenantBranding = {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
};

const defaultTenant = {
  logo: "/logos/logo.png",
  primaryColor: "#F3FCF0",
  secondaryColor: "#540D6E",
};

const useTenantBranding = (): TenantBranding | null => {
  const { user } = useAuth();
  const [branding, setBranding] = useState<TenantBranding | null>(null);

  useEffect(() => {
    const fetchTenantMetadata = async () => {
      if (user?.accessToken) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_FRONTEGG_BASE_URL}/identity/resources/users/v1/me/tenants`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const activeTenant = data.activeTenant;

            if (activeTenant && activeTenant.metadata) {
              const parsedMetadata = JSON.parse(activeTenant.metadata); // Parse the stringified metadata
              const { logo = defaultTenant.logo, primaryColor = defaultTenant.primaryColor, secondaryColor = defaultTenant.secondaryColor } = parsedMetadata;
              setBranding({ logo, primaryColor, secondaryColor });
            } else {
              setBranding(defaultTenant); // Use default branding if no metadata
            }
          } else {
            setBranding(defaultTenant); // Fallback to default branding on error
          }
        } catch (error) {
          console.error('Error fetching tenant metadata:', error);
          setBranding(defaultTenant); // Fallback to default branding on error
        }
      } else {
        setBranding(defaultTenant); // Fallback to default branding if no user data
      }
    };

    fetchTenantMetadata();
  }, [user]);

  return branding;
};

export default useTenantBranding;