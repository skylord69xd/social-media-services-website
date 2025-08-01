// DOM Elements
const telegramLink = document.getElementById('telegram-channel-link');
const feedbackForm = document.getElementById('feedback-form');
const ratingStars = document.querySelectorAll('.rating i');
const ratingInput = document.getElementById('rating');
const vouchesContainer = document.getElementById('vouches-container');
const approvedFeedbackContainer = document.getElementById('approved-feedback-container');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data from localStorage
    loadTelegramLink();
    loadVouches();
    loadApprovedFeedback();
    
    // Setup rating stars
    setupRatingStars();
    
    // Handle feedback form submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }
});

// Load Telegram link from localStorage
function loadTelegramLink() {
    const savedLink = localStorage.getItem('telegramChannelLink');
    if (savedLink && telegramLink) {
        telegramLink.href = savedLink;
    } else if (telegramLink) {
        // Default link if none is set
        telegramLink.href = "https://t.me/skylord_zr";
    }
}

// Load vouches from localStorage
function loadVouches() {
    const vouches = JSON.parse(localStorage.getItem('vouches')) || [];
    vouchesContainer.innerHTML = '';
    
    vouches.forEach(vouch => {
        const vouchCard = document.createElement('div');
        vouchCard.className = 'vouch-card';
        vouchCard.innerHTML = `
            <img src="${vouch.imageUrl}" alt="Vouch screenshot">
            <p>${vouch.description || ''}</p>
        `;
        vouchesContainer.appendChild(vouchCard);
    });
}

// Load approved feedback from localStorage
function loadApprovedFeedback() {
    const approvedFeedback = JSON.parse(localStorage.getItem('approvedFeedback')) || [];
    approvedFeedbackContainer.innerHTML = '';
    
    approvedFeedback.forEach(feedback => {
        const feedbackCard = document.createElement('div');
        feedbackCard.className = 'feedback-card';
        feedbackCard.innerHTML = `
            <div class="feedback-header">
                <span class="feedback-name">${feedback.name || 'Anonymous'}</span>
                <span class="feedback-stars">${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</span>
            </div>
            <p>${feedback.message}</p>
        `;
        approvedFeedbackContainer.appendChild(feedbackCard);
    });
}

// Setup rating stars interaction
function setupRatingStars() {
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            
            // Update star display
            ratingStars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });
    });
}

// Handle feedback form submission
function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    const rating = parseInt(ratingInput.value);
    
    if (!message || rating === 0) {
        alert('Please provide both a rating and feedback message');
        return;
    }
    
    // Save feedback to pending approval
    const feedback = {
        name,
        message,
        rating,
        timestamp: new Date().toISOString()
    };
    
    const pendingFeedback = JSON.parse(localStorage.getItem('pendingFeedback')) || [];
    pendingFeedback.push(feedback);
    localStorage.setItem('pendingFeedback', JSON.stringify(pendingFeedback));
    
    // Reset form
    feedbackForm.reset();
    ratingStars.forEach(star => {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
    });
    ratingInput.value = '0';
    
    alert('Thank you for your feedback! It will be visible after approval.');
}