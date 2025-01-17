// Import Google's Generative AI
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Constants
const MAX_SUBJECT_LINES = 5;
const API_KEY = 'AIzaSyCzfo30VbbWdrdXKr1-dQBBZqx7R1xvnwQ';

// DOM Elements
const emailContent = document.getElementById('emailContent');
const generateBtn = document.getElementById('generateBtn');
const loadingElement = document.getElementById('loading');
const resultsElement = document.getElementById('results');
const subjectLinesList = document.getElementById('subjectLines');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

// Event Listeners
generateBtn.addEventListener('click', generateSubjectLines);

async function generateSubjectLines() {
    const content = emailContent.value.trim();
    
    if (!content) {
        alert('Please enter your email content first!');
        return;
    }

    // Show loading state
    loadingElement.style.display = 'block';
    resultsElement.style.display = 'none';
    generateBtn.disabled = true;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `As an expert email marketer, create ${MAX_SUBJECT_LINES} engaging subject lines for the following email content. Follow these guidelines:

1. Keep each subject line under 50 characters
2. Make them sound natural and conversational
3. Avoid clickbait or overly salesy language
4. Include action words but stay professional
5. Focus on the main benefit or key message
6. Make each one unique in approach
7. Format as a numbered list

Email content:
${content}

Remember: Be concise, compelling, and human. Write as if you're emailing a colleague or client you respect.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Process the response
        const subjectLines = processSubjectLines(text);
        displaySubjectLines(subjectLines);
    } catch (error) {
        console.error('Error details:', error);
        alert('Error generating subject lines: ' + error.message);
    } finally {
        // Hide loading state
        loadingElement.style.display = 'none';
        generateBtn.disabled = false;
    }
}

function processSubjectLines(content) {
    // Split the content into lines and clean them up
    return content.split('\n')
        .map(line => line.replace(/^\d+[\.\)-]\s*/, '').trim())
        .filter(line => line.length > 0 && line.length <= 50); // Ensure lines aren't too long
}

function displaySubjectLines(subjectLines) {
    subjectLinesList.innerHTML = '';
    
    subjectLines.forEach(subject => {
        const li = document.createElement('li');
        li.textContent = subject;
        li.addEventListener('click', () => {
            navigator.clipboard.writeText(subject);
            const originalText = li.textContent;
            li.textContent = 'Copied! 📋';
            li.classList.add('copied');
            setTimeout(() => {
                li.textContent = originalText;
                li.classList.remove('copied');
            }, 1500);
        });
        subjectLinesList.appendChild(li);
    });

    resultsElement.style.display = 'block';
} 