const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const addSliceBtn = document.getElementById("add-slice-btn");
const breakfastInput = document.getElementById("breakfast-input");
const sliceInputsContainer = document.getElementById("slice-inputs-container");


let breakfastMenus = [
  "Taho",
  "Pancakes",
  "Omelette",
  "Tasty",
  "Pandesal",
  "Champorado",
];


const generateRotationValues = () => {
  return breakfastMenus.map((menu, index) => {
    const color = ["gray", "green", "red", "cyan", "black", "violet"][index % 6];
    return {
      minDegree: (index * 60) + 1,
      maxDegree: (index + 1) * 60,
      value: menu,
      color: color,
    };
  });
};

let rotationValues = generateRotationValues();


function getRandomBreakfastMenu() {
  const randomIndex = Math.floor(Math.random() * breakfastMenus.length);
  return breakfastMenus[randomIndex];
}


const data = Array(breakfastMenus.length).fill(360 / breakfastMenus.length);


const pieColors = rotationValues.map((value) => value.color);


const myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: rotationValues.map((value) => value.value),
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: {
        display: false,
      },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});


const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Your Breakfast: ${i.value}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};


let count = 0;
let resultValue = 101;


spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>What's you breakfast for today Lets! Roll!!:</p>`;
  const randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  const rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});


addSliceBtn.addEventListener("click", () => {
  const newSlice = breakfastInput.value.trim();
  if (newSlice !== "") {
    breakfastMenus.push(newSlice);
    rotationValues = generateRotationValues();
    data.push(360 / breakfastMenus.length);
    myChart.data.labels = rotationValues.map((value) => value.value);
    myChart.data.datasets[0].data = data;
    myChart.data.datasets[0].backgroundColor = rotationValues.map((value) => value.color);
    myChart.update();
    breakfastInput.value = "";
  }
});
