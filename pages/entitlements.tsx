import { GetServerSideProps } from "next";
import { getSession } from "@frontegg/nextjs/pages";
import {
  useIsAuthenticated,
  useFeatureEntitlements,
  usePermissionEntitlements,
  useEntitlements,
} from "@frontegg/nextjs";
import { Container, Alert } from "react-bootstrap";

// A component to render entitlement-based sections
const Entitlements = () => {
  // Check for feature entitlement using a feature key.
  const { isEntitled: isFEntitled, justification: fJust } =
    useFeatureEntitlements("premium_docs");

  // Check for permission entitlement using a permission key.
  const { isEntitled: isPEntitled, justification: pJust } =
    usePermissionEntitlements("delete_premium_docs");

  const { isEntitled: isFEntitled2, justification: fJust2 } = useEntitlements({
      featureKey: "abs_features",
    });

  const { isEntitled: isPEntitled2, justification: pJust2 } = useEntitlements({
    permissionKey: "delete_abs",
  });

  return (
    <>
      {isFEntitled && <div>User has Premium Features</div>}
      {isPEntitled && <div>User can Delete Premium Docs</div>}
      {isFEntitled2 && <div>User has ABS Features</div>}
      {isPEntitled2 && <div>User can Delete ABS Forms</div>}
    </>
  );
};

const EntitlementsPage = () => {
  const isAuthenticated = useIsAuthenticated();

  // Optionally, you can show a message if the user isn't authenticated.
  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <Container className="pt-5 pb-5">
      <h1>User Entitlements</h1>
      <p>
        This page shows different sections based on your Frontegg entitlements.
      </p>
      <Alert variant="info"><Entitlements /></Alert>
    </Container>
  );
};

export default EntitlementsPage;

// Protect the page using getServerSideProps to ensure the user is authenticated.
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

  return { props: {} };
};
