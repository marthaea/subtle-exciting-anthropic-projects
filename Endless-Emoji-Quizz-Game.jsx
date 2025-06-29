import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X, Trophy, Star, Zap, Target, Gamepad2, Play } from 'lucide-react';

const TRANSLATIONS = {
  "en-US": {
    "gameTitle": "Emoji charades",
    "gameSubtitle": "Decode emoji clues to reveal hidden sayings",
    "playButton": "Play",
    "correctLabel": "Correct",
    "questionsLabel": "Questions",
    "accuracyLabel": "Accuracy",
    "comboLabel": "Combo",
    "resetButton": "Reset",
    "loadingMessage": "Loading next question...",
    "questionPrompt": "What saying do these emojis represent?",
    "hintPrefix": "💡",
    "answerPlaceholder": "Enter your answer...",
    "submitButton": "Submit",
    "hintButton": "Hint",
    "yourAnswerLabel": "Your answer:",
    "nextQuestionButton": "Next question",
    "perfectFeedback": "Perfect!",
    "correctFeedback": "Correct!",
    "tryAgainFeedback": "Try again next time!",
    "pointsSuffix": "points",
    "claudePrompt": "Please respond in"
  },
  /* LOCALE_PLACEHOLDER_START */
  "es-ES": {
    "gameTitle": "Charadas de emojis",
    "gameSubtitle": "Decodifica pistas de emojis para revelar dichos ocultos",
    "playButton": "Jugar",
    "correctLabel": "Correctas",
    "questionsLabel": "Preguntas",
    "accuracyLabel": "Precisión",
    "comboLabel": "Combo",
    "resetButton": "Reiniciar",
    "loadingMessage": "Cargando siguiente pregunta...",
    "questionPrompt": "¿Qué dicho representan estos emojis?",
    "hintPrefix": "💡",
    "answerPlaceholder": "Ingresa tu respuesta...",
    "submitButton": "Enviar",
    "hintButton": "Pista",
    "yourAnswerLabel": "Tu respuesta:",
    "nextQuestionButton": "Siguiente pregunta",
    "perfectFeedback": "¡Perfecto!",
    "correctFeedback": "¡Correcto!",
    "tryAgainFeedback": "¡Inténtalo de nuevo la próxima vez!",
    "pointsSuffix": "puntos",
    "claudePrompt": "Por favor responde en idioma"
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

const EmojiQuizGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [usedSayings, setUsedSayings] = useState(new Set());
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);

  const generateNewQuestion = async () => {
    setIsLoading(true);
    setShowAnswer(false);
    setUserGuess('');
    setFeedback('');
    setShowHint(false);
    
    try {
      const usedSayingsArray = Array.from(usedSayings);
      const excludeList = usedSayingsArray.length > 0 
        ? `\n\nDO NOT use any of these previously used sayings: ${usedSayingsArray.join(', ')}`
        : '';
      
      // Add randomization elements to make each question generation unique
      const categories = [
        'animals and nature',
        'time and patience', 
        'wisdom and advice',
        'work and success',
        'relationships and friendship',
        'food and cooking',
        'weather and seasons',
        'money and value',
        'actions and consequences',
        'appearance vs reality'
      ];
      
      const styles = [
        'classic proverbs',
        'modern idioms', 
        'folk sayings',
        'common expressions',
        'traditional wisdom'
      ];
      
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      const randomSeed = Math.floor(Math.random() * 10000);
      
      const prompt = `Generate a fun quiz question that converts a common saying, idiom, or proverb into emojis. 

Focus on: ${randomCategory} themes from ${randomStyle}
Random seed: ${randomSeed}

Requirements:
- Choose a well-known saying/idiom/proverb in English
- Convert it creatively into 3-6 emojis that represent the meaning
- Make it challenging but solvable
- Avoid overly obscure sayings
- Be creative and vary your approach from typical examples${excludeList}

Respond with a JSON object in this exact format:
{
  "saying": "the actual saying/idiom/proverb",
  "emojis": "the emoji representation",
  "hint": "a brief helpful hint if needed"
}

Your entire response MUST be a single, valid JSON object. DO NOT include any other text.

${t('claudePrompt')} ${locale} language`;

      const response = await window.claude.complete(prompt);
      const questionData = JSON.parse(response);
      
      setCurrentQuestion(questionData);
      setUsedSayings(prev => new Set([...prev, questionData.saying]));
      
    } catch (error) {
      console.error('Error generating question:', error);
      // Even fallback questions should be randomized
      const fallbacks = [
        { saying: "Time flies", emojis: "⏰🪰", hint: "Something about how quickly time passes" },
        { saying: "Break the ice", emojis: "🔨🧊", hint: "Starting a conversation" },
        { saying: "Spill the beans", emojis: "🫘💦", hint: "Revealing a secret" },
        { saying: "It's raining cats and dogs", emojis: "🌧️🐱🐶", hint: "Heavy rainfall" }
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setCurrentQuestion(randomFallback);
    }
    
    setIsLoading(false);
  };

  const checkAnswer = () => {
    if (!currentQuestion || !userGuess.trim()) return;
    
    const userAnswer = userGuess.toLowerCase().trim();
    const correctAnswer = currentQuestion.saying.toLowerCase();
    
    // More comprehensive answer checking for close matches
    const normalizeAnswer = (text) => {
      return text.replace(/[^\w\s]/g, '') // Remove punctuation
                 .replace(/\b(a|an|the|is|are|was|were)\b/g, '') // Remove common words
                 .replace(/\s+/g, ' ') // Normalize spaces
                 .trim();
    };
    
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    
    // Check various levels of similarity
    const isExactMatch = userAnswer === correctAnswer;
    const isCloseMatch = normalizedUser === normalizedCorrect ||
                        normalizedCorrect.includes(normalizedUser) ||
                        normalizedUser.includes(normalizedCorrect) ||
                        // Check if most words match
                        normalizedUser.split(' ').filter(word => 
                          normalizedCorrect.includes(word) && word.length > 2
                        ).length >= Math.ceil(normalizedCorrect.split(' ').length * 0.6);
    
    setShowAnswer(true);
    setTotalQuestions(prev => prev + 1);
    
    if (isExactMatch || isCloseMatch) {
      const newStreak = streak + 1;
      const points = comboMultiplier;
      
      setScore(prev => prev + points);
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      
      // Increase combo multiplier
      if (newStreak >= 5) setComboMultiplier(3);
      else if (newStreak >= 3) setComboMultiplier(2);
      
      if (isExactMatch) {
        setFeedback(`${t('perfectFeedback')} +${points} ${t('pointsSuffix')}`);
      } else {
        setFeedback(`${t('correctFeedback')} +${points} ${t('pointsSuffix')}`);
      }
    } else {
      setStreak(0);
      setComboMultiplier(1);
      setFeedback(t('tryAgainFeedback'));
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTotalQuestions(0);
    setUsedSayings(new Set());
    setStreak(0);
    setBestStreak(0);
    setComboMultiplier(1);
    generateNewQuestion();
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(null);
    setUserGuess('');
    setShowAnswer(false);
    setScore(0);
    setTotalQuestions(0);
    setUsedSayings(new Set());
    setFeedback('');
    setShowHint(false);
    setStreak(0);
    setBestStreak(0);
    setComboMultiplier(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showAnswer && userGuess.trim()) {
      checkAnswer();
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8" style={{backgroundColor: '#F1F5F9'}}>
        <div className="max-w-lg w-full text-center">
          <div className="text-5xl mb-8">🤔💭</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-8">
            {t('gameTitle')}
          </h1>
          <p className="text-2xl text-gray-600 mb-16">
            {t('gameSubtitle')}
          </p>
          
          <button
            onClick={startGame}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-12 py-6 rounded-2xl font-semibold text-2xl transition-colors flex items-center gap-4 mx-auto border border-yellow-500"
          >
            <Play size={28} fill="currentColor" />
            {t('playButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{backgroundColor: '#F1F5F9'}}>
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-3xl font-bold text-gray-900">{score}</div>
                <div className="text-base text-gray-500">{t('correctLabel')}</div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-gray-900">{totalQuestions}</div>
                <div className="text-base text-gray-500">{t('questionsLabel')}</div>
              </div>
              
              {totalQuestions > 0 && (
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {Math.round((score/totalQuestions) * 100)}%
                  </div>
                  <div className="text-base text-gray-500">{t('accuracyLabel')}</div>
                </div>
              )}
              
              {comboMultiplier > 1 && (
                <div className="bg-yellow-400 rounded-lg p-3 border border-yellow-500">
                  <div className="text-xl font-bold text-gray-900">×{comboMultiplier}</div>
                  <div className="text-sm text-gray-700">{t('comboLabel')}</div>
                </div>
              )}
            </div>
            
            <button
              onClick={resetGame}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 text-lg"
            >
              {t('resetButton')}
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-xl p-12 shadow-sm">
          {isLoading ? (
            <div className="text-center py-16">
              <RefreshCw className="animate-spin mx-auto mb-6 text-gray-400" size={40} />
              <p className="text-xl text-gray-600">{t('loadingMessage')}</p>
            </div>
          ) : currentQuestion ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-2xl text-gray-800 mb-10">
                  {t('questionPrompt')}
                </h2>
                <div className="text-8xl p-10 bg-gray-50 rounded-xl border">
                  {currentQuestion.emojis}
                  
                  {showHint && currentQuestion.hint && (
                    <div className="text-lg text-gray-600 mt-6">
                      {t('hintPrefix')} {currentQuestion.hint}
                    </div>
                  )}
                </div>
              </div>

              {!showAnswer ? (
                <div className="space-y-6">
                  <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('answerPlaceholder')}
                    className="w-full p-6 border border-gray-200 rounded-xl text-xl focus:outline-none focus:border-yellow-400"
                    autoFocus
                  />
                  
                  <div className="flex gap-4">
                    <button
                      onClick={checkAnswer}
                      disabled={!userGuess.trim()}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-4 rounded-xl font-semibold text-lg disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors border border-yellow-500 disabled:border-gray-300"
                    >
                      {t('submitButton')}
                    </button>
                    
                    {currentQuestion.hint && !showHint && (
                      <button
                        onClick={() => setShowHint(true)}
                        className="bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-colors border border-gray-300 text-lg"
                      >
                        {t('hintButton')}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 border">
                    <div className="text-2xl font-semibold text-gray-900 mb-3">
                      "{currentQuestion.saying}"
                    </div>
                    <div className="text-lg text-gray-600">{t('yourAnswerLabel')} "{userGuess}"</div>
                  </div>
                  
                  <div className="text-xl text-gray-700">
                    {feedback}
                  </div>
                  
                  <button
                    onClick={generateNewQuestion}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-colors border border-yellow-500"
                  >
                    {t('nextQuestionButton')}
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EmojiQuizGame;