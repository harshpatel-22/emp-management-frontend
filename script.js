const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const popupForm = document.getElementById('popupForm');
const closeBtn = document.getElementById('closeBtn');

addEmployeeBtn.onclick = function () {
    popupForm.style.display = 'block';
}
closeBtn.onclick = function () {
    popupForm.style.display = 'none';
}
window.onclick = function(event) {
    if (event.target == popupForm) {
        popupForm.style.display = 'none';
    }
}


const API_URL = 'http://localhost:8080/api/employee';

function getEmployees() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => displayEmployee(data))
        .catch(error => console.error(error))
}

function displayEmployee(employees) {
    const tableBody = document.getElementById('employeeTableBody');
    tableBody.innerHTML = '';

    employees.forEach(employee => {
        const row = `
            <tr>
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.gender}</td>
                <td>
                    <div class="btnContainer">
                        <button onclick="editEmployee(${employee.id})"  class="actionBtn">Edit</button>
                        <button onclick="deleteEmployee(${employee.id})"  class="actionBtn">Delete</button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function saveEmployee() {
    const id = document.getElementById('employeeId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const gender = document.getElementById('gender').value;

    const employee = {
        id: id,
        name: name,
        email: email,
        gender: gender
    };

    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';

    if (confirm("Sure???")) {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee)
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success', data);
            clearForm();
            popupForm.style.display = 'none';
            getEmployees();
            
        })
        .catch(error => console.error('Error:', error));
    }
    
}

function editEmployee(id) {
    popupForm.style.display = 'block';
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(employee => {
            document.getElementById('employeeId').value = employee.id;
            document.getElementById('name').value = employee.name;
            document.getElementById('email').value = employee.email;
            document.getElementById('gender').value = employee.gender;
        })
        .catch(error => console.error('Error:', error));
}

function deleteEmployee(id) {
    if (confirm('Pakka delete karna hai?')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success');
            getEmployees();
        })
        .catch(error => console.error('Error:', error));
    }
}

function clearForm() {
    document.getElementById('employeeId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('gender').value = '';
}

window.onload = getEmployees();