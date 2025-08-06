'use client';

import { useState, useEffect, useCallback } from 'react';
import ComputerScreen from '../components/ComputerScreen';
import TopicSidebar from '../components/TopicSidebar';
import { validateHTML } from '../utils/htmlValidator';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [isValidHTML, setIsValidHTML] = useState(false);
  const [selectedTopicOrSubtopic, setSelectedTopicOrSubtopic] = useState('');
  const [selectedTopicOrSubtopicPrompts, setSelectedTopicOrSubtopicPrompts] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [difficulty, setDifficulty] = useState('default');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleTopicSelect = (topic: string, prompts: string[]) => {
    setSelectedTopicOrSubtopic(topic);
    setSelectedTopicOrSubtopicPrompts(prompts);
  };

  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  }, []);

  const handleQuizResult = useCallback((passed: boolean, score: number, total: number) => {
    if (passed) {
      if (difficulty === 'default') {
        setDifficulty('harder');
        showToastMessage(`🎉 Congratulations! You scored ${score}/${total}! Things are about to get more challenging. Ready for the harder level?`);
      } else if (difficulty === 'easier') {
        setDifficulty('default');
        showToastMessage(`🌟 Well done! You scored ${score}/${total}! You're back to the standard difficulty level. Keep it up!`);
      } else {
        showToastMessage(`🔥 Amazing! You scored ${score}/${total} on the hardest level! You're a true science master!`);
      }
    } else {
      if (difficulty === 'default') {
        setDifficulty('easier');
        showToastMessage(`💪 Don't worry! You scored ${score}/${total}. Let's try an easier version to build your confidence. You've got this!`);
      } else if (difficulty === 'harder') {
        setDifficulty('default');
        showToastMessage(`🎯 Good effort! You scored ${score}/${total}. Let's step back to the standard level and practice more.`);
      } else {
        showToastMessage(`🌱 Keep practicing! You scored ${score}/${total}. Remember, every expert was once a beginner. Try again!`);
      }
    }
  }, [difficulty, setDifficulty, showToastMessage]);

  const generateHTML = async () => {
    if (!selectedTopicOrSubtopic || selectedTopicOrSubtopicPrompts.length === 0) return;

    setIsLoading(true);
    try {
      const randomPrompt = selectedTopicOrSubtopicPrompts[
        Math.floor(Math.random() * selectedTopicOrSubtopicPrompts.length)
      ];
      
      const response = await fetch('/api/generate-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: randomPrompt,
          theme: selectedTheme,
          difficulty: difficulty,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.html) {
        const validationResult = validateHTML(data.html);
        setGeneratedHTML(data.html);
        setIsValidHTML(validationResult.isValid);
      } else {
        setGeneratedHTML('');
        setIsValidHTML(false);
      }
    } catch (error) {
      console.error('Error generating HTML:', error);
      setGeneratedHTML('');
      setIsValidHTML(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'quizComplete') {
        const { passed, score, total } = event.data;
        handleQuizResult(passed, score, total);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [difficulty, handleQuizResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex">
      <TopicSidebar 
        selectedTopicOrSubtopic={selectedTopicOrSubtopic}
        onTopicSelect={handleTopicSelect}
      />
      
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-blue-700 mb-2">🧪  EduGemma</h1>
            <p className="text-gray-600 text-lg">Create interactive science experiments and demonstrations!</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <ComputerScreen 
                htmlContent={generatedHTML}
                isValid={isValidHTML}
                isLoading={isLoading}
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              {selectedTopicOrSubtopic && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-sm font-semibold text-gray-700">Selected Topic:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {selectedTopicOrSubtopic}
                    </span>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm font-semibold text-gray-700">Theme:</span>
                      <select
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                        className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                      >
                        <option value="default">🎨 Default</option>
                        <option value="futuristic">🚀 Futuristic</option>
                        <option value="pastel">🌸 Pastel</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center">
                <button
                  onClick={generateHTML}
                  disabled={isLoading || !selectedTopicOrSubtopic}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                      <span>Processing...</span>
                    </div>
                  ) : generatedHTML ? (
                    '🔄 Regenerate Experiment'
                  ) : (
                    '🚀 Generate Experiment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-4 transform transition-all duration-500 ease-out">
            <div className="flex items-start">
              <div className="ml-3">
                <p className="text-sm text-gray-700">{toastMessage}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 items-center justify-center"
              >
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
