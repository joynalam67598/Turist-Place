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

let touristReviews = [];
let reviewsSize = 0;

function showError(elem, message) {
  elem.className = "error";
  elem.nextElementSibling.innerHTML = message;
}

function clearError(elem) {
  elem.removeAttribute("error");
  elem.nextElementSibling.innerHTML = "";
}

function placeNameExist(placeName, id) {
  for (i = 0; i < reviewsSize; i++) {
    if (id != -1) {
      if (
        touristReviews[i].placeName == placeName &&
        id != touristReviews[i].id
      )
        return true;
    } else if (touristReviews[i].placeName == placeName) return true;
  }
  return false;
}

function validateForm(touristPlaceData) {
  let valid = true;
  if (touristPlaceData[0] == "") {
    valid = false;
    showError(nameField, "Name is required");
  } else if (placeNameExist(touristPlaceData[0].trim(), touristPlaceData[5])) {
    valid = false;
    showError(nameField, "Place name already taken");
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
    getStoredData();
    touristReviews.push({
      id: reviewsSize ? reviewsSize + 1 : 1,
      placeName: touristPlaceData[0],
      address: touristPlaceData[1],
      rating: touristPlaceData[2],
      type: touristPlaceData[3],
      pictureSrc: touristPlaceData[4],
    });
    sessionStorage.setItem("touristReviews", JSON.stringify(touristReviews));
    clearForm();
    togglePage();
  }
}

function getTtouristPlaceData() {
  let id = reviewIdField.value;
  let placeName = nameField.value;
  let address = addressField.value;
  let rating = ratingField.value;
  let type = typeField.value;
  let pictureSrc = pictureField.value;

  return [placeName, address, rating, type, pictureSrc, id];
}

function getStoredData() {
  var previousStoredData = sessionStorage.getItem("touristReviews");
  if (previousStoredData != null) {
    touristReviews = JSON.parse(previousStoredData);
    reviewsSize = touristReviews.length;
  }
}

function clearForm() {
  reviewIdField.value = -1;
  nameField.value = "";
  addressField.value = "";
  ratingField.value = "";
  typeField.value = "";
  pictureField.value = "";
}

function drawTable() {
  getStoredData();
  for (i = 0; i < reviewsSize; i++) {
    genarateRow(touristReviews[i]);
  }
}

drawTable();

function genarateRow(data) {
  var newRow = reviewTable.insertRow();
  var cell1 = newRow.insertCell();
  var cell2 = newRow.insertCell();
  var cell3 = newRow.insertCell();
  var cell4 = newRow.insertCell();
  var cell5 = newRow.insertCell();
  cell1.innerHTML = data.placeName;
  cell2.innerHTML = data.address;
  cell3.innerHTML = data.rating;
  cell4.innerHTML = `<img src="/images/${getImageName(
    data.pictureSrc
  )}" height="100" width="100"/>`;
  cell5.innerHTML = `<div class="container">
                        <a
                          class="button"
                          style="background-color: #0ea5c7"
                          onclick="editData(${data.id})"
                          >Update</a
                        >
                        <a
                          class="button"
                          style="background-color: #b52b09"
                          onClick="deleteData(${data.id})"
                          >Delete</a
                        >
                      </div>`;
}

function getReviewById(id) {
  getStoredData();
  let position = 0;
  for (i = 0; i < reviewsSize; i++) {
    if (touristReviews[i].id == id) {
      console.log(touristReviews[i]);
      position = i;
      break;
    }
  }
  return position;
}

function editData(id) {
  let pos = getReviewById(id);
  submitBtn.innerHTML = "Update";
  submitBtn.setAttribute("onclick", "updateData(event)");
  togglePage();
  reviewIdField.value = touristReviews[pos].id;
  nameField.value = touristReviews[pos].placeName;
  addressField.value = touristReviews[pos].address;
  ratingField.value = touristReviews[pos].rating;
  typeField.value = touristReviews[pos].type;
  // pictureField.value = "/image/" + touristReviews[pos].pictureSrc;
  // pictureField.value = touristReviews[pos].pictureSrc;
}

function updateData(e) {
  e.preventDefault();
  var touristPlaceData = getTtouristPlaceData();
  let valid = validateForm(touristPlaceData);
  if (valid) {
    let pos = getReviewById(touristPlaceData[5]);
    touristReviews[pos].id = touristPlaceData[5];
    touristReviews[pos].placeName = touristPlaceData[0];
    touristReviews[pos].address = touristPlaceData[1];
    touristReviews[pos].rating = touristPlaceData[2];
    touristReviews[pos].type = touristPlaceData[3];
    touristReviews[pos].pictureSrc = touristPlaceData[4];

    sessionStorage.setItem("touristReviews", JSON.stringify(touristReviews));
    clearForm();
    togglePage();
    submitBtn.innerHTML = "Submit";
    submitBtn.setAttribute("onclick", "submitForm(event)");
  }
}

function deleteData(id) {
  let ans = confirm("Are you sure delete this row?");
  if (ans) {
    let pos = getReviewById(id);
    touristReviews.splice(pos, 1);
    sessionStorage.setItem("touristReviews", JSON.stringify(touristReviews));
    drawTable();
  }
}

function emptyTable() {
  while (reviewTable.rows.length > 1) {
    reviewTable.deleteRow(1);
  }
}

function getReviewByPlacenName() {
  getStoredData();
  emptyTable();
  let inputName = serachInput.value;
  // var found = false;
  for (i = 0; i < reviewsSize; i++) {
    if (touristReviews[i].placeName == inputName) {
      genarateRow(touristReviews[i]);
      found = true;
      break;
    }
  }
  // if (!found) {
  //   var newRow = reviewTable.insertRow();
  //   var cell1 = newRow.insertCell();
  //   cell1.colSpan = "5";
  //   cell1.innerHTML = "No Data Found";
  // }
}

function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
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
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
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
