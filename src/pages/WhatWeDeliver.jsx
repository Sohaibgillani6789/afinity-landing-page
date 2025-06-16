import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import Lenis from '@studio-freight/lenis'; 
import Footer from '../components/Footer';

// Add styles to override Navbar positioning
const navbarOverrideStyles = `
  #root > div > section:first-child nav > nav {
    position: relative !important;
    top: 0 !important;
  }
`;

const WhatWeDeliver = () => {
  const [tableData, setTableData] = useState([]); // State to store the parsed CSV data
  const [loading, setLoading] = useState(true);   // State to manage loading status
  const [error, setError] = useState(null);       // State to handle any errors
  const [rowsPerPage, setRowsPerPage] = useState(5); // Add state for rows per page
  const [currentPage, setCurrentPage] = useState(1); // Add state for current page

  // Lenis initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4emx
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Request animation frame for smooth scrolling
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function to destroy Lenis instance on component unmount
    return () => {
      lenis.destroy();
    };
  }, []); // Empty dependency array means this effect runs only once after the initial render

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/county_uk.csv'); // Adjust the path to your CSV file

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setTableData(results.data);
            setLoading(false);
          },
          error: (err) => {
            setError(err);
            setLoading(false);
          }
        });
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract headers dynamically for the table
  const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  return (
    <>
      <style>{navbarOverrideStyles}</style>
      <div className="min-h-screen animate-slideIn">
        {/* First Section - Dark Blue */}          <section className="relative min-h-screen bg-[#070c24] flex flex-col overflow-hidden">
          <div className="w-full" style={{ position: 'relative' }}>
            <div style={{ position: 'static' }}>
              <nav className="relative">
                <Navbar />
              </nav>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-6xl text-white font-bold mb-6">
                What We Deliver
              </h1>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl">
                Explore our comprehensive solutions and deliverables that drive success.
              </p>
            </div>
          </div>

          <div className="absolute left-1/2 bottom-1 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="w-[1px] h-24 bg-white/20 relative overflow-hidden">
              <motion.div
                className="w-full h-full bg-white"
                animate={{
                  y: ['-100%', '100%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'linear',
                }}
              />
            </div>
          </div>
        </section>

        {/* Second Section - White (Integrated CSV Table) */}
        <section className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-5xl text-gray-800 font-bold text-center mb-10">
              Our Key Deliverables
            </h2>

            {loading && (
              <div className="text-center text-lg text-gray-600">Loading deliverables data...</div>
            )}

            {error && (
              <div className="text-center text-lg text-red-600">Error: {error.message}. Please check your CSV file.</div>
            )}

            {!loading && !error && tableData.length === 0 && (
              <div className="text-center text-lg text-gray-600">No deliverable data found.</div>
            )}

            {!loading && !error && tableData.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-gray-700">Rows per page:</label>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-pink-300 rounded px-2 py-1 bg-pink-800 cursor-pointer appearance-nonefocus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                    style={{
                      WebkitAppearance: "menulist",
                      MozAppearance: "menulist",
                    }}
                  >
                    {[5, 15, 30, 50, 100].map(value => (
                      <option 
                        key={value} 
                        value={value}
                        className="bg-pink-400 hover:bg-pink-100"
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto shadow-xl rounded-lg border-2 border-pink-500">
                  <table className="min-w-full divide-y divide-pink-300">
                    <thead className="bg-pink-100">
                      <tr>
                        {headers.map((header, index) => (
                          <th
                            key={index}
                            className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-pink-700 uppercase tracking-wider border-b border-r last:border-r-0 border-pink-300"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-pink-200">
                      {currentRows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-pink-50' : 'bg-white'}>
                          {headers.map((header, colIndex) => (
                            <td
                              key={`${rowIndex}-${colIndex}`}
                              className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-800 border-b border-r last:border-r-0 border-pink-200"
                            >
                              {row[header] !== null && row[header] !== undefined ? row[header].toString() : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-gray-600">
                    Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, tableData.length)} of {tableData.length} entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-pink-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-pink-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default WhatWeDeliver;