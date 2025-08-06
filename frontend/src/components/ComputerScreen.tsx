'use client';

import { useState, useRef, useEffect } from 'react';

interface ComputerScreenProps {
  htmlContent: string;
  isValid: boolean;
  isLoading?: boolean;
}

export default function ComputerScreen({ htmlContent, isValid, isLoading = false }: ComputerScreenProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      iframeRef.current.srcdoc = htmlContent;
    }
  }, [htmlContent]);
  const renderIframe = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="text-center p-8">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4">🔬 Generating Experiment...</h3>
            <p className="text-gray-600 text-lg mb-4">Creating your interactive science quiz!</p>
            <div className="flex justify-center space-x-2 text-2xl">
              <span className="animate-bounce delay-0">⚗️</span>
              <span className="animate-bounce delay-100">🧪</span>
              <span className="animate-bounce delay-200">🔬</span>
              <span className="animate-bounce delay-300">✨</span>
            </div>
          </div>
        </div>
      );
    } else if (htmlContent && isValid) {
      return (
        <iframe
          ref={iframeRef}
          srcDoc={htmlContent}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Generated Science Experiment"
        />
      );
    } else if (htmlContent && !isValid) {
      return (
        <div className="flex items-center justify-center h-full bg-red-50">
          <div className="text-center p-8">
            <div className="text-8xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-700 mb-2">Experiment Error!</h3>
            <p className="text-red-600 text-lg">The experiment code has some problems and can&apos;t be displayed safely.</p>
            <p className="text-red-500 text-sm mt-2">Try describing your experiment differently!</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-green-50">
          <div className="text-center p-8">
            <div className="text-8xl mb-4">🧪</div>
            <h3 className="text-2xl font-bold text-blue-700 mb-2">Ready for Science!</h3>
            <p className="text-gray-600 text-lg">Select a topic from the sidebar and generate an experiment!</p>
            <div className="mt-4 flex justify-center space-x-4 text-3xl">
              <span>🔬</span>
              <span>🌟</span>
              <span>⚗️</span>
              <span>🚀</span>
            </div>
          </div>
        </div>
      );
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleFullscreen}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-colors"
          >
            ✕ Exit Fullscreen
          </button>
        </div>
        {renderIframe()}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl">
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-t-lg p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
          <div className="ml-4 text-white text-sm font-medium">🔬 Science Experiment Viewer</div>
        </div>
        {htmlContent && isValid && (
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-gray-300 text-sm px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
            title="Open in fullscreen"
          >
            ⛶ Fullscreen
          </button>
        )}
      </div>
      
      <div 
        className="bg-white rounded-b-lg overflow-hidden border-4 border-gray-600"
        style={{ aspectRatio: '16/9', minHeight: '400px' }}
      >
        {renderIframe()}
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-300">
          <div className={`w-2 h-2 rounded-full ${
            htmlContent && isValid 
              ? "bg-green-500 animate-pulse" 
              : htmlContent && !isValid 
                ? "bg-red-500"
                : "bg-blue-500 animate-pulse"
          }`}></div>
          <span>
            {htmlContent && isValid 
              ? "✅ Experiment Running Successfully!" 
              : htmlContent && !isValid 
                ? "❌ Experiment Has Errors"
                : "⏳ Waiting for Your Amazing Idea..."
            }
          </span>
        </div>
      </div>
    </div>
  );
}