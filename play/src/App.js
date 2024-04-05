import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await axios.get('https://opentdb.com/api.php?amount=10'); // OTDB API endpoint
                if (response.data.response_code === 0) {
                    // Extract questions from the response
                    const formattedQuestions = response.data.results.map(question => {
                        const formattedQuestion = {
                            questionText: question.question,
                            answerOptions: [
                                ...question.incorrect_answers.map(answer => ({ answerText: answer, isCorrect: false })),
                                { answerText: question.correct_answer, isCorrect: true }
                            ]
                        };
                        return formattedQuestion;
                    });
                    setQuestions(formattedQuestions);
                } else {
                    console.error('Error fetching questions:', response.data);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        }

        fetchQuestions();
    }, []);

    const handleAnswerClick = (isCorrect) => {
        setUserAnswers([...userAnswers, isCorrect]);
        setCurrentQuestion(currentQuestion + 1);
    };

    return (
        <div className='quiz'>
            {currentQuestion < questions.length ? (
                <>
                    <div className='question'>{questions[currentQuestion].questionText}</div>
                    <div className='answer-options'>
                        {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                            <button key={index} onClick={() => handleAnswerClick(answerOption.isCorrect)}>
                                {answerOption.answerText}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className='results'>
                    <h2>Quiz Complete!</h2>
                    <p>Your score: {userAnswers.filter(answer => answer).length} / {questions.length}</p>
                </div>
            )}
        </div>
    );
}


export default App;
