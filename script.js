let books = JSON.parse(localStorage.getItem('books')) || [];

const initialBooks = [
    {
        id: 1,
        title: "Wiedźmin: Ostatnie życzenie",
        author: "Andrzej Sapkowski",
        cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400",
        desc: "Zbiór opowiadań fantasy, który wprowadza nas w świat Geralta z Rivii. Genialna kreacja świata, dekonstrukcja klasycznych baśni i unikalny styl autora sprawiają, że to pozycja obowiązkowa."
    },
    {
        id: 2,
        title: "Hobbit, czyli tam i z powrotem",
        author: "J.R.R. Tolkien",
        cover: "",
        desc: "Klasyka literatury fantasy. Historia Bilbo Bagginsa, który wyrusza w wielką i niebezpieczną podróż, by wraz z krasnoludami odzyskać ich dawne królestwo z rąk smoka Smauga."
    }
];

if (books.length === 0) {
    books = initialBooks;
    localStorage.setItem('books', JSON.stringify(books));
}

const sectionList = document.getElementById('section-list');
const sectionAdd = document.getElementById('section-add');
const btnShowList = document.getElementById('btn-show-list');
const btnShowAdd = document.getElementById('btn-show-add');
const booksGrid = document.getElementById('books-grid');
const emptyState = document.getElementById('empty-state');
const searchBar = document.getElementById('search-bar');
const addBookForm = document.getElementById('add-book-form');
const navLogo = document.getElementById('nav-logo');

const modal = document.getElementById('book-modal');
const closeModal = document.querySelector('.close-modal');
const modalCover = document.getElementById('modal-cover');
const modalTitle = document.getElementById('modal-title');
const modalAuthor = document.getElementById('modal-author');
const modalDesc = document.getElementById('modal-desc');

function showListView() {
    sectionList.classList.remove('hidden');
    sectionAdd.classList.add('hidden');
    btnShowList.classList.add('active');
    btnShowAdd.classList.remove('active');
    renderBooks(books);
}

function showAddView() {
    sectionAdd.classList.remove('hidden');
    sectionList.classList.add('hidden');
    btnShowAdd.classList.add('active');
    btnShowList.classList.remove('active');
}

btnShowList.addEventListener('click', showListView);
btnShowAdd.addEventListener('click', showAddView);
navLogo.addEventListener('click', (e) => { e.preventDefault(); showListView(); });
document.getElementById('btn-cancel').addEventListener('click', showListView);

function renderBooks(booksToRender) {
    booksGrid.innerHTML = '';
    
    if (booksToRender.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');

    booksToRender.forEach(book => {
        const coverSrc = book.cover ? book.cover : 'https://placehold.co/220x280/1e293b/f8fafc?text=Brak+Okładki';
        
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="cover-wrapper">
                <img src="${coverSrc}" alt="Okładka ${book.title}" onerror="this.src='https://placehold.co/220x280/1e293b/f8fafc?text=Brak+Okładki'">
            </div>
            <div class="book-info">
                <h3 class="book-title" title="${book.title}">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <button class="btn-details" data-id="${book.id}">Szczegóły</button>
            </div>
        `;
        booksGrid.appendChild(card);
    });

    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            openBookModal(id);
        });
    });
}

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm)
    );
    renderBooks(filtered);
});

function openBookModal(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    modalTitle.textContent = book.title;
    modalAuthor.textContent = book.author;
    modalDesc.textContent = book.desc;
    modalCover.src = book.cover ? book.cover : 'https://placehold.co/220x280/1e293b/f8fafc?text=Brak+Okładki';

    modal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const cover = document.getElementById('book-cover').value.trim();
    const desc = document.getElementById('book-desc').value.trim();

    const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        cover: cover,
        desc: desc
    };

    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));

    addBookForm.reset();
    showListView();
});

showListView();