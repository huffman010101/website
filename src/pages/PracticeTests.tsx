import { useState, useEffect, useRef } from 'react'

type TestQuestion = {
  prompt: string
  context?: string
  shapes?: string
  options: string[]
  answer: string
  explanation: string
}

type TestCategory = {
  id: string
  title: string
  icon: string
  color: string
  border: string
  description: string
  secondsPerQuestion: number
  tip: string
  questions: TestQuestion[]
}

const testCategories: TestCategory[] = [
  {
    id: 'numerical',
    title: 'Numerical Reasoning',
    icon: '🔢',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    description: 'Percentages, ratios and data interpretation — the SHL-style tables and charts banks actually send you.',
    secondsPerQuestion: 75,
    tip: 'Real tests allow a calculator — but the winners estimate first, then verify. Learn percentage shortcuts: 15% of 240 = 10% (24) + 5% (12) = 36.',
    questions: [
      {
        context: 'A fund\'s value grows from £2.4m to £3.0m over one year.',
        prompt: 'What is the percentage increase?',
        options: ['20%', '25%', '30%', '60%'],
        answer: '25%',
        explanation: 'Increase = 0.6m. 0.6 ÷ 2.4 = 0.25 = 25%. Always divide the change by the ORIGINAL value.',
      },
      {
        context: 'Company revenue: 2021: £480m · 2022: £552m · 2023: £600m.',
        prompt: 'In which year was percentage growth higher, and what was it?',
        options: ['2022, at 15%', '2023, at 15%', '2022, at 13%', '2023, at 8.7%'],
        answer: '2022, at 15%',
        explanation: '2022: 72 ÷ 480 = 15%. 2023: 48 ÷ 552 ≈ 8.7%. Growth on a bigger base needs a bigger absolute rise.',
      },
      {
        context: 'A portfolio is split equities : bonds : cash in the ratio 5 : 3 : 2. The portfolio is worth £1.8m.',
        prompt: 'How much is held in bonds?',
        options: ['£360,000', '£540,000', '£600,000', '£900,000'],
        answer: '£540,000',
        explanation: 'Ratio parts total 10, so each part = £180k. Bonds = 3 parts = £540k.',
      },
      {
        prompt: 'A trader buys shares at £8.00 and sells at £9.20, paying 0.5% commission on each transaction (on transaction value). Approximate net profit per share?',
        options: ['£1.20', '£1.11', '£1.16', '£1.03'],
        answer: '£1.11',
        explanation: 'Gross profit £1.20. Commissions: 0.5% × 8.00 = 4p + 0.5% × 9.20 = 4.6p → 8.6p total. Net ≈ £1.11.',
      },
      {
        context: 'An analyst\'s bonus is 40% of base salary. Base salary is £65,000.',
        prompt: 'What is total compensation?',
        options: ['£91,000', '£105,000', '£26,000', '£89,000'],
        answer: '£91,000',
        explanation: 'Bonus = 0.4 × 65,000 = £26,000. Total = 65,000 + 26,000 = £91,000.',
      },
      {
        context: 'GDP data: Country A: $2.0tn growing at 3%. Country B: $1.6tn growing at 5%.',
        prompt: 'Approximately how much does each economy add next year?',
        options: ['A: $60bn, B: $80bn', 'A: $80bn, B: $60bn', 'A: $60bn, B: $60bn', 'A: $30bn, B: $50bn'],
        answer: 'A: $60bn, B: $80bn',
        explanation: 'A: 3% × 2,000bn = $60bn. B: 5% × 1,600bn = $80bn. The smaller, faster economy adds more in absolute terms here.',
      },
      {
        prompt: 'An investment falls 20% in year one, then rises 20% in year two. Overall it is:',
        options: ['Back to its starting value', 'Down 4%', 'Up 4%', 'Down 2%'],
        answer: 'Down 4%',
        explanation: '100 → 80 → 96. The 20% recovery applies to the smaller base. This asymmetry of losses is a classic test (and investing) trap.',
      },
      {
        context: 'Exchange rate: £1 = $1.25. A UK firm invoices a US client $150,000.',
        prompt: 'How much does the firm receive in pounds?',
        options: ['£187,500', '£120,000', '£150,000', '£112,500'],
        answer: '£120,000',
        explanation: '$150,000 ÷ 1.25 = £120,000. Dividing by the rate converts dollars into (fewer) pounds — sanity-check the direction.',
      },
      {
        context: 'A company\'s costs are 70% of revenue. Revenue rises 10% while costs rise only 5%.',
        prompt: 'If revenue was £100m, what is the new profit?',
        options: ['£30m', '£33m', '£36.5m', '£40m'],
        answer: '£36.5m',
        explanation: 'New revenue £110m; new costs 70 × 1.05 = £73.5m. Profit = 110 − 73.5 = £36.5m — up 21.7% from £30m. Operating leverage in action.',
      },
      {
        prompt: 'A bond pays a £45 annual coupon and trades at £900. Its current yield is:',
        options: ['4.5%', '5.0%', '5.5%', '9.0%'],
        answer: '5.0%',
        explanation: 'Current yield = coupon ÷ price = 45 ÷ 900 = 5%. Buying below face value lifts the yield above the 4.5% coupon rate.',
      },
      {
        context: 'Team A of 4 analysts completes a model in 6 days.',
        prompt: 'Working at the same rate, how long would 3 analysts take?',
        options: ['4.5 days', '7 days', '8 days', '9 days'],
        answer: '8 days',
        explanation: 'Total work = 4 × 6 = 24 analyst-days. 24 ÷ 3 = 8 days. Inverse proportion — fewer people, proportionally longer.',
      },
      {
        context: 'A fund charges a 2% management fee. An investor puts in £250,000 and the gross return is 8%.',
        prompt: 'Roughly what is the investor\'s net gain after the fee (fee charged on invested capital)?',
        options: ['£20,000', '£15,000', '£10,000', '£5,000'],
        answer: '£15,000',
        explanation: 'Gross gain 8% × 250k = £20k. Fee 2% × 250k = £5k. Net = £15k — the fee ate a quarter of the return.',
      },
    ],
  },
  {
    id: 'verbal',
    title: 'Verbal Reasoning',
    icon: '📖',
    color: 'text-green-400',
    border: 'border-green-500/30',
    description: 'Read a passage, then judge statements as True, False, or Cannot Say — using ONLY the passage.',
    secondsPerQuestion: 60,
    tip: 'The #1 trap: using outside knowledge. If the passage doesn\'t state or directly imply it, the answer is Cannot Say — even if you know it\'s true in real life.',
    questions: [
      {
        context: 'Passage: "The central bank raised interest rates by 0.5% in response to inflation reaching 8%. Analysts had expected a smaller rise of 0.25%. Following the announcement, the currency strengthened against the dollar."',
        prompt: 'Statement: The rate rise was larger than analysts expected.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'The passage states analysts expected 0.25% and the bank delivered 0.5% — directly supported.',
      },
      {
        context: 'Passage: "The central bank raised interest rates by 0.5% in response to inflation reaching 8%. Analysts had expected a smaller rise of 0.25%. Following the announcement, the currency strengthened against the dollar."',
        prompt: 'Statement: The currency strengthened because of the rate rise.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'The passage says the currency strengthened FOLLOWING the announcement — sequence, not proven causation. Classic verbal reasoning trap.',
      },
      {
        context: 'Passage: "Firm X\'s graduate scheme receives over 50,000 applications for roughly 400 places. Successful candidates typically complete three interview rounds and a numerical assessment. The firm states that academic background is only one of several criteria it considers."',
        prompt: 'Statement: Fewer than 1% of applicants receive a place.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: '400 ÷ 50,000 = 0.8%, which is below 1%. The passage supports this arithmetically.',
      },
      {
        context: 'Passage: "Firm X\'s graduate scheme receives over 50,000 applications for roughly 400 places. Successful candidates typically complete three interview rounds and a numerical assessment. The firm states that academic background is only one of several criteria it considers."',
        prompt: 'Statement: Candidates with poor grades are never hired.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'The firm says academics are "one of several criteria" — that neither confirms nor rules out hiring candidates with poor grades.',
      },
      {
        context: 'Passage: "Index funds now account for over half of US equity fund assets. Their fees average below 0.1%, compared with roughly 0.7% for active funds. Some researchers argue this shift reduces the amount of price discovery in markets, though others dispute the effect is significant."',
        prompt: 'Statement: Researchers agree that index funds harm price discovery.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'The passage explicitly says others DISPUTE the effect — so "researchers agree" is contradicted by the text.',
      },
      {
        context: 'Passage: "Index funds now account for over half of US equity fund assets. Their fees average below 0.1%, compared with roughly 0.7% for active funds. Some researchers argue this shift reduces the amount of price discovery in markets, though others dispute the effect is significant."',
        prompt: 'Statement: Active funds charge roughly seven times more than index funds on average.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: '0.7% vs below 0.1% — roughly seven times (or more). Supported by the passage\'s own figures.',
      },
      {
        context: 'Passage: "The merger was approved by shareholders of both companies in March. Regulators in two of the three required jurisdictions have granted clearance. The companies expect completion by year end, subject to remaining approvals."',
        prompt: 'Statement: The merger has completed.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'Completion is "expected by year end, subject to remaining approvals" — one jurisdiction is still outstanding, so it has not completed.',
      },
      {
        context: 'Passage: "The merger was approved by shareholders of both companies in March. Regulators in two of the three required jurisdictions have granted clearance. The companies expect completion by year end, subject to remaining approvals."',
        prompt: 'Statement: The third regulator will block the merger.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'The passage gives no information about the third regulator\'s likely decision — only that it hasn\'t yet cleared.',
      },
      {
        context: 'Passage: "Hedge fund launches fell to a decade low last year, while closures exceeded launches for the third consecutive year. Industry assets nonetheless reached a record high, driven by performance gains at existing funds and inflows to the largest managers."',
        prompt: 'Statement: The number of hedge funds is shrinking while industry assets are growing.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Closures exceeding launches for three years means fewer funds; record assets means growth. Both are stated — consolidation into bigger funds.',
      },
    ],
  },
  {
    id: 'logical',
    title: 'Logical & Abstract Reasoning',
    icon: '🔷',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    description: 'The infamous shape-sequence tests: find the pattern, predict what comes next.',
    secondsPerQuestion: 45,
    tip: 'Check patterns systematically: count of shapes, rotation, alternation, size, position, and combinations. If stuck, eliminate options that break an obvious rule and guess — never leave blanks.',
    questions: [
      {
        shapes: '●  ○  ●  ○  ●  ?',
        prompt: 'What comes next in the sequence?',
        options: ['●', '○', '◆', '■'],
        answer: '○',
        explanation: 'Simple alternation: filled, empty, filled, empty... Next must be empty ○.',
      },
      {
        shapes: '▲  ▲▲  ▲▲▲  ▲▲▲▲  ?',
        prompt: 'What comes next?',
        options: ['▲▲▲', '▲▲▲▲', '▲▲▲▲▲', '▲'],
        answer: '▲▲▲▲▲',
        explanation: 'The count increases by one each step: 1, 2, 3, 4 → 5 triangles.',
      },
      {
        shapes: '◐  ◓  ◑  ◒  ?',
        prompt: 'The half-filled circle rotates each step. What comes next?',
        options: ['◐', '◓', '◑', '◒'],
        answer: '◐',
        explanation: 'The fill rotates 90° clockwise each step (left, top, right, bottom). After bottom it returns to left: ◐.',
      },
      {
        shapes: '■ ●  |  ● ■  |  ■ ●  |  ?',
        prompt: 'What comes next?',
        options: ['■ ●', '● ■', '■ ■', '● ●'],
        answer: '● ■',
        explanation: 'The pair swaps positions each step. After ■●, the next is ●■.',
      },
      {
        shapes: '○  ◔  ◑  ◕  ?',
        prompt: 'The circle fills progressively. What comes next?',
        options: ['●', '○', '◔', '◑'],
        answer: '●',
        explanation: 'Fill increases by a quarter each step: empty, quarter, half, three-quarters → full ●.',
      },
      {
        shapes: '△ △ ▲  |  □ □ ■  |  ○ ○ ?',
        prompt: 'Each group follows the same rule. What completes the third group?',
        options: ['○', '●', '△', '■'],
        answer: '●',
        explanation: 'Each group is: empty, empty, filled version of the same shape. So the circles end with a filled ●.',
      },
      {
        shapes: '★ 1  |  ★★ 2  |  ★★★★ 3  |  ★★★★★★★★ 4  |  ? 5',
        prompt: 'How many stars are in the 5th group?',
        options: ['10', '12', '16', '9'],
        answer: '16',
        explanation: 'Stars double each step: 1, 2, 4, 8 → 16. Geometric, not arithmetic, progression.',
      },
      {
        shapes: '◆ ■ ●  |  ■ ● ◆  |  ● ◆ ■  |  ?',
        prompt: 'What comes next?',
        options: ['◆ ■ ●', '● ■ ◆', '■ ◆ ●', '◆ ● ■'],
        answer: '◆ ■ ●',
        explanation: 'Each shape shifts one position left, with the first wrapping to the end. After three steps the cycle returns to the start: ◆ ■ ●.',
      },
      {
        shapes: '2 △  |  4 □  |  6 ⬠  |  8 ⬡  |  10 ?',
        prompt: 'The number and shape are linked. What shape accompanies 10?',
        options: ['A triangle', 'A circle', 'A seven-sided shape (heptagon)', 'A ten-sided shape'],
        answer: 'A seven-sided shape (heptagon)',
        explanation: 'Sides: 3, 4, 5, 6 — increasing by one while numbers rise by 2. Next: 7 sides. Track BOTH sequences independently.',
      },
      {
        shapes: '●○○  ○●○  ○○●  ○●○  ?',
        prompt: 'The filled circle moves. What comes next?',
        options: ['●○○', '○●○', '○○●', '●●●'],
        answer: '●○○',
        explanation: 'The dot bounces: position 1, 2, 3, 2 → back to 1. A "ping-pong" pattern rather than a loop.',
      },
      {
        shapes: '▲▽  ▽▲  ▲▽  ▽▲  ?',
        prompt: 'What comes next?',
        options: ['▲▽', '▽▲', '▲▲', '▽▽'],
        answer: '▲▽',
        explanation: 'Two states alternating: ▲▽, ▽▲, ▲▽, ▽▲ → ▲▽ again. Odd positions match the first state.',
      },
      {
        shapes: '① ▲  |  ② ▲▲  |  ③ ▲▲▲▲  |  ④ ▲▲▲▲▲▲▲',
        prompt: 'Triangles added each step: +1, +2, +3... How many triangles at step ⑤?',
        options: ['9', '10', '11', '12'],
        answer: '11',
        explanation: 'Counts: 1, 2, 4, 7 — differences of 1, 2, 3. Next difference is 4: 7 + 4 = 11. Second-order (accelerating) sequences are a favourite.',
      },
    ],
  },
  {
    id: 'sjt',
    title: 'Situational Judgement',
    icon: '🤔',
    color: 'text-orange-400',
    border: 'border-orange-500/30',
    description: 'Workplace scenarios — choose the MOST effective response. Tests judgement, integrity and professionalism.',
    secondsPerQuestion: 90,
    tip: 'Firms score against their values: integrity first, escalate appropriately, communicate early, never hide mistakes, and don\'t throw colleagues under the bus. Pick what a calm professional would actually do.',
    questions: [
      {
        context: 'You\'re an intern and you notice a significant error in a spreadsheet your manager already sent to a client.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Say nothing — it\'s your manager\'s responsibility now',
          'Tell your manager immediately and suggest a corrected version',
          'Email the client directly with a correction',
          'Fix it quietly in the file for next time',
        ],
        answer: 'Tell your manager immediately and suggest a corrected version',
        explanation: 'Speed and honesty, through the right channel. Hiding it risks the client acting on wrong numbers; going direct to the client bypasses your manager and makes things worse.',
      },
      {
        context: 'You have three urgent tasks from three different senior people, and you cannot finish all of them today.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Work through the night without telling anyone',
          'Do them in the order they were received',
          'Quickly clarify deadlines and priorities with the requesters, then flag the conflict',
          'Choose the task from the most senior person and ignore the others',
        ],
        answer: 'Quickly clarify deadlines and priorities with the requesters, then flag the conflict',
        explanation: 'Communicating conflicts early lets the seniors themselves resolve priorities — they usually don\'t know about each other\'s requests. Silent heroics fail unpredictably.',
      },
      {
        context: 'A colleague tells you confidential information about an upcoming deal that you are not part of, and suggests you could "make some money" trading the stock.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Trade a small amount so it isn\'t noticeable',
          'Decline, and report the conversation to compliance',
          'Decline but keep the conversation to yourself',
          'Ask a friend outside the firm to trade instead',
        ],
        answer: 'Decline, and report the conversation to compliance',
        explanation: 'This is insider dealing — a criminal offence. You must decline AND report it: staying silent makes you complicit if it surfaces later. Options 1 and 4 are crimes.',
      },
      {
        context: 'You realise you made a mistake in your own analysis two days ago. Nobody has noticed, and the presentation using it is tomorrow.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Tell your manager now, with the corrected numbers and impact',
          'Hope nobody notices — it may not matter',
          'Correct it silently and say nothing',
          'Mention it casually after the presentation',
        ],
        answer: 'Tell your manager now, with the corrected numbers and impact',
        explanation: 'Owning mistakes early with a solution attached is the single most valued junior behaviour. Silent fixes leave your manager presenting numbers they can\'t explain if questioned.',
      },
      {
        context: 'A client asks you a technical question in a meeting and you don\'t know the answer.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Give your best guess confidently',
          'Say you\'ll confirm the detail and follow up today — then do it',
          'Change the subject',
          'Refer them to your competitor',
        ],
        answer: 'Say you\'ll confirm the detail and follow up today — then do it',
        explanation: '"I\'ll confirm and come back to you" preserves credibility; a confident wrong answer destroys it. The follow-through is what actually builds trust.',
      },
      {
        context: 'Your team is celebrating a deal, but you notice a junior colleague has been excluded and looks upset — they did significant work on it.',
        prompt: 'What is the MOST effective response?',
        options: [
          'It\'s not your problem — enjoy the celebration',
          'Publicly criticise the team lead for excluding them',
          'Invite them along and make a point of crediting their work to the team',
          'Privately tell them office politics are just like that',
        ],
        answer: 'Invite them along and make a point of crediting their work to the team',
        explanation: 'Direct positive action fixes the situation without creating conflict. SJTs reward inclusion and credit-sharing — and punish both passivity and public confrontation.',
      },
      {
        context: 'It\'s 7pm, your work is done, but the rest of your team is staying late on a deadline that doesn\'t involve you.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Leave quietly — it\'s not your project',
          'Ask the team if you can help with anything before deciding',
          'Stay and look busy so you\'re seen at your desk',
          'Announce loudly that you\'ve finished everything',
        ],
        answer: 'Ask the team if you can help with anything before deciding',
        explanation: 'Offering genuine help shows team spirit; "presenteeism" (staying to be seen) impresses nobody. If they don\'t need you, leaving is fine — you asked.',
      },
      {
        context: 'A senior colleague repeatedly takes sole credit for analysis you produced. It\'s now affecting how others perceive your contribution.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Raise it directly but professionally with the colleague first',
          'Complain about them to other team members',
          'Stop producing good work for them',
          'Immediately escalate to HR',
        ],
        answer: 'Raise it directly but professionally with the colleague first',
        explanation: 'The professional sequence: address it directly first, escalate to your manager if it continues, HR after that. Gossip and work-to-rule damage you more than them.',
      },
    ],
  },
]

type View = 'home' | 'test' | 'results'

export default function PracticeTests() {
  const [view, setView] = useState<View>('home')
  const [category, setCategory] = useState<TestCategory | null>(null)
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  useEffect(() => stopTimer, [])

  function startTest(cat: TestCategory) {
    setCategory(cat)
    setQIndex(0)
    setAnswers(new Array(cat.questions.length).fill(null))
    setTimeLeft(cat.questions.length * cat.secondsPerQuestion)
    setView('test')
    stopTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopTimer()
          setView('results')
          return 0
        }
        return t - 1
      })
    }, 1000)
    window.scrollTo(0, 0)
  }

  function selectAnswer(opt: string) {
    setAnswers(prev => prev.map((a, i) => (i === qIndex ? opt : a)))
  }

  function finishTest() {
    stopTimer()
    setView('results')
    window.scrollTo(0, 0)
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // ===== HOME =====
  if (view === 'home' || !category) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Online Test Practice</h1>
          <p className="text-gray-400">Practise the psychometric tests banks and firms actually send — numerical, verbal, the shape puzzles, and situational judgement. Timed, scored, and every answer explained.</p>
        </div>

        <div className="bg-brand-card border border-brand-gold/20 rounded-xl p-5 mb-8">
          <h2 className="text-brand-gold font-bold mb-2">⚡ How firms use these tests</h2>
          <p className="text-gray-300 text-sm leading-relaxed">Almost every finance graduate scheme sends online assessments (SHL, Korn Ferry/Talent Q, Cappfinity, HireVue games) immediately after your application — often before a human ever sees your CV. They cut 50-80% of candidates. The good news: these tests are extremely learnable. Practise until the formats feel boring.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {testCategories.map(cat => (
            <div key={cat.id} className={`bg-brand-card border ${cat.border} rounded-2xl p-6 flex flex-col`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{cat.icon}</span>
                <h2 className={`text-lg font-black ${cat.color}`}>{cat.title}</h2>
              </div>
              <p className="text-gray-400 text-sm mb-4 flex-1">{cat.description}</p>
              <div className="text-xs text-gray-600 mb-4">
                {cat.questions.length} questions · {formatTime(cat.questions.length * cat.secondsPerQuestion)} time limit
              </div>
              <button
                onClick={() => startTest(cat)}
                className="w-full py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors"
              >
                Start Test →
              </button>
            </div>
          ))}
        </div>

        <div className="bg-brand-card border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-4">🎯 Test-day tactics that actually work</h2>
          <ul className="space-y-2.5">
            {[
              'Do the practice questions every provider offers before the real test — formats vary and familiarity is free marks.',
              'Use a proper calculator, pen and paper for numerical tests — mental-only maths under time pressure causes silly errors.',
              'Never leave blanks: most tests don\'t punish wrong answers, so eliminate and guess.',
              'For verbal reasoning: answer ONLY from the passage. Your outside knowledge is the trap.',
              'For logical tests: check count → rotation → alternation → size → position, in that order.',
              'For SJTs: research the firm\'s stated values first — you\'re being scored against them.',
              'Take the test fresh, in the morning, on a proper computer with stable internet — not on your phone at midnight before the deadline.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-brand-teal mt-0.5 flex-shrink-0">✓</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // ===== RESULTS =====
  if (view === 'results') {
    const correct = category.questions.filter((q, i) => answers[i] === q.answer).length
    const total = category.questions.length
    const pct = Math.round((correct / total) * 100)
    const band = pct >= 90 ? { label: 'Outstanding — top-tier firm ready', color: 'text-brand-gold' }
      : pct >= 75 ? { label: 'Strong — you\'d pass most screens', color: 'text-green-400' }
      : pct >= 55 ? { label: 'Borderline — more practice needed', color: 'text-yellow-400' }
      : { label: 'Keep practising — review every explanation below', color: 'text-red-400' }

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{pct >= 75 ? '🏆' : pct >= 55 ? '📈' : '📚'}</div>
          <h1 className="text-3xl font-black text-white mb-2">{category.title} — Results</h1>
          <div className="text-5xl font-black text-brand-gold my-4">{correct}/{total}</div>
          <p className={`font-bold ${band.color}`}>{pct}% — {band.label}</p>
        </div>

        <div className="flex gap-3 justify-center mb-10">
          <button onClick={() => startTest(category)} className="px-6 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
            🔄 Retake
          </button>
          <button onClick={() => { setView('home'); setCategory(null) }} className="px-6 py-3 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors">
            All tests
          </button>
        </div>

        <h2 className="text-white font-bold text-lg mb-4">Review your answers</h2>
        <div className="space-y-4">
          {category.questions.map((q, i) => {
            const userAnswer = answers[i]
            const isCorrect = userAnswer === q.answer
            return (
              <div key={i} className={`bg-brand-card border rounded-xl p-5 ${isCorrect ? 'border-green-500/20' : 'border-red-500/20'}`}>
                <div className="flex items-start gap-3 mb-2">
                  <span className={`font-black text-sm flex-shrink-0 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? '✓' : '✗'} Q{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    {q.context && <p className="text-gray-500 text-xs mb-1 italic">{q.context}</p>}
                    {q.shapes && <p className="text-white text-xl tracking-widest mb-2 overflow-x-auto">{q.shapes}</p>}
                    <p className="text-gray-200 text-sm font-medium">{q.prompt}</p>
                  </div>
                </div>
                <div className="pl-8 text-sm">
                  <p className="text-gray-400">Your answer: <span className={isCorrect ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>{userAnswer || '(no answer)'}</span></p>
                  {!isCorrect && <p className="text-gray-400">Correct answer: <span className="text-green-400 font-semibold">{q.answer}</span></p>}
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ===== TEST =====
  const q = category.questions[qIndex]
  const answeredCount = answers.filter(a => a !== null).length
  const urgent = timeLeft <= 60

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { stopTimer(); setView('home'); setCategory(null) }} className="text-gray-500 hover:text-white text-sm">✕ Quit</button>
        <div className={`font-mono font-bold text-lg px-4 py-1.5 rounded-lg ${urgent ? 'bg-red-500/15 text-red-400 animate-pulse' : 'bg-white/5 text-white'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
        <span className="text-xs text-gray-500">{answeredCount}/{category.questions.length} answered</span>
      </div>

      <div className="flex-1 mb-6 h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-brand-gold rounded-full transition-all" style={{ width: `${((qIndex + 1) / category.questions.length) * 100}%` }} />
      </div>

      <div className="mb-2">
        <span className={`text-xs font-semibold uppercase tracking-wider ${category.color}`}>
          {category.icon} {category.title} — Question {qIndex + 1} of {category.questions.length}
        </span>
      </div>

      <div className="bg-brand-card border border-white/10 rounded-2xl p-6 sm:p-8 mb-4">
        {q.context && (
          <div className="bg-brand-darker border border-white/5 rounded-xl p-4 mb-4">
            <p className="text-gray-300 text-sm leading-relaxed">{q.context}</p>
          </div>
        )}
        {q.shapes && (
          <div className="bg-brand-darker border border-white/5 rounded-xl p-5 mb-4 text-center overflow-x-auto">
            <p className="text-white text-3xl tracking-[0.3em] whitespace-nowrap">{q.shapes}</p>
          </div>
        )}
        <h2 className="text-lg font-bold text-white leading-relaxed mb-5">{q.prompt}</h2>
        <div className="space-y-3">
          {q.options.map(opt => (
            <button
              key={opt}
              onClick={() => selectAnswer(opt)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all ${
                answers[qIndex] === opt
                  ? 'bg-brand-gold/15 border-brand-gold text-white'
                  : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setQIndex(i => Math.max(0, i - 1))}
          disabled={qIndex === 0}
          className="px-6 py-4 bg-white/5 text-gray-300 rounded-xl font-semibold hover:bg-white/10 transition-colors disabled:opacity-30"
        >
          ← Back
        </button>
        {qIndex < category.questions.length - 1 ? (
          <button
            onClick={() => setQIndex(i => i + 1)}
            className="flex-1 py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={finishTest}
            className="flex-1 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors"
          >
            Finish & See Results
          </button>
        )}
      </div>
      <p className="text-gray-600 text-xs text-center mt-3">💡 {category.tip}</p>
    </div>
  )
}
