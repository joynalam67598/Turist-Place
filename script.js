const reviewIdField = document.getElementById("reviewId");
const nameField = document.getElementById("name");
const addressField = document.getElementById("address");
const ratingField = document.getElementById("rating");
const typeField = document.getElementById("type");
const pictureField = document.getElementById("picture");
const reviewTable = document.getElementById("review-table");
const serachInput = document.getElementById("searchInput");
const formPage = document.getElementById("form-div");
const listPage = document.getElementById("table-div");
const toogleBtn = document.getElementById("toogle");
const submitBtn = document.getElementById("submit");

var row = null;

function showError(elem, message) {
  elem.nextElementSibling.innerHTML = message;
}

function clearError(elem) {
  elem.removeAttribute("error");
  elem.nextElementSibling.innerHTML = "";
}

function verifyName(placeName) {
  let rows = reviewTable.getElementsByTagName("tr");
  for (i = 1; i < rows.length; i++) {
    td = rows[i].cells[0];
    if (td) {
      txtValue = td.innerText;
      if (
        row != null &&
        txtValue == placeName &&
        row.rowIndex != rows[i].rowIndex
      )
        return true;
      else if (row == null && txtValue == placeName) return true;
    }
  }
  return false;
}

function validateForm(touristPlaceData) {
  let valid = true;
  if (touristPlaceData[0] == "") {
    valid = false;
    showError(nameField, "Name is required");
  } else if (verifyName(touristPlaceData[0])) {
    valid = false;
    showError(nameField, "Name already taken");
  } else clearError(nameField);

  if (touristPlaceData[1] == "") {
    valid = false;
    showError(addressField, "Address is required");
  } else clearError(addressField);

  if (touristPlaceData[2] < 1 || touristPlaceData[2] > 5) {
    valid = false;
    showError(ratingField, "Range 1 to 5");
  } else clearError(ratingField);

  if (touristPlaceData[3] == "") {
    valid = false;
    showError(typeField, "Type is required");
  } else clearError(typeField);

  if (touristPlaceData[4] == "") {
    valid = false;
    showError(pictureField, "Picture can't be balnk.");
  } else clearError(pictureField);
  return valid;
}

function getImageName(imgPath) {
  return imgPath.replace(/^.*[\\\/]/, "");
}

function submitForm(e) {
  e.preventDefault();
  var touristPlaceData = getTtouristPlaceData();
  let valid = validateForm(touristPlaceData);
  if (valid) {
    if (row == null) genarateRow(touristPlaceData);
    else updateData();
    clearForm();
    togglePage();
  }
}

function getTtouristPlaceData() {
  let placeName = nameField.value;
  let address = addressField.value;
  let rating = ratingField.value;
  let type = typeField.value;
  let pictureSrc = getImageName(pictureField.value);

  return [placeName, address, rating, type, pictureSrc];
}

function clearForm() {
  nameField.value = "";
  addressField.value = "";
  ratingField.value = "";
  typeField.value = "";
  pictureField.value = "";
}

function genarateRow(data) {
  var row = reviewTable.insertRow();
  var cell1 = row.insertCell();
  var cell2 = row.insertCell();
  var cell3 = row.insertCell();
  var cell4 = row.insertCell();
  var cell5 = row.insertCell();
  var cell6 = row.insertCell();
  cell1.innerHTML = data[0];
  cell2.innerHTML = data[1];
  cell3.innerHTML = data[2];
  cell4.innerHTML = data[3];
  cell4.style.display = "none";
  cell5.innerHTML = `<img src="/images/${data[4]}" height="100" width="100"/>`;
  cell6.innerHTML = `<div class="container">
                        <button
                          type = "button"
                          class="button update-btn"
                          onclick="editData(this)"
                          >Update
                        </button>
                        <button
                          type = "button"
                          class="button delete-btn"
                          onClick="deleteData(this)"
                          >Delete
                        </button>
                      </div>`;
}

function editData(td) {
  row = td.parentElement.parentElement.parentElement;
  nameField.value = row.cells[0].innerHTML;
  addressField.value = row.cells[1].innerHTML;
  ratingField.value = row.cells[2].innerHTML;
  typeField.value = row.cells[3].innerHTML;
  // pictureField.value = "/image/" + touristReviews[pos].pictureSrc;
  // pictureField.value = touristReviews[pos].pictureSrc;
  togglePage();
}

function updateData() {
  row.cells[0].innerHTML = nameField.value;
  row.cells[1].innerHTML = addressField.value;
  row.cells[2].innerHTML = ratingField.value;
  row.cells[3].innerHTML = typeField.value;
  row.cells[4].src = pictureField.value;
  row = null;
}

function deleteData(td) {
  let ans = confirm("Are you sure delete this row?");
  let rowIndex = td.parentElement.parentElement.parentElement.rowIndex;
  if (ans) {
    reviewTable.deleteRow(rowIndex);
  }
}

function getReviewByPlacenName() {
  let inputName = serachInput.value.toUpperCase();
  let rows = reviewTable.getElementsByTagName("tr");
  for (i = 1; i < rows.length; i++) {
    td = rows[i].cells[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(inputName) > -1) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }
}

function sortTable(n) {
  var table,
    rows,
    switching,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = reviewTable;
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      let x = rows[i].getElementsByTagName("TD")[n];
      let y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function togglePage() {
  if (formPage.style.display === "none") {
    formPage.style.display = "flex";
    listPage.style.display = "none";
    toogleBtn.innerHTML = "Back To Tourist Place List";
  } else {
    formPage.style.display = "none";
    listPage.style.display = "block";
    toogleBtn.innerHTML = "Create New Tourist Place";
  }
}
