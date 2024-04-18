const monthCtx = document.getElementById("monthlySales").getContext("2d");
const deptCtx = document.getElementById("deptSales").getContext("2d");
const yearlyLabel = document.getElementById("yearlyTotal");
const bSalesOver5000 = document.getElementById("bSalesOver5000");
bSalesOver5000.addEventListener("click", getSalesMonths);
const bReset = document.getElementById("bReset");
bReset.addEventListener("click", resetMonthlySales);

// Valores del formulario
const newAmount = document.getElementById("itemAmount");
const newMonth = document.getElementById("monthId");
const bAddSaleModal = document.getElementById("bAddSaleModal");
bAddSaleModal.addEventListener("click", addSale);
const bRemoveSale = document.getElementById("bRemoveSale");
bRemoveSale.addEventListener("click", drawSelectMontlySales);
const bRemoveSaleModal = document.getElementById("bRemoveSaleModal");
bRemoveSaleModal.addEventListener("click", removeMonthlySale);
//agregamos un identificador de radioButtons
const radioButtons = document.getElementsByName("inlineRadioOptions");

// Variables
const monthSales = Array.of(6500, 3250, 4000);
const monthLabels = Array.of("Octubre", "Noviembre", "Diciembre");
const deptSales = Array.of(12, 9, 7, 3);
const deptLabels = Array.of("Cámara", "Móvil", "Portátil", "Tablet");
const yearlyTotal = 0;

//añadimos los arrays para los elementos
let monthlySalesCamera = Array.of(1000, 1000, 1000);
let monthlySalesLaptop = Array.of(2000, 2000, 2000);
let monthlySalesPhone = Array.of(3000, 3000, 3000);
let monthlySalesTablet = Array.of(4000, 4000, 4000);
let monthyLabels = Array.of("Oct", "Nov", "Dec");

// Colecciones para mostrar en gráficos.
const monthlyLabelsSet = new Set();
const monthlySalesArray = [];
const monthlySalesMap = new Map();

// Gráfico de Barras
const monthlySalesChart = new Chart(monthCtx, {
	type: "bar",
	data: {
		labels: monthLabels,
		datasets: [
			{
				label: "Camarás",
				data: monthlySalesCamera,
				backgroundColor: "rgba(238,184,104,1)",
				borderWidth: 0,
			},
			{
				label: "Portatiles",
				data: monthlySalesLaptop,
				backgroundColor: "rgba(75,166,223,1)",
				borderWidth: 0,
			},
			{
				label: "Telefonos",
				data: monthlySalesPhone,
				backgroundColor: "rgba(239,118,122,1)",
				borderWidth: 0,
			},
			{
				label: "Tablets",
				data: monthlySalesTablet,
				backgroundColor: "rgba(40,167,69,1)",
				borderWidth: 0,
			},
		],
	},
	options: {
		scales: {
			yAxes: [
				{
					ticks: { beginAtZero: true },
				},
			],
		},
	},
});

// Pie
const deptSalesChart = new Chart(deptCtx, {
	type: "pie",
	data: {
		labels: deptLabels,
		datasets: [
			{
				label: "Número de ventas",
				data: deptSales,
				backgroundColor: [
					"rgba(238, 184, 104, 1)",
					"rgba(75, 166, 223, 1)",
					"rgba(239, 118, 122, 1)",
					"rgba(40, 167, 69, 1)",
				],
				borderWidth: 0,
			},
		],
	},
	options: {},
});

/* Calculo de totales */
function addYearlyTotal(a, b, c) {
	return a + b + c;
}

function initMonthlyTotalSales() {
	yearlyLabel.innerHTML =
		Array.from(monthlySalesMap.values()).reduce(function (count, value) {
			return count + value;
		}, 0) + "€";
}

initMonthlyTotalSales();

/* Ventas por encima de 5000 */
function findOver5000() {
	let position = -1;
	const quantity = monthSales.find((elem, index) => {
		if (elem > 5000) {
			position = index;
			return true;
		}
		return false;
	});
	alert(`Cantidad: ${quantity} Posición: ${position}`);
}

function resetMonthlySales() {
	monthlySalesMap.clear();
	monthlySalesChart.reset();
	monthlySalesChart.render();
	initMonthlyTotalSales();
}

function checkRadios() {
	const radioButtons = document.getElementsByName("inlineRadioOptions");

	let selected = false;
	for (let i = 0; i < radioButtons.length; i++) {
		if (radioButtons[i].checked) {
			selected = true;
			break;
		}
	}

	if (selected) {
		alert("¡Al menos un radiobutton ha sido seleccionado!");
	} else {
		alert("Por favor, selecciona al menos un radiobutton.");
	}
}

// Añadir ventas al gráfico
function addSale() {
	try {
		//validacion de los datos recogidos desde el formulario
		if (newMonth.value === "")
			throw {
				name: "MonthError",
				message: "El mes esta vacio",
			};
		//validar todos los inputs del formulario
		if (newAmount.value === "")
			throw {
				name: "AmonthError",
				message: "La cantidad esta vacia",
			};

		//comprobamos los radiobuttons
		let radioSelected = false;
		for (let i = 0; i < radioButtons.length; i++) {
			if (radioButtons[i].checked) {
				radioSelected = true;
				break;
			}
		}

		if (!radioSelected)
			throw {
				name: "bRadioError",
				message: "Debe seleccionar al menos un elemento",
			};

		// si ya existe el mes se sumara
		if (monthlySalesMap.has(newMonth.value)) {
			let currentValue = monthlySalesMap.get(newMonth.value);
			let newValue = currentValue + Number.parseInt(newAmount.value);
			monthlySalesMap.set(newMonth.value, newValue);
		} else {
			// Si el mes no existe en el mapa, simplemente agregamos la nueva cantidad como un nuevo elemento
			monthlySalesMap.set(newMonth.value, Number.parseInt(newAmount.value));
		}

		// Actualizar arrays de ventas mensuales con los nuevos datos
		actualizarDpt();
		// Recuento de totales
		initMonthlyTotalSales();
		updateCharts();
	} catch (error) {
		// Tratamiento de excepciones
		alert(error.message);
	} finally {
		// Reseteo de formulario
		cleanAddSaleForm();
	}
}

function actualizarDpt() {
	if (radioButtons[0].checked) {
		monthlySalesCamera = Array.of(...monthlySalesMap.values());
	} else if (radioButtons[1].checked) {
		monthlySalesLaptop = Array.of(...monthlySalesMap.values());
	} else if (radioButtons[2].checked) {
		monthlySalesPhone = Array.of(...monthlySalesMap.values());
	} else if (radioButtons[3].checked) {
		monthlySalesTablet = Array.of(...monthlySalesMap.values());
	}
}

function updateCharts() {
	//actualizar grafica de meses
	// Actualizar gráfico
	const radioButtons = document.getElementsByName("inlineRadioOptions");

	if (radioButtons[0].checked) {
		monthlySalesChart.data.datasets[0].data = Array.from(
			monthlySalesMap.values()
		);
	} else if (radioButtons[1].checked) {
		monthlySalesChart.data.datasets[1].data = Array.from(
			monthlySalesMap.values()
		);
	} else if (radioButtons[2].checked) {
		monthlySalesChart.data.datasets[2].data = Array.from(
			monthlySalesMap.values()
		);
	} else if (radioButtons[3].checked) {
		monthlySalesChart.data.datasets[3].data = Array.from(
			monthlySalesMap.values()
		);
	}

	monthlySalesChart.data.labels = Array.from(monthlySalesMap.keys());
	monthlySalesChart.update();
	//actualizar la grafica de ventas por departamento
	deptSalesChart.data.datasets[0].data = calculateTotalSales();
	deptSalesChart.update();
}

function cleanAddSaleForm() {
	newMonth.value = "";
	newAmount.value = "";
}

// //Resetear datos en los gráficos
// function resetMonthlySales() {
// 	monthlySalesArray.length = 0;
// 	monthlyLabelsSet.clear();
// 	monthlySalesChart.update();
// 	initMonthlyTotalSales();
// }
function resetMonthlySales() {
	// Limpiar el mapa de ventas mensuales
	monthlySalesMap.clear();

	// Restaurar arrays de ventas mensuales a cero
	monthlySalesCamera.fill(0);
	monthlySalesLaptop.fill(0);
	monthlySalesPhone.fill(0);
	monthlySalesTablet.fill(0);

	// Establecer todos los valores de los conjuntos de datos del gráfico a cero
	for (let dataset of monthlySalesChart.data.datasets) {
		dataset.data.fill(0);
	}

	// Recalcular totales y actualizar gráficos
	initMonthlyTotalSales();
	updateCharts();
}



function getSalesMonths() {
	monthlyLabelsSet.forEach(function (month) {
		console.dir(month);
		alert(month);
	});
}

// Función para calcular las ventas totales por categoría
function calculateTotalSales() {
	let totalSales = [];

	// Recorremos los datos de ventas mensuales por cada categoría
	for (let i = 0; i < deptLabels.length; i++) {
		let categoryTotal = 0;
		switch (i) {
			case 0:
				categoryTotal = monthlySalesCamera.reduce(
					(total, amount) => total + amount,
					0
				);
				break;
			case 1:
				categoryTotal = monthlySalesLaptop.reduce(
					(total, amount) => total + amount,
					0
				);
				break;
			case 2:
				categoryTotal = monthlySalesPhone.reduce(
					(total, amount) => total + amount,
					0
				);
				break;
			case 3:
				categoryTotal = monthlySalesTablet.reduce(
					(total, amount) => total + amount,
					0
				);
				break;
			default:
				break;
		}
		totalSales.push(categoryTotal);
	}

	return totalSales;
}

// Obtener las ventas totales por categoría
let totalDeptSales = calculateTotalSales();

// Actualizar datos del gráfico de sectores
// deptSalesChart.data.datasets[0].data = totalDeptSales;
// deptSalesChart.update();

// Funciones
function drawSelectMontlySales() {
	monthSelect.innerHTML = ""; // Limpiar el select
  
	for (let [month, amount] of monthSalesMap.entries()) {
	  const option = document.createElement("option");
	  option.value = month;
	  option.textContent = `${month}: ${amount}`;
	  monthSelect.appendChild(option);
	}
  }
  
  function removeMonthlySale() {
	const selectedMonth = monthSelect.value;
	const selectedType = [...radioButtons].find(radio => radio.checked).value;
  
	if (!selectedMonth || !selectedType) {
	  alert("Selecciona un mes y un tipo de venta para eliminar.");
	  return;
	}
  
	if (!monthSalesMap.has(selectedMonth)) {
	  alert(`No hay ventas del tipo ${selectedType} en el mes ${selectedMonth}.`);
	  return;
	}
  
	// Eliminar la venta del tipo seleccionado del mes seleccionado
	switch (selectedType) {
	  case "camera":
		monthlySalesCamera[monthLabels.indexOf(selectedMonth)] -= monthSalesMap.get(selectedMonth);
		break;
	  case "laptop":
		monthlySalesLaptop[monthLabels.indexOf(selectedMonth)] -= monthSalesMap.get(selectedMonth);
		break;
	  case "phone":
		monthlySalesPhone[monthLabels.indexOf(selectedMonth)] -= monthSalesMap.get(selectedMonth);
		break;
	  case "tablet":
		monthlySalesTablet[monthLabels.indexOf(selectedMonth)] -= monthSalesMap.get(selectedMonth);
		break;
	}
}
