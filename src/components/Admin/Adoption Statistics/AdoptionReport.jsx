import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { fetchBarangayData } from './BarangayData';

function AdoptionReport() {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { adoptionCounts, rehomedCounts } = await fetchBarangayData();
    
            const combinedData = Object.keys(adoptionCounts).map((barangay) => ({
              barangay,
              adoptionCount: adoptionCounts[barangay] || 0,
              rehomedCount: rehomedCounts[barangay] || 0,
            }));
    
            setData(combinedData);
          } catch (error) {
            console.error("Error fetching adoption data:", error);
          }
        };
    
        fetchData();
      }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
      
        // Add the title
        doc.setFontSize(16);
        doc.text("Adoption Report", 105, 15, null, null, "center");
      
        // Add the date of download
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.text(`Downloaded on: ${currentDate}`, 105, 22, null, null, "center");
      
        // Sort data by the highest number of pets (adoption + rehomed) to lowest
        const sortedData = [...data].sort(
          (a, b) =>
            b.adoptionCount + b.rehomedCount - (a.adoptionCount + a.rehomedCount)
        );
      
        // Prepare table data
        const tableData = sortedData.map((item) => [
          item.barangay,
          item.adoptionCount,
          item.rehomedCount,
        ]);
      
        // Add the table
        doc.autoTable({
          head: [["Barangay", "Pets for Adoption", "Rehomed Pets"]],
          body: tableData,
          startY: 30,
          styles: { fontSize: 10, halign: "center" },
          headStyles: { fillColor: [220, 53, 69] },
        });
      
        // Save the PDF
        doc.save(`AdoptionReport(${currentDate}).pdf`);
      };
      
      

    return (
        <button onClick={generatePDF} className='bg-primary rounded-md px-2 text-sm text-white font-medium py-1 hover:bg-primaryHover duration-150' >
            Download Report
        </button>
    );
}

export default AdoptionReport;
