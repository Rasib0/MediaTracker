import React, { type ReactNode } from "react";
import { Navbar } from "./layout/navbar";
import { type currentPage } from "../common/types";

type Props = {
  children: ReactNode;
  currentPage: currentPage;
  maxWidth?: string;
};

const Layout = (props: Props) => (
  <div>
    <Navbar currentPage={props.currentPage} />
    <main className=" flex justify-center">
      <div className={`h-full min-h-screen w-full border-x border-slate-700 ${props.maxWidth ?? "md:max-w-7xl"}`}>
        {props.children}
      </div>
    </main>
  </div>
);

export default Layout;
