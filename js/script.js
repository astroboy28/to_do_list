// Variable of object to redirect pages
const pages = {
    landing: "landing-page", // to landing
    signup: "signup-page", // to sign up
    signin: "signin-page", // to sign in
    dashboard: "dashboard", // to dashboard
    editAccount: "edit-account", // to edit account
    editList: "edit-list" // to list content
  };
  
  // Function to navigate pages
  function navigatePages(val) {
    let arr = Array.from(document.getElementsByTagName("section")); // Get array of section elements
  
    for (let elem of arr) {
      // Cycle through section elements
      if (elem.id === pages[val]) {
        // If the value is selected display the page
        elem.style.display = "unset";
      } else {
        // If not selected remove from display
        elem.style.display = "none";
      }
    }
  }
  
  /*
   ** Validation
   */
  // Set window.localStorage variable
  let storage = window.localStorage;
  
  // Set document elements variables
  let signupForm = document.forms["sign-up"]; // Sign-up form element
  let signinForm = document.forms["sign-in"]; // Sign-in form element
  let alertMssg = document.getElementsByClassName("required-mssg"); // Alert message on empty fields
  let confirmMssg = document.getElementsByClassName("confirm-mssg"); // Error message on format problems
  let signupId = document.querySelector("#signUpForm"); // Signup element
  let signinId = document.querySelector("#signInForm"); // Signin element
  
  signupId.addEventListener(
    "submit",
    e => {
      // Action on submit signup form
      // Don't submit the form
      e.preventDefault();
      validateRegistry(); // Run validation process
    },
    false
  );
  
  signinId.addEventListener(
    "submit",
    e => {
      // Action on submit signin form
      // Don't submit the form
      e.preventDefault();
      validateSubmission(); // Run validation process
    },
    false
  );
  
  // Check if sign-up entries have been submitted
  function signupEntries() {
    let fal = true; // Set default variable to true
    for (let i = 0; i < 5; i++) {
      let val = signupForm[i].value; // Cycle through the inputs values
      let checkedBox = signupForm[5].checked; // Check if the signup form checkbox has been checked
  
      if (val == "" || !checkedBox) {
        // If either the values are an empty string or the checkbox isn't checked
        alertMssg[0].style.display = "unset"; // Display the alert message
        confirmMssg[0].style.display = "none";
        fal = false; // Reassign default variable to false
      }
    }
    return fal; // Return the variable
  }
  
  // Check if sign-in entries have been submitted
  function signinEntries() {
    let fls = true; // Set default variable to true
    for (let i = 0; i < 2; i++) {
      let valx = signinForm[i].value; // Cycle through the inputs values of signin form
      if (valx == "") {
        // If either of the values are an empty string
        alertMssg[1].style.display = "unset"; // Display the alert message
        confirmMssg[1].style.display = "none";
        fls = false; // Reassign default variable to false
      }
    }
    return fls; // Return the variable
  }
  
  // Function to check for valid name
  function validateName(name) {
    let reg = /^[a-zA-Z]*$/; // RegEx to see if the name only contains letters
    return reg.test(name); // Return true if conditions match
  }
  
  // Check for valid email entry
  function validateMail(mail) {
    // RegEx to see if mail has the correct email format
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(mail); // Return true if conditions match
  }
  
  // Check for valid password
  function validatePassword(password) {
    // 6-20 characters long with atleast 1 uppercase, 1 lowercase, 1 number
    let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return re.test(password); // Return true if the conditions match
  }
  
  // Check if the email is already in use
  function checkStorage(mail) {
    let acc; // Create acc variable to store parsed strings
    let index; // Create index variable to store index keys
    let fsy = true; // Set default variable to true
    for (let j = 0; j < storage.length; j++) {
      // Cycle through all keys in the localStorage
      acc = JSON.parse(storage.getItem(j)); // Parse string from the value assigned to key(j)
      if (acc.Email == mail) {
        // Check if the mail value submitted already exists
        fsy = false; // Reassign default variable to false if mail already exists
        index = j; // Set index to the key integer
      }
    }
    let ary = [fsy, index]; // Set array with fsy, index
    return ary; // Return ary
  }
  
  // Check if entries in signup are all validated
  function validateEntries() {
    if (signupEntries()) {
      // If signupEntries function returns true proceed
      let arr; // Create variable to store entries
      let fname = signupForm["fname"].value; // Set firstname value to fname
      let lname = signupForm["lname"].value; // Set lastname value to lname
      let password = signupForm["password"].value; // Set password value to password
      let confirmPassword = signupForm["confirmpassword"].value; // Set confirmpassword to confirmPassword
      fname = fname.trim(); // Trim entries of whitespaces
      lname = lname.trim();
      password = password.trim();
      confirmPassword = confirmPassword.trim();
  
      // If all validation passes and confirmpassword equals password send info in for storage
      if (
        validateName(fname) &&
        validateName(lname) &&
        validatePassword(password) &&
        password == confirmPassword
      ) {
        arr = [fname, lname, password]; // Set arr to array of validated entries
        return arr; // Return arr if successfull
      } else {
        confirmMssg[0].style.display = "unset"; // If any of the entries are invalid display error message
        alertMssg[0].style.display = "none";
  
        return false; // Return false if unsuccessful
      }
    }
  }
  
  // Check if the entry exists and store it if it's a new entry
  function validateRegistry() {
    let email = signupForm["email"].value; // Set email value to form email
    email = email.trim(); // Trim email entry
    let store = checkStorage(email); // Test if email is already in use
  
    // If email is valid and not in use and entries validated store all data
    if (store[0]) {
      if (validateEntries() && validateMail(email)) {
        let entryNo = storage.length; // Create an entry number for new entry
        let enter = validateEntries(); // Returns an array of fname, lname, password
        let entry = {}; // Create an entry object
        entry.firstName = enter[0]; // Set firstName key to fname
        entry.lastName = enter[1]; // Set lastName key to lname
        entry.Email = email; // Set Email key to email
        entry.Password = sha256(enter[2]); // Set Password key to encrypted password
  
        storage.setItem(entryNo, JSON.stringify(entry)); // Store entry as a string under entryNo key
        dashboardPage(entryNo, entry); // Redirect to dashboard
        return true;
      }
    } else {
      // if unsuccessful display error message
      confirmMssg[0].style.display = "unset";
      alertMssg[0].style.display = "none";
  
      return false; // Return false
    }
  }
  
  // Check if email exists and password is correct
  function validateSubmission() {
    if (signinEntries()) {
      // Check if non-empty entries are submitted
      let email = signinForm["email"].value; // Set email to form email
      let password = signinForm["password"].value; // Set password to form password
      email = email.trim(); // Trim entries
      password = password.trim();
      let store = checkStorage(email); // Return an array of fsy, index
  
      let account = JSON.parse(storage.getItem(store[1])); // Create an object variable of the string value under the given index
  
      // Check if email exist and if password submitted is valid
      if (!store[0] && sha256(password) == account.Password) {
        dashboardPage(store[1], account);
        return true;
      } else {
        // if unsuccessful display error message
        confirmMssg[1].style.display = "unset";
        alertMssg[1].style.display = "none";
  
        return false; // Return false
      }
    }
  }
  
  /*
   ** Dashboard
   */
  // Get target elements
  let userId; // UserId for the session
  let todoDash = document.getElementById("todo-dash"); // Get dashboard div to populate
  let dashForm = document.getElementById("dash-form"); // Todo dashboard form
  let listTitle = document.getElementById("list-title"); // Get input field dashboard form
  
  let todoGen = el => {
    // Function to create list elements
    let objArr = Object.keys(el); // Get list of dashboard keys
    let header = document.getElementById("header-title"); // Get header of editList page
    for (let item of objArr) {
      // Cycle through dashboard keys
      let itemList = document.createElement("DIV"); // Create new DIV
      let label = document.createElement("P"); // Create new P
      let preview = document.createElement("UL"); // Create new UL
      let prevArr = el[item]; // Get array of elements in under a given key
      // Cycle through a given key arrays
      for (let k of prevArr) {
        let lItem = document.createElement("LI"); // Create new LI
        lItem.innerText = k; // Fill with string
        lItem.className = "preview-class"; // Set class name
        preview.appendChild(lItem); // Add to preview UL
      }
  
      itemList.addEventListener(
        "click",
        vnt => { // Event to redirect to edit list page
          vnt.preventDefault(); // Prevent default
          let targetel = vnt.currentTarget; // Get target element
          let targetTitle = targetel.firstChild.textContent;
          header.innerText = targetTitle; // Set header of edit page to key title
          gotoList(targetTitle); // Redirect to edit list page
        },
        false
      );
      header.innerText = item; // Set header
      label.innerText = item; // Set label
      itemList.className = "dash-lists"; // Set class name
      let newId = item.split(" ").join("-"); // Create unique ID
      itemList.id = newId; // Set ID for DIV elements
      preview.id = "preview-" + newId; // Set ID for preview elements
      itemList.appendChild(label); // Add to DIV
      itemList.appendChild(preview); // Add to DIV
      todoDash.appendChild(itemList); // Append to existing parent element
    }
  };
  
  // Function to get current User object
  let currentUser = id => {
    let objUser = JSON.parse(storage.getItem(id));
    return objUser; // Return specific user json data
  };
  
  dashForm.addEventListener(
    "submit",
    event => {
      // Action on submit list form
      // Don't submit the form
      event.preventDefault();
      createTodoItem(); // Call function to create new item
    },
    false
  );
  
  // Navigate to specific user dashboard
  function dashboardPage(accNumber, acc) {
    // Get account details
    let usrlist = acc.Dashboard; // Retrieve list if it exists or is undefined or is empty
    if (usrlist) {
      // If the list exists display items
      todoGen(usrlist);
    }
    navigatePages("dashboard"); // Open user dashboard
    userId = accNumber; // Return user ID and list array
  }
  
  // Create new todo list
  function createTodoItem() {
    let usr = currentUser(userId); // Get user account
  
    if (listTitle.value) { // Make sure input value is not an empty string
      if (
        usr.Dashboard == undefined ||
        !Object.keys(usr.Dashboard).includes(listTitle.value)
      ) {
        // If the Dashboard is undefined or the value has not been used
        let todoObj = {}; // Create variable object for key property
        let value = listTitle.value.trim(); // Trim entry value
        todoObj[value] = []; // Push new key value
        listTitle.value = ""; // Set to empty string when done
  
        if (usr.Dashboard == undefined) {
          // If no list has been created
          usr.Dashboard = todoObj;
        } else {
          let existing = usr.Dashboard; // Assign dashboard array
          let obj = Object.assign(existing, todoObj); // Push new list item
          usr.Dashboard = obj; // Reassign value
        }
        storage.setItem(userId, JSON.stringify(usr)); // Save user todo list
        todoGen(todoObj); // Display new todo list element
        gotoList(value); // Redirect to edit list page
      } else {
        alert("List title must be unique!"); // Alert if list title entry is repeated
      }
    }
  }
  
  // Clear dashboard elements on click "clear" button
  function clearDashboard() {
    if (userId >= 0) { // If id value is zero or greater
      while (todoDash.lastChild) {
        // Cycle through child elements
        todoDash.removeChild(todoDash.lastChild); // Remove dashboard elemnt
      }
      let usr = currentUser(userId); // Get user account
      usr.Dashboard = undefined; // Set dashboard to undefined
      storage.setItem(userId, JSON.stringify(usr)); // Set changes to user account
      navigatePages("dashboard"); // Redirect to dashboard page
    }
  }
  /*
   ** Edit Account Details
   */
  // Get elements
  let editacc = document.forms["edit-acc"]; // Edit account form element
  let editAC = document.querySelector("#edit-account"); // Edit account element
  let resetEdit = () => {
    // Reset edit page
    editacc["password"].value = ""; // Reset to empty string
    editacc["confirmpassword"].value = "";
    confirmMssg[2].style.display = "none"; // If any of the entries are invalid display error message
    alertMssg[2].style.display = "none";
  };
  
  editAC.addEventListener(
    "submit",
    e => {
      // Action on submit signup form
      // Don't submit the form
      e.preventDefault();
      editAcc(); // Run edit Account process
    },
    false
  );
  // Function to redirect to edit account page
  function gotoEdit() {
    let user = currentUser(userId); // Get user account
    editacc["fname"].value = user.firstName; // Prefill with user data
    editacc["lname"].value = user.lastName;
    editacc["email"].value = user.Email;
    navigatePages("editAccount"); // Navigate to edit account page
  }
  
  // Check if all edit entries have been filled
  function editEntries() {
    let fal = true; // Set default variable to true
    for (let i = 0; i < 5; i++) {
      let val = editacc[i].value; // Cycle through the inputs values
  
      if (val == "") {
        // If either the values are an empty string or the checkbox isn't checked
        alertMssg[2].style.display = "unset"; // Display the alert message
        confirmMssg[2].style.display = "none";
        fal = false; // Reassign default variable to false
      }
    }
    return fal; // Return the variable
  }
  
  // Check if entries in edit are all validated
  function validateEdits() {
    if (editEntries()) {
      // If signupEntries function returns true proceed
      let arr; // Create variable to store entries
      let fname = editacc["fname"].value; // Set firstname value to fname
      let lname = editacc["lname"].value; // Set lastname value to lname
      let password = editacc["password"].value; // Set password value to password
      let confirmPassword = editacc["confirmpassword"].value; // Set confirmpassword to confirmPassword
      fname = fname.trim(); // Trim entries of whitespaces
      lname = lname.trim();
      password = password.trim();
      confirmPassword = confirmPassword.trim();
  
      // If all validation passes and confirmpassword equals password send info in for storage
      if (
        validateName(fname) &&
        validateName(lname) &&
        validatePassword(password) &&
        password == confirmPassword
      ) {
        arr = [fname, lname, password]; // Set arr to array of validated entries
        return arr; // Return arr if successfull
      } else {
        confirmMssg[2].style.display = "unset"; // If any of the entries are invalid display error message
        alertMssg[2].style.display = "none";
  
        return false; // Return false if unsuccessful
      }
    }
  }
  
  // Function to edit account details and save new values
  function editAcc() {
    let email = editacc["email"].value; // Set email value to form email
    email = email.trim(); // Trim email entry
    let store = checkStorage(email); // Test if email is already in use
    let usr = currentUser(userId);
    // If email is valid and not in use and entries validated store all data
    if (validateEdits() && validateMail(email)) { // If validation passes
      if (store[0] || email == usr.Email) {
        let enter = validateEdits(); // Returns an array of fname, lname, password
        usr.firstName = enter[0]; // Set firstName key to fname
        usr.lastName = enter[1]; // Set lastName key to lname
        usr.Email = email; // Set Email key to email
        usr.Password = sha256(enter[2]); // Set Password key to encrypted password
  
        storage.setItem(userId, JSON.stringify(usr)); // Store entry as a string under entryNo key
        navigatePages("dashboard"); // Redirect to dashboard page
        resetEdit(); // Reset edit page
        return true;
      } else {
        confirmMssg[2].style.display = "unset"; // If any of the entries are invalid display error message
        alertMssg[2].style.display = "none";
        return false;
      }
    }
  }
  // Function for User confirms deletion process
  function confirmDelete() { // Confirm deletion process
    confirm(
        "Are you sure you want to delete your account?\nAll your details will be deleted."
      ) ?
      deleteAccount() :
      alert("Process Aborted!"); // Abort deletion process
  }
  // Function to Delete Current User Account
  function deleteAccount() {
    for (let ky = 0; ky < storage.length; ky++) { // Cycle through storage
      if (userId < ky) {
        // If key is larger than userId proceed
        let adjacentUser = storage.getItem(ky); // Get adjacent user
        let newUserId = ky - 1; // Reset IDs for subsequent user
        storage.setItem(newUserId, adjacentUser); // Reassign key value pairs to respective numerical values
      }
    }
    let lastUser = storage.length - 1; // Get ID of last item
    storage.removeItem(lastUser); // Remove the last user to avoid repetition
    location.reload(); // Reload page after deletion
  }
  
  /*
   ** List Edits
   */
  // Get the target Elements
  let listId; // Create undefined variable
  let listForm = document.getElementById("list-form"); // Get page elements
  let listElement = document.getElementById("list-element");
  let oList = document.getElementsByTagName("ol")[0];
  let listGen = lst => {
    // Display list elements
    for (let varr of lst) { // For each array element
      let listItem = document.createElement("LI"); // Create new elements
      let deleteList = document.createElement("SPAN");
      var text = document.createTextNode("\u00D7");
      listItem.addEventListener("click", eve => { // Add event listener to LI element
        eve.preventDefault(); // Prevent default
        let tar = eve.target; // Get target element
        checkItem(tar); // Add strike through function
      });
      deleteList.addEventListener("click", v => { // Add event listener to SPAN
        v.preventDefault(); // Prevent default
        let currentListItem = v.currentTarget.parentElement; // Get parent element of SPAN
        deleteListItem(currentListItem); // Run function to delete clicked list item
      });
      deleteList.className = "delete-list"; // Set class name
      listItem.innerText = varr; // Set inner text to array value
      deleteList.appendChild(text); // Add to SPAN
      listItem.appendChild(deleteList); // Add to LI
      oList.appendChild(listItem); // Add to OL element
    }
  };
  
  listForm.addEventListener( // Add event listener to list form
    "submit",
    event => {
      //Prevent default submission event
      event.preventDefault();
      createListItem(); // Run process to create new list item
    },
    false
  );
  
  // Redirect to specific todo list key
  function gotoList(dashKey) {
    let user = currentUser(userId); // Get user info
    let listArr = user.Dashboard[dashKey];
    // If listArr exists and is non-empty array continue
    if (!(listArr == undefined)) {
      if (listArr.length > 0) {
        listGen(listArr); // Generate list elements
      }
    }
    listId = dashKey; // Set current list id value
    navigatePages("editList"); // Redirect to edit list page
  }
  let update = []; // Holds values to update the preview list
  
  // Function to create new list item
  function createListItem() {
    let user = currentUser(userId); // Get user info
    if (listElement.value) {
      // For a non empty submission
      let liElmnt = []; // Create list variable
      let inputs = listElement.value.trim(); // Trim entry
      liElmnt.push(inputs); // Push new list element
      listElement.value = ""; // Reset input to empty string
      if (user.Dashboard[listId] == undefined || user.Dashboard[listId].length == 0) {
        // If list is empty
        user.Dashboard[listId] = liElmnt;
      } else {
        let existingList = user.Dashboard[listId]; // Assign dashboard key list
        let newList = existingList.concat(liElmnt); // Create adjusted list values
        user.Dashboard[listId] = newList; // Reassign key value
      }
      storage.setItem(userId, JSON.stringify(user)); // Save user list
      update.push(inputs); // Push to update array
      listGen(liElmnt); // Display new list element
      updatePreview(); // Update preview
      navigatePages("editList"); // Redirect to new edit list
    }
  }
  
  let clearView = () => { // Function to remove all list elements from view
    while (oList.lastChild) {
      // Cycle through child elements
      oList.removeChild(oList.lastChild); // Remove list element
    }
  };
  
  let clearPreview = () => { // Clear all list elements from view
    let prev = listId.split(" ").join("-"); // Get id value of element
    prev = "preview-" + prev;
    let prevEl = document.getElementById(prev); // Get element of preview DIV
    while (prevEl.lastChild) {
      // Cycle through child elements
      prevEl.removeChild(prevEl.lastChild); // Remove list element
    }
  };
  
  // Clear list elements on click "clear" button
  function clearList() {
    clearView(); // Run to clear from display
    clearPreview();
    let usr = currentUser(userId); // Get user Account
    usr.Dashboard[listId] = []; // Set dashboard keys to empty list
    storage.setItem(userId, JSON.stringify(usr)); // Make changes to user Account
    navigatePages("editList"); // Navigate to edit list page
  }
  
  // Delete current todo list on click "delete" button
  function deleteTodo() {
    clearView(); // Clear from display
    let idList = listId.split(" ").join("-");
    let dashLists = document.getElementById(idList);
    todoDash.removeChild(dashLists);
    let usr = currentUser(userId); // Get Account
    usr.Dashboard[listId] = undefined; // Set dashboard keys to undefined
    storage.setItem(userId, JSON.stringify(usr)); // Make changes to user Account
    navigatePages("dashboard"); // Back to updated dashboard
  }
  
  // Check or uncheck a list item
  function checkItem(check) {
    // First check item
    if (
      !check.classList.contains("checked-item") &&
      !check.classList.contains("unchecked-item")
    ) {
      check.classList.add("checked-item");
    }
    // Then uncheck item
    else if (
      check.classList.contains("checked-item") &&
      !check.classList.contains("unchecked-item")
    ) {
      check.classList.remove("checked-item");
      check.classList.add("unchecked-item");
    }
    // Then check item
    else {
      check.classList.remove("unchecked-item");
      check.classList.add("checked-item");
    }
  }
  // Update the preview lists on the dashboard by adding an element
  function updatePreview() {
    let prev = listId.split(" ").join("-"); // Generate UL id
    prev = "preview-" + prev;
    let prevEl = document.getElementById(prev); // Get UL element
    if (update.length > 0) { // If there is an update continue
      for (let z = 0; z < update.length; z++) { // Cycle through update list
        let lItem = document.createElement("LI"); // Create new element
        lItem.innerText = update[z]; // Set inner text value
        lItem.classList.add("preview-class"); // Set class name
        prevEl.appendChild(lItem); // Append to preview UL
      }
    }
    update = []; // Reset update to empty array
  }
  // Function that deletes one item from a list
  function deleteListItem(item) {
    item.id = "deleted-item"; // Set id
    let usr = currentUser(userId); // Get user info
    let listItemsArray = usr.Dashboard[listId]; // Get Array of list items
    let newAdjustedList = [];
    for (let listCon of listItemsArray) {
      if (!(item.firstChild.textContent == listCon)) {
        newAdjustedList.push(listCon); // Fill new list with items not on
      }
    }
    usr.Dashboard[listId] = newAdjustedList; // Reassign to new list
    storage.setItem(userId, JSON.stringify(usr)); // Save changes
    deletePreview(item); // Run to delete element from preview
  }
  // Function to delete from preview
  function deletePreview(item) {
    let prev = listId.split(" ").join("-"); // Generate list value
    prev = "preview-" + prev;
    let prevEl = document.getElementById(prev); // Get Preview LI element
    let arrPreview = Array.from(prevEl.children); // Get array of child LI
    for (let z of arrPreview) { // Cycle through children
      if (z.textContent == item.firstChild.textContent) {
        prevEl.removeChild(z); // Remove if value matches
        return;
      }
    }
  }
  
  // Function to change todo list title
  function changeTitle() {
    let prev = listId.split(" ").join("-"); // Generate preview ID
    let prevUL = "preview-" + prev; // Generate list preview ID
    let newTitle = prompt("Please enter new title:", listId); // Prompt user for new value
    let newHeader = document.getElementById("header-title"); // Get header element
    let prevTitle = document.getElementById(prev); // Get preview element
    let prevList = document.getElementById(prevUL); // Get preview list element
    let usr = currentUser(userId); // User info
    if (newTitle == null || newTitle == "") { // If cancelled or empty entry
      alert("Process has been cancelled.");
    } else {
      newTitle = newTitle.trim(); // Trim entry
      if (newTitle == listId) { // If value unchanged
        return;
      } else if (!Object.keys(usr.Dashboard).includes(newTitle)) {
        // If user keys don't exist already
        let arrayList = usr.Dashboard[listId]; // Reassign to new value
        usr.Dashboard[newTitle] = arrayList;
        delete usr.Dashboard[listId]; // Delete old value
        storage.setItem(userId, JSON.stringify(usr)); // Save changes
        newHeader.innerText = newTitle; // Set new header title
        prevTitle.firstChild.innerText = newTitle; // Set preview title
        let newPrev = newTitle.split(" ").join("-"); // Generate new id
        let newPrevList = "preview-" + newPrev; // Generate new list id
        prevTitle.id = newPrev; // Set id value
        prevList.id = newPrevList; // Set UL id value
        listId = newTitle; // Reassign list title
      } else { // If already in use send alert
        alert("List title must be unique!");
      }
    }
  }