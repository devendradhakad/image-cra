import React from "react";
import Footer from "../Footer";
import Header from "../Header";
import MainContainer from "../MainContainer";
/**
 *
 * @returns UI with Header, Footer and Main Container
 */
export default function RootContainer() {
  return (
    <div className="main-wrap">
      <div>
        <Header />
      </div>
      <div className="main-wrap">
        <MainContainer />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
