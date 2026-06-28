import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizQuestions } from '../data/quiz'

export default function Quiz() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion) / quizQuestions.length) * 100
  const isLast = currentQuestion === quizQuestions.length - 1

  const handleSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const handleNext = () => {
    if (selectedOption === null) return
    const newAnswers = { ...answers, [question.id]: selectedOption }
    setAnswers(newAnswers)

    if (isLast) {
      // Calculate scores
      const scores: Record<string, number> = {}
      quizQuestions.forEach(q => {
        const answerIndex = newAnswers[q.id]
        if (answerIndex !== undefined) {
          const option = q.options[answerIndex]
          if (option) {
            Object.entries(option.scores).forEach(([careerId, score]) => {
              scores[careerId] = (scores[careerId] || 0) + score
            })
          }
        }
      })
      localStorage.setItem('findr-quiz-scores', JSON.stringify(scores))
      navigate('/results')
    } else {
      setCurrentQuestion(prev => prev + 1)
      setSelectedOption(null)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      const prevAnswer = answers[quizQuestions[currentQuestion - 1].id]
      setSelectedOption(prevAnswer !== undefined ? prevAnswer : null)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Career <span className="text-gradient-gold">Personality Quiz</span>
          </h1>
          <p className="text-gray-400 text-sm">Find the finance career that matches your goals and personality</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-gold to-brand-teal rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-brand-card border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 animate-fade-in">
          <h2 className="text-white font-bold text-lg sm:text-xl mb-6 leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedOption === i
                    ? 'border-brand-gold bg-brand-gold/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                    selectedOption === i
                      ? 'border-brand-gold bg-brand-gold'
                      : 'border-white/20'
                  }`}>
                    {selectedOption === i && (
                      <div className="w-2 h-2 bg-black rounded-full" />
                    )}
                  </div>
                  <span className="text-sm leading-relaxed">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="px-6 py-2.5 bg-brand-gold text-black font-bold text-sm rounded-xl hover:bg-brand-gold2 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
          >
            {isLast ? 'See My Results →' : 'Next Question →'}
          </button>
        </div>

        {/* Question dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {quizQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < currentQuestion
                  ? 'bg-brand-gold'
                  : i === currentQuestion
                  ? 'bg-brand-teal w-4'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
