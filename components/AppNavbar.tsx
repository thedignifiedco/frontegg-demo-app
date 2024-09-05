import { Navbar, Nav, Container, Button, Image } from "react-bootstrap";
import { useRouter } from "next/router";
import { useAuth } from "@frontegg/nextjs";

const CustomNavbar = () => {
  const { user } = useAuth();

  const login = () => {
    window.location.href = "/account/login";
  };

  const logout = () => {
    window.location.href = "/account/logout";
  };

  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
        <Image
              src="/logo.png"
              roundedCircle
              width="80"
              height="80"
              className="me-2"
              alt="Dignified Travels"
            />
            Dignified Travels</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/bookings">My Bookings</Nav.Link>
          </Nav>
          {isAuthenticated && user ? (
            <div className="d-flex align-items-center">
              <Image
                src={user.profilePictureUrl ?? "/next.svg"}
                roundedCircle
                width="40"
                height="40"
                className="me-2"
                alt={user.name}
              />
              <Nav.Link href="/profile">
                <span className="me-3">{user.name}</span>
              </Nav.Link>
            </div>
          ) : null}
          <Button onClick={handleLoginLogout}>
            {isAuthenticated ? "Logout" : "Login"}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
