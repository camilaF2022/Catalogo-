import React from "react";
import { Route, Routes } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import MenuBar from "./MenuBar";
import NotFound from "./NotFound";
import { Home, Login, Gallery, CreateItem } from "../pages";
import useToken from "../hooks/useToken";

const Layout = () => {
  const { token, setToken } = useToken();

  const isAuthenticated = !!token;

  return (
    <CustomGrid>
      <MenuBar loggedIn={isAuthenticated} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/gallery"
          element={<Gallery loggedIn={isAuthenticated} />}
        />
        {/* Private routes */}
        <Route
          path="/gallery/new"
          element={
            isAuthenticated ? (
              <CreateItem />
            ) : (
              <Login setToken={setToken} navigateTo="/gallery/new" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CustomGrid>
  );
};

const CustomGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  minHeight: theme.spacing(103),
}));

export default Layout;
