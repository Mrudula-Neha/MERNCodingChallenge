import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/transactions', {
                    params: {
                        search: searchTerm,
                        page,
                        perPage
                    }
                });

                if (response.data && response.data.transactions) {
                    setTransactions(response.data.transactions);
                } else {
                    setTransactions([]);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [searchTerm, page]);

    return (
        <div>
            <h2>Transactions</h2>

            <input
                type="text"
                placeholder="Search transactions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>{transaction.id}</td>
                                <td>{transaction.title}</td>
                                <td>{transaction.description}</td>
                                <td>{transaction.price}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                <td>
                                    {transaction.image ? (
                                        <img src={transaction.image} alt="product" style={{ width: '50px', height: '50px' }} />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No transactions found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div>
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                    Previous
                </button>
                <button onClick={() => setPage((prev) => prev + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default TransactionTable;
