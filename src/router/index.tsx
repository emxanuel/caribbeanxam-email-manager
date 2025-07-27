import { lazy } from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";

const EmailManager = lazy(() => import("@/pages/home"));

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<EmailManager />} />
    </>
  )
);
