// src/pages/AnalyticsPage.js
import React, { useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { LoaderIcon, AnalyticsIcon, CommentsIcon, PostsIcon } from '../components/Icons';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const KpiCard = ({ title, value, icon }) => (
    <div className="kpi-card" style={{border: '1px solid var(--border-color)', padding: '24px', borderRadius: 'var(--border-radius)'}}>
        <div className="kpi-icon" style={{marginBottom: '12px'}}>{icon}</div>
        <div className="kpi-content">
            <span className="kpi-value" style={{fontSize: '28px', fontWeight: '700', display: 'block'}}>{value}</span>
            <span className="kpi-title" style={{fontSize: '14px', color: 'var(--text-secondary)'}}>{title}</span>
        </div>
    </div>
);

const AnalyticsPage = () => {
    const { analytics, ui } = useData();
    const { analyticsData, influenceIndex, fetchAnalyticsData, fetchInfluenceIndex } = analytics;
    const { isLoading } = ui;

    useEffect(() => {
        fetchAnalyticsData();
        fetchInfluenceIndex();
    }, [fetchAnalyticsData, fetchInfluenceIndex]);

    // --- ИЗМЕНЕНИЕ: Новая цветовая палитра для графиков ---
    const chartColors = {
        primary: 'rgba(158, 82, 255, 0.7)', // --color-accent-purple
        primaryBorder: '#9E52FF',
        danger: 'rgba(255, 77, 141, 0.8)', // --color-accent-pink
        warning: 'rgba(255, 206, 86, 0.8)', // Желтый для нейтрального
        success: 'rgba(0, 231, 255, 0.7)', // --color-accent-cyan
        text: '#F0F2F5', // --color-text-primary
        grid: 'rgba(0, 231, 255, 0.2)' // --color-border
    };

    const processedData = useMemo(() => {
        if (!analyticsData || !analyticsData.length) {
            return { pieData: null, barData: null, totalComments: 0, sentimentRatio: 'N/A' };
        }
        
        const sentimentCounts = analyticsData.reduce((acc, item) => {
            const sentiment = item.tonalita || 'Unknown';
            acc[sentiment] = (acc[sentiment] || 0) + 1;
            return acc;
        }, {});

        const intentCounts = analyticsData.reduce((acc, item) => {
            const intent = item.zamer_uzivatele || 'Unknown';
            acc[intent] = (acc[intent] || 0) + 1;
            return acc;
        }, {});
        
        const positive = sentimentCounts['Pozitivní'] || 0;
        const negative = sentimentCounts['Negativní'] || 0;
        const sentimentRatio = negative > 0 ? `${(positive / negative).toFixed(1)} : 1` : '∞';

        return {
            totalComments: analyticsData.length,
            sentimentRatio,
            pieData: {
                labels: Object.keys(sentimentCounts),
                datasets: [{
                    data: Object.values(sentimentCounts),
                    backgroundColor: [chartColors.success, chartColors.danger, chartColors.warning],
                    borderColor: '#16152B', // --color-panel
                    borderWidth: 2,
                }]
            },
            barData: {
                labels: Object.keys(intentCounts),
                datasets: [{
                    label: 'Comment Count',
                    data: Object.values(intentCounts),
                    backgroundColor: chartColors.primary,
                    borderColor: chartColors.primaryBorder,
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            }
        };
    }, [analyticsData, chartColors]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: chartColors.text, font: { family: "'Inter', sans-serif" } } }
        }
    };
    const barChartOptions = { ...chartOptions, indexAxis: 'y', scales: {
        y: { ticks: { color: chartColors.text }, grid: { color: chartColors.grid } },
        x: { ticks: { color: chartColors.text }, grid: { color: chartColors.grid } }
    }};
    const pieChartOptions = { ...chartOptions, plugins: {
        legend: { position: 'right', labels: { color: chartColors.text, font: { family: "'Inter', sans-serif" } } }
    }};
    
    if (isLoading && !analyticsData.length) {
        return <div style={{padding: '40px'}}><LoaderIcon/> Loading Analytics Data...</div>
    }

    return (
        <div className="analytics-layout">
            <div className="panel analytics-panel">
                <div className="panel-header">
                    <h2><AnalyticsIcon /> Analytics</h2>
                </div>
                <div className="panel-body">
                    <div className="kpi-grid">
                        <KpiCard title="Total Comments" value={processedData.totalComments} icon={<CommentsIcon />} />
                        <KpiCard title="Positive/Negative Ratio" value={processedData.sentimentRatio} icon={<AnalyticsIcon />} />
                        <KpiCard title="Top Influence Index" value={influenceIndex.length > 0 ? influenceIndex[0].influenceIndex : 'N/A'} icon={<PostsIcon />} />
                    </div>

                    <div className="tables-grid">
                        <div className="table-container">
                            <h3>Top Influence Posts</h3>
                            <table style={{width: '100%', marginTop: '16px'}}>
                                <thead>
                                    <tr><th>Post</th><th>Index</th></tr>
                                </thead>
                                <tbody>
                                    {influenceIndex.map(post => (
                                        <tr key={post.post_id}>
                                            <td><a href={post.permalink_url} target="_blank" rel="noopener noreferrer">{post.message}</a></td>
                                            <td>{post.influenceIndex}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-container">
                            <h3>Latest Comments</h3>
                            <table style={{width: '100%', marginTop: '16px'}}>
                                <thead>
                                    <tr><th>Comment</th><th>Tone</th><th>Intent</th></tr>
                                </thead>
                                <tbody>
                                    {analyticsData.slice(0, 5).map(comment => (
                                         <tr key={comment.comment_id}><td>{comment.message}</td><td>{comment.tonalita}</td><td>{comment.zamer_uzivatele}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="charts-grid">
                        <div className="chart-container">
                            <h3>Tone Distribution</h3>
                            {processedData.pieData && <Pie data={processedData.pieData} options={pieChartOptions} />}
                        </div>
                        <div className="chart-container">
                            <h3>User Intent</h3>
                            {processedData.barData && <Bar data={processedData.barData} options={barChartOptions}/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AnalyticsPage;