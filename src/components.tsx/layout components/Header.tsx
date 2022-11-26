import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { SSRProvider } from 'react-bootstrap';
import { signOut } from 'next-auth/react';
import 'bootstrap/dist/css/bootstrap.min.css'

type Props = {}

const Header = (props: Props) => {
  return (
    <SSRProvider>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
      <Container>
        <Link href="/" passHref legacyBehavior><Navbar.Brand>Media Tracker</Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link href="/library" passHref legacyBehavior><Nav.Link>Library</Nav.Link></Link>
            <Link href="/book/all" passHref legacyBehavior><Nav.Link>Books</Nav.Link></Link>
            <Link href="/book/all" passHref legacyBehavior><Nav.Link>Podcasts</Nav.Link></Link>
            <Link href="/book/dune" passHref legacyBehavior><Nav.Link>Movies</Nav.Link></Link>
            <Link href="/book/dune" passHref legacyBehavior><Nav.Link>TV shows</Nav.Link></Link>
          </Nav>
          <Nav className = "ml-auto">
            <Link href="/profile" passHref legacyBehavior><Nav.Link>Profile</Nav.Link></Link>
            <Nav.Link  onClick={() => signOut({ callbackUrl: "/log-in" })}>Log out</Nav.Link>
            <NavDropdown title="Settings" id="collasible-nav-dropdown">
            <Link href="/" passHref legacyBehavior><NavDropdown.Item>Action Later</NavDropdown.Item></Link>
            <Link href="/" passHref legacyBehavior><NavDropdown.Item>
                Something Later
              </NavDropdown.Item></Link>
              <Link href="/" passHref legacyBehavior><NavDropdown.Item>Something Later</NavDropdown.Item></Link>
              <NavDropdown.Divider />
              <Link href="/" passHref legacyBehavior><NavDropdown.Item>
                Something Later
              </NavDropdown.Item></Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </SSRProvider>
    )
}

export default Header