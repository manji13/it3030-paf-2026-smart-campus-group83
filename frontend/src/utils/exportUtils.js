/**
 * Export utilities for resources - supports CSV and PDF formats
 */

/**
 * Export resources as CSV file
 * @param {Array} resources - Array of resource objects
 * @param {string} filename - Name of the file (default: resources.csv)
 */
export const exportToCSV = (resources, filename = 'resources.csv') => {
    if (!resources || resources.length === 0) {
        alert('No resources to export.');
        return;
    }

    // Define CSV headers
    const headers = ['ID', 'Resource Name', 'Type', 'Capacity', 'Location', 'Status', 'Availability Windows'];

    // Map resource data to CSV rows
    const rows = resources.map(resource => [
        resource.id || '',
        resource.name || '',
        formatType(resource.type) || '',
        resource.capacity || '',
        resource.location || '',
        resource.status || '',
        (resource.availabilityWindows && Array.isArray(resource.availabilityWindows))
            ? resource.availabilityWindows.join('; ')
            : ''
    ]);

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create blob and download
    downloadFile(csvContent, filename, 'text/csv');
};

/**
 * Export resources as PDF file (simple table format)
 * @param {Array} resources - Array of resource objects
 * @param {string} filename - Name of the file (default: resources.pdf)
 */
export const exportToPDF = (resources, filename = 'resources.pdf') => {
    if (!resources || resources.length === 0) {
        alert('No resources to export.');
        return;
    }

    // Create HTML table
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Resource List</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    background-color: #f5f5f5;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #1f2937;
                    margin: 0;
                }
                .header p {
                    color: #6b7280;
                    font-size: 12px;
                    margin: 5px 0 0 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                thead {
                    background-color: #14b8a6;
                    color: white;
                }
                th {
                    padding: 12px;
                    text-align: left;
                    font-weight: bold;
                    border: 1px solid #d1d5db;
                }
                td {
                    padding: 10px 12px;
                    border: 1px solid #e5e7eb;
                    font-size: 13px;
                }
                tbody tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                tbody tr:hover {
                    background-color: #f3f4f6;
                }
                .status-active {
                    color: #059669;
                    font-weight: bold;
                }
                .status-inactive {
                    color: #dc2626;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #d1d5db;
                    font-size: 11px;
                    color: #6b7280;
                    text-align: center;
                }
                @media print {
                    body { background-color: white; }
                    table { box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📚 Resource Management Report</h1>
                <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                <p>Total Resources: ${resources.length}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Resource Name</th>
                        <th>Type</th>
                        <th>Capacity</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Availability</th>
                    </tr>
                </thead>
                <tbody>
                    ${resources.map(resource => `
                        <tr>
                            <td>${resource.name || '-'}</td>
                            <td>${formatType(resource.type) || '-'}</td>
                            <td>${resource.capacity || '-'}</td>
                            <td>${resource.location || '-'}</td>
                            <td class="status-${resource.status === 'ACTIVE' ? 'active' : 'inactive'}">
                                ${resource.status || '-'}
                            </td>
                            <td>${(resource.availabilityWindows && Array.isArray(resource.availabilityWindows))
                                ? resource.availabilityWindows.join(', ')
                                : '-'
                            }</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="footer">
                <p>This is an automated report from Smart Campus Hub Resource Management System</p>
            </div>

            <script>
                window.print();
            </script>
        </body>
        </html>
    `;

    // Create blob and download
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(htmlBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

/**
 * Helper function to download file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

/**
 * Format resource type for display
 * @param {string} type - Resource type code
 * @returns {string} Formatted type name
 */
const formatType = (type) => {
    const typeMap = {
        LECTURE_HALL: 'Lecture Hall',
        LAB: 'Lab',
        MEETING_ROOM: 'Meeting Room',
        EQUIPMENT: 'Equipment'
    };
    return typeMap[type] || type;
};

/**
 * Get filename with current timestamp
 * @param {string} prefix - Filename prefix
 * @param {string} extension - File extension
 * @returns {string} Filename with timestamp
 */
export const getTimestampedFilename = (prefix = 'resources', extension = 'csv') => {
    const date = new Date();
    const timestamp = date.toISOString().slice(0, 10);
    return `${prefix}-${timestamp}.${extension}`;
};
