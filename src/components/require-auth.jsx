/* eslint-disable react/prop-types */

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { UrlState } from "@/context";
import { BarLoader } from "react-spinners";

function RequireAuth({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, isAuthenticated } = UrlState();

  // detect short link like "/abc123"
  const isShortLink =
    location.pathname.split("/").filter(Boolean).length === 1;

  useEffect(() => {
    // only protect private pages
    if (!isAuthenticated && !loading && !isShortLink) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, location.pathname]);

  if (loading) return <BarLoader width={"100%"} color="#36d7b7" />;

  return children;
}

export default RequireAuth;
