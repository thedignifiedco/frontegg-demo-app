import { GetServerSideProps } from "next";
import { getSession } from "@frontegg/nextjs/pages";
import { useAuth, useAuthActions, useTenantsActions } from "@frontegg/nextjs";
import {
  Container,
  Card,
  Image,
  Button,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import PreferredExperienceModal from "@/components/PreferredExperienceModal";
import { AdminPortalButton } from "@/components/AdminPortal";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import useTenantBranding from "@/hooks/useTenantBranding";

const ProfilePage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [parsedMetadata, setParsedMetadata] = useState<any>({});
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");

  // Get tenantsData and active tenant branding from our custom hook.
  const { branding, tenantsData } = useTenantBranding();

  // Set the default selected tenant to the active tenant (if found), otherwise fallback to the first tenant.
  useEffect(() => {
    if (tenantsData && tenantsData.length > 0) {
      if (branding) {
        const activeTenant = tenantsData.find(
          (tenant: any) => tenant.name === branding.name
        );
        if (activeTenant) {
          setSelectedTenantId(activeTenant.tenantId);
          return;
        }
      }
      setSelectedTenantId(tenantsData[0].tenantId);
    }
  }, [tenantsData, branding]);

  // Parse user metadata
  useEffect(() => {
    if (user?.metadata) {
      const metadata =
        typeof user.metadata === "string"
          ? JSON.parse(user.metadata)
          : user.metadata;
      setParsedMetadata(metadata);
    }
  }, [user]);

  // Decode the access token
  useEffect(() => {
    if (user?.accessToken) {
      const decoded = jwtDecode(user.accessToken);
      setDecodedToken(decoded);
    }
  }, [user]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const { switchTenant } = useAuthActions();
  // Updated: When switching tenants, include the selected tenant's applicationUrl as requestOrigin.
  const handleSwitchTenant = () => {
    const selectedTenant = tenantsData.find(
      (tenant: any) => tenant.tenantId === selectedTenantId
    );
    if (selectedTenant && selectedTenant.applicationUrl) {
      // Cast the payload as any to include the extra property "requestOrigin"
      (switchTenant as any)({
        tenantId: selectedTenantId,
        requestOrigin: selectedTenant.applicationUrl,
      });
    } else {
      switchTenant({ tenantId: selectedTenantId });
    }
  };

  // Create a simplified list of tenants (each with name and tenantId) for display.
  const tenantsList =
    tenantsData?.map((tenant: any) => ({
      name: tenant.name,
      tenantId: tenant.tenantId,
    })) || [];

  if (!user) return null;

  return (
    <Container className="pt-5 pb-5">
      <Card>
        <Card.Body>
          <Row>
            <Col sm={6} className="profile-picture">
              <Image
                src={user.profilePictureUrl ?? "/next.svg"}
                roundedCircle
                width="200"
                height="200"
                className="me-2"
                alt={user.name}
              />
            </Col>
            <Col sm={6}>
              <h2>{user.name}</h2>
              <p>
                <b>Email:</b> {user.email}
              </p>
              <p>
                <b>Email Verified:</b> {JSON.stringify(user.verified)}
              </p>
              <p>
                <b>User ID:</b> {user.sub}
              </p>
              <p>
                <b>Tenant ID:</b> {user.tenantId}
              </p>
              <p>
                <b>Company:</b> {(user as any).customClaims?.Company ?? "N/A"}
                <br />
                (Response from{" "}
                <Link
                  href="https://fake-json-api.mock.beeceptor.com/companies"
                  target="_blank"
                >
                  3rd-party API
                </Link>
                )
              </p>
              <AdminPortalButton />
              <Button variant="primary" onClick={handleOpenModal}>
                Update Preferred Experience
              </Button>
              {/* Preferred Experience Modal */}
              <PreferredExperienceModal
                show={showModal}
                handleClose={handleCloseModal}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col sm={6}>
              <h3>Access Token</h3>
              <pre>{user.accessToken}</pre>
            </Col>
            <Col sm={6}>
              <h3>Profile Metadata</h3>
              <pre>{JSON.stringify(parsedMetadata, null, 2)}</pre>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col sm={6}>
              <h3>Decoded Access Token</h3>
              <pre>
                {decodedToken
                  ? JSON.stringify(decodedToken, null, 2)
                  : "No token available"}
              </pre>
            </Col>
            <Col sm={6}>
              <h3>Entitlements</h3>
              <pre>{JSON.stringify(user.entitlements, null, 2)}</pre>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col sm={6}>
              <h3>Active Tenant</h3>
              <Form.Group controlId="tenantSwitch" className="mt-3">
                <Form.Label>Select Tenant</Form.Label>
                <Form.Select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                >
                  {tenantsData.map((tenant: any) => (
                    <option key={tenant.tenantId} value={tenant.tenantId}>
                      {tenant.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button
                variant="secondary"
                onClick={handleSwitchTenant}
                className="mt-2"
              >
                Switch Tenant
              </Button>
            </Col>
            <Col sm={6}>
              <h3>Tenants</h3>
              <pre>{JSON.stringify(tenantsList, null, 2)}</pre>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context.req);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
