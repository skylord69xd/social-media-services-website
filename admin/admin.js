// DOM Elements
const telegramLinkInput = document.getElementById('telegram-link');
const saveTelegramLinkBtn = document.getElementById('save-telegram-link');
const telegramLinkStatus = document.getElementById('telegram-link-status');
const vouchImageInput = document.getElementById('vouch-image');
const vouchDescInput = document.getElementById('vouch-desc');
const addVouchBtn = document.getElementById('add-vouch');
const vouchPreviewContainer = document.getElementById('vouch-preview-container');
const vouchStatus = document.getElementById('vouch-status');
const pendingFeedbackContainer = document.getElementById('pending-feedback-container');
const approvedFeedbackContainer = document.getElementById('admin-approved-feedback');

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Load current Telegram link
    const currentLink = localStorage.getItem('telegramChannelLink');
    if (currentLink) {
        telegramLinkInput.value = currentLink;
    }
    
    // Load vouches preview
    vouchImageInput.addEventListener('input', updateVouchPreview);
    
    // Load pending and approved feedback
    loadPendingFeedback();
    loadAdminApprovedFeedback();
    
    // Set up event listeners
    saveTelegramLinkBtn.addEventListener('click', saveTelegramLink);
    addVouchBtn.addEventListener('click', addVouch);
});

// Save Telegram link
function saveTelegramLink() {
    const link = telegramLinkInput.value.trim();
    
    if (!link) {
        telegramLinkStatus.textContent = 'Please enter a valid URL';
        telegramLinkStatus.style.color = 'red';
        return;
    }
    
    localStorage.setItem('telegramChannelLink', link);
    telegramLinkStatus.textContent = 'Telegram link updated successfully!';
    telegramLinkStatus.style.color = 'green';
    
    // Update the preview after a short delay
    setTimeout(() => {
        telegramLinkStatus.textContent = '';
    }, 3000);
}

// Update vouch preview
function updateVouchPreview() {
    const imageUrl = vouchImageInput.value.trim();
    
    if (imageUrl) {
        vouchPreviewContainer.innerHTML = `
            <p>Preview:</p>
            <img src="${imageUrl}" alt="Vouch preview" class="vouch-preview">
        `;
    } else {
        vouchPreviewContainer.innerHTML = '';
    }
}

// Add new vouch
function addVouch() {
    const imageUrl = vouchImageInput.value.trim();
    const description = vouchDescInput.value.trim();
    
    if (!imageUrl) {
        vouchStatus.textContent = 'Please enter an image URL';
        vouchStatus.style.color = 'red';
        return;
    }
    
    const newVouch = {
        imageUrl,
        description
    };
    
    const vouches = JSON.parse(localStorage.getItem('vouches')) || [];
    vouches.push(newVouch);
    localStorage.setItem('vouches', JSON.stringify(vouches));
    
    vouchStatus.textContent = 'Vouch added successfully!';
    vouchStatus.style.color = 'green';
    
    // Clear inputs
    vouchImageInput.value = '';
    vouchDescInput.value = '';
    vouchPreviewContainer.innerHTML = '';
    
    // Update the main site
    if (window.opener) {
        window.opener.loadVouches();
    }
    
    setTimeout(() => {
        vouchStatus.textContent = '';
    }, 3000);
}

// Load pending feedback
function loadPendingFeedback() {
    const pendingFeedback = JSON.parse(localStorage.getItem('pendingFeedback')) || [];
    pendingFeedbackContainer.innerHTML = '';
    
    if (pendingFeedback.length === 0) {
        pendingFeedbackContainer.innerHTML = '<p>No pending feedback to review.</p>';
        return;
    }
    
    pendingFeedback.forEach((feedback, index) => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <p><strong>${feedback.name || 'Anonymous'}</strong> - ${new Date(feedback.timestamp).toLocaleString()}</p>
            <div class="feedback-stars">${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <p>${feedback.message}</p>
            <div class="feedback-actions">
                <button class="btn btn-approve" data-index="${index}">Approve</button>
                <button class="btn btn-reject" data-index="${index}">Reject</button>
            </div>
        `;
        pendingFeedbackContainer.appendChild(feedbackItem);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', function() {
            approveFeedback(parseInt(this.getAttribute('data-index')));
        });
    });
    
    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', function() {
            rejectFeedback(parseInt(this.getAttribute('data-index')));
        });
    });
}

// Load approved feedback for admin
function loadAdminApprovedFeedback() {
    const approvedFeedback = JSON.parse(localStorage.getItem('approvedFeedback')) || [];
    approvedFeedbackContainer.innerHTML = '';
    
    if (approvedFeedback.length === 0) {
        approvedFeedbackContainer.innerHTML = '<p>No approved feedback yet.</p>';
        return;
    }
    
    approvedFeedback.forEach((feedback, index) => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <p><strong>${feedback.name || 'Anonymous'}</strong> - ${new Date(feedback.timestamp).toLocaleString()}</p>
            <div class="feedback-stars">${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <p>${feedback.message}</p>
            <button class="btn btn-reject" data-index="${index}">Remove</button>
        `;
        approvedFeedbackContainer.appendChild(feedbackItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', function() {
            removeApprovedFeedback(parseInt(this.getAttribute('data-index')));
        });
    });
}

// Approve feedback
function approveFeedback(index) {
    const pendingFeedback = JSON.parse(localStorage.getItem('pendingFeedback')) || [];
    const approvedFeedback = JSON.parse(localStorage.getItem('approvedFeedback')) || [];
    
    if (index >= 0 && index < pendingFeedback.length) {
        approvedFeedback.push(pendingFeedback[index]);
        pendingFeedback.splice(index, 1);
        
        localStorage.setItem('pendingFeedback', JSON.stringify(pendingFeedback));
        localStorage.setItem('approvedFeedback', JSON.stringify(approvedFeedback));
        
        // Reload both lists
        loadPendingFeedback();
        loadAdminApprovedFeedback();
        
        // Update the main site
        if (window.opener) {
            window.opener.loadApprovedFeedback();
        }
    }
}

// Reject feedback
function rejectFeedback(index) {
    const pendingFeedback = JSON.parse(localStorage.getItem('pendingFeedback')) || [];
    
    if (index >= 0 && index < pendingFeedback.length) {
        pendingFeedback.splice(index, 1);
        localStorage.setItem('pendingFeedback', JSON.stringify(pendingFeedback));
        loadPendingFeedback();
    }
}

// Remove approved feedback
function removeApprovedFeedback(index) {
    const approvedFeedback = JSON.parse(localStorage.getItem('approvedFeedback')) || [];
    
    if (index >= 0 && index < approvedFeedback.length) {
        approvedFeedback.splice(index, 1);
        localStorage.setItem('approvedFeedback', JSON.stringify(approvedFeedback));
        loadAdminApprovedFeedback();
        
        // Update the main site
        if (window.opener) {
            window.opener.loadApprovedFeedback();
        }
    }
}