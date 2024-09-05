import { useState, useEffect } from 'react';
import { Card, Button, Form, Container } from 'react-bootstrap';
import { holidayExperiences } from '../data/holidayExperiences';
import { useAuth } from '@frontegg/nextjs';
import PreferredExperienceModal from '@/components/PreferredExperienceModal';

type UserMetadata = {
  preferredExperience?: string;
  hasSelectedPreferredExperience?: boolean;
};

const HomePage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>('');
  const [filteredExperiences, setFilteredExperiences] = useState(holidayExperiences);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.metadata) {
      let metadata: UserMetadata;

      try {
        metadata = typeof user.metadata === 'string' ? JSON.parse(user.metadata) : user.metadata;
      } catch (e) {
        metadata = {}; // Default to an empty object if parsing fails
      }

      const preferredExperience = metadata.preferredExperience || '';
      setFilter(preferredExperience);

      // Show the modal if the user has not selected a preferred experience
      if (!metadata.hasSelectedPreferredExperience) {
        setShowModal(true);
      }
    } else {
      // Handle the case where metadata is completely missing or undefined
      setShowModal(true); // Show modal if there's no metadata at all
    }
  }, [user]);

  useEffect(() => {
    setFilteredExperiences(
      holidayExperiences.filter(exp => exp.type.includes(filter))
    );
  }, [filter]);

  const handleCloseModal = () => setShowModal(false);

  return (
    <Container className="mt-5">
      {user &&  <PreferredExperienceModal show={showModal} handleClose={handleCloseModal} />}

      <Form.Group controlId="experienceFilter">
        <Form.Label>Filter by experience type</Form.Label>
        <Form.Control 
          as="select" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="City Break">City Break</option>
          <option value="Couples Trip">Couples Trip</option>
          <option value="Group Trips">Group Trips</option>
          <option value="Business Retreats">Business Retreats</option>
          <option value="Solo Travel">Solo Travel</option>
        </Form.Control>
      </Form.Group>
      <div className="row">
        {filteredExperiences.map(exp => (
          <div className="col-md-4" key={exp.id}>
            <Card>
              <Card.Img variant="top" src={exp.image} alt={exp.title} /> {/* Display cover image */}
              <Card.Body>
                <Card.Title>{exp.title}</Card.Title>
                <Card.Text>{exp.description}</Card.Text>
                <Card.Text>£{exp.price}</Card.Text>
                <Button href={`/experience/${exp.id}`}>View Details</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HomePage;
