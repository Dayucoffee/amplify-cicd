import React, { useState, useEffect } from 'react';
import he from 'he';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(""); 
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch questions from the API URL provided by Open Trivia DB (https://opentdb.com/api_config.php)
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=boolean');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        console.log(data);
        const questions = data.results.map((q) => ({
            question: he.decode(q.question),
            options: [...q.incorrect_answers.map(a => he.decode(a)), he.decode(q.correct_answer)].sort(() => Math.random() - 0.5),
            answer: he.decode(q.correct_answer),
            }));
        setQuestions(questions);
        console.log(questions);

        setError(null);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerOptionClick = (option) => {
    const correctAnswer = questions[currentQuestion].answer;
    setSelectedAnswer(option);
    if (option === correctAnswer) {
      setScore(score + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    // Delay moving to the next question to allow the user to see feedback
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setIsCorrect(null); // Reset for the next question
        setSelectedAnswer(""); // Reset selected answer
      } else {
        setShowScore(true);
      }
    }, 1000); // Adjust time as needed
  };

  return (
    <div className='text-center'>
      <div className="min-h-screen flex flex-col justify-center">
        <h1 className='text-4xl font-bold mb-4 text-white font-sans'>Interesting & Incredible Quiz App</h1>
      {showScore ? (
        <div>
          <h2 className='text-xl font-semibold mb-4 text-white'>
          Your score: {score} / {questions.length}
          </h2>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => window.location.reload()}>
            Restart Quiz
          </button>
        </div>
      ) : (
        <div className='bg-slate-100 mx-52 rounded-md p-10'>
          {questions.length > 0 ? (
            <div>
            <h2 className= "text-xl font-semibold mb-4 font-sans">
                Question {currentQuestion + 1}/{questions.length}
            </h2>
            <p className='text-lg mb-4 font-semibold font-sans'>{questions[currentQuestion].question}</p>
            </div>
          ) : (
            <p className='text-lg mb-4 font-semibold text-black font-sans'>Loading questions ⏳ ... if you don't see them refresh the page</p>
          )}
          {questions.length > 0 && (
            <div className='grid grid-cols-2 gap-4 mx-44'>
              {questions[currentQuestion].options.map((option) => (
                <button 
                  onClick={() => handleAnswerOptionClick(option)} 
                  key={option}
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md font-sans'
                  style={{ backgroundColor: selectedAnswer === option ? (isCorrect ? 'lightgreen' : 'pink') : '' }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          {selectedAnswer && (
            <div style={{ marginTop: '10px' }}>
              {isCorrect ? 'Correct! 🎉' : 'Sorry, that is not right. 😢'}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

export default Quiz;