document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('submit');
  submitButton.addEventListener('click', calculateScore);

  const questionContainers = document.querySelectorAll('#questionare-container');

  questionContainers.forEach(container => {
    const answerButtons = container.querySelectorAll('.btn-grid .btn');
    answerButtons.forEach(button => {
      button.addEventListener('click', function (event) {
        event.preventDefault();

        const currentButtons = container.querySelectorAll('.btn-grid .btn');
        currentButtons.forEach(btn => {
          btn.classList.remove('selected');
        });

        button.classList.add('selected');
      });
    });
  });
});


function calculateScore() {
  const questionContainers = document.querySelectorAll('#questionare-container');
  let totalScore = 0;

  questionContainers.forEach(container => {
    const selectedButton = container.querySelector('.btn-grid .btn.selected');
    if (selectedButton) {
      const answerValue = parseInt(selectedButton.dataset.value);
      const weight = parseFloat(selectedButton.dataset.weight);
      const questionScore = answerValue / 5 * weight;
      totalScore += questionScore;
    }
  });

  console.log('Total Score:', totalScore);

  openPopup(totalScore);
}

function openPopup(score) {
  const popup = document.getElementById("popup");

  const popupContent = popup.querySelector(".popup-content");
  popupContent.innerHTML = `
    <h2>Your Score</h2>
    <p>${score}</p>
    <button id="closePopup">Close</button>
  `;

  popup.style.display = "block";

  const closePopupButton = popup.querySelector("#closePopup");
  closePopupButton.addEventListener("click", function () {
    popup.style.display = "none";
  });
}


function clearView() {
  const divs = document.querySelectorAll('div[id^="canvas-container-"]');

  divs.forEach(function (div) {
    div.parentNode.removeChild(div);
  });

  const div = document.querySelector("#canvas-container");
  const headers = div.querySelectorAll('h2');
  headers.forEach(function (header) {
    header.parentNode.removeChild(header);
  });
}



function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}


function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
}


function uploadFile() {
  var fileInput = document.getElementById('file-input');
  var file = fileInput.files[0];

  var reader = new FileReader();

  reader.onload = function (event) {
    var types = []
    var data = [];
    var dates = [];
    var type = -1;
    var fileContentAll = event.target.result;
    fileContentAll = fileContentAll.split("\n")
    for (var i = 0; i < fileContentAll.length; i++) {
      fileContentAll[i] = fileContentAll[i].split("\"").join("")
      fileContentAll[i] = fileContentAll[i].split(",")
    }
    for (var i = 0; i < fileContentAll[0].length; i++) {
      if (fileContentAll[0][i] == "Test Type") {
        type = i;
      }
    }

    const distinctNames = [...new Set(fileContentAll.slice(1).map(row => row[0]))];
    const distinctTests = [...new Set(fileContentAll.slice(1).map(row => row[type]))];
    

    const container = document.getElementById('canvas-container');

    for(var w=0;w<distinctTests.length;w++){
      fileContent=filterRowsByTestType(fileContentAll,distinctTests[w]);
      console.log(fileContent);
      for (var q = 0; q < distinctNames.length; q++) {
        data = []
        dates = []
        const heading = document.createElement('h2');
        heading.textContent = distinctNames[q]+" "+fileContent[1][type];
        container.appendChild(heading);
  
        const chartContainerId = `canvas-container-${distinctNames[q]+" "+fileContent[1][type]}`;
        const chartContainer = document.createElement('div');
        chartContainer.setAttribute('id', chartContainerId);
        chartContainer.classList.add('canvas-container');
  
        container.appendChild(chartContainer);
  
        for (var i = 1; i < fileContent.length; i++) {
          if (fileContent[i][0] == distinctNames[q]) {
            dates.push(convertDateFormat(fileContent[i][3]))
          }
        }
        for (var j = 5; j < (fileContent[0].length - 5); j++) {
          var breakOccurred = false;
          for (var i = 1; i < fileContent.length; i++) {
            if (fileContent[i][0] == distinctNames[q]) {
              if (fileContent[i][j] == "") {
                data = [];
                breakOccurred = true;
                break;
              }
              data.push(removeUnit(fileContent[i][j]))
            }
  
          }
          if (!breakOccurred) {
            types.push(fileContent[0][j])
            createChart(distinctNames[q]+" "+fileContent[1][type], fileContent[0][j], dates, data);
          }
          data = [];
        }
      }
    }
    enableCorelation(types,fileContentAll);
  };

  reader.readAsText(file);
}

function createChart(name, chart_label, dates, data) {
  // Sort the dates in ascending order
  const sortedDates = dates.slice().sort((a, b) => new Date(a) - new Date(b));

  // Find the corresponding indices of the sorted dates in the original array
  const indices = sortedDates.map(date => dates.indexOf(date));

  // Sort the data based on the indices of the sorted dates
  const sortedData = indices.map(index => data[index]);

  const chart_data = {
    labels: sortedDates,
    datasets: [{
      label: chart_label,
      data: sortedData,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    }]
  };

  const canvas = document.createElement('canvas');
  const chart_container = document.createElement('div');

  canvas.setAttribute('id', 'myChart');

  const containerId = `canvas-container-${name}`;
  const container = document.getElementById(containerId);
  if (container) {
    container.appendChild(chart_container);
    chart_container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: chart_data,
      options: {}
    });
  }
}


function removeUnit(number) {
  var numberString = number.toString();

  numberString = numberString.replace(',', '.');

  var cleanNumberString = numberString.replace(/[^\d.]/g, '');

  var cleanNumber = Number(cleanNumberString);
  return cleanNumber;
}

function convertDateFormat(dateString) {
  var dateParts = dateString.split('/');

  var day = dateParts[0];
  var month = dateParts[1];
  var year = dateParts[2];

  var date = new Date(year, month - 1, day);

  // Adjust the date based on the timezone offset
  var timezoneOffset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
  date.setTime(date.getTime() - timezoneOffset);

  // Since the date is in UTC now, we need to convert it back to the local timezone
  var localDate = new Date(date.getTime() + timezoneOffset);

  var formattedDate = localDate.toISOString().split('T')[0];

  return formattedDate;
}

function filterRowsByTestType(table, testType) {
  const headerRow = table[0];
  const testTypeIndex = headerRow.indexOf("Test Type");
  
  if (testTypeIndex === -1) {
    console.log("Test Type column not found.");
    return [];
  }
  
  const filteredTable = [];
  filteredTable.push(headerRow); // Add the header row to the filtered table
  
  for (let i = 1; i < table.length; i++) {
    const row = table[i];
    if (row[testTypeIndex] === testType) {
      filteredTable.push(row);
    }
  }
  
  return filteredTable;
}

function enableCorelation(types,data) {
  const canvasContainer = document.getElementById('canvas-container');

  const newDiv = document.createElement('div');
  const innerDiv = document.createElement('div');
  innerDiv.setAttribute('id','selection');
  const header = document.createElement('h2');
  const button = document.createElement('button');
  button.textContent = 'See corelation';

  header.textContent = 'Correlation';
  newDiv.appendChild(header);

  const text = document.createElement('p');
  text.textContent = 'Choose the metrics you want to see correlation of';
  newDiv.appendChild(text);

  const select1 = document.createElement('select');
  const select2 = document.createElement('select');
  select1.setAttribute('id','option1');
  select1.setAttribute('id','option2');
  types.forEach(function (type) {
    const option1 = document.createElement('option');
    const option2 = document.createElement('option');
    option1.textContent = type;
    option2.textContent = type;
    select1.appendChild(option1);
    select2.appendChild(option2);
  });
  
  innerDiv.appendChild(select1);
  innerDiv.appendChild(select2);
  innerDiv.appendChild(button);

  newDiv.appendChild(innerDiv);
  
  const chartDiv = document.createElement('div');
  chartDiv.setAttribute('id','scatter-container');

  newDiv.appendChild(chartDiv);
  canvasContainer.parentNode.insertBefore(newDiv, canvasContainer);

  button.addEventListener('click', function() {
    const selectedOption1 = select1.value;
    const selectedOption2 = select2.value;
  
    const xData = getColumnData(data, selectedOption1);
    const yData = getColumnData(data, selectedOption2);
    
    console.log(xData)
    console.log(yData)
    const x = xData.map(str => parseFloat(str));
    const y = yData.map(str => parseFloat(str));
    createScatterPlot(xData, yData);
  });
  
}

function createScatterPlot(xValues, yValues) {
  const scatterData = {
    datasets: [{
      data: xValues.map((x, index) => ({ x, y: yValues[index] })),
      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      pointRadius: 5,
      pointHoverRadius: 7,
      showLine: false,
    }]
  };

  const scatterOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
      y: {
        type: 'linear',
      }
    },
  };

  const scatterConfig = {
    type: 'scatter',
    data: scatterData,
    options: scatterOptions
  };

  const canvas = document.createElement('canvas');
  const scatterContainer = document.getElementById('scatter-container');
  scatterContainer.innerHTML = '';
  scatterContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  new Chart(ctx, scatterConfig);
}

function getColumnData(data, columnName) {
  const headerRow = data[0];
  var columnIndex = -1;

  for(var i=0;i<headerRow.length;i++) {
    if (headerRow[i].indexOf(columnName) !== -1 && data[1][i]!="") {
      columnIndex = i;
      break;
    }
  }

  if (columnIndex === -1) {
    console.log(`Column '${columnName}' not found.`);
    return [];
  }

  var column=[];
  for(var i=1;i<data.length;i++) {
    column.push(removeUnit(data[i][columnIndex]));
  }
  return column;
}
