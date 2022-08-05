var touristReviews = [];

function submitForm() {
  var turistPlaceData = getTturistPlaceData();
  var previousStoredData = getPreviousStoredData();
  touristReviews.push({
    id: touristReviews.length ? touristReviews.length + 1 : 1,
    placeName: turistPlaceData[0],
    address: turistPlaceData[1],
    rating: turistPlaceData[2],
    type: turistPlaceData[3],
    pictureSrc: turistPlaceData[4],
  });
  localStorage.setItem("touristReviews", JSON.stringify(touristReviews));
  clearForm();
  alert("Turist place review saved successfully!");
}

function getTturistPlaceData() {
  var placeName = document.getElementById("name").value;
  var address = document.getElementById("address").value;
  var rating = document.getElementById("rating").value;
  var type = document.getElementById("type").value;
  var pictureSrc = document.getElementById("picture").value;

  return [placeName, address, rating, type, pictureSrc];
}

function getPreviousStoredData() {
  var previousStoredData = localStorage.getItem("touristReviews");
  if (previousStoredData != null) {
    touristReviews = JSON.parse(previousStoredData);
  }
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
  document.getElementById("rating").value = "";
  document.getElementById("type").value = "";
  document.getElementById("picture").value = "";
}
