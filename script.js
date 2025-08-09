// Simplified addItem() with completely empty fields
function addItem() {
  const table = document.getElementById("itemsBody");
  const rowCount = table.rows.length + 1;
  const row = document.createElement("tr");
  row.innerHTML = `
    <td style="text-align: center">${rowCount}</td>
    <td contenteditable="true">Item <br><small contenteditable="true"></small></td>
    <td contenteditable="true" style="text-align: center"></td>
    <td contenteditable="true" style="text-align: center"></td>
    <td contenteditable="true" style="text-align: center"></td>
    <td contenteditable="true" style="text-align: center"></td>
    <td class="delete-cell no-print"><button onclick="deleteRow(this)">❌</button></td>
  `;
  table.appendChild(row);
  calculateTotals();
}

function deleteRow(button) {
  const row = button.closest("tr");
  row.remove();
  updateSerialNumbers();
  calculateTotals();
}

function updateSerialNumbers() {
  const rows = document.querySelectorAll("#itemsBody tr");
  rows.forEach((row, index) => {
    row.cells[0].textContent = index + 1;
  });
}

// Simplified calculateTotals - just sums whatever numbers it finds
function calculateTotals() {
  let amountTotal = 0;
  let totalWeight = 0;

  document.querySelectorAll("#itemsBody tr").forEach((row) => {
    totalWeight += parseFloat(row.cells[3].textContent) || 0;
    amountTotal += parseFloat(row.cells[5].textContent) || 0;
  });

  // Round to 2 decimal places to fix floating point precision issues
  document.getElementById("totalWeightFooter").textContent =
    Math.round(totalWeight * 100) / 100;
  document.getElementById("grandTotalFooter").textContent =
    Math.round(amountTotal * 100) / 100;
}

// Completely hands-off input handler
document.getElementById("itemsBody").addEventListener("input", (e) => {
  calculateTotals();
});

// Rest of the code remains the same...
function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = String(today.getFullYear()).slice(-2); // last two digits

  return `${day}/${month}/${year}`;
}

function downloadPDF() {
  const customerName = (
    document.querySelector('.billed-to-table input[type="text"]')?.value ||
    "invoice"
  ).replace(/[^a-zA-Z0-9]/g, "_");

  const element = document.getElementById("invoice");
  const opt = {
    margin: 0,
    filename: `${customerName}_estimate.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(opt).from(element).save();
}

window.onload = function () {
  const dateInputs = document.querySelectorAll(
    '.header-table input[type="text"]'
  );
  if (dateInputs.length >= 2 && !dateInputs[1].value) {
    dateInputs[1].value = getCurrentDate();
  }

  document
    .getElementById("photoInput")
    .addEventListener("change", function (event) {
      const reader = new FileReader();
      reader.onload = function () {
        document.getElementById("customerPhoto").src = reader.result;
      };
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
      }
    });

  document
    .getElementById("ornamentPhotoInput")
    .addEventListener("change", function (event) {
      const reader = new FileReader();
      reader.onload = function () {
        document.getElementById("ornamentPhoto").src = reader.result;
      };
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
      }
    });

  calculateTotals();
  addItem();
};
