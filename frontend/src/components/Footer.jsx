import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import HashLoader from "react-spinners/HashLoader";
import { useDispatch } from "react-redux";
import { showLoginModal, showSignModal } from "../reducers/authSlice";

export const Footer = () => {
  const [locationData, setLocationData] = useState([
    { location_details: "Naya Baneshwor, Kathmandu, Nepal" },
    { location_details: "Aadarshnagar, Birgunj" }
  ]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  let pageName;
  const location = useLocation();

  location.pathname === "/" ? (pageName = "home") : (pageName = "");

  const locations = locationData.map((location, idx) => {
    return (
      <p key={idx} className="address">
        {location.location_details}
      </p>
    );
  });

  return (
    <section className="section-footer container">
      {pageName === "home" ? (
        <HashLink className="footer-logo-container" to="#headerTop">
          
          <h1 className="footer-logo-text">FlimFusion</h1>
        </HashLink>
      ) : (
        <Link className="footer-logo-container" to="/">
          
          <h1 className="footer-logo-text">FlimFusion</h1>
        </Link>
      )}

      <div className="footer-link-container foot-reg">
        <button
          className="footer-btn"
          onClick={() => {
            dispatch(showSignModal());
          }}
        >
          Create account
        </button>
      </div>

      <div className="footer-link-container">
        <button
          className="footer-btn"
          onClick={() => {
            dispatch(showLoginModal());
          }}
        >
          Sign in
        </button>
      </div>

      <div className="footer-link-container">
        <Link className="footer-link" to="/aboutus">
          About us
        </Link>
      </div>

      <h3 className="footer-heading">Our Theatres</h3>

      <p className="copyright">
        Copyright &copy; 2023 by Aaditya Binod Yadav, Aastha Pandey, Ujashna Dangol, Inc. This work is licensed under
        the terms of the{" "}
        <a href="https://www.gnu.org/licenses/gpl-3.0.html">
          GNU General Public License, version 3 or later (GPL-3.0-or-later)
        </a>
        .
      </p>

      <div className="footer-address-container">
        {loading ? <HashLoader color="#eb3656" /> : locations}
      </div>
    </section>
  );
};
