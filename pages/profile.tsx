import { GetServerSideProps } from "next";
import { getSession } from "@frontegg/nextjs/pages";
import { useAuth } from "@frontegg/nextjs";
import { Container, Card, Image, Button, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import PreferredExperienceModal from "@/components/PreferredExperienceModal";
import { AdminPortalButton } from "@/components/AdminPortal";

const ProfilePage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [parsedMetadata, setParsedMetadata] = useState<any>({});

  useEffect(() => {
    if (user?.metadata) {
      const metadata =
        typeof user.metadata === "string"
          ? JSON.parse(user.metadata)
          : user.metadata;
      setParsedMetadata(metadata);
    }
  }, [user]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (!user) return null;

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Row>
            <Col sm={5} className="profile-picture">
              <Image
                src={user.profilePictureUrl ?? "/next.svg"}
                roundedCircle
                width="200"
                height="200"
                className="me-2"
                alt={user.name}
              />
            </Col>
            <Col sm={7}>
              <h2>{user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Email Verified: {JSON.stringify(user.verified)}</p>
              <p>UUID: {user.sub}</p>
              <p>Tenant ID: {user.tenantId}</p>
              <Button variant="primary" onClick={handleOpenModal}>
                Update Preferred Experience
              </Button>
              {/* Preferred Experience Modal */}
              <PreferredExperienceModal
                show={showModal}
                handleClose={handleCloseModal}
              />
              <AdminPortalButton />
            </Col>
          </Row>
          <Row>
            <Col sm={5}>
              <h3>Permissions</h3>
              <pre>
                {JSON.stringify(user.permissions, null, 2)}{" "}
                {/* Display parsed metadata */}
              </pre>
            </Col>
            <Col sm={7}>
              <h3>Profile Metadata</h3>
              <pre>
                {JSON.stringify(parsedMetadata, null, 2)}{" "}
                {/* Display parsed metadata */}
              </pre>
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
