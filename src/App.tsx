import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Jobs from "./pages/job/jobs";
import CreateJobForm from "./pages/job/addjobs";
import JobDetailsPage from "./pages/job/jobDetailsPage";
import "react-datepicker/dist/react-datepicker.css";
import SkillsTable from "./pages/Tables/SkillsTable";
import CertificationTable from "./pages/Tables/CertificationsTable";
import FicheListPage from "./components/Job/Fiche/FicheListPage";
import CreateFicheForm from "./components/Job/Fiche/CreateFicheForm";
import FicheDetailsPage from "./components/Job/Fiche/FicheDetailsPage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/cv-profile/:cvId" element={<UserProfiles />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
                        <Route path="/fiches/:id" element={<FicheDetailsPage />} />

                        <Route path= "/skills" element={<SkillsTable />} />
                                                <Route path= "/certifications" element={<CertificationTable />} />

<Route path="/FicheListPage" element={<FicheListPage />} />
<Route path="/fiches/new" element={<CreateFicheForm />} />

            
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/Jobs" element={<Jobs />} />
            <Route path="/:id/Jobs" element={<Jobs />} />

            <Route path="/add-job" element={<CreateJobForm />} />
            <Route path="/:id/add-job" element={<CreateJobForm />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
