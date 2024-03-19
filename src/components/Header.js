import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="header-navigation-link">
          <Link to="/">React-Bootstrap</Link>
          <Link to="/">Home</Link>
          <Link to="/push">Push Notification</Link>
          <Link to="/screen-2">Screen 2</Link>
          <Link to="/screen-3">Screen 3</Link>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;