import React from "react";
import { Route, Routes } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import MenuBar from "./MenuBar";
import NotFound from "./NotFound";
import { Home, Login, Gallery, CreateItem, ObjectDetail } from "../pages";
import useToken from "../hooks/useToken";

/**
 * Layout Component
 *
 * This component represents the main layout of the application.
 * It renders a MenuBar and sets up routing using React Router.
 */

const Layout = () => {

  // Retrieve token state and setter function from useToken custom hook
  const { token, setToken } = useToken();

  // Check if user is authenticated based on presence of token, which changes the Menu Bar
  const isAuthenticated = !!token;

  return (
    <CustomGrid>
      {/* Render the MenuBar component with authentication status */}
      <MenuBar loggedIn={isAuthenticated} setToken={setToken} />
      
      {/* Setup routes for different paths */}
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/catalog"
          element={<Gallery loggedIn={isAuthenticated} />}
        />
        <Route
          path="/catalog/:pieceId"
          element={<ObjectDetail loggedIn={isAuthenticated} />}
        />
        {/* Private routes, must be authenticated to access */}
        <Route
          path="/catalog/new"
          element={
            isAuthenticated ? (
              <CreateItem />
            ) : (
              <Login setToken={setToken} navigateTo="/catalog/new" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CustomGrid>
  );
};

// Styled component for the main grid layout
const CustomGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  minHeight: '100vh',
}));

export default Layout;
