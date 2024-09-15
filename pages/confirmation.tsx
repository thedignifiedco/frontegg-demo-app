import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@frontegg/nextjs';
import { Container } from 'react-bootstrap';
import { holidayExperiences } from '@/data/holidayExperiences'; // Adjust this path as necessary

type Booking = {
  confirmationNumber: string;
  date: string;
  package: string;
  price: string | null;
};

type UserMetadata = {
  previousBookings?: Booking[];
};

const BookingConfirmation = () => {
  const router = useRouter();
  const { title } = router.query;
  const [confirmationNumber, setConfirmationNumber] = useState<string>('');
  const [price, setPrice] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const confirmationNum = Math.random().toString(36).substr(2, 9).toUpperCase();
    setConfirmationNumber(confirmationNum);

    if (title) {
      // Fetch the price from the data source based on the title
      const experience = holidayExperiences.find(exp => exp.title === title);
      if (experience) {
        setPrice(experience.price.toString()); // Convert the price to a string
      }
    }

    if (user && title && price !== null) {
      updateUserBookings(user, title as string, price, confirmationNum);
    }
  }, [user, title, price]);

  const updateUserBookings = async (user: any, experienceTitle: string, experiencePrice: string, confirmationNumber: string) => {
    const accessToken = user.accessToken;
    const userId = user.id;
    const tenantId = user.tenantId;
    const bookingDate = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    const newBooking: Booking = {
      confirmationNumber,
      date: bookingDate,
      package: experienceTitle,
      price: experiencePrice
    };

    let existingMetadata: UserMetadata = {};
    if (user.metadata) {
      existingMetadata = typeof user.metadata === 'string' ? JSON.parse(user.metadata) : user.metadata;
    }

    const updatedMetadata: UserMetadata = {
      ...existingMetadata,
      previousBookings: [
        ...(existingMetadata.previousBookings || []),
        newBooking
      ]
    };

    const options = {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'frontegg-user-id': userId,
        'frontegg-tenant-id': tenantId,
        'content-type': 'application/json',
        authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ metadata: JSON.stringify(updatedMetadata) })
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEGG_BASE_URL}/identity/resources/users/v1`, options);
      if (!response.ok) {
        throw new Error('Failed to update user metadata');
      }
      console.log('User bookings updated successfully');
    } catch (err) {
      console.error('Error updating user bookings:', err);
    }
  };

  return (
    <Container className="pt-5 pb-5">
      <h1>Booking Confirmation</h1>
      {title && <p>Booking for: {title}</p>}
      <p>Your booking is confirmed. Your confirmation number is {confirmationNumber}</p>
    </Container>
  );
};

export default BookingConfirmation;
