import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

interface QuestionPanelProps {
  jobDescription: string;
  candidateExperience: string;
}

function QuestionPanel({ jobDescription, candidateExperience }: QuestionPanelProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [askedQuestions, setAskedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    generateQuestions();
  }, [jobDescription, candidateExperience]);

  const generateQuestions = async () => {
    // Here we would typically call an AI service to generate questions
    // For now, we'll use some example questions
    const sampleQuestions = [
      "Can you describe your experience with similar roles?",
      "How have you handled challenging situations in your previous positions?",
      "What interests you about this position?",
      "How do your skills align with our requirements?",
      "Can you provide specific examples of projects you've worked on?"
    ];
    setQuestions(sampleQuestions);
  };

  const markQuestionAsAsked = (index: number) => {
    setAskedQuestions(prev => new Set([...prev, index]));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Job Description</h2>
        <div 
          className="prose max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: marked(jobDescription) }}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Candidate Experience</h2>
        <div 
          className="prose max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: marked(candidateExperience) }}
        />
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold mb-2">Interview Questions</h2>
        <div className="space-y-2">
          {questions.map((question, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                askedQuestions.has(index)
                  ? 'bg-gray-200'
                  : 'bg-white cursor-pointer hover:bg-gray-50'
              }`}
              onClick={() => markQuestionAsAsked(index)}
            >
              {question}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionPanel;