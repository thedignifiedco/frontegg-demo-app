import { GetServerSideProps } from "next";
import { getSession } from "@frontegg/nextjs/pages";
import { useRouter } from "next/router";
import { Container, Col, Row, Button, Image } from "react-bootstrap";
import { holidayExperiences } from "../../data/holidayExperiences";
import { ParsedUrlQuery } from "querystring";

interface ExperienceDetailProps {
  experience: {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
  } | null;
}

const ExperienceDetail = ({ experience }: ExperienceDetailProps) => {
  const router = useRouter();

  if (!experience) return <p>Experience not found</p>;

  const handleBooking = () => {
    router.push({
      pathname: "/confirmation",
      query: { title: experience.title },
    });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={5}>
          <h1>{experience.title}</h1>
          <p>{experience.description}</p>
          <p>Price: £{experience.price}</p>
          <Button onClick={handleBooking}>Book Now</Button>
        </Col>
        <Col sm={7}>
          <Image
            src={experience.image}
            width="100%"
            height="auto"
            className="booking-image"
            alt={experience.title}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ExperienceDetail;

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context.req);

  if (!session) {
    return {
      redirect: {
        destination: "/account/login",
        permanent: false,
      },
    };
  }

  const { id } = context.params as Params;
  const experience = holidayExperiences.find((exp) => exp.id === parseInt(id));

  return {
    props: {
      experience: experience || null,
    },
  };
};
