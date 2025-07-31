// Simplified addItem() without any calculation logic
function addItem() {
  const table = document.getElementById("itemsBody");
  const rowCount = table.rows.length + 1;
  const row = document.createElement("tr");
  row.innerHTML = `
    <td style="text-align: center">${rowCount}</td>
    <td contenteditable="true">Item <br><small contenteditable="true"></small></td>
    <td contenteditable="true" style="text-align: center"></td>
    <td contenteditable="true" style="text-align: center">Gms.</td>
    <td contenteditable="true" style="text-align: center"></td> <!-- ROI Column (index 4) -->
    <td contenteditable="true" style="text-align: center"></td> <!-- Amount Column (index 5) -->
    <td class="delete-cell no-print"><button onclick="deleteRow(this)">❌</button></td>
  `;
  table.appendChild(row);
  calculateTotals();
}

function deleteRow(button) {
  const row = button.closest("tr");
  row.remove();
  // Update serial numbers after deletion
  updateSerialNumbers();
  calculateTotals();
}

function updateSerialNumbers() {
  const rows = document.querySelectorAll("#itemsBody tr");
  rows.forEach((row, index) => {
    row.cells[0].textContent = index + 1;
  });
}

// Pure summation without any calculations
function calculateTotals() {
  let amountTotal = 0;
  let totalWeight = 0;
  let totalPieces = 0;

  document.querySelectorAll("#itemsBody tr").forEach((row) => {
    totalPieces += parseFloat(row.cells[2].textContent) || 0;
    totalWeight +=
      parseFloat(row.cells[3].textContent.replace(/[^\d.]/g, "")) || 0;
    amountTotal +=
      parseFloat(row.cells[5].textContent.replace(/[^\d.]/g, "")) || 0;
  });

  // Update footer
  document.getElementById("totalPiecesFooter").textContent = totalPieces;
  document.getElementById("totalWeightFooter").textContent =
    totalWeight.toFixed(2);
  document.getElementById("grandTotalFooter").textContent =
    amountTotal.toFixed(2);
}

// Improved input handler with cursor position preservation
document.getElementById("itemsBody").addEventListener("input", (e) => {
  const cell = e.target.closest("td");
  if (!cell) return;

  const cellIndex = Array.from(cell.parentElement.cells).indexOf(cell);

  // Only handle numeric columns (Weight, ROI, Amount)
  if ([3, 4, 5].includes(cellIndex)) {
    // Save cursor position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const cursorPosition = range.startOffset;

    // Get numeric value
    const originalText = cell.textContent;
    const numericValue = parseFloat(originalText.replace(/[^\d.]/g, "")) || 0;

    // Format the value
    let formattedValue = numericValue.toFixed(2);
    if (cellIndex === 3) {
      formattedValue += " Gms.";
    }

    // Update cell content
    cell.textContent = formattedValue;

    // Restore cursor position (adjusted for any added characters)
    try {
      const newRange = document.createRange();
      const newCursorPos = Math.min(cursorPosition, formattedValue.length);
      newRange.setStart(cell.childNodes[0], newCursorPos);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } catch (e) {
      console.log("Cursor position restoration error:", e);
    }
  }

  calculateTotals();
});

// Add this function to format the date
function getCurrentDate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const today = new Date();
  const day = today.getDate();
  const month = months[today.getMonth()];
  const year = today.getFullYear();
  return `${day} ${month} ${year}`;
}

function downloadPDF() {
  // Get customer name for filename
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

document.getElementById("itemsBody").addEventListener("input", calculateTotals);

// Update the window.onload function to set the date
window.onload = function () {
  // Set current date in the date field - more specific selector
  const dateInputs = document.querySelectorAll(
    '.header-table input[type="text"]'
  );
  if (dateInputs.length >= 2) {
    // Date is the second input
    if (!dateInputs[1].value) {
      // Only set if empty
      dateInputs[1].value = getCurrentDate();
    }
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
  // Add one empty row by default when page loads
  addItem();
};
