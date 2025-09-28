import React, { useState, useCallback, KeyboardEvent, ChangeEvent, useEffect } from 'react';

// --- EXPANDED RANDOM ANSWERS ---
const randomAnswers = [
  "Aura answers only to its master.",
  "Not in the mood to answer.",
  "The ether is silent on this matter...",
  "The stars do not align for such a query.",
  "That is a question for another time.",
  "Seek the answer within yourself.",
  "The future is clouded, ask again later.",
  "Consult the void, for it holds what you seek.",
  "Energy signatures are unclear. Rephrase your petition.",
  "The path you walk is your own to discover.",
  "A whisper on the cosmic wind is your only reply.",
];

// --- CHILD COMPONENTS ---

const Header: React.FC = () => (
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold text-cyan-300 text-glow-cyan">Aura Replies</h1>
    <p className="text-cyan-200/70 mt-2">The digital ether speaks.</p>
  </div>
);

const AuraCoreAnimation: React.FC<{ isThinking: boolean }> = ({ isThinking }) => (
  <div className={`aura-core mb-8 ${isThinking ? 'thinking' : ''}`}>
    <div className="aura-ring aura-ring-1"></div>
    <div className="aura-ring aura-ring-2"></div>
    <div className="aura-ring aura-ring-3"></div>
    <div className="aura-spark"></div>
  </div>
);

interface AuraFormProps {
  petitionDisplay: string;
  question: string;
  isHiding: boolean;
  showAnswer: boolean;
  handlePetitionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePetitionKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  setQuestion: (value: string) => void;
  handleAskAura: () => void;
}

const AuraForm: React.FC<AuraFormProps> = (props) => (
  <>
    <div className="space-y-6">
      <div className="relative">
        <label htmlFor="petition" className="block text-sm font-medium text-cyan-300 mb-2">Petition</label>
        <input
          id="petition"
          type="text"
          placeholder="Begin your petition..."
          className={`w-full bg-gray-900/80 border-2 border-cyan-600 focus:border-cyan-400 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.2)] ${props.isHiding ? 'input-hiding-glow' : ''}`}
          value={props.petitionDisplay}
          onChange={props.handlePetitionChange}
          onKeyDown={props.handlePetitionKeyDown}
          disabled={props.showAnswer}
          autoComplete="off"
        />
      </div>
      <div className="relative">
         <label htmlFor="question" className="block text-sm font-medium text-cyan-300 mb-2">Question</label>
        <input
          id="question"
          type="text"
          placeholder="Ask your public question..."
          className="w-full bg-gray-900/80 border-2 border-cyan-600 focus:border-cyan-400 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
          value={props.question}
          onChange={(e) => props.setQuestion(e.target.value)}
          disabled={props.showAnswer}
        />
      </div>
    </div>
    <div className="mt-8">
      <button
        onClick={props.handleAskAura}
        disabled={!props.question || !props.petitionDisplay}
        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:text-gray-400 text-white font-bold text-lg py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 shadow-[0_0_25px_rgba(0,255,255,0.6)]"
      >
        Ask Aura
      </button>
    </div>
  </>
);

interface AuraResponseProps {
  typedAnswer: string;
  handleReset: () => void;
}

const AuraResponse: React.FC<AuraResponseProps> = ({ typedAnswer, handleReset }) => (
  <div className="text-center p-6 bg-gray-900/80 rounded-xl border-2 border-cyan-500 shadow-[0_0_25px_rgba(0,255,255,0.4)] animate-fade-in">
    <p className="text-lg text-cyan-200/80 mb-2">Aura's response:</p>
    <p className="text-3xl font-bold text-cyan-300 text-glow-cyan break-words min-h-[44px]">
      {typedAnswer}
    </p>
    <button
      onClick={handleReset}
      className="mt-6 bg-transparent hover:bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold py-2 px-6 rounded-full transition-colors duration-300"
    >
      Ask Another
    </button>
  </div>
);

const Footer: React.FC = () => (
    <div className="absolute bottom-4 text-center w-full text-cyan-200/30 text-xs">
        <p>Developed by AuraTech Vision</p>
    </div>
);

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [petitionDisplay, setPetitionDisplay] = useState('');
  const [question, setQuestion] = useState('');
  const [hiddenAnswer, setHiddenAnswer] = useState('');
  const [isHiding, setIsHiding] = useState(false);
  
  const [finalAnswer, setFinalAnswer] = useState('');
  const [typedAnswer, setTypedAnswer] = useState(''); // For typewriter effect
  const [isThinking, setIsThinking] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const PETITION_PHRASE = 'Aura please answer the following question.';

  // --- Typewriter Effect ---
  useEffect(() => {
    if (showAnswer && finalAnswer) {
      setTypedAnswer(''); // Reset before typing
      if (finalAnswer.length > 0) {
        const interval = setInterval(() => {
          setTypedAnswer((prev) => {
            if (prev.length < finalAnswer.length) {
              return finalAnswer.substring(0, prev.length + 1);
            } else {
              clearInterval(interval);
              return prev;
            }
          });
        }, 50); // Typing speed
        return () => clearInterval(interval);
      }
    }
  }, [finalAnswer, showAnswer]);

  // --- MOBILE & DESKTOP COMPATIBLE PETITION HANDLING ---
  const handlePetitionChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (showAnswer) return;

    const newValue = e.target.value;
    const oldValue = petitionDisplay;

    // If not in hiding mode, handle normally
    if (!isHiding) {
      // Check if user just typed a dot on an empty field (start hiding mode)
      if (newValue === '.' && oldValue === '') {
        setIsHiding(true);
        setHiddenAnswer('');
        setPetitionDisplay(PETITION_PHRASE.substring(0, 1)); // Show "A"
        return;
      }
      // Normal mode - just update the display
      setPetitionDisplay(newValue);
      return;
    }

    // In hiding mode - handle character input
    const expectedDisplayLength = hiddenAnswer.length + 1; // +1 for the initial "A"

    if (newValue.length < expectedDisplayLength) {
      // User is deleting
      if (hiddenAnswer.length > 0) {
        const newHidden = hiddenAnswer.slice(0, -1);
        setHiddenAnswer(newHidden);
        setPetitionDisplay(PETITION_PHRASE.substring(0, newHidden.length + 1));
      } else {
        // Exit hiding mode if no hidden answer left
        setIsHiding(false);
        setPetitionDisplay('');
      }
    } else if (newValue.length > expectedDisplayLength) {
      // User added characters
      const addedChars = newValue.length - expectedDisplayLength;
      
      // Process each added character
      for (let i = 0; i < addedChars; i++) {
        const newChar = newValue[expectedDisplayLength + i];
        
        if (newChar === '.') {
          // End hiding mode when dot is encountered
          setIsHiding(false);
          setPetitionDisplay(PETITION_PHRASE);
          return;
        } else {
          // Add to hidden answer and advance display
          const newHidden = hiddenAnswer + newChar;
          setHiddenAnswer(newHidden);
          
          if ((newHidden.length + 1) >= PETITION_PHRASE.length) {
            // Auto-complete and exit hiding mode
            setIsHiding(false);
            setPetitionDisplay(PETITION_PHRASE);
            return;
          } else {
            setPetitionDisplay(PETITION_PHRASE.substring(0, newHidden.length + 1));
          }
        }
      }
    }
  }, [isHiding, showAnswer, hiddenAnswer, petitionDisplay, PETITION_PHRASE]);

  const handlePetitionKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (showAnswer) {
      e.preventDefault();
      return;
    }

    // Handle desktop-specific shortcuts
    if (isHiding) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsHiding(false);
        setPetitionDisplay('');
        setHiddenAnswer('');
      }
      // Let onChange handle the rest for better mobile compatibility
    } else {
      // Not in hiding mode - let onChange handle dot detection
    }
  }, [isHiding, showAnswer]);

  const handleAskAura = () => {
    setIsThinking(true);
    setTimeout(() => {
      let answerToSet = '';
      if (hiddenAnswer) {
        answerToSet = hiddenAnswer;
      } else {
        const randomIndex = Math.floor(Math.random() * randomAnswers.length);
        answerToSet = randomAnswers[randomIndex];
      }
      setFinalAnswer(answerToSet);
      setIsThinking(false);
      setShowAnswer(true);
    }, 2500); // Thinking duration
  };
  
  const handleReset = () => {
    setPetitionDisplay('');
    setQuestion('');
    setHiddenAnswer('');
    setFinalAnswer('');
    setTypedAnswer('');
    setIsHiding(false);
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-4 font-mono overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient"></div>
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <AuraCoreAnimation isThinking={isThinking || showAnswer} />
        <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-cyan-500/30 shadow-cyan-500/20">
          <Header />
          {!showAnswer ? (
            <AuraForm
              petitionDisplay={petitionDisplay}
              question={question}
              isHiding={isHiding}
              showAnswer={showAnswer}
              handlePetitionChange={handlePetitionChange}
              handlePetitionKeyDown={handlePetitionKeyDown}
              setQuestion={setQuestion}
              handleAskAura={handleAskAura}
            />
          ) : (
            <AuraResponse typedAnswer={typedAnswer} handleReset={handleReset} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
