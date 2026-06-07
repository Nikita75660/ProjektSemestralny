const SUPABASE_URL = "https://xohpancxryzudbofmdtv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YM8tlXs1_eNVVC4kbeuNLg_yAG3VRrT";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

let books = [];

const sectionList = document.getElementById('section-list');
const sectionAdd = document.getElementById('section-add');
const btnShowList = document.getElementById('btn-show-list');
const btnShowAdd = document.getElementById('btn-show-add');
const booksGrid = document.getElementById('books-grid');
const emptyState = document.getElementById('empty-state');
const searchBar = document.getElementById('search-bar');
const sortBooks = document.getElementById('sort-books');
const addBookForm = document.getElementById('add-book-form');
const navLogo = document.getElementById('nav-logo');

const modal = document.getElementById('book-modal');
const closeModal = document.querySelector('.close-modal');
const modalCover = document.getElementById('modal-cover');
const modalTitle = document.getElementById('modal-title');
const modalAuthor = document.getElementById('modal-author');
const modalDesc = document.getElementById('modal-desc');

async function loadBooks() {
    const { data, error } = await supabaseClient
        .from('books')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    books = data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        rating: book.rating,
        cover: book.cover,
        desc: book.description
    }));

    renderBooks(books);
}

function showListView() {
    sectionList.classList.remove('hidden');
    sectionAdd.classList.add('hidden');

    btnShowList.classList.add('active');
    btnShowAdd.classList.remove('active');
}

function showAddView() {
    sectionAdd.classList.remove('hidden');
    sectionList.classList.add('hidden');

    btnShowAdd.classList.add('active');
    btnShowList.classList.remove('active');
}

btnShowList?.addEventListener('click', showListView);
btnShowAdd?.addEventListener('click', showAddView);

navLogo?.addEventListener('click', (e) => {
    e.preventDefault();
    showListView();
});

document.getElementById('btn-cancel')?.addEventListener('click', showListView);

function renderBooks(booksToRender) {
    booksGrid.innerHTML = '';

    if (booksToRender.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    booksToRender.forEach(book => {

        const coverSrc =
            book.cover ||
            'https://placehold.co/220x280/1e293b/f8fafc?text=Brak+Okładki';

        const card = document.createElement('div');

        card.className = 'book-card';

        card.innerHTML = `
            <div class="cover-wrapper">
                <img
                    src="${coverSrc}"
                    alt="${book.title}"
                    onerror="this.src='https://placehold.co/220x280/1e293b/f8fafc?text=Brak+Okładki'"
                >
            </div>

            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>

                <p class="book-author">${book.author}</p>

                <p><strong>Gatunek:</strong> ${book.genre || "-"}</p>

                <p><strong>Ocena:</strong> ${book.rating || "-"}/10</p>

                <button class="btn-details" data-id="${book.id}">
                    Szczegóły
                </button>
                <button class="btn-delete" data-id="${book.id}">
                    Usuń
                </button>
            </div>
        `;

        booksGrid.appendChild(card);
    });


    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', (e) => {
            openBookModal(
                Number(e.target.dataset.id)
            );
        });
    });
    document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', async (e) => {

        const id = Number(e.target.dataset.id);

        const password = prompt(
            "Podaj hasło administratora:"
        );
        
        if (password !== "1234") {
            alert("Nieprawidłowe hasło!");
            return;
        }
        
        const confirmDelete = confirm(
            "Czy na pewno chcesz usunąć tę książkę?"
        );
        
        if (!confirmDelete) return;

        const { error } = await supabaseClient
            .from('books')
            .delete()
            .eq('id', id);

        if (error) {
            alert(error.message);
            return;
        }

        if (error) {
            alert(error.message);
            return;
        }

        await loadBooks();
    });
});
}



searchBar?.addEventListener('input', (e) => {

    const searchTerm = e.target.value.toLowerCase();

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

    modalAuthor.textContent =
        `${book.author} | ${book.genre || "-"} | ${book.rating || "-"} / 10`;

    modalDesc.textContent = book.desc;

    modalCover.src =
        book.cover ||
        'https://placehold.co/220x280/1e293b/f8fafc?text=Brak+Okładki';

    modal.classList.remove('hidden');
}

closeModal?.addEventListener('click', () => {
    modal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});

addBookForm?.addEventListener('submit', async (e) => {

    e.preventDefault();

    const title =
        document.getElementById('book-title').value.trim();

    const author =
        document.getElementById('book-author').value.trim();

    const genre =
        document.getElementById('book-genre').value.trim();

    const rating =
        document.getElementById('book-rating').value;

    const cover =
        document.getElementById('book-cover').value.trim();

    const desc =
        document.getElementById('book-desc').value.trim();

    const { error } = await supabaseClient
        .from('books')
        .insert([
            {
                title,
                author,
                genre,
                rating: Number(rating),
                cover,
                description: desc
            }
        ]);

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    addBookForm.reset();

    await loadBooks();

    showListView();
});
sortBooks?.addEventListener('change', () => {

    let sortedBooks = [...books];

    if (sortBooks.value === 'rating-desc') {
        sortedBooks.sort((a, b) => b.rating - a.rating);
    }

    if (sortBooks.value === 'rating-asc') {
        sortedBooks.sort((a, b) => a.rating - b.rating);
    }

    renderBooks(sortedBooks);
});
loadBooks();
