 <script>
    // Sample books data
    const books = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        translator: "Rahman Ahmed",
        language: "en-to-bn",
        description: "A classic American novel about the American Dream and the Jazz Age",
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
        dateAdded: "2024-12-25",
        fileSize: "3.1 MB"
      }
    ];

    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
      displayBooks();
      setupNavigation();
    });

    // Display books
    function displayBooks() {
      const grid = document.getElementById('booksGrid');
      grid.innerHTML = '';

      books.forEach(book => {
        const bookCard = createBookCard(book);
        grid.appendChild(bookCard);
      });
    }

    // Create book card
    function createBookCard(book) {
      const languageIcon = book.language === 'en-to-bn' ? '🇬🇧→🇧🇩' : '🇧🇩→🇬🇧';
      const languageText = book.language === 'en-to-bn' ? 'English to Bangla' : 'Bangla to English';
      
      const bookCard = document.createElement('div');
      bookCard.className = 'book-card';
      bookCard.innerHTML = `
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
            <a href="#" class="btn btn-primary">
              📖 Read PDF
            </a>
            <a href="#" class="btn btn-secondary">
              ⬇️ Download
            </a>
          </div>
        </div>
      `;
      
      return bookCard;
    }

    // Escape HTML
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Setup navigation
    function setupNavigation() {
      const navbar = document.getElementById('navbar');
      
      // Change navbar on scroll
      window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });

      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  </script>
