import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '@frontegg/nextjs';

type PreferredExperienceModalProps = {
  show: boolean;
  handleClose: () => void;
};

const PreferredExperienceModal = ({ show, handleClose }: PreferredExperienceModalProps) => {
  const { user } = useAuth();
  const [preferredExperience, setPreferredExperience] = useState<string>('');

  const handleSubmit = async () => {
    if (user) {
      const accessToken = user.accessToken;
      const userId = user.id;
      const tenantId = user.tenantId;

      // Prepare the updated metadata
      let existingMetadata = {};
      if (user.metadata) {
        existingMetadata = typeof user.metadata === 'string' ? JSON.parse(user.metadata) : user.metadata;
      }

      const updatedMetadata = {
        ...existingMetadata,
        preferredExperience,
        hasSelectedPreferredExperience: true, // Prevent showing the modal again
      };

      // Make the PUT request to update the user metadata
      const options = {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'frontegg-user-id': userId,
          'frontegg-tenant-id': tenantId,
          'content-type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ metadata: JSON.stringify(updatedMetadata) }),
      };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FRONTEGG_BASE_URL}/identity/resources/users/v1`,
          options
        );
        if (!response.ok) {
          throw new Error('Failed to update user metadata');
        }
        console.log('User preferred experience updated successfully');
        handleClose();
        window.location.reload(); // Reload the homepage
      } catch (err) {
        console.error('Error updating user metadata:', err);
      }

      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select your preferred experience</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="preferredExperience">
            <Form.Label>Preferred Experience</Form.Label>
            <Form.Control
              as="select"
              value={preferredExperience}
              onChange={(e) => setPreferredExperience(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="City Break">City Break</option>
              <option value="Couples Trip">Couples Trip</option>
              <option value="Group Trips">Group Trips</option>
              <option value="Business Retreats">Business Retreats</option>
              <option value="Solo Travel">Solo Travel</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Save Preferences
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PreferredExperienceModal;
