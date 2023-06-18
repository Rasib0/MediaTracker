import React, { ReactNode } from "react";
import Navbar from "./layout/navbar";
import { currentPage } from "../common/types";

type Props = {
  children: ReactNode;
  currentPage: currentPage;
};

const Layout = (props: Props) => (
  <div>
    <Navbar currentPage={props.currentPage} />
    <div>{props.children}</div>
  </div>
);

export default Layout;