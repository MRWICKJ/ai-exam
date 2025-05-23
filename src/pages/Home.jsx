import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800">
      {/* Hero */}
      <section className="text-center py-20 px-6">
        <h2 className="text-5xl font-extrabold text-blue-700 mb-6">
          Revolutionize Your Learning with AI 🚀
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Say goodbye to traditional studying. Type or speak a topic and let AI generate smart, tailored quizzes instantly.
        </p>
        <button
          onClick={() => navigate("/exam")}
          className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition"
        >
          Start Generating Exams ➡️
        </button>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">🧠 How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { title: "1. Choose Topic", desc: "Type or speak any topic you're interested in." },
            { title: "2. Select Difficulty", desc: "Pick your level: Easy, Medium, or Hard." },
            { title: "3. Get Instant Quiz", desc: "AI generates questions with answers in seconds." },
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">⚙️ Features</h3>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            "Voice Input (soon)",
            "Multiple Difficulty Levels",
            "Instant AI Answers",
            "Timer Based Exam Mode",
            "Lightweight, No Signup Needed",
            "Mobile Friendly Design",
          ].map((feature, i) => (
            <div key={i} className="bg-blue-50 p-6 rounded-lg shadow">
              <p className="text-lg font-medium text-blue-700">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">🎯 Who Is This For?</h3>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          {[
            {
              title: "📚 Students",
              desc: "Practice smarter, not harder. Prepare for exams quickly.",
            },
            {
              title: "👨‍🏫 Teachers",
              desc: "Use AI-generated questions to create quick assessments.",
            },
            {
              title: "🧑‍💼 Professionals",
              desc: "Refresh your knowledge for interviews or certifications.",
            },
            {
              title: "🌍 Lifelong Learners",
              desc: "Test yourself on any topic you're curious about.",
            },
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">{card.title}</h4>
              <p className="text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-blue-600 text-white py-20 px-6">
        <h3 className="text-4xl font-bold mb-4">Ready to Test Your Brain? 🧠</h3>
        <p className="mb-8 text-lg">Start your AI-powered quiz now — it's free and fun!</p>
        <button
          onClick={() => navigate("/exam")}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Launch Exam Generator
        </button>
      </section>
    </div>
  );
}
