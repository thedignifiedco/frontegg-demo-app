'use client';
import { useEffect } from 'react';
import { GetServerSideProps } from "next";
import { getSession } from "@frontegg/nextjs/pages";
import { AdminPortal } from '@frontegg/nextjs';
import { Container, Row, Card } from "react-bootstrap";

const AdminPortalPage = () => {
  useEffect(() => {
    AdminPortal.show();
  }, []);

  return (
    <Container className="pt-5 pb-5">
      <h1>Dashboard</h1>
      <Card>
        <Card.Body>
          <Row>
            <p>
                Opening the Admin Portal...
            </p>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminPortalPage;

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

