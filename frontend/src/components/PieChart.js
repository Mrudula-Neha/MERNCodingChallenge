
import React, { useEffect, useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5733'];

const CategoryPieChart = ({ month }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPieChartData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/transactions/pie-chart', {
                    params: { month }
                });
                setData(response.data);
                setError(null);
            } catch (error) {
                setError('Failed to load data.');
            }
        };

        if (month) {
            fetchPieChartData();
        }
    }, [month]);

    return (
        <div>
            <h2>Category Distribution for {month}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            dataKey="total"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </RechartsPieChart>
                </ResponsiveContainer>
            ) : (
                <p>No data available for {month}</p>
            )}
        </div>
    );
};

export default CategoryPieChart;
