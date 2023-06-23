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
            if (type != -1) {
              createChart(distinctNames[q]+" "+fileContent[1][type], fileContent[0][j] + " " + fileContent[1][type], dates, data);
            }
            else {
              createChart(distinctNames[q]+" "+fileContent[1][type], fileContent[0][j], dates, data);
            }
          }
          data = [];
        }
        //displayFileContent(fileContent);
      }
    }
  };

  reader.readAsText(file);
}


function displayFileContent(content) {
  var fileContentDiv = document.getElementById('file-content');
  fileContentDiv.textContent = content;
}

function createChart(name, chart_label, dates, data) {
  const chart_data = {
    labels: dates,
    datasets: [{
      label: chart_label,
      data: data,
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

  var formattedDate = date.toISOString().split('T')[0];

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