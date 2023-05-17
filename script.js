function uploadFile() {
  var fileInput = document.getElementById('file-input');
  var file = fileInput.files[0];

  var reader = new FileReader();

  reader.onload = function (event) {
    var data = []
    const dates = []
    var fileContent = event.target.result;
    fileContent = fileContent.split("\n")
    for (var i = 0; i < fileContent.length; i++) {
      fileContent[i] = fileContent[i].split("\"").join("")
      fileContent[i] = fileContent[i].split(",")
    }
    for (var i = 1; i < fileContent.length; i++) {
      dates.push(fileContent[i][1])
    }
    for (var j = 2; j < fileContent.length -1; j++) {
      for (var i = 1; i < fileContent.length; i++) {
        data.push(fileContent[i][j])
      }
      createChart(fileContent[0][j],dates,data)
      data=[]
    }
    console.log(fileContent)
    //displayFileContent(fileContent);
  };

  reader.readAsText(file);
}

function displayFileContent(content) {
  var fileContentDiv = document.getElementById('file-content');
  fileContentDiv.textContent = content;
}

function createChart(chart_label, dates, data) {
  const chart_data = {
    labels: dates,
    datasets: [{
      label: chart_label,
      data: data,
      borderColor: 'rgba(75, 192, 192, 1)', // Color of the line
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color underneath the line
    }]
  };

  // Create the line chart
  const canvas = document.createElement('canvas');

  // Set attributes (optional)
  canvas.setAttribute('id', 'myChart');

  // Append the canvas element to the container div
  const container = document.getElementById('canvas-container');
  container.appendChild(canvas);

  // Get the canvas context
  const ctx = canvas.getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: chart_data,
    options: {} // You can customize the chart options here
  });

}