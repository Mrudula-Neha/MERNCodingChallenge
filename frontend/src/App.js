// src/App.js
import './styles.css';
import React, { useState } from 'react';
import TransactionTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart'; // Import the Bar Chart component
import CategoryPieChart from './components/PieChart'; // Import the Pie Chart component

const App = () => {
    const [month, setMonth] = useState('March');  // Initialize month

    return (
        <div>
            <h1>Transaction Dashboard</h1>

            {/* Month Selector */}
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
            </select>

            {/* Passing month to children */}
            <Statistics month={month} />
            <TransactionTable month={month} setMonth={setMonth} />
            <BarChart month={month} /> {/* Pass month to Bar Chart */}
            <CategoryPieChart month={month} /> {/* Pass month to Pie Chart */}
        </div>
    );
};

export default App;
