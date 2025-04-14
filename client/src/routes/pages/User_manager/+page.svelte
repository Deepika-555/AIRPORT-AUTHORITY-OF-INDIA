<script lang="ts">
  import { onMount } from "svelte";

  import Search from "@/assets/images/search.png";

  // import { onMount }/ from "svelte";
  import "./style.css";
  // import { faTimes } from "@fortawesome/free-solid-svg-icons";
  // import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  // import CryptoJS from "crypto-js";
  let roles = [];
  let error = "";
  let showTable = false;
  let newRole = "";
  let showInput = false;
  let showModal = false;


  let newUser = {
    name: "",
    emp_id: "",
    designation: "",
    email: "",
    password: "",
    role_id: "",
  };
  let users = [];
  let selectedUser = "";
  let currentPassword = "";
  let newPassword = "";
  let showOldUserModal = false;
  let confirmPassword = "";

  function openOldUserModal() {
    showOldUserModal = true;
    fetchUsers();
    currentView = 'showOldUserModal';
  }

  function closeOldUserModal() {
    showOldUserModal = false;
    selectedUser = "";
    currentPassword = "";
    newPassword = "";
  }

  async function fetchUsers() {
    try {
      const res = await fetch("http://localhost:5500/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      users = await res.json();
    } catch (err) {
      error = err.message;
    }
  }

  async function fetchPassword() {
    if (!selectedUser) return;

    try {
      const res = await fetch(
        `http://localhost:5500/api/users/${selectedUser}/password`
      );
      if (!res.ok) throw new Error("Failed to fetch password");

      const data = await res.json();
      currentPassword = data.password;
    } catch (err) {
      error = err.message;
    }
  }

  function hashPassword(password) {
    return CryptoJS.SHA512(password).toString(CryptoJS.enc.Base64);
  }

  function comparePasswords(inputPassword, storedHashedPassword) {
    return hashPassword(inputPassword) === storedHashedPassword;
  }

  async function changePassword() {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      error = "New password and confirm password cannot be empty";
      return;
    }

    if (newPassword !== confirmPassword) {
      error = "New password and confirm password do not match";
      return;
    }

    if (!comparePasswords(currentPassword, hashPassword(currentPassword))) {
      error = "Current password is incorrect";
      return;
    }

    const hashedNewPassword = hashPassword(newPassword);

    if (hashedNewPassword === currentPassword) {
      error = "New password cannot be the same as the current password";
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5500/api/users/${selectedUser}/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            newPassword: hashedNewPassword,
            confirmPassword: hashedNewPassword,
          }), // Send the plain-text currentPassword
        }
      );

      if (!res.ok) throw new Error("Failed to update password");

      alert("Password updated successfully!");

      // ✅ Reset password fields after a successful update
      currentPassword = "";
      newPassword = "";
      confirmPassword = "";

      closeOldUserModal();
    } catch (err) {
      error = err.message;
    }
  }

  async function dropUser() {
    if (!selectedUser) return;

    if (!confirm(`Are you sure you want to delete ${selectedUser}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:5500/api/users/${selectedUser}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      alert("User deleted successfully!");
      closeOldUserModal();
    } catch (err) {
      error = err.message;
    }
  }

  // 5/2/25

  function openModal() {
  showModal = true;
  fetchRolesForDropdown();
  currentView = 'showModal';
}
  function closeModal() {
    showModal = false;
    newUser = {
      name: "",
      emp_id: "",
      designation: "",
      email: "",
      password: "",
      role_id: "",
    };
  }

  async function submitUser() {
    try {
      const hashedPassword = hashPassword(newUser.password);

      const res = await fetch("http://localhost:5500/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newUser, password: hashedPassword }),
      });

      if (!res.ok) throw new Error("Failed to add user");

      closeModal();
    } catch (err) {
      error = err.message;
    }
  }

  async function fetchRoles() {
    try {
      const res = await fetch("http://localhost:5500/api/roles");
      if (!res.ok) throw new Error("Failed to fetch roles");
      roles = await res.json();
      error = "";
      showTable = true;
    } catch (err) {
      error = err.message;
    }
    currentView = 'showTable';
  }

  function addNewRole() {
    showInput = true; // Show input field when "Add" is clicked
  }

  async function saveRole() {
    if (!newRole.trim()) {
      error = "Role name cannot be empty";
      return;
    }

    try {
      const res = await fetch("http://localhost:5500/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_name: newRole }),
      });

      if (!res.ok) throw new Error("Failed to add role");

      newRole = "";
      showInput = false; // Hide input field after saving
      fetchRoles(); // Refresh table after adding role
    } catch (err) {
      error = err.message;
    }
  }

  async function deleteRole(id) {
    try {
      const res = await fetch(`http://localhost:5500/api/roles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete role");

      fetchRoles(); // Refresh table after deleting role
    } catch (err) {
      error = err.message;
    }
  }

  async function fetchRolesForDropdown() {
    try {
      const res = await fetch("http://localhost:5500/api/roles");
      if (!res.ok) throw new Error("Failed to fetch roles");
      roles = await res.json();
      error = "";
      
    } catch (err) {
      error = err.message;
    }
  }

  function closeTable() {
    showTable = false;
    roles = [];
    error = "";
    showInput = false;
  }

 let currentView = ''; // Default view (can be 'roleTable', 'newUser', or 'existingUser')

  // Functions to set the view based on the button clicked



</script>

<div>
  <header
    class="Explore_Header"
    style="display: flex; flex-direction:row; justify-content:space-between"
  >
    <div class="Explore_Header_button">
      <button class="explore-button" on:click={fetchRoles}>Role Table</button>
      <button class="explore-button" on:click={openModal}>New User</button>
      <button class="explore-button" on:click={openOldUserModal}>Existing User</button>
    </div>
  </header>

  <div class="flex h-[70vh]" style="justify-content: center; align-items:center">
    {#if currentView ===  'showTable'}
     
          <div
            style="width:50%; background:rgba(255, 255, 255, 1);  border:2px solid rgb(246,246,247);  border-radius:3px; overflow-y:auto;"
          >
            <div style=" background:rgb(246, 246, 247); text-center sm:text-center;  text-align: center; padding:5px 2px;">
              <div style="color:black;">Role Table</div>
              <!-- <button on:click={closeTable}>✖</button> -->
            </div>
            <div
              id=""
              style="display:flex; justify-content:center; overflow:auto; padding:20px; height:300px;"
            >
              <table border="1">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Role Name</th>
                    <!-- <th> <button on:click={closeTable}>✖</button></th> -->
                  </tr>
                </thead>
                <tbody>
                  {#each roles as role}
                    <tr>
                      <td>{role.id}</td>
                      <td>{role.role_name}</td>
                      <td>
                        <button on:click={() => deleteRole(role.id)}>🗑️</button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>

            <div class="table-footer">
              {#if showInput}
                <input
                  type="text"
                  bind:value={newRole}
                  placeholder="Enter new role"
                />
                <button on:click={saveRole}>Save</button>
              {:else}
                <div
                  class="add-cls"
                  style="display:flex; justify-content:center; margin:10px;"
                >
                  <button class="add-btn" on:click={addNewRole}>Add</button>
                </div>
              {/if}
            </div>
          </div>
      
    {/if}

    {#if  currentView === 'showModal'}
    <div
    style="width:auto; background:rgba(255, 255, 255, 1); padding:0px 5px;  border-radius:3px; overflow-y:auto;"
  >
          <div class="header-add">
            <h3>Create New User</h3>
            <button on:click={closeModal} aria-label="Close" >✖</button>
          </div>
          <div class="form-data" style="padding: 10px;">
            <div class="form-row">
              <label>Name:</label>
              <input type="text" bind:value={newUser.name} required />
            </div>
            <div class="form-row">
              <label>ID:</label>
              <input type="number" bind:value={newUser.emp_id} required />
            </div>
            <div class="form-row">
              <label>Designation:</label>
              <input type="text" bind:value={newUser.designation} required />
            </div>
            <div class="form-row">
              <label>Mail:</label>
              <input type="email" bind:value={newUser.email} required />
            </div>
            <div class="form-row">
              <label>Password:</label>
              <input type="password" bind:value={newUser.password} required />
            </div>
            <div class="form-row">
              <label>Role:</label>
              <select bind:value={newUser.role} required>
                <option  value="">Select a role</option>
                {#each roles as role}
                  <option value={role.role_name}>{role.role_name}</option>
                {/each}
              </select>
            </div>
            <div class="form-buttons">
              <button class="form-btn" on:click={submitUser}>Submit</button>
              <!-- <button class="form-btn" on:click={closeModal}>Close</button> -->
            </div>
            {#if error}
              <p style="color: black;">{error}</p>
            {/if}
          </div>
      </div>
    {/if}

    {#if  currentView === 'showOldUserModal'}
    <div
    style="width:50%; background:rgba(255, 255, 255, 1); padding:0px 5px;  border-radius:3px; overflow-y:auto;"
  >
          <div class="header-add">
            <h3>Manage Existing User</h3>
            <button on:click={closeOldUserModal} aria-label="Close">✖</button>
          </div>
          <div class="form-data" style="padding: 20px;">
            <div class="form-row">
              <label>Username:</label>
              <select bind:value={selectedUser}>
                <option value="">Select a user</option>
                {#each users as user}
                  <option  value={user.name}>{user.name}</option>
                {/each}
              </select>
            </div>
            <div
              class="form-row"
              style="display: flex; justify-content:center;"
            >
              <div class="form-buttons">
                <button class="form-btn" on:click={fetchPassword}
                  >Change Pass</button
                >
                <button class="form-btn" on:click={dropUser}>Drop User</button>
              </div>
            </div>
            {#if currentPassword}
              <!-- <div class="form-row">
                <label>Current Password:</label>
                <input type="text" value={currentPassword} disabled />
            </div> -->
              <div class="form-row">
                <label>New Password:</label>
                <input type="password" bind:value={newPassword} required />
              </div>
              <div class="form-row">
                <label>Confirm Password:</label>
                <input type="password" bind:value={confirmPassword} required />
              </div>
              <div class="form-buttons">
                <button class="form-btn" on:click={changePassword}
                  >Submit</button
                >
              </div>
            {/if}
            {#if error}
              <p style="color: black;">{error}</p>
            {/if}
          </div>
        </div>
    
    {/if}
  </div>
</div>

<style>
  .Explore_Header {
    display: flex;
    gap: 10px;
    justify-content: start; /* This will space out the items */
    align-items: center; /* This ensures that the items are aligned vertically in the center */
    padding: 0px 12px 10px 12px; /* Add some padding to the header */
    border-bottom: 2px solid gray;
  }

  .Explore_Header .explore-button {
    padding: 10px 12px; /* Adds some padding to the button */
    cursor: pointer; /* Changes the cursor to a pointer when hovered */
    font-size: 14px; /* Sets a font size for the button */
    color: rgb(17, 24, 39);
    background: rgb(255, 255, 255);
    border: 2px solid rgb(209, 213, 219);
    outline: none;
    border-radius: 3px;
  }

  .Explore_Header .explore-button:focus,
  .Explore_Header .explore-button:active {
    border: 2px solid rgb(53, 167, 196); /* Change the border color when clicked */
  }

  /* Style for the selected button */
  .explore-button.selected {
    color: rgb(1, 1, 1);
    background: rgb(255, 255, 255);
    border: 2px solid rgb(53, 167, 196); /* Darker blue border */
    border-radius: 3px; /* Optional: rounded corners */
  }

  /* Optional: Hover effect for selected button */
  .explore-button.selected:hover {
    border: 3px solid rgb(53, 167, 196);
  }
</style>
