document.addEventListener('DOMContentLoaded', function() {
    // Google AI Studio API Key
    const apiKey = ''; // Replace with your actual API key

    // DOM Elements - Forms and containers
    const studentForm = document.getElementById('studentForm');
    const questionForm = document.getElementById('questionForm');
    const registrationForm = document.getElementById('registrationForm');
    const chatInterface = document.getElementById('chatInterface');
    const aboutSection = document.getElementById('aboutSection');
    const servicesSection = document.getElementById('servicesSection');
    const schoolsSection = document.getElementById('schoolsSection');
    const developersSection = document.getElementById('developersSection');
    
    // DOM Elements - Others
    const studentNameSpan = document.getElementById('studentName');
    const loadingIndicator = document.getElementById('loading');
    const responseDiv = document.getElementById('response');
    const responseContent = document.getElementById('responseContent');
    const backButton = document.getElementById('backButton');
    
    // Navigation elements
    const navHome = document.getElementById('nav-home');
    const navAbout = document.getElementById('nav-about');
    const navServices = document.getElementById('nav-services');
    const navSchools = document.getElementById('nav-schools');
    const navDevelopers = document.getElementById('nav-developers');
    
    // Back buttons
    const backToHomeButtons = [
        document.getElementById('backToHomeFromAbout'),
        document.getElementById('backToHomeFromServices'),
        document.getElementById('backToHomeFromSchools'),
        document.getElementById('backToHomeFromDevs')
    ];
    
    // Helper function to hide all sections
    function hideAllSections() {
        registrationForm.style.display = 'none';
        chatInterface.style.display = 'none';
        aboutSection.style.display = 'none';
        servicesSection.style.display = 'none';
        schoolsSection.style.display = 'none';
        developersSection.style.display = 'none';
    }
    
    // Helper function to show section
    function showSection(section) {
        hideAllSections();
        section.style.display = 'block';
    }
    
    // Helper function to show home
    function showHome() {
        const savedName = localStorage.getItem('studentName');
        const savedEmail = localStorage.getItem('studentEmail');
        if (savedName && savedEmail) {
            showSection(chatInterface);
            studentNameSpan.textContent = savedName;
        } else {
            showSection(registrationForm);
        }
    }

    // Navigation click handlers
    navHome.addEventListener('click', showHome);
    navAbout.addEventListener('click', () => showSection(aboutSection));
    navServices.addEventListener('click', () => showSection(servicesSection));
    navSchools.addEventListener('click', () => showSection(schoolsSection));
    navDevelopers.addEventListener('click', () => showSection(developersSection));
    
    // Back to home buttons
    backToHomeButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', showHome);
        }
    });
    
    // Handle student registration
    studentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        // Store student info
        localStorage.setItem('studentName', name);
        localStorage.setItem('studentEmail', email);
        
        // Show chat interface
        showSection(chatInterface);
        studentNameSpan.textContent = name;
    });
    
    // Handle question submission
    questionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const question = document.getElementById('question').value;
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        responseDiv.classList.add('hidden');
        backButton.style.display = 'none';
        
        try {
            console.log("Sending request to Google Gemini API...");
// Make API request to Google Gemini API
const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/ggemini-2.0-flash:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
      // In the Gemini API, questions and context are incorporated within the "contents" array.
      contents: [
        {
            parts: [
              {
                text: `I am a student from University of Juba. Please provide a comprehensive, educational answer to my question: ${question}`
              }
            ]
        }
    ]
  })
});

const result = await response.json();
            
            if (response.ok) {
                responseContent.innerHTML = result.answer;
            } else {
                console.error("Error response:", result);
                responseContent.innerHTML = "Sorry, there was an error getting your answer. Please try again.";
            }
            
            loadingIndicator.classList.add('hidden');
            responseDiv.classList.remove('hidden');
            backButton.style.display = 'block';
        } catch (err) {
            console.error("Error:", err);
            responseContent.innerHTML = "Sorry, there was an error connecting to the AI tutor. Please try again later.";
            loadingIndicator.classList.add('hidden');
            responseDiv.classList.remove('hidden');
            backButton.style.display = 'block';
        }
    });
    
    // Handle back button
    backButton.addEventListener('click', function() {
        responseDiv.classList.add('hidden');
        backButton.style.display = 'none';
        document.getElementById('question').value = '';
    });
    
    // Initialize the app - show home
    showHome();
});