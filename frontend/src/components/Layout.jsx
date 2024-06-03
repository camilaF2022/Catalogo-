import React from "react";
import { Route, Routes } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import MenuBar from "./MenuBar";
import NotFound from "./NotFound";
import { Home, Login, Gallery, CreateItem, ObjectDetail } from "../pages";
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
          path="/catalog"
          element={<Gallery loggedIn={isAuthenticated} />}
        />
        <Route
          path="/catalog/:pieceId"
          element={<ObjectDetail loggedIn={isAuthenticated} />}
        />
        {/* Private routes */}
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

const CustomGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  minHeight: theme.spacing(103),
}));

export default Layout;
