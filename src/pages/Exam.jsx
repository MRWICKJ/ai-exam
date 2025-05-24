import React, { useState, useEffect, useRef } from "react";

const ExamPage = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examCompleted, setExamCompleted] = useState(false);
  const [badge, setBadge] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const timerRef = useRef(null);

  // Configuration constants
  const timeForDifficulty = { easy: 60, medium: 45, hard: 30 };
  const questionLimits = { min: 3, max: 15 };
   const badges = {
    perfect: { 
      name: "Perfect Score", 
      color: "bg-yellow-400", 
      text: "text-yellow-800",
      gif: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExamR4ODhqZTY3Z2dlM3YzbW1ycG9rcmZhbm9sdHQxaW1udXlnbnFucCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zb1IbMHM5Y1gy6bWRM/giphy.gif"
    },
    excellent: { 
      name: "Excellent", 
      color: "bg-green-400", 
      text: "text-green-800",
      gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmRpb2N4OXYxMndmNW13M2poaWFka2NmaXM5dnc4dHNheTZxNmJ4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kUFlw7XaGE36w/giphy.gif"
    },
    good: { 
      name: "Good", 
      color: "bg-blue-400", 
      text: "text-blue-800",
      gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcW5pMWR1a3JjeXlncWw0bjVyNDhia21iNTRiNTl0MXpoNnFieXlnYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tIeCLkB8geYtW/giphy.gif"
    },
    average: { 
      name: "Average", 
      color: "bg-purple-400", 
      text: "text-purple-800",
      gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGIwbWlyNGgyNnplODNkbHNtdGRoMzA3b2wxbWxjc2IycmlwN3I2YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iSyDSFVyEnsWD43q4n/giphy.gif"
    },
    poor: { 
      name: "Needs Improvement", 
      color: "bg-red-400", 
      text: "text-red-800",
      gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjNrYXg5Mnd5ZmZsYnRnYjRkNXFlY3FyMDM2cGpocWpqOHBmdXd1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UeVNmXsALFcTdAwiZN/giphy.gif"
    }
  };

  useEffect(() => {
    if (!questions.length) return;

    setTimeLeft(timeForDifficulty[difficulty]);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQIndex, questions, difficulty]);

  const calculateBadge = (percentage) => {
    if (percentage === 100) return badges.perfect;
    if (percentage >= 80) return badges.excellent;
    if (percentage >= 60) return badges.good;
    if (percentage >= 40) return badges.average;
    return badges.poor;
  };

  const handleGenerateQuestions = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    
    if (questionCount < questionLimits.min || questionCount > questionLimits.max) {
      setError(`Please select between ${questionLimits.min} and ${questionLimits.max} questions.`);
      return;
    }

    setError("");
    setLoading(true);
    setQuestions([]);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setExamCompleted(false);
    setBadge(null);
    setUserAnswers([]);
    setShowResults(false);

    const prompt = `Generate ${questionCount} ${difficulty} multiple-choice questions about "${topic}". 
    Format each question as:
    Q: [question text]
    A: [correct answer]
    B: [option]
    C: [option]
    D: [option]
    Answer: [correct letter]`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDp8kMlV3WQDt7yPzhtdTEBUV7OcpO6umc`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch questions");
      }

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                      data?.contents?.[0]?.parts?.[0]?.text || 
                      data?.parts?.[0]?.text;

      if (typeof rawText !== "string") {
        throw new Error("Unexpected response format");
      }

      // Parse MCQ questions
      const questionBlocks = rawText.split('Q:').slice(1);
      const parsedQuestions = questionBlocks.map(block => {
        const lines = block.split('\n').filter(line => line.trim());
        const questionText = lines[0].trim();
        
        const options = {};
        let correctAnswer = '';
        
        lines.slice(1).forEach(line => {
          if (line.startsWith('A:')) options.A = line.replace('A:', '').trim();
          else if (line.startsWith('B:')) options.B = line.replace('B:', '').trim();
          else if (line.startsWith('C:')) options.C = line.replace('C:', '').trim();
          else if (line.startsWith('D:')) options.D = line.replace('D:', '').trim();
          else if (line.startsWith('Answer:')) correctAnswer = line.replace('Answer:', '').trim();
        });

        return {
          question: questionText,
          options,
          correctAnswer
        };
      });

      if (parsedQuestions.length === 0) throw new Error("No questions found");

      setQuestions(parsedQuestions);
      setLoading(false);
      setTimeLeft(timeForDifficulty[difficulty]);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong");
    }
  };

  const handleNextQuestion = () => {
    // Save user's answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    // Check if answer is correct
    if (selectedOption === questions[currentQIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    // Move to next question or finish exam
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setTimeLeft(timeForDifficulty[difficulty]);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    clearInterval(timerRef.current);
    const percentage = Math.round((score / questions.length) * 100);
    setBadge(calculateBadge(percentage));
    setExamCompleted(true);
  };

  const restartExam = () => {
    setQuestions([]);
    setExamCompleted(false);
    setBadge(null);
    setUserAnswers([]);
    setShowResults(false);
  };

  const retryExam = () => {
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setExamCompleted(false);
    setUserAnswers([]);
    setTimeLeft(timeForDifficulty[difficulty]);
  };

  const toggleResults = () => {
    setShowResults(!showResults);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* Main content */}
      <main className="flex-grow max-w-3xl mx-auto p-6 w-full">
        {!questions.length && !examCompleted && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-center">
              Generate your MCQ Exam
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Topic</label>
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E.g. Python, World History, Biology"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Difficulty</label>
                  <select
                    className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Number of Questions ({questionLimits.min}-{questionLimits.max})
                  </label>
                  <input
                    type="number"
                    min={questionLimits.min}
                    max={questionLimits.max}
                    className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Math.max(questionLimits.min, 
                      Math.min(questionLimits.max, parseInt(e.target.value) || questionLimits.min)))}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateQuestions}
                disabled={loading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Generating Questions..." : "Generate Exam"}
              </button>

              {error && (
                <p className="text-red-600 font-semibold mt-4 text-center">{error}</p>
              )}
            </div>
          </div>
        )}

        {questions.length > 0 && !examCompleted && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                Question {currentQIndex + 1} of {questions.length}
              </h3>
              <div className={`px-3 py-1 rounded-full font-bold ${
                timeLeft <= 10 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                Time: {formatTime(timeLeft)}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-lg font-medium mb-4">{questions[currentQIndex].question}</p>
              
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map(option => (
                  questions[currentQIndex].options[option] && (
                    <div 
                      key={option}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selectedOption === option 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedOption(option)}
                    >
                      <span className="font-medium mr-2">{option}:</span>
                      {questions[currentQIndex].options[option]}
                    </div>
                  )
                ))}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className={`w-full py-3 px-6 rounded font-semibold transition ${
                !selectedOption 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {currentQIndex + 1 === questions.length ? 'Finish Exam' : 'Next Question'}
            </button>
          </div>
        )}

        {examCompleted && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-4">Exam Completed!</h2>
              
              {badge && (
                <div className="flex flex-col items-center mb-6">
                  <div className={`inline-block ${badge.color} ${badge.text} px-4 py-2 rounded-full font-bold mb-4`}>
                    {badge.name}
                  </div>
                  <img 
                    src={badge.gif} 
                    alt="Result GIF" 
                    className="w-48 h-48 object-cover rounded-lg mb-4"
                  />
                </div>
              )}

              <p className="text-xl mb-2">
                Your score: <span className="font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>
              </p>
              <p className="text-lg mb-6">
                ({Math.round((score / questions.length) * 100)}%)
              </p>
            </div>

            <button
              onClick={toggleResults}
              className="w-full mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              {showResults ? 'Hide Detailed Results' : 'Show Detailed Results'}
            </button>

            {showResults && (
              <div className="mb-6 space-y-6">
                {questions.map((q, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === q.correctAnswer;
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <p className="font-semibold mb-3">Question {index + 1}: {q.question}</p>
                      
                      <div className="space-y-2">
                        {['A', 'B', 'C', 'D'].map(option => (
                          q.options[option] && (
                            <div 
                              key={option}
                              className={`p-2 rounded ${
                                option === q.correctAnswer 
                                  ? 'bg-green-100 border border-green-300'
                                  : option === userAnswer && !isCorrect
                                    ? 'bg-red-100 border border-red-300'
                                    : 'bg-gray-50'
                              }`}
                            >
                              <span className="font-medium mr-2">{option}:</span>
                              {q.options[option]}
                              {option === q.correctAnswer && (
                                <span className="ml-2 text-green-700 font-semibold">(Correct Answer)</span>
                              )}
                              {option === userAnswer && !isCorrect && (
                                <span className="ml-2 text-red-700 font-semibold">(Your Answer)</span>
                              )}
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={restartExam}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded"
              >
                Create New Exam
              </button>
              <button
                onClick={retryExam}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded"
              >
                Retry This Exam
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamPage;