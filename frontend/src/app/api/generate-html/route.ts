import { NextRequest, NextResponse } from 'next/server';
import { seedData } from '../../../utils/seedData';

export async function POST(request: NextRequest) {
  try {
    const { prompt, theme = 'default', difficulty = 'default' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const seedEntry = Object.entries(seedData).find(([key]) => 
      prompt.toLowerCase().includes(key.toLowerCase())
    );

    if (seedEntry) {
      const LOWER_BOUND = 3000;
      const RANGE = 2000;
      const delayMs = Math.floor(Math.random() * RANGE) + LOWER_BOUND;
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      const [, themeVariations] = seedEntry;
      
      let selectedTheme = themeVariations.find((variation: { theme: string; difficulty?: string; prompt: string; completion: string }) => 
        variation.theme === theme && (variation.difficulty || 'default') === difficulty
      );
      
      if (!selectedTheme) {
        selectedTheme = themeVariations.find((variation: { theme: string; difficulty?: string; prompt: string; completion: string }) => 
          variation.theme === theme && (variation.difficulty || 'default') === 'default'
        );
      }
      
      if (!selectedTheme) {
        selectedTheme = themeVariations.find((variation: { theme: string; difficulty?: string; prompt: string; completion: string }) => 
          variation.theme === 'default' && (variation.difficulty || 'default') === difficulty
        );
      }
      
      if (!selectedTheme) {
        selectedTheme = themeVariations.find((variation: { theme: string; difficulty?: string; prompt: string; completion: string }) => 
          variation.theme === 'default' && (variation.difficulty || 'default') === 'default'
        );
      }
      
      if (!selectedTheme && themeVariations.length > 0) {
        selectedTheme = themeVariations[0];
      }

      if (selectedTheme) {
        return NextResponse.json({
          success: true,
          html: selectedTheme.completion,
          raw: selectedTheme.completion,
          theme: selectedTheme.theme,
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'No theme variations found for this topic' },
          { status: 404 }
        );
      }
    }

    const hfToken = process.env.HUGGINGFACE_TOKEN;
    const hfModel = process.env.HUGGINGFACE_MODEL || "Qwen/Qwen3-Coder-480B-A35B-Instruct";

    if (!hfToken) {
      return NextResponse.json(
        { success: false, error: 'Hugging Face API token not configured' },
        { status: 500 }
      );
    }

    const inputPrompt = `Create a complete, self-contained HTML page with embedded CSS and JavaScript for an interactive science experiment about ${prompt}. 

Requirements:
- Include proper HTML5 structure with DOCTYPE, head, and body tags
- Use colorful, child-friendly design with large buttons and clear text
- Make it interactive with click events, animations, or simple physics
- Include educational content appropriate for elementary students
- Use inline CSS and JavaScript (no external dependencies)
- Make it safe and appropriate for children
- Focus on visual learning and hands-on interaction

Generate a complete HTML page starting with <!DOCTYPE html>:`;

    let response;
    let data;
    let generatedText = '';

    try {
      response = await fetch(
        `https://api-inference.huggingface.co/models/${hfModel}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: inputPrompt,
            parameters: {
              temperature: 1.0,
              top_p: 0.95,
              top_k: 64,
              max_new_tokens: 8192,
              seed: Math.floor(Math.random() * 1000000), // Random seed for variety
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HuggingFace API error: ${response.status} - ${errorText}`);
        if (response.status === 503) {
          return NextResponse.json(
            { success: false, error: 'Model is currently loading. Please try again in a few moments.' },
            { status: 503 }
          );
        } else if (response.status === 429) {
          return NextResponse.json(
            { success: false, error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
          );
        } else if (response.status === 401) {
          return NextResponse.json(
            { success: false, error: 'Invalid API token.' },
            { status: 401 }
          );
        } else {
          return NextResponse.json(
            { success: false, error: `HuggingFace API error: ${response.status}` },
            { status: response.status }
          );
        }
      }

      data = await response.json();

      if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        generatedText = data[0].generated_text;
      } else if (data.generated_text) {
        generatedText = data.generated_text;
      } else {
        console.error('Unexpected API response format:', data);
        return NextResponse.json(
          { success: false, error: 'Unexpected response format from HuggingFace API' },
          { status: 500 }
        );
      }

    } catch (fetchError) {
      console.error('Network error calling HuggingFace API:', fetchError);
      
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        return NextResponse.json(
          { success: false, error: 'Network error: Unable to reach HuggingFace API' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to generate content from HuggingFace API' },
        { status: 500 }
      );
    }

    if (!generatedText || generatedText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'No content generated from HuggingFace API' },
        { status: 500 }
      );
    }

    let htmlContent = generatedText;
    
    const htmlMatch = htmlContent.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
    if (htmlMatch) {
      htmlContent = htmlMatch[0];
    } else {
      const bodyMatch = htmlContent.match(/<html[\s\S]*<\/html>/i);
      if (bodyMatch) {
        htmlContent = `<!DOCTYPE html>\n${bodyMatch[0]}`;
      } else {
        htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Science Experiment: ${prompt}</title>
    <style>
        body { 
            font-family: 'Comic Sans MS', cursive, sans-serif; 
            margin: 0; 
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .experiment-container { 
            background: white; 
            padding: 30px; 
            border-radius: 20px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
        }
        h1 { color: #2d3748; font-size: 2em; margin-bottom: 20px; }
        .science-content { 
            font-size: 1.2em; 
            line-height: 1.6;
            background: #f7fafc;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .fun-button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1.2em;
            border-radius: 25px;
            cursor: pointer;
            margin: 10px;
            transition: transform 0.2s;
        }
        .fun-button:hover {
            transform: scale(1.05);
        }
        .science-emoji {
            font-size: 3em;
            margin: 20px;
        }
    </style>
</head>
<body>
    <div class="experiment-container">
        <div class="science-emoji">🧪🔬⚗️</div>
        <h1>Science Experiment: ${prompt}</h1>
        <div class="science-content">
            <p><strong>Generated Content:</strong></p>
            <p>${generatedText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            <button class="fun-button" onclick="alert('Great job exploring science! 🌟')">
                Click to Learn More!
            </button>
        </div>
        <p style="margin-top: 30px; color: #666;">
            🌟 Keep exploring and asking questions! Science is everywhere! 🌟
        </p>
    </div>
</body>
</html>`;
      }
    }

    return NextResponse.json({
      success: true,
      html: htmlContent,
      raw: generatedText,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}