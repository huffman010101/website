import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

type Q = { q: string; type: string; tips: string }

const questionBank: Q[] = [
  { q: 'Tell me about yourself.', type: 'Motivation', tips: 'Past → present → future in 90 seconds. End pointing at this firm.' },
  { q: 'Why do you want to work in this industry?', type: 'Motivation', tips: 'Two or three genuine reasons plus evidence you understand the downsides.' },
  { q: 'Why our firm specifically?', type: 'Motivation', tips: 'Firm-specific facts. If it could be pasted to a competitor, it fails.' },
  { q: 'Why should we choose you over other candidates?', type: 'Motivation', tips: 'Rule of three — three differentiators, each with one line of evidence.' },
  { q: 'Tell me about a time you worked in a team.', type: 'Behavioural', tips: 'Pick a story with friction. Use "I", not "we". Land a quantified result.' },
  { q: 'Tell me about a time you failed.', type: 'Behavioural', tips: 'A real failure, owned without excuses, plus the specific change you made after.' },
  { q: 'Describe a time you led others.', type: 'Behavioural', tips: 'Separate your role from the team\'s. Show one moment you made the team better.' },
  { q: 'Tell me about a time you worked under pressure.', type: 'Behavioural', tips: 'Show a system — prioritisation, delegation, communication — not just survival.' },
  { q: 'Describe a time you showed initiative.', type: 'Behavioural', tips: 'Something nobody asked you to do. Your own finance prep counts.' },
  { q: 'Tell me about a recent news story that interested you.', type: 'Commercial', tips: 'What happened → why it matters → your view → what would change your mind.' },
  { q: 'What are your greatest strengths and weaknesses?', type: 'Behavioural', tips: 'Real weakness plus the concrete steps you are taking. No "I work too hard".' },
  { q: 'Where do you see yourself in five years?', type: 'Motivation', tips: 'Show direction and commitment without sounding rigid or entitled.' },
  { q: 'What do you think this role actually involves day to day?', type: 'Motivation', tips: 'Proves you researched the job, not just the brand.' },
  { q: 'How do you handle criticism or feedback?', type: 'Behavioural', tips: 'Give a specific example where feedback changed what you did next.' },
  { q: 'What is your biggest achievement to date?', type: 'Behavioural', tips: 'Pick something with a measurable outcome and explain why it mattered to you.' },
]

const reviewChecklist = [
  'Did I answer the question in the first sentence?',
  'Did I look at the lens (not my own face) most of the time?',
  'Was it between 60 and 120 seconds?',
  'Did I use specific numbers, names or outcomes?',
  'Did I avoid filler words (um, like, sort of)?',
  'Did my energy read as engaged rather than flat?',
  'Did I use "I" more than "we" in a behavioural answer?',
  'Would I remember this answer if I heard eight of them?',
]

const setupTips = [
  'Camera at eye level — stack books under a laptop. Looking down at the camera is the most common self-inflicted mistake.',
  'Light in front of you, never behind. A window you face beats any lamp behind you.',
  'Plain background, door shut, phone on silent, housemates warned.',
  'Look at the LENS while answering, not at yourself on screen — that is what reads as eye contact to the viewer.',
  'Talking to a camera feels dead, so deliberately add about 20% more energy than feels natural. It lands as normal on playback.',
  'Use the prep time to jot 3 bullet beats on paper — allowed and expected. Never try to script full sentences.',
  'Dress exactly as you would for a live interview. It changes how you sit and speak, not just how you look.',
]

function fmt(s: number) {
  return `0:${s.toString().padStart(2, '0')}`
}

export default function VideoPractice() {
  const [prepSecs, setPrepSecs] = useState(30)
  const [answerSecs, setAnswerSecs] = useState(120)
  const [phase, setPhase] = useState<'setup' | 'prep' | 'recording' | 'review'>('setup')
  const [question, setQuestion] = useState<Q | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(0)

  const liveRef = useRef<HTMLVideoElement>(null)
  const playbackRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function clearTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  // Release camera and any object URL when leaving the page
  useEffect(() => () => {
    clearTimer()
    stopStream()
    if (videoUrl) URL.revokeObjectURL(videoUrl)
  }, [videoUrl])

  async function start() {
    setError(null)
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Your browser does not support in-page video recording. Chrome or Edge on desktop works best.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (liveRef.current) {
        liveRef.current.srcObject = stream
        liveRef.current.play().catch(() => {})
      }
      if (videoUrl) { URL.revokeObjectURL(videoUrl); setVideoUrl(null) }
      setQuestion(questionBank[Math.floor(Math.random() * questionBank.length)])
      setPhase('prep')
      setTimeLeft(prepSecs)
      clearTimer()
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearTimer(); beginRecording(); return 0 }
          return t - 1
        })
      }, 1000)
    } catch {
      setError('Camera/microphone access was blocked. Allow access in your browser settings, then try again.')
    }
  }

  function beginRecording() {
    const stream = streamRef.current
    if (!stream) return
    chunksRef.current = []
    let recorder: MediaRecorder
    try {
      recorder = new MediaRecorder(stream)
    } catch {
      setError('Recording could not start in this browser.')
      return
    }
    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || 'video/webm' })
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
      stopStream()
      setCompleted(c => c + 1)
      setPhase('review')
    }
    recorderRef.current = recorder
    recorder.start()
    setPhase('recording')
    setTimeLeft(answerSecs)
    clearTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearTimer(); stopRecording(); return 0 }
        return t - 1
      })
    }, 1000)
  }

  function stopRecording() {
    clearTimer()
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop()
  }

  function quit() {
    clearTimer()
    stopRecording()
    stopStream()
    setPhase('setup')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Video Interview Practice</h1>
        <p className="text-gray-400">A HireVue simulator: a random question, a prep countdown, then a timed recording to camera. Everything stays in your browser — nothing is uploaded or saved anywhere.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* SETUP */}
      {phase === 'setup' && (
        <div className="space-y-6">
          <div className="bg-brand-card border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-4">Set your timings</h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Prep time</p>
                <div className="flex gap-2">
                  {[20, 30, 60].map(s => (
                    <button key={s} onClick={() => setPrepSecs(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${prepSecs === s ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                      {s}s
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Answer time</p>
                <div className="flex gap-2">
                  {[60, 90, 120, 180].map(s => (
                    <button key={s} onClick={() => setAnswerSecs(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${answerSecs === s ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                      {s}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={start} className="w-full py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
              🎥 Start Practice Question
            </button>
            <p className="text-gray-600 text-xs mt-3 text-center">
              Your browser will ask for camera and microphone access. Recording happens locally and is discarded when you leave the page.
              {completed > 0 && <span className="text-brand-teal"> · {completed} answered this session</span>}
            </p>
          </div>

          <div className="bg-brand-card border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-3">Setup that changes your score</h2>
            <ul className="space-y-2">
              {setupTips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                  <span className="text-brand-teal mt-0.5 flex-shrink-0">✓</span> {t}
                </li>
              ))}
            </ul>
            <p className="text-gray-500 text-xs mt-4">
              Full technique and model answers are in <Link to="/interview-guide" className="text-brand-gold hover:underline">Interview Mastery</Link>; type-and-score practice is in the <Link to="/interview-quiz" className="text-brand-gold hover:underline">Interview Quiz</Link>.
            </p>
          </div>
        </div>
      )}

      {/* PREP + RECORDING */}
      {(phase === 'prep' || phase === 'recording') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={quit} className="text-gray-500 hover:text-white text-sm">✕ Quit</button>
            <div className={`font-mono font-bold text-2xl px-5 py-2 rounded-lg ${
              phase === 'recording' ? 'bg-red-500/15 text-red-400' : 'bg-brand-gold/15 text-brand-gold'
            }`}>
              {phase === 'recording' && <span className="mr-2">●</span>}{fmt(timeLeft)}
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              {phase === 'prep' ? 'Prepare' : 'Recording'}
            </span>
          </div>

          <div className="bg-brand-card border border-white/10 rounded-2xl p-6">
            <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-2">{question?.type}</p>
            <h2 className="text-xl font-bold text-white leading-relaxed">{question?.q}</h2>
            {phase === 'prep' && <p className="text-gray-500 text-sm mt-3">💡 {question?.tips}</p>}
          </div>

          <video ref={liveRef} muted playsInline className="w-full rounded-2xl bg-black aspect-video object-cover" />

          {phase === 'prep' ? (
            <>
              <p className="text-gray-400 text-sm text-center">Jot 3 bullet beats on paper. Recording starts automatically when the timer hits zero.</p>
              <button onClick={() => { clearTimer(); beginRecording() }} className="w-full py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
                Start recording now →
              </button>
            </>
          ) : (
            <button onClick={stopRecording} className="w-full py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 transition-colors">
              ■ Stop & Review
            </button>
          )}
        </div>
      )}

      {/* REVIEW */}
      {phase === 'review' && (
        <div className="space-y-4">
          <div className="bg-brand-card border border-white/10 rounded-2xl p-5">
            <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-1">{question?.type}</p>
            <h2 className="text-lg font-bold text-white">{question?.q}</h2>
          </div>

          {videoUrl && <video ref={playbackRef} src={videoUrl} controls playsInline className="w-full rounded-2xl bg-black aspect-video" />}

          <div className="bg-brand-card border border-brand-gold/20 rounded-2xl p-6">
            <h3 className="text-brand-gold font-bold mb-1">Score yourself honestly</h3>
            <p className="text-gray-500 text-xs mb-4">Watching yourself back is uncomfortable and is the single fastest way to improve. Check each one.</p>
            <ul className="space-y-2">
              {reviewChecklist.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-gray-600 mt-0.5 flex-shrink-0">☐</span> {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={start} className="flex-1 py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
              🎥 Next Question
            </button>
            <button onClick={() => setPhase('setup')} className="px-6 py-4 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Done
            </button>
          </div>
          <p className="text-gray-600 text-xs text-center">This recording is discarded as soon as you move on — it never leaves your device.</p>
        </div>
      )}
    </div>
  )
}
