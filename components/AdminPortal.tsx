'use client';
import { AdminPortal } from '@frontegg/nextjs';
import { Button } from 'react-bootstrap';
import styles from "../app/page.module.css";

export const AdminPortalButton = () => {
  return (
    <Button className={styles.card} onClick={() => AdminPortal.show()}>Settings <span>-&gt;</span></Button>
  );
};