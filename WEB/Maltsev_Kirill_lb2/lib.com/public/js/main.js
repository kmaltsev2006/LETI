// main.js - manages loading, filtering, sorting, adding, borrowing, returning and editing

let allBooks = []; // All books loaded from server
let currentSort = { type: null, direction: 1 }; // Current sorting state
let currentBookId = null; // Currently selected book for borrowing

// Utility functions
function escapeHtml(s) {
  if (!s && s !== 0) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Loading and rendering
async function loadBooks() {
  try {
    const res = await fetch('/api/books');
    allBooks = await res.json();
    renderBooks(allBooks);
  } catch (err) {
    console.error('Error loading books', err);
  }
}

function renderBooks(books) {
  const tbody = document.querySelector('#booksTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  for (const b of books) {
    const tr = document.createElement('tr');

    const statusText = b.available ? 'Available' : `Borrowed by (${b.borrower})`;
    const dueText = b.available ? '-' : (b.dueDate || '-');

    // Highlight overdue and soon-to-return books
    let rowClass = '';
    if (!b.available && b.dueDate) {
      const due = new Date(b.dueDate);
      if (!isNaN(due.getTime())) {
        const now = new Date();
        if (due < now) {
          rowClass = 'overdue';
        } else {
          const diffDays = (due - now) / (1000 * 60 * 60 * 24);
          if (diffDays <= 3) rowClass = 'urgent';
        }
      }
    }

    tr.className = rowClass;

    tr.innerHTML = `
      <td><a href="/books/${b.id}">${escapeHtml(b.title)}</a></td>
      <td>${escapeHtml(b.author)}</td>
      <td>${b.year || ''}</td>
      <td>${escapeHtml(statusText)}</td>
      <td>${escapeHtml(dueText)}</td>
      <td>
        <button onclick="deleteBook(${b.id})" title="Delete"><i class="fa fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

// Adding books
const addDialog = document.getElementById('addDialog');

function showAddDialog() {
  if (!addDialog) return;
  addDialog.showModal();
}

async function addBook() {
  const title = document.getElementById('titleInput').value.trim();
  const author = document.getElementById('authorInput').value.trim();
  const year = document.getElementById('yearInput').value.trim();

  if (!title || !author || !year) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, year })
    });
    if (res.ok) {
      addDialog.close();
      document.getElementById('titleInput').value = '';
      document.getElementById('authorInput').value = '';
      document.getElementById('yearInput').value = '';
      await loadBooks();
    } else {
      alert('Error adding book');
    }
  } catch (err) {
    console.error(err);
    alert('Error adding book');
  }
}

// Deleting books
async function deleteBook(id) {
  if (!confirm('Delete book?')) return;
  try {
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      await loadBooks();
    } else {
      alert('Error deleting book');
    }
  } catch (err) {
    console.error(err);
    alert('Error deleting book');
  }
}

// Filtering and reset
function resetFilters() {
  const fAv = document.getElementById('filterAvailable');
  const fDate = document.getElementById('filterDate');
  if (fAv) fAv.checked = false;
  if (fDate) fDate.value = '';
  renderBooks(allBooks);
}

function filterBooks() {
  const availableOnly = document.getElementById('filterAvailable')?.checked;
  const returnDate = document.getElementById('filterDate')?.value;

  let books = [...allBooks];
  if (availableOnly) books = books.filter(b => b.available);
  if (returnDate) {
    const limit = new Date(returnDate);
    books = books.filter(b => {
      if (!b.dueDate) return false;
      const d = new Date(b.dueDate);
      return d <= limit;
    });
  }
  renderBooks(books);
}

// Sorting
function sortByStatus() {
  if (currentSort.type === 'status') {
    currentSort.direction *= -1;
  } else {
    currentSort = { type: 'status', direction: 1 };
  }

  const sorted = [...allBooks].sort((a, b) => {
    const aVal = a.available ? 1 : 0;
    const bVal = b.available ? 1 : 0;
    return (aVal - bVal) * currentSort.direction;
  });

  renderBooks(sorted);
}

function sortByDueDate() {
  if (currentSort.type === 'dueDate') {
    currentSort.direction *= -1;
  } else {
    currentSort = { type: 'dueDate', direction: 1 };
  }

  const sorted = [...allBooks].sort((a, b) => {
    const aDate = a.available ? new Date(0) : new Date(a.dueDate || 0);
    const bDate = b.available ? new Date(0) : new Date(b.dueDate || 0);
    const aT = isNaN(aDate.getTime()) ? Infinity : aDate.getTime();
    const bT = isNaN(bDate.getTime()) ? Infinity : bDate.getTime();
    return (aT - bT) * currentSort.direction;
  });

  renderBooks(sorted);
}

// Borrowing and returning books
const borrowDialog = document.getElementById('borrowDialog');

function openBorrowDialog(id) {
  currentBookId = id;
  if (!borrowDialog) return;
  const form = document.getElementById('borrowForm');
  if (form) form.reset();
  borrowDialog.showModal();
}

async function confirmBorrow() {
  let id = currentBookId || window.PAGE_BOOK_ID;
  if (!id) {
    alert('Book ID unknown');
    return;
  }

  const borrower = document.getElementById('borrowerName')?.value.trim();
  const dueDate = document.getElementById('dueDateInput')?.value;

  if (!borrower || !dueDate) {
    alert('Enter reader name and due date');
    return;
  }

  try {
    const res = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        available: false,
        borrower,
        dueDate
      })
    });
    if (res.ok) {
      borrowDialog.close();
      if (document.querySelector('#booksTable')) {
        await loadBooks();
      } else {
        window.location.reload();
      }
    } else {
      alert('Error borrowing book');
    }
  } catch (err) {
    console.error(err);
    alert('Error borrowing book');
  }
}

async function returnBook(id) {
  const bookId = id || window.PAGE_BOOK_ID;
  if (!bookId) {
    alert('Book ID unknown');
    return;
  }
  if (!confirm('Confirm book return?')) return;
  try {
    const res = await fetch(`/api/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        available: true,
        borrower: '',
        dueDate: ''
      })
    });
    if (res.ok) {
      if (document.querySelector('#booksTable')) {
        await loadBooks();
      } else {
        window.location.reload();
      }
    } else {
      alert('Error returning book');
    }
  } catch (err) {
    console.error(err);
    alert('Error returning book');
  }
}

// Editing book details
async function saveBookChanges(id) {
  const title = document.getElementById('bookTitle')?.value.trim();
  const author = document.getElementById('bookAuthor')?.value.trim();
  const year = document.getElementById('bookYear')?.value.trim();

  if (!title || !author || !year) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const res = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, year })
    });
    if (res.ok) {
      alert('Changes saved!');
      window.location.reload();
    } else {
      alert('Error saving book');
    }
  } catch (err) {
    console.error(err);
    alert('Error saving book');
  }
}

// Initialization
window.addEventListener('load', () => {
  if (document.querySelector('#booksTable')) {
    loadBooks();
  }
  if (window.PAGE_BOOK_ID) {
    currentBookId = window.PAGE_BOOK_ID;
  }
});