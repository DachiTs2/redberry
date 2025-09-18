const filterBtn = document.getElementById("btn-filter");
const filterPanel = document.getElementById("filter-panel");

const sortBtn = document.getElementById("sort");
const sortPanel = document.getElementById("sort-panel");

//  filter on main page
filterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  filterPanel.hidden = !filterPanel.hidden;
  sortPanel.hidden = true;
});

//sort on main page 
sortBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  sortPanel.hidden = !sortPanel.hidden;
  filterPanel.hidden = true; 
});

// closing
document.addEventListener("click", () => {
  filterPanel.hidden = true;
  sortPanel.hidden = true;
});
