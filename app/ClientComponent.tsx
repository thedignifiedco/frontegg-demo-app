"use client";
import { useCallback } from 'react';
import { useAuth, useLoginWithRedirect } from "@frontegg/nextjs";//, useLoginWithRedirect 
import { AdminPortal } from '@frontegg/nextjs';
import styles from "./page.module.css";
import { Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export const ClientComponent = () => {
  const { user, isAuthenticated } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();
  const router = useRouter();

  const logout = useCallback(() => {
    router.replace('/account/logout');
  }, [router]);

  const profilePictureUrl = user?.profilePictureUrl ?? '/default-profile-picture.png';

  return (
    <div>
      {isAuthenticated ? (
        <div className={styles.grid}>
            <div className={styles.card}>
                <Row>
                    <Col className="col-md-auto">
                        <img src={profilePictureUrl} alt={user?.name} />
                    </Col>
                    <Col>
                        <span>Logged in as:</span>
                        <h3> {user?.name}</h3>
                    </Col>
                </Row>
            </div>
          <div className={styles.card}>
                <Row className="align-items-center">
                    <Col className="d-grid gap-2">
                        <Button className="btn-light btn-lg btn-block" onClick={() => AdminPortal.show()}>Settings</Button>
                    </Col>
                </Row>
          </div>
          <div className={styles.card}>
                <Row className="align-items-center">
                    <Col className="d-grid gap-2">
                        <Button className="btn-light btn-lg btn-block" onClick={() => logout()}>Logout</Button>
                    </Col>
                </Row>
          </div>
        </div>
      ) : (
        <><></><div className={styles.grid}>
            <div className={styles.card}>
                <Row className="align-items-center">
                    <Col className="d-grid gap-2">
                        <Button className="btn-light btn-lg btn-block" onClick={() => loginWithRedirect()}>Login</Button>
                    </Col>
                </Row>
            </div>
            </div></>
      )}
    </div>
  );
};