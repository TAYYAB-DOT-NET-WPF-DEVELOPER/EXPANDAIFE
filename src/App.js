import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import TechnicalProposal from "./pages/TechnicalProposal";
import TechnicalProposalPreview from "./pages/TechnicalProposalPreview";
import SelectTemplate from "./pages/SelectTemplate";
import Footer from "./components/Footer";
import ProposalsPage from "./pages/ProposalsPage";
import TemplatesPage from "./pages/TemplatesPage";
import FinancialProposal from "./pages/FinancialProposal";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/technical-proposal" element={<TechnicalProposal />} />
        <Route path="/technical-proposal-preview" element={<TechnicalProposalPreview />} />
        <Route path="/select-template" element={<SelectTemplate />} />
        <Route path="/proposals" element={<ProposalsPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/financial-proposal" element={<FinancialProposal />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
