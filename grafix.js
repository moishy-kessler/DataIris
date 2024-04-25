const fs = require('fs');
const plotly = require('plotly')('yosistady', 'vq2fE6kXJ6nce6JDeyVT');


// const csvFilePath = 'irisFile.csv';
// const csvFile = fs.readFileSync(csvFilePath, 'utf8');

// Read the CSV data
fs.readFile('irisFile.csv', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
//   console.log(data);

  // Parse CSV data
  const lines = data.trim().split('\n');
  const headers = lines.shift().split(',');
  const csvData = lines.map(line => line.split(','));

  // Extract Petal length values
  const petalLengths = csvData.map(row => parseFloat(row[2]));

  // Create histogram trace
  const trace = {
    x: petalLengths,
    type: 'histogram',
  };

  // Create layout
  const layout = {
    title: 'Histogram of Petal Length',
    xaxis: { title: 'Petal Length' },
    yaxis: { title: 'Frequency' },
  };

  // Create graph options
  const graphOptions = { layout: layout, filename: 'iris-histogram', fileopt: 'overwrite' };

  // Generate graph and save it to Plotly
  plotly.plot(trace, graphOptions, (err, msg) => {
    if (err) {
      console.error('Error creating graph:', err);
    } else {
      console.log('Graph created:', msg);
    }
  });
});
