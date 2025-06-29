import React, { useState } from 'react';
import { Lightbulb, Sparkles, Rocket, Palette, Wrench, BookOpen, Package, Search, Loader, Shuffle, Zap } from 'lucide-react';

const TRANSLATIONS = {
  "en-US": {
    "appTitle": "Idea Spark",
    "appSubtitle": "Two words. Endless possibilities.",
    "word1Label": "WORD 1",
    "word2Label": "WORD 2",
    "word1Placeholder": "ocean",
    "word2Placeholder": "robot",
    "generateRandomWordTitle": "Generate random word",
    "businessCategory": "Business",
    "creativeWritingCategory": "Creative writing",
    "productIdeasCategory": "Product ideas",
    "problemSolvingCategory": "Problem solving",
    "artDesignCategory": "Art & design",
    "storyConceptsCategory": "Story concepts",
    "generateIdeasButton": "Generate ideas",
    "generatingIdeasButton": "Generating ideas",
    "yourIdeasTitle": "Your ideas",
    "resetButton": "Reset",
    "errorMessage": "Sorry, there was an error generating ideas. Please try again!"
  },
  /* LOCALE_PLACEHOLDER_START */
  "es-ES": {
    "appTitle": "Chispa de Ideas",
    "appSubtitle": "Dos palabras. Infinitas posibilidades.",
    "word1Label": "PALABRA 1",
    "word2Label": "PALABRA 2",
    "word1Placeholder": "océano",
    "word2Placeholder": "robot",
    "generateRandomWordTitle": "Generar palabra aleatoria",
    "businessCategory": "Negocios",
    "creativeWritingCategory": "Escritura creativa",
    "productIdeasCategory": "Ideas de productos",
    "problemSolvingCategory": "Resolución de problemas",
    "artDesignCategory": "Arte y diseño",
    "storyConceptsCategory": "Conceptos de historias",
    "generateIdeasButton": "Generar ideas",
    "generatingIdeasButton": "Generando ideas",
    "yourIdeasTitle": "Tus ideas",
    "resetButton": "Reiniciar",
    "errorMessage": "Lo siento, hubo un error al generar ideas. ¡Por favor, inténtalo de nuevo!"
  }
  /* LOCALE_PLACEHOLDER_END */
};

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

const WordFusionApp = () => {
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ideas, setIdeas] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const wordBank = [
    // Technology
    'robot', 'digital', 'cyber', 'quantum', 'virtual', 'neural', 'smart', 'nano', 'bio', 'eco',
    // Nature
    'ocean', 'forest', 'mountain', 'solar', 'lunar', 'crystal', 'thunder', 'wind', 'fire', 'ice',
    // Actions
    'flying', 'dancing', 'spinning', 'glowing', 'flowing', 'racing', 'climbing', 'diving', 'jumping', 'singing',
    // Objects
    'mirror', 'door', 'bridge', 'tower', 'garden', 'library', 'kitchen', 'studio', 'workshop', 'laboratory',
    // Qualities
    'invisible', 'magical', 'ancient', 'modern', 'tiny', 'giant', 'silent', 'colorful', 'transparent', 'flexible',
    // Animals
    'dragon', 'phoenix', 'wolf', 'eagle', 'dolphin', 'butterfly', 'tiger', 'lion', 'bear', 'fox',
    // Time
    'midnight', 'dawn', 'sunset', 'eternal', 'instant', 'future', 'vintage', 'timeless', 'rapid', 'slow',
    // Materials
    'glass', 'metal', 'wood', 'stone', 'fabric', 'paper', 'plastic', 'ceramic', 'diamond', 'gold'
  ];

  const getRandomWord = () => {
    return wordBank[Math.floor(Math.random() * wordBank.length)];
  };

  const shuffleWord1 = () => {
    setWord1(getRandomWord());
  };

  const shuffleWord2 = () => {
    setWord2(getRandomWord());
  };

  const categories = [
    { id: 'business', name: t('businessCategory'), icon: '💼' },
    { id: 'writing', name: t('creativeWritingCategory'), icon: '✍️' },
    { id: 'products', name: t('productIdeasCategory'), icon: '📦' },
    { id: 'solutions', name: t('problemSolvingCategory'), icon: '🔧' },
    { id: 'art', name: t('artDesignCategory'), icon: '🎨' },
    { id: 'stories', name: t('storyConceptsCategory'), icon: '✨' },
  ];

  const generateIdeas = async () => {
    if (!word1.trim() || !word2.trim() || !selectedCategory) {
      return; // Button is disabled, so this shouldn't happen
    }

    setIsLoading(true);
    setIdeas('');

    try {
      const categoryContext = {
        business: 'business opportunities, startups, or entrepreneurial ventures',
        writing: 'creative writing prompts, story ideas, or narrative concepts',
        products: 'new product concepts, improvements, or market opportunities',
        art: 'artistic projects, design concepts, or creative visual ideas',
        solutions: 'practical solutions to everyday problems or challenges',
        stories: 'engaging story concepts, plot ideas, or narrative themes',
      };

      const prompt = `Please respond in ${locale} language. Generate 5-7 creative and practical ideas that combine the words "${word1}" and "${word2}" for ${categoryContext[selectedCategory]}. 

Make the ideas:
- Innovative and unique
- Practical and achievable
- Each idea should have a clear title followed by a detailed explanation
- Varied in scope and approach

Format your response as a numbered list where each entry follows this exact format:
"1. [Idea Title] - [Detailed explanation of the idea in 1-2 sentences]"

Example format:
"1. Smart Garden Monitor - A device that combines sensors and AI to automatically track soil moisture, light levels, and plant health, sending notifications to your phone when your plants need attention."

Make sure every idea has both a title AND a description separated by " - "`;

      const response = await window.claude.complete(prompt);
      setIdeas(response);
    } catch (error) {
      setIdeas(t('errorMessage'));
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setWord1('');
    setWord2('');
    setSelectedCategory('');
    setIdeas('');
  };

  const shuffleBothWords = () => {
    setWord1(getRandomWord());
    setWord2(getRandomWord());
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">{t('appTitle')}</h1>
          <p className="text-xl text-gray-400 font-medium">
            {t('appSubtitle')}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-8 text-black">
          {/* Word Inputs */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="bg-gray-100 rounded-2xl p-6 relative">
                  <label className="block text-sm font-bold mb-3 text-gray-500 uppercase tracking-wide">
                    {t('word1Label')}
                  </label>
                  <input
                    type="text"
                    value={word1}
                    onChange={(e) => setWord1(e.target.value)}
                    placeholder={t('word1Placeholder')}
                    className="w-full text-2xl font-bold bg-transparent border-none outline-none text-black placeholder-gray-400"
                  />
                  <button
                    onClick={shuffleWord1}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-purple-500 transition-colors duration-200 hover:scale-110"
                    title={t('generateRandomWordTitle')}
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <div className="bg-gray-100 rounded-2xl p-6 relative">
                  <label className="block text-sm font-bold mb-3 text-gray-500 uppercase tracking-wide">
                    {t('word2Label')}
                  </label>
                  <input
                    type="text"
                    value={word2}
                    onChange={(e) => setWord2(e.target.value)}
                    placeholder={t('word2Placeholder')}
                    className="w-full text-2xl font-bold bg-transparent border-none outline-none text-black placeholder-gray-400"
                  />
                  <button
                    onClick={shuffleWord2}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-purple-500 transition-colors duration-200 hover:scale-110"
                    title={t('generateRandomWordTitle')}
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-6 rounded-2xl transition-all duration-200 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="font-bold text-lg">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mb-8">
            <button
              onClick={generateIdeas}
              disabled={isLoading || !word1.trim() || !word2.trim() || !selectedCategory}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-50 text-white py-6 rounded-2xl text-xl font-black transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  {t('generatingIdeasButton')}
                </>
              ) : (
                t('generateIdeasButton')
              )}
            </button>
          </div>

          {/* Ideas Display */}
          {ideas && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-purple-500">{t('yourIdeasTitle')}</h3>
                <button
                  onClick={resetApp}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-bold transition-colors text-gray-700"
                >
                  {t('resetButton')}
                </button>
              </div>
              <div className="grid gap-4">
                {ideas.split('\n').filter(line => line.trim() && /^\d+\./.test(line.trim())).map((idea, index) => {
                  // Clean the idea text by removing the number prefix
                  const cleanIdea = idea.replace(/^\d+\.\s*/, '').trim();
                  
                  // Try to split on " - " first, then try other common separators
                  let title, description;
                  
                  if (cleanIdea.includes(' - ')) {
                    [title, ...description] = cleanIdea.split(' - ');
                    description = description.join(' - ');
                  } else if (cleanIdea.includes(': ')) {
                    [title, ...description] = cleanIdea.split(': ');
                    description = description.join(': ');
                  } else {
                    // If no clear separator, use the whole thing as title
                    // but try to split on first sentence if it's very long
                    if (cleanIdea.length > 100) {
                      const sentences = cleanIdea.split(/\.\s+(?=[A-Z])/);
                      title = sentences[0];
                      description = sentences.slice(1).join('. ');
                      if (description) description += '.';
                    } else {
                      title = cleanIdea;
                      description = '';
                    }
                  }
                  
                  return (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-purple-700 mb-2">
                            {title.replace(/^["']|["']$/g, '')}
                          </h4>
                          {description && (
                            <p className="text-gray-700 leading-relaxed">
                              {description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordFusionApp;