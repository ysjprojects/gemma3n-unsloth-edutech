export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateHTML(html: string): ValidationResult {
  const errors: string[] = [];
  
  if (!html || typeof html !== 'string') {
    return {
      isValid: false,
      errors: ['HTML content is empty or invalid']
    };
  }

  const trimmedHTML = html.trim();
  
  if (trimmedHTML.length === 0) {
    return {
      isValid: false,
      errors: ['HTML content is empty']
    };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmedHTML, 'text/html');
    
    const parseErrors = doc.querySelectorAll('parsererror');
    if (parseErrors.length > 0) {
      parseErrors.forEach((error, index) => {
        errors.push(`Parse error ${index + 1}: ${error.textContent}`);
      });
    }

    if (!trimmedHTML.includes('<html') && !trimmedHTML.includes('<body') && !trimmedHTML.includes('<div')) {
      errors.push('HTML should contain at least basic structure elements');
    }

    
    const basicTags = ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    basicTags.forEach(tag => {
      const openTags = (trimmedHTML.match(new RegExp(`<${tag}[^>]*>`, 'gi')) || []).length;
      const closeTags = (trimmedHTML.match(new RegExp(`<\/${tag}>`, 'gi')) || []).length;
      
      if (openTags > closeTags) {
        errors.push(`Unclosed ${tag} tags detected`);
      }
    });

    if (trimmedHTML.includes('<script')) {
      const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
      let match;
      while ((match = scriptRegex.exec(trimmedHTML)) !== null) {
        const scriptContent = match[1];
        if (scriptContent.includes('eval(') || 
            scriptContent.includes('document.write(')) {
          errors.push('Potentially unsafe JavaScript detected');
        }
      }
    }

    if (errors.length === 0) {
      const hasVisibleContent = 
        trimmedHTML.includes('<div') ||
        trimmedHTML.includes('<p') ||
        trimmedHTML.includes('<span') ||
        trimmedHTML.includes('<h1') ||
        trimmedHTML.includes('<h2') ||
        trimmedHTML.includes('<h3') ||
        trimmedHTML.includes('<button') ||
        trimmedHTML.includes('<input') ||
        />[^<\s]+</.test(trimmedHTML);

      if (!hasVisibleContent) {
        errors.push('HTML appears to have no visible content');
      }
    }

  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}