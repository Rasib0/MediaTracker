import React, { ReactNode } from "react";
import Header from "./layout components/Header"

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header/>
    <div className="layout">{props.children}</div>
    <style jsx global>{`
      html {
        box-sizing: border-box;
      }
      body {
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
      }
      input, textarea {
        font-size: 16px;
      }

      button {
        cursor: pointer;
      }
    `}</style>
   </div>
);

export default Layout;
