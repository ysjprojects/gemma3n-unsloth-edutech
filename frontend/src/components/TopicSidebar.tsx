'use client';

import { useState } from 'react';

const topicsData = {
  "Forces and energy": {
    "Interaction of forces": ["the interaction of forces"],
    "Interaction of forces (magnets)": ["the interaction of forces, specifically magnets"],
    "Energy conversion": ["energy conversion"],
    "Heat energy": ["the forms and uses of heat energy", "the concept of heat energy"],
    "Light energy": ["the forms and uses of light energy"]
  },
  "Living things vs non-living things": {
    "Classifying living and non-living things": ["classifying living and non-living things"],
    "Diversity of living and non-living things": ["the diversity of living and non-living things"],
    "Diversity of materials": ["the diversity of materials"],
    "Basic electrical systems": ["basic electrical systems"]
  },
  "Cycles": {
    "The water cycle": ["the water cycle"],
    "The life cycles of plants and animals": ["the life cycles of plants and animals"],
    "Environmental interaction": ["environmental interactions"]
  },
  "Plants": {
    "Plant parts and their functions": ["plant parts and their functions"],
    "Basics of photosynthesis": ["the basics of photosynthesis"],
    "Plant system": ["plant system"]
  },
  "Human systems": {
    "Digestive system": ["the human digestive system"],
    "Respiratory and circulatory systems": ["the human respiratory and circulatory systems"]
  }
};

interface TopicSidebarProps {
  selectedTopicOrSubtopic: string;
  onTopicSelect: (topic: string, prompts: string[]) => void;
}

export default function TopicSidebar({ selectedTopicOrSubtopic, onTopicSelect }: TopicSidebarProps) {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (topic: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topic)) {
      newExpanded.delete(topic);
    } else {
      newExpanded.add(topic);
    }
    setExpandedTopics(newExpanded);
  };

  const handleTopicClick = (topic: string) => {
    const subtopics = topicsData[topic as keyof typeof topicsData];
    const allPrompts = Object.values(subtopics).flat();
    onTopicSelect(topic, allPrompts);
    
    const newExpanded = new Set(expandedTopics);
    newExpanded.add(topic);
    setExpandedTopics(newExpanded);
  };

  const handleSubtopicClick = (subtopic: string, prompts: string[]) => {
    onTopicSelect(subtopic, prompts);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Science Topics</h2>
      </div>
      
      <div className="p-2">
        {Object.entries(topicsData).map(([topic, subtopics]) => (
          <div key={topic} className="mb-2">
            <div className="flex items-center">
              <button
                onClick={() => toggleTopic(topic)}
                className="mr-2 p-1 hover:bg-gray-100 rounded"
              >
                <span className="text-gray-500">
                  {expandedTopics.has(topic) ? '▼' : '▶'}
                </span>
              </button>
              <button
                onClick={() => handleTopicClick(topic)}
                className={`flex-1 text-left px-3 py-2 rounded-md font-medium transition-colors ${
                  selectedTopicOrSubtopic === topic
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {topic}
              </button>
            </div>
            
            {expandedTopics.has(topic) && (
              <div className="ml-6 mt-1 space-y-1">
                {Object.entries(subtopics).map(([subtopic, prompts]) => (
                  <button
                    key={subtopic}
                    onClick={() => handleSubtopicClick(subtopic, prompts)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedTopicOrSubtopic === subtopic
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {subtopic}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}