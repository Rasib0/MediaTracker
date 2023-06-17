import React, { ReactNode } from "react";
import Navbar from "./layout/navbar";

type Props = {
  children: ReactNode;
  currentPath: string;
};

const Layout = (props: Props) => (
  <div>
    <Navbar current_path={props.currentPath} />
    <div>{props.children}</div>
  </div>
);

export default Layout;
