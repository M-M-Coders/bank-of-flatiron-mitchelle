import React, { useState, useEffect } from 'react';
import '../index.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    id: '',
    date: '',
    description: '',
    category: '',
    amount: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(''); // New state for sorting field
  const [sortDirection, setSortDirection] = useState('asc'); // New state for sorting direction

  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch('http://localhost:3000/transactions');
      const transactions = await response.json();
      setTransactions(transactions);
    }
    fetchTransactions();
  }, []);

  function handleFormSubmit(e) {
    e.preventDefault();
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    setNewTransaction({
      id: '',
      date: '',
      description: '',
      category: '',
      amount: '',
    });
  }

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'category') {
      return sortDirection === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    } else if (sortField === 'description') {
      return sortDirection === 'asc'
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    }
    return 0; // No sorting by default
  });

  // Function to handle transaction deletion
  function handleDeleteTransaction(id) {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(updatedTransactions);
  }

  return (
    <div className="this">
      <h1 style={{ textAlign: 'center' }}>Transaction Form</h1>
      <form className="form-container1">
        {/* ... (existing form input fields) */}
        <button type="submit" onClick={handleFormSubmit}>
          Add Transaction
        </button>
      </form>
      <input
        type="text"
        placeholder="Search by Description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        <label>Sort by: </label>
        <select
          value={sortField}
          onChange={(e) => {
            setSortField(e.target.value);
          }}
        >
          <option value="">None</option>
          <option value="category">Category</option>
          <option value="description">Description</option>
        </select>
        <button onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
          {sortDirection === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      <table className="table">
        <thead className="head">
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>
              Description
              {sortField === 'description' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>
              Category
              {sortField === 'category' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Amount</th>
            <th>Action</th> {/* New column for Delete button */}
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.id}</td>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>{transaction.amount}</td>
              <td>
                <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;

