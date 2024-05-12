import React from "react";
import { Route, Routes } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import MenuBar from "./MenuBar";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import {ObjectDetail} from "../pages/ObjectDetail";

const Layout = () => {
  return (
    <CustomGrid>
      <MenuBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/detail" element={<ObjectDetail pieceId={78}/>} />
      </Routes>
    </CustomGrid>
  );
};

const CustomGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  minHeight: theme.spacing(100),
}));

export default Layout;
