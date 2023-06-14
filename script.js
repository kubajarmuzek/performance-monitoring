document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.getElementById('submit');
  submitButton.addEventListener('click', calculateScore);

  const questionContainers = document.querySelectorAll('#questionare-container');

  questionContainers.forEach(container => {
    const answerButtons = container.querySelectorAll('.btn-grid .btn');
    answerButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();

        // Remove 'selected' class from all buttons in the current question container
        const currentButtons = container.querySelectorAll('.btn-grid .btn');
        currentButtons.forEach(btn => {
          btn.classList.remove('selected');
        });

        // Add 'selected' class to the clicked button
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

  // Display the total score or perform further actions
  console.log('Total Score:', totalScore);
}



function clearView() {
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
    for (var j = 2; j < fileContent.length -2; j++) {
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

  const canvas = document.createElement('canvas');
  const chart_container = document.createElement('div');


  canvas.setAttribute('id', 'myChart');
  chart_container.setAttribute('id', 'chart-container');

  const container = document.getElementById('canvas-container');
  container.appendChild(chart_container);
  chart_container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: chart_data,
    options: {} 
  });

}