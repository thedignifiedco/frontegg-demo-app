// brandingConfig.ts
type Branding = {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
  };
  
  export const brandingConfig: { [key: string]: Branding } = {
    defaultTenant: {
      logo: '/logos/logo.png',
      primaryColor: '#F3FCF0', // Default Gray
      secondaryColor: '#540D6E', // Default Dark Gray
    },
    '304e4d0c-5e75-4fd5-b41a-45dde8f8bfb1': {
      logo: '/logos/trip.gif',
      primaryColor: '#F2E3BC', // Tomato Red
      secondaryColor: '#35281D', // Steel Blue
    },
  };
  