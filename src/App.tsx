import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Advisor from './pages/Advisor'
import SalaryComparison from './pages/SalaryComparison'
import CVReviewer from './pages/CVReviewer'
import Networking from './pages/Networking'
import Resources from './pages/Resources'
import InterviewQuiz from './pages/InterviewQuiz'
import MeetingNotes from './pages/MeetingNotes'
import Learn from './pages/Learn'
import PracticeTests from './pages/PracticeTests'
import AISkills from './pages/AISkills'
import Dashboard from './pages/Dashboard'
import Capstone from './pages/Capstone'
import CareerComparison from './pages/CareerComparison'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-dark flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/advisor" element={<Advisor />} />
            <Route path="/salary-comparison" element={<SalaryComparison />} />
            <Route path="/cv-reviewer" element={<CVReviewer />} />
            <Route path="/networking" element={<Networking />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/interview-quiz" element={<InterviewQuiz />} />
            <Route path="/meeting-notes" element={<MeetingNotes />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/practice-tests" element={<PracticeTests />} />
            <Route path="/ai-skills" element={<AISkills />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn/capstone/:id" element={<Capstone />} />
            <Route path="/career-comparison" element={<CareerComparison />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
