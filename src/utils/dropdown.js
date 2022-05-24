var dropdownbtn = document.getElementById("dropdown-btn");

if (dropdownbtn) {
  dropdownbtn.addEventListener("click", () => {
    document.getElementById("my-account-dropdown").classList.toggle("show");
  });

  window.onclick = function (event) {
    if (!event.target.matches(".account-menu-btn")) {
      var dropdowns = document.getElementsByClassName("account-menu-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  };
}
