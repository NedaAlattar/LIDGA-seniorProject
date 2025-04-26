
  let saved_url = null;

  // 1. Save the URL on page load (no redirect)
  window.addEventListener("load", () => {
    const token = "<TOKEN>"; // Replace with your real token
    const currentUrl = location.href;
    const fetchUrl = 'http://127.0.0.1:5000/bookmark?url=' + encodeURIComponent(currentUrl) + '&token=' + token;

    fetch(fetchUrl)
      .then(response => {
        saved_url = currentUrl;
        console.log("Bookmark saved.");
      })
      .catch(error => {
        console.error("Error saving bookmark:", error);
      });
  });

  // 2. Redirect to the saved bookmark when button is clicked
  document.getElementById("bookmark").addEventListener("click", () => {
    if (saved_url) {
      window.location.href = saved_url;
    } else {
      alert("No saved bookmark found.");
    }
  });
