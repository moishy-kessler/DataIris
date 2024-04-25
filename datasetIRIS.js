const csvUrl = "https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data";
const fs = require('fs');
const nodeplotlib = require('nodeplotlib');
const XLSX = require('xlsx');


 // Fetching the CSV file
    // fetch(csvUrl)
    //   .then(response => response.text())
    //   .then(data => {
fs.readFile('irisFile.csv', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
    }
    // Parsing the CSV data
    const irisData = data.split('\n').map(row => row.split(','));
    //  console.log(irisData );
    // Converting CSV data to JSON format
    const irisJson = irisData.map(row => ({
        Sepal_length: parseFloat(row[0]),
        Sepal_width: parseFloat(row[1]),
        Petal_length: parseFloat(row[2]),
        Petal_width: parseFloat(row[3]),
        Iris_name: row[4].replace(/\r/g, ''),
        Sepal_length_rounded: 0,
        First_or_Last: ''
    }));
    // console.log(irisJson);
    // Adding a column that rounds Sepal length of each row
    irisJson.forEach(row => {
        row.Sepal_length_rounded = Math.round(row.Sepal_length);
    });
    // console.log(irisJson);
    // Calculating mean Petal length for each Iris name
    const meanPetalLength = irisJson.reduce((acc, curr) => {
        const irisName = curr.Iris_name.trim();
        if (!acc[irisName]) {
            acc[irisName] = { sum: 0, count: 0 };
        }
        acc[irisName].sum += curr.Petal_length;
        acc[irisName].count++;
        return acc;
    }, {});

    for (const name in meanPetalLength) {
        meanPetalLength[name] = meanPetalLength[name].sum / meanPetalLength[name].count;
    }

    // Adding a column based on the condition
    irisJson.forEach(row => {
        row.First_or_Last = row.Petal_length > meanPetalLength[row.Iris_name] ? row.Iris_name.charAt(0) : row.Iris_name.slice(-1);
    });
    // Displaying the histogram of Petal length (not provided here due to limitations)

    // Converting JSON data back to CSV format
    // const csvContent = irisJson.map(row => Object.values(row).join(',')).join('\n');

    // Extracting Petal_length values
    const petalLengths = irisJson.map(row => row.Petal_length);

    // Define histogram trace
    const trace = {
        x: petalLengths,
        type: 'histogram'
    };

    // Define layout
    const layout = {
        title: 'Histogram of Petal Length',
        xaxis: { title: 'Petal Length' },
        yaxis: { title: 'Frequency' }
    };

    // Plot the histogram
    nodeplotlib.plot([trace], layout);

    const wb = XLSX.utils.book_new();

    // Convert JSON to worksheet
    const ws = XLSX.utils.json_to_sheet(irisJson);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write the workbook to an Excel file
    const excelFileName = 'output.xlsx';
    XLSX.writeFile(wb, excelFileName, { bookSST: true });

    console.log(`Excel file "${excelFileName}" has been created.`);


});