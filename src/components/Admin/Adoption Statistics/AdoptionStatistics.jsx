import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase/firebase';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AdoptionReport from './AdoptionReport';

ChartJS.register(ArcElement, Tooltip, Legend);

function AdoptionStatistics() {
    const GENERAL_TRIAS_BARANGAYS = [
        "Alingaro", "Arnaldo Poblacion", "Bacao I", "Bacao II", "Bagumbayan Poblacion",
        "Biclatan", "Buenavista I", "Buenavista II", "Buenavista III", "Corregidor Poblacion",
        "Dulong Bayan Poblacion", "Gov. Ferrer Poblacion", "Javalera", "Manggahan", "Navaro",
        "Ninety Sixth Poblacion", "Panungyanan", "Pasong Camachile I", "Pasong Camachile II",
        "Pasong Kawayan I", "Pasong Kawayan II", "Pinagtipunan", "Prinza Poblacion",
        "Sampalucan Poblacion", "San Francisco", "San Gabriel Poblacion", "San Juan I",
        "San Juan II", "Santa Clara", "Santiago", "Tapia", "Tejero", "Vibora Poblacion",
    ];

    const [adoptionChartData, setAdoptionChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
            ],
        }]
    });

    const [rehomedChartData, setRehomedChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
            ],
        }]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const barangayCountsForAdoption = {};
                const barangayCountsRehomed = {};
    
                const adoptionSnapshot = await getDocs(collection(db, "petsForAdoption"));
                const rehomedSnapshot = await getDocs(collection(db, "rehomedPets"));
    
                // Count pets for adoption by barangay
                adoptionSnapshot.forEach((doc) => {
                    const { barangay } = doc.data();
                    if (barangay && GENERAL_TRIAS_BARANGAYS.includes(barangay)) {
                        barangayCountsForAdoption[barangay] = 
                            (barangayCountsForAdoption[barangay] || 0) + 1;
                    }
                });
    
                // Count rehomed pets by barangay
                rehomedSnapshot.forEach((doc) => {
                    const barangay = doc.data().adopterDetails?.barangay;
                    if (barangay && GENERAL_TRIAS_BARANGAYS.includes(barangay)) {
                        barangayCountsRehomed[barangay] = 
                            (barangayCountsRehomed[barangay] || 0) + 1;
                    }
                });
    
                // Get top 5 barangays for pets for adoption
                const sortedForAdoption = Object.entries(barangayCountsForAdoption)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .slice(0, 5);
                const labelsForAdoption = sortedForAdoption.map(([barangay]) => barangay);
                const dataForAdoption = sortedForAdoption.map(([, count]) => count);
    
                // Get top 5 barangays for rehomed pets
                const sortedRehomed = Object.entries(barangayCountsRehomed)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .slice(0, 5);
                const labelsRehomed = sortedRehomed.map(([barangay]) => barangay);
                const dataRehomed = sortedRehomed.map(([, count]) => count);
    
                setAdoptionChartData({
                    labels: labelsForAdoption,
                    datasets: [{
                        data: dataForAdoption,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF'
                        ],
                    }]
                });
    
                setRehomedChartData({
                    labels: labelsRehomed,
                    datasets: [{
                        data: dataRehomed,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF'
                        ],
                    }]
                });
            } catch (error) {
                console.error("Error fetching barangay data: ", error);
            }
        };
    
        fetchData();
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: {
                        family: 'Poppins, sans-serif',
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className='pt-36 relative lg:pt-20 lg:pl-56 lg:pr-3 lg:ml-3 min-h-screen flex flex-col font-poppins text-text'>
            <div className='flex mt-3 lg:mt-3 bg-secondary sm:mx-auto lg:mx-0 flex-grow mb-3 w-full text-text sm:w-[97%] lg:w-full sm:rounded-md lg:rounded-lg shadow-custom'>
                <div className='p-5 md:px-7 w-full mb-3'>
                    <div className='flex relative justify-between'>
                        <h1 className='text-2xl font-semibold whitespace-nowrap'>Adoption Statistics</h1>
                        <div className='w-full hidden sm:flex justify-end'>
                            <AdoptionReport />
                        </div>
                    </div>

                    <div className='w-full flex py-4 sm:hidden justify-end'>
                        <AdoptionReport />
                    </div>

                    <div className='flex flex-col items-center justify-center w-full sm:h-full'>
                        <p className='w-full text-center font-medium leading-5 pb-2 text-lg'>
                            Pets for Adoption by Barangay in General Trias
                        </p>
                        <div className='w-[80%] pt-5 h-72 font-poppins'>
                            <Pie
                                data={adoptionChartData}
                                options={chartOptions}
                            />
                        </div>
                        
                        <p className='w-full text-center mt-14 leading-5 font-medium pb-2 text-lg'>
                            Rehomed Pets by Barangay in General Trias
                        </p>
                        <div className='w-[80%] pt-5 h-72 font-poppins'>
                            <Pie
                                data={rehomedChartData}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdoptionStatistics