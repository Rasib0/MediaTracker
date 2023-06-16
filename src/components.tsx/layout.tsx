import React, { ReactNode } from "react";
import Navbar from "./layout/navbar";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Navbar />
    <div>{props.children}</div>
  </div>
);

export default Layout;
