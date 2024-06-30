import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import MenuBar from "./MenuBar";
import NotFound from "./NotFound";
import { useToken } from "../hooks/useToken";
import { CircularProgress } from "@mui/material";

// Lazy-loaded components
const Home = lazy(() => import("../pages/Home/Home"));
const Login = lazy(() => import("../pages/Login/Login"));
const Gallery = lazy(() => import("../pages/Gallery/Gallery"));
const CreateItem = lazy(() => import("../pages/Gallery/CreateItem"));
const ObjectDetail = lazy(() => import("../pages/ObjectDetail/ObjectDetail"));
const EditForm = lazy(() =>
  import("../pages/ObjectDetail/components/EditForm")
);

const PrivateRouteWrapper = () => {
  const { token } = useToken();
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const Layout = () => {
  return (
    <CustomGrid>
      <MenuBar />
      <Suspense
        fallback={
          <LoadingSpinner>
            <CircularProgress />
          </LoadingSpinner>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalog" element={<Gallery />} />
          <Route path="/catalog/:pieceId" element={<ObjectDetail />} />
          <Route element={<PrivateRouteWrapper />}>
            <Route path="/catalog/new" element={<CreateItem />} />
            <Route path="/catalog/:pieceId/edit" element={<EditForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </CustomGrid>
  );
};

const CustomGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  minHeight: "100vh",
}));

const LoadingSpinner = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "50vh",
}));

export default Layout;
