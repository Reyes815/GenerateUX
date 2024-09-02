import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Container } from "reactstrap";
import Sidebar from "./Sidebar";
import BpmnDiagram from "./Diagram_Editor";

const FullLayout = () => {
  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        {/********Content Area**********/}
        <div className="contentArea">
          {/********header**********/}
          <Header />
          {/********Header End**********/}
          <BpmnDiagram/>
          {/********Sidebar**********/}
          {/* <aside className="sidebarArea shadow" id="sidebarArea">
            <Sidebar />
          </aside> */}

          {/********Sidebar End**********/}
          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
