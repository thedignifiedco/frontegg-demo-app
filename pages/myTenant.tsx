import { GetServerSideProps } from "next";
import { getSession } from "@frontegg/nextjs/pages";
import { useAuth } from "@frontegg/nextjs";
import { Container, Row, Card } from "react-bootstrap";
import useTenantBranding from "@/hooks/useTenantBranding";

const MyTenant = () => {
  const { user } = useAuth();
  const branding = useTenantBranding();

  if (!user || !branding) {
    return <div>Loading...</div>; // Display loading state while fetching branding
  }

  return (
    <Container className="pt-5 pb-5">
      <h1>Tenant Info</h1>
      <Card>
        <Card.Body>
          <Row>
            <p>
              Welcome {user.name}, you are logged into the{" "}
              <strong>{branding.name}</strong> tenant.
            </p>
            <p>
              <strong>Tenant Name:</strong> {branding.name}
            </p>
            <p>
              <strong>Tenant ID:</strong> {user.tenantId}
            </p>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyTenant;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context.req);

  if (!session) {
    return {
      redirect: {
        destination: `/account/login?redirectUrl=${encodeURIComponent(
          context.resolvedUrl
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
