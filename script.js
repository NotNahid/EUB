// Global variables
let books = [];
let translators = new Set();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Initialize the application with sample data
function initializeApp() {
    addSampleBooks();
    console.log('BornoBridge application initialized!');
}

// Set up event listeners
function setupEventListeners() {
    // File input display update
    document.getElementById('pdfFile').addEventListener('change', function(e) {
        const fileName = e.target.files[0]?.name || 'Choose PDF file or drag & drop here';
        document.querySelector('.file-input-display span:last-child').textContent = fileName;
    });

    // Form submission on Enter key
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            addBook();
        }
    });
}

// Add a new book translation
function addBook() {
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('originalAuthor').value.trim();
    const translator = document.getElementById('translator').value.trim();
    const language = document.getElementById('language').value;
    const description = document.getElementById('description').value.trim();
    const pdfFile = document.getElementById('pdfFile').files[0];

    // Validation
    if (!validateBookForm(title, author, translator, language, pdfFile)) {
        return;
    }

    // Create a URL for the PDF file (in a real app, you'd upload this to a server)
    const pdfUrl = URL.createObjectURL(pdfFile);

    const book = {
        id: Date.now(),
        title: title,
        author: author,
        translator: translator,
        language: language,
        description: description,
        pdfUrl: pdfUrl,
        fileName: pdfFile.name,
        dateAdded: new Date().toLocaleDateString(),
        fileSize: formatFileSize(pdfFile.size)
    };

    books.push(book);
    translators.add(translator);
    
    displayBooks();
    updateStats();
    clearForm();
    
    // Show success message
    showNotification('Book added successfully!', 'success');
}

// Validate the book form
function validateBookForm(title, author, translator, language, pdfFile) {
    if (!title) {
        showNotification('Please enter the book title.', 'error');
        return false;
    }
    
    if (!author) {
        showNotification('Please enter the original author.', 'error');
        return false;
    }
    
    if (!translator) {
        showNotification('Please enter the translator name.', 'error');
        return false;
    }
    
    if (!language) {
        showNotification('Please select translation direction.', 'error');
        return false;
    }
    
    if (!pdfFile) {
        showNotification('Please select a PDF file.', 'error');
        return false;
    }
    
    if (pdfFile.type !== 'application/pdf') {
        showNotification('Please select a valid PDF file.', 'error');
        return false;
    }
    
    if (pdfFile.size > 10 * 1024 * 1024) { // 10MB limit
        showNotification('File size should be less than 10MB.', 'error');
        return false;
    }
    
    return true;
}

// Display all books in the grid
function displayBooks() {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';

    if (books.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: white; font-size: 1.2rem;">No books added yet. Add your first translation above!</p>';
        return;
    }

    books.forEach(book => {
        const bookCard = createBookCard(book);
        grid.appendChild(bookCard);
    });
}

// Create a book card element
function createBookCard(book) {
    const languageIcon = book.language === 'en-to-bn' ? '🇬🇧→🇧🇩' : '🇧🇩→🇬🇧';
    const languageText = book.language === 'en-to-bn' ? 'English to Bangla' : 'Bangla to English';
    
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
        <button class="delete-btn" onclick="deleteBook(${book.id})" title="Delete book">×</button>
        <div class="book-cover">
            📚
        </div>
        <div class="book-info">
            <div class="book-title">${escapeHtml(book.title)}</div>
            <div class="book-meta">
                <div><strong>Original Author:</strong> ${escapeHtml(book.author)}</div>
                <div><strong>Translator:</strong> ${escapeHtml(book.translator)}</div>
                <div><strong>Direction:</strong> ${languageIcon} ${languageText}</div>
                <div><strong>Added:</strong> ${book.dateAdded}</div>
                <div><strong>File Size:</strong> ${book.fileSize}</div>
                ${book.description ? `<div><strong>Description:</strong> ${escapeHtml(book.description)}</div>` : ''}
            </div>
            <div class="book-actions">
                <a href="${book.pdfUrl}" target="_blank" class="btn btn-primary">
                    📖 Read PDF
                </a>
                <a href="${book.pdfUrl}" download="${book.fileName}" class="btn btn-secondary">
                    ⬇️ Download
                </a>
            </div>
        </div>
    `;
    
    return bookCard;
}

// Delete a book
function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        const bookIndex = books.findIndex(book => book.id === bookId);
        
        if (bookIndex !== -1) {
            // Revoke the object URL to free up memory
            URL.revokeObjectURL(books[bookIndex].pdfUrl);
            
            // Remove the book
            books.splice(bookIndex, 1);
            
            // Rebuild translators set
            translators.clear();
            books.forEach(book => translators.add(book.translator));
            
            displayBooks();
            updateStats();
            
            showNotification('Book deleted successfully!', 'success');
        }
    }
}

// Update statistics
function updateStats() {
    document.getElementById('totalBooks').textContent = books.length;
    document.getElementById('totalTranslators').textContent = translators.size;
}

// Clear the form
function clearForm() {
    document.getElementById('bookTitle').value = '';
    document.getElementById('originalAuthor').value = '';
    document.getElementById('translator').value = '';
    document.getElementById('language').value = '';
    document.getElementById('description').value = '';
    document.getElementById('pdfFile').value = '';
    document.querySelector('.file-input-display span:last-child').textContent = 'Choose PDF file or drag & drop here';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Add sample books for demonstration
function addSampleBooks() {
    const sampleBooks = [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            translator: "Rahman Ahmed",
            language: "en-to-bn",
            description: "A classic American novel about the American Dream and the Jazz Age",
            pdfUrl: "#",
            fileName: "great-gatsby-bangla.pdf",
            dateAdded: "2024-12-15",
            fileSize: "2.3 MB"
        },
        {
            id: 2,
            title: "Pather Panchali",
            author: "Bibhutibhushan Bandyopadhyay",
            translator: "Sarah Johnson",
            language: "bn-to-en",
            description: "A beloved Bengali novel about rural life in Bengal",
            pdfUrl: "#",
            fileName: "pather-panchali-english.pdf",
            dateAdded: "2024-12-20",
            fileSize: "1.8 MB"
        },
        {
            id: 3,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            translator: "Fatima Khatun",
            language: "en-to-bn",
            description: "A novel about racial injustice and moral growth",
            pdfUrl: "#",
            fileName: "mockingbird-bangla.pdf",
            dateAdded: "2024-12-25",
            fileSize: "3.1 MB"
        }
    ];

    books = sampleBooks;
    sampleBooks.forEach(book => translators.add(book.translator));
    displayBooks();
    updateStats();
}

// Search functionality (bonus feature)
function searchBooks(query) {
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.translator.toLowerCase().includes(query.toLowerCase())
    );
    
    displayFilteredBooks(filteredBooks);
}

// Display filtered books
function displayFilteredBooks(filteredBooks) {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';

    if (filteredBooks.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: white; font-size: 1.2rem;">No books found matching your search.</p>';
        return;
    }

    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book);
        grid.appendChild(bookCard);
    });
}
