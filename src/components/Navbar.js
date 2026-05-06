import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark" >
        <div className="container-fluid ">
          <Link className="navbar-brand" to="/">NewsMonkey</Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="navbarSupportedContent"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li> */}
              {/* <li className="nav-item" ><Link className="nav-link" to="/about">About</Link></li> */}
              <li className="nav-item"><Link className="nav-link" to="/technology" onClick={() => setIsOpen(false)}>Technology</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/business" onClick={() => setIsOpen(false)}>Business</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/entertainment" onClick={() => setIsOpen(false)}>Entertainment</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/general" onClick={() => setIsOpen(false)}>General</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/health" onClick={() => setIsOpen(false)}>Health</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/science" onClick={() => setIsOpen(false)}>Science</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/sports" onClick={() => setIsOpen(false)}>Sports</Link></li>
              
            </ul>
          </div>
        </div>
      </nav>
    );
  
}

export default Navbar;