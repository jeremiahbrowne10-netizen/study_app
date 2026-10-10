// Data storage
let flashcardDecks = {};
let quizzes = {};
let exercises = {};
let progress = {
    flashcardsStudied: 0,
    quizzesCompleted: 0,
    exercisesDone: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    activities: []
};

// Current state
let currentDeck = null;
let currentCardIndex = 0;
let currentQuiz = null;
let currentQuestionIndex = 0;
let currentExercise = null;
let currentExerciseIndex = 0;

// Pre-made content
const preMadeFlashcards = {
    'General Knowledge': [
        { front: 'What is the capital of France?', back: 'Paris' },
        { front: 'What is the largest planet in our solar system?', back: 'Jupiter' },
        { front: 'Who wrote Romeo and Juliet?', back: 'William Shakespeare' },
        { front: 'What year did World War II end?', back: '1945' },
        { front: 'What is the chemical symbol for gold?', back: 'Au' }
    ],
    'Science Basics': [
        { front: 'What is H2O?', back: 'Water' },
        { front: 'What is the speed of light?', back: '299,792,458 meters per second' },
        { front: 'What is photosynthesis?', back: 'The process by which plants convert sunlight into energy' },
        { front: 'What is gravity?', back: 'A force that attracts objects with mass toward each other' },
        { front: 'What is DNA?', back: 'Deoxyribonucleic acid - the molecule that carries genetic instructions' }
    ]
};

const preMadeQuizzes = {
    'Math Quiz': [
        {
            question: 'What is 15 + 27?',
            options: { A: '42', B: '41', C: '43', D: '40' },
            correct: 'A'
        },
        {
            question: 'What is 8 × 7?',
            options: { A: '54', B: '56', C: '58', D: '52' },
            correct: 'B'
        },
        {
            question: 'What is 100 ÷ 4?',
            options: { A: '20', B: '25', C: '24', D: '30' },
            correct: 'B'
        },
        {
            question: 'What is 12²?',
            options: { A: '122', B: '144', C: '124', D: '148' },
            correct: 'B'
        },
        {
            question: 'What is the square root of 64?',
            options: { A: '6', B: '7', C: '8', D: '9' },
            correct: 'C'
        }
    ],
    'Geography Quiz': [
        {
            question: 'Which continent is the largest?',
            options: { A: 'Africa', B: 'Asia', C: 'Europe', D: 'North America' },
            correct: 'B'
        },
        {
            question: 'What is the longest river in the world?',
            options: { A: 'Amazon', B: 'Mississippi', C: 'Nile', D: 'Yangtze' },
            correct: 'C'
        },
        {
            question: 'Which country has the most population?',
            options: { A: 'USA', B: 'India', C: 'China', D: 'Russia' },
            correct: 'C'
        }
    ]
};

const preMadeExercises = {
    'Math Problems': [
        {
            question: 'Solve for x: 2x + 5 = 15',
            solution: 'x = 5',
            explanation: 'Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5'
        },
        {
            question: 'Calculate: (3 + 4) × 2',
            solution: '14',
            explanation: 'First add 3 + 4 = 7, then multiply by 2: 7 × 2 = 14'
        },
        {
            question: 'What is 15% of 200?',
            solution: '30',
            explanation: 'Multiply 200 by 0.15: 200 × 0.15 = 30'
        }
    ],
    'Writing Prompts': [
        {
            question: 'Write a paragraph about your favorite hobby.',
            solution: 'Sample answer: My favorite hobby is reading because it allows me to explore new worlds and learn about different perspectives.',
            explanation: 'This is a creative exercise - any well-written paragraph about a hobby is acceptable.'
        }
    ]
};

// Initialize app
function init() {
    loadFromStorage();
    populateSelectors();
    setupEventListeners();
    updateProgress();
}

// Load data from localStorage
function loadFromStorage() {
    const storedFlashcards = localStorage.getItem('flashcardDecks');
    const storedQuizzes = localStorage.getItem('quizzes');
    const storedExercises = localStorage.getItem('exercises');
    const storedProgress = localStorage.getItem('progress');

    if (storedFlashcards) {
        flashcardDecks = JSON.parse(storedFlashcards);
    } else {
        flashcardDecks = { ...preMadeFlashcards };
    }

    if (storedQuizzes) {
        quizzes = JSON.parse(storedQuizzes);
    } else {
        quizzes = { ...preMadeQuizzes };
    }

    if (storedExercises) {
        exercises = JSON.parse(storedExercises);
    } else {
        exercises = { ...preMadeExercises };
    }

    if (storedProgress) {
        progress = JSON.parse(storedProgress);
    }
}

// Save data to localStorage
function saveToStorage() {
    localStorage.setItem('flashcardDecks', JSON.stringify(flashcardDecks));
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    localStorage.setItem('exercises', JSON.stringify(exercises));
    localStorage.setItem('progress', JSON.stringify(progress));
}

// Populate dropdown selectors
function populateSelectors() {
    const flashcardSelect = document.getElementById('flashcardDeckSelect');
    const quizSelect = document.getElementById('quizSelect');
    const exerciseSelect = document.getElementById('exerciseSelect');

    flashcardSelect.innerHTML = '<option value="">Select a deck...</option>';
    quizSelect.innerHTML = '<option value="">Select a quiz...</option>';
    exerciseSelect.innerHTML = '<option value="">Select an exercise...</option>';

    Object.keys(flashcardDecks).forEach(deckName => {
        const option = document.createElement('option');
        option.value = deckName;
        option.textContent = deckName;
        flashcardSelect.appendChild(option);
    });

    Object.keys(quizzes).forEach(quizName => {
        const option = document.createElement('option');
        option.value = quizName;
        option.textContent = quizName;
        quizSelect.appendChild(option);
    });

    Object.keys(exercises).forEach(exerciseName => {
        const option = document.createElement('option');
        option.value = exerciseName;
        option.textContent = exerciseName;
        exerciseSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            navigateTo(section);
        });
    });

    // Mobile menu toggle
    document.getElementById('navToggle').addEventListener('click', () => {
        document.getElementById('navMenu').classList.toggle('active');
    });

    // Flashcard deck selection
    document.getElementById('flashcardDeckSelect').addEventListener('change', (e) => {
        currentDeck = e.target.value;
        currentCardIndex = 0;
        if (currentDeck) {
            displayFlashcard();
        }
    });

    // Flashcard flip
    document.getElementById('flashcard').addEventListener('click', () => {
        if (currentDeck) {
            document.getElementById('flashcard').classList.toggle('flipped');
        }
    });

    // Flashcard navigation
    document.getElementById('prevCard').addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            displayFlashcard();
        }
    });

    document.getElementById('nextCard').addEventListener('click', () => {
        if (currentDeck && currentCardIndex < flashcardDecks[currentDeck].length - 1) {
            currentCardIndex++;
            displayFlashcard();
        }
    });

    // Flashcard marking
    document.getElementById('markKnown').addEventListener('click', () => {
        if (currentDeck) {
            progress.flashcardsStudied++;
            progress.correctAnswers++;
            progress.totalAnswers++;
            addActivity('Studied a flashcard (Known)');
            saveToStorage();
            updateProgress();
            moveToNextCard();
        }
    });

    document.getElementById('markUnknown').addEventListener('click', () => {
        if (currentDeck) {
            progress.flashcardsStudied++;
            progress.totalAnswers++;
            addActivity('Studied a flashcard (Need Practice)');
            saveToStorage();
            updateProgress();
            moveToNextCard();
        }
    });

    // Quiz selection
    document.getElementById('quizSelect').addEventListener('change', (e) => {
        currentQuiz = e.target.value;
        currentQuestionIndex = 0;
        if (currentQuiz) {
            displayQuizQuestion();
        }
    });

    // Next question button
    document.getElementById('nextQuestion').addEventListener('click', () => {
        if (currentQuiz && currentQuestionIndex < quizzes[currentQuiz].length - 1) {
            currentQuestionIndex++;
            displayQuizQuestion();
        } else {
            alert('Quiz completed!');
            progress.quizzesCompleted++;
            addActivity(`Completed quiz: ${currentQuiz}`);
            saveToStorage();
            updateProgress();
        }
    });

    // Exercise selection
    document.getElementById('exerciseSelect').addEventListener('change', (e) => {
        currentExercise = e.target.value;
        currentExerciseIndex = 0;
        if (currentExercise) {
            displayExercise();
        }
    });

    // Submit exercise
    document.getElementById('submitExercise').addEventListener('click', () => {
        if (currentExercise) {
            const userAnswer = document.getElementById('exerciseAnswer').value.trim();
            const correctAnswer = exercises[currentExercise][currentExerciseIndex].solution;
            
            const feedback = document.getElementById('exerciseFeedback');
            const solution = document.getElementById('exerciseSolution');
            
            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase() || 
                userAnswer.includes(correctAnswer) || 
                correctAnswer.includes(userAnswer)) {
                feedback.textContent = 'Correct! Great job!';
                feedback.className = 'exercise-feedback correct';
                progress.correctAnswers++;
            } else {
                feedback.textContent = 'Not quite right. Check the solution below.';
                feedback.className = 'exercise-feedback incorrect';
            }
            
            progress.totalAnswers++;
            progress.exercisesDone++;
            solution.innerHTML = `
                <strong>Solution:</strong> ${correctAnswer}<br>
                <small>${exercises[currentExercise][currentExerciseIndex].explanation || ''}</small>
            `;
            solution.style.display = 'block';
            
            addActivity('Completed an exercise');
            saveToStorage();
            updateProgress();
        }
    });

    // Create tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(e.target.dataset.tab).classList.add('active');
        });
    });

    // Create flashcard form
    document.getElementById('flashcardForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const deckName = document.getElementById('flashcardDeck').value;
        const front = document.getElementById('flashcardFrontInput').value;
        const back = document.getElementById('flashcardBackInput').value;

        if (!flashcardDecks[deckName]) {
            flashcardDecks[deckName] = [];
        }

        flashcardDecks[deckName].push({ front, back });
        saveToStorage();
        populateSelectors();
        e.target.reset();
        alert('Flashcard added successfully!');
        addActivity(`Created flashcard in deck: ${deckName}`);
    });

    // Create quiz form
    document.getElementById('quizForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const quizName = document.getElementById('quizName').value;
        const question = document.getElementById('quizQuestionInput').value;
        const optionA = document.getElementById('quizOptionA').value;
        const optionB = document.getElementById('quizOptionB').value;
        const optionC = document.getElementById('quizOptionC').value;
        const optionD = document.getElementById('quizOptionD').value;
        const correct = document.getElementById('quizCorrectAnswer').value;

        if (!quizzes[quizName]) {
            quizzes[quizName] = [];
        }

        quizzes[quizName].push({
            question,
            options: { A: optionA, B: optionB, C: optionC, D: optionD },
            correct
        });

        saveToStorage();
        populateSelectors();
        e.target.reset();
        alert('Quiz question added successfully!');
        addActivity(`Created quiz question in: ${quizName}`);
    });

    // Create exercise form
    document.getElementById('exerciseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const setName = document.getElementById('exerciseSetName').value;
        const question = document.getElementById('exerciseQuestionInput').value;
        const solution = document.getElementById('exerciseSolutionInput').value;
        const explanation = document.getElementById('exerciseExplanation').value;

        if (!exercises[setName]) {
            exercises[setName] = [];
        }

        exercises[setName].push({ question, solution, explanation });
        saveToStorage();
        populateSelectors();
        e.target.reset();
        alert('Exercise added successfully!');
        addActivity(`Created exercise in: ${setName}`);
    });
}

// Navigation
function navigateTo(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
    
    document.getElementById(section).classList.add('active');
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Close mobile menu
    document.getElementById('navMenu').classList.remove('active');
}

// Display flashcard
function displayFlashcard() {
    const card = flashcardDecks[currentDeck][currentCardIndex];
    document.getElementById('flashcardFront').textContent = card.front;
    document.getElementById('flashcardBack').textContent = card.back;
    document.getElementById('cardCounter').textContent = `${currentCardIndex + 1} / ${flashcardDecks[currentDeck].length}`;
    document.getElementById('flashcard').classList.remove('flipped');
}

// Move to next card
function moveToNextCard() {
    if (currentCardIndex < flashcardDecks[currentDeck].length - 1) {
        currentCardIndex++;
        displayFlashcard();
    } else {
        alert('Deck completed!');
    }
}

// Display quiz question
function displayQuizQuestion() {
    const quiz = quizzes[currentQuiz][currentQuestionIndex];
    document.getElementById('quizQuestion').textContent = quiz.question;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    Object.entries(quiz.options).forEach(([key, value]) => {
        const option = document.createElement('div');
        option.className = 'quiz-option';
        option.textContent = `${key}. ${value}`;
        option.addEventListener('click', () => selectQuizOption(key, quiz.correct, option));
        optionsContainer.appendChild(option);
    });
    
    document.getElementById('quizFeedback').style.display = 'none';
    document.getElementById('nextQuestion').style.display = 'none';
    document.getElementById('quizCounter').textContent = `Question ${currentQuestionIndex + 1} of ${quizzes[currentQuiz].length}`;
    
    const progressPercent = ((currentQuestionIndex) / quizzes[currentQuiz].length) * 100;
    document.getElementById('quizProgress').style.width = `${progressPercent}%`;
}

// Select quiz option
function selectQuizOption(selected, correct, element) {
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.style.pointerEvents = 'none';
    });
    
    element.classList.add('selected');
    
    const feedback = document.getElementById('quizFeedback');
    
    if (selected === correct) {
        element.classList.add('correct');
        feedback.textContent = 'Correct! Great job!';
        feedback.className = 'quiz-feedback correct';
        progress.correctAnswers++;
    } else {
        element.classList.add('incorrect');
        document.querySelector(`.quiz-option:nth-child(${correct.charCodeAt(0) - 64})`).classList.add('correct');
        feedback.textContent = `Incorrect. The correct answer is ${correct}.`;
        feedback.className = 'quiz-feedback incorrect';
    }
    
    progress.totalAnswers++;
    addActivity('Answered a quiz question');
    saveToStorage();
    updateProgress();
    
    document.getElementById('nextQuestion').style.display = 'block';
}

// Display exercise
function displayExercise() {
    const exercise = exercises[currentExercise][currentExerciseIndex];
    document.getElementById('exerciseQuestion').textContent = exercise.question;
    document.getElementById('exerciseAnswer').value = '';
    document.getElementById('exerciseFeedback').style.display = 'none';
    document.getElementById('exerciseSolution').style.display = 'none';
}

// Update progress display
function updateProgress() {
    document.getElementById('totalFlashcards').textContent = progress.flashcardsStudied;
    document.getElementById('totalQuizzes').textContent = progress.quizzesCompleted;
    document.getElementById('totalExercises').textContent = progress.exercisesDone;
    
    const accuracy = progress.totalAnswers > 0 
        ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100) 
        : 0;
    document.getElementById('accuracyRate').textContent = `${accuracy}%`;
    
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    progress.activities.slice(-10).reverse().forEach(activity => {
        const li = document.createElement('li');
        li.textContent = activity;
        activityList.appendChild(li);
    });
}

// Add activity
function addActivity(activity) {
    const timestamp = new Date().toLocaleString();
    progress.activities.push(`${timestamp}: ${activity}`);
    if (progress.activities.length > 50) {
        progress.activities = progress.activities.slice(-50);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
