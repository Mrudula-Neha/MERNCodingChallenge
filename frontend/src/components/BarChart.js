
import React, { useEffect, useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const BarChart = ({ month }) => {
    const [data, setData] = useState([]); 
    const [error, setError] = useState(null); 

  
    useEffect(() => {
        const fetchBarChartData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/transactions/bar-chart', {
                    params: { month } 
                });
                console.log('Bar Chart Data:', response.data); 
                setData(response.data); 
                setError(null); 
            } catch (error) {
                console.error('Error fetching bar chart data:', error);
                setError('Failed to load data.'); 
            }
        };

        if (month) { 
            fetchBarChartData();
        }
    }, [month]); 

    return (
        <div>
            <h2>Price Distribution for {month}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} 

            
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={data}>
                        <XAxis dataKey="range" /> 
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" /> 
                    </RechartsBarChart>
                </ResponsiveContainer>
            ) : (
                <p>No data available for {month}</p> 
            )}
        </div>
    );
};

export default BarChart; 
