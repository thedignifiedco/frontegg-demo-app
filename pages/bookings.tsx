import { GetServerSideProps } from 'next';
import { getSession } from '@frontegg/nextjs/pages';
import { useAuth } from '@frontegg/nextjs';
import { Container, ListGroup, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';

type Booking = {
  confirmationNumber: string;
  date: string;
  package: string;
  price: string | null;
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user?.metadata) {
      const metadata = typeof user.metadata === 'string' ? JSON.parse(user.metadata) : user.metadata;
      setBookings(metadata.previousBookings || []);
    }
  }, [user]);

  if (!user) {
    return <Alert variant="warning">You need to be logged in to view your bookings.</Alert>;
  }

  return (
    <Container className="mt-5">
      <h1>My Bookings</h1>
      {bookings.length > 0 ? (
        <ListGroup>
          {bookings.map((booking, index) => (
            <ListGroup.Item key={index}>
              <h5>{booking.package}</h5>
              <p>Confirmation Number: {booking.confirmationNumber}</p>
              <p>Date: {booking.date}</p>
              <p>Price: £{booking.price}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="info">You have no bookings yet.</Alert>
      )}
    </Container>
  );
};

export default MyBookings;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context.req);

  if (!session) {
    return {
      redirect: {
        destination: `/account/login?redirectUrl=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
