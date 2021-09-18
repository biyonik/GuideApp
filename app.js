const guide_form = document.querySelector('#guide-form');
const name = document.querySelector('#name');
const surname = document.querySelector('#surname');
const email = document.querySelector('#email');
const save_data_button = document.querySelector('#save-data-button');
const person_list = document.querySelector('.person-list');

const allPersonArray = [];
let selectedRow = undefined;

guide_form.addEventListener('submit', save);
person_list.addEventListener('click', doPersonAction)

function save(e) {
    e.preventDefault();
    const personToBeAdded = {
        name: name.value,
        surname: surname.value,
        email: email.value
    };

    const checkResult = checkData(personToBeAdded);
    if(checkResult.length > 0) {
        for(let cR of checkResult) {
            document.getElementById(cR.area).classList.remove('display-block');
            document.getElementById(cR.area).style.display = 'block';
            document.getElementById(cR.area).innerText=cR.message;

            createInfo(cR.message, checkResult.status);
        }
    } else {
        if(selectedRow) {
            updatePerson(personToBeAdded);
            createInfo('Kişi başarıyla güncellendi', true);
        } else {
            savePerson(personToBeAdded);
            createInfo('Kişi başarıyla kaydedildi', true);
        }
        
        clearInputValues();
        
    }
} 

function checkData(data) {
    let statusHandler = {
        status: false,
        area: null,
        message: null
    };
    let statusArr = [];
    for(const val in data) {
        if(data[val]) {
            console.log(data[val]);
        } else {
            statusArr.push({
                status: false,
                area: `${val}_err_area`,
                message: `'${val}' alanı boş bırakılamaz`
            });
        }
    }
    return statusArr;
}

function createInfo(message, status) {
    const createdInfoDiv = document.createElement('div');
    createdInfoDiv.textContent = message;
    createdInfoDiv.classList.add('info');
    status == true ? createdInfoDiv.classList.add('info-success') : createdInfoDiv.classList.add('info-error');
    document.querySelector('.container').insertBefore(createdInfoDiv, guide_form);
    setTimeout(() => {
        document.querySelectorAll('.info').forEach((item) => {
            item.style.transform = 'scale(0)';
            item.style.transition = '1s';
            item.style.display = 'none';
        })
    }, 2000);
}

function clearInputValues() {
    name.value = null;
    surname.value = null;
    email.value = null;
}

function savePerson(personToBeAdded) {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = 
    `<td>${personToBeAdded.name}</td>
    <td>${personToBeAdded.surname}</td>
    <td>${personToBeAdded.email}</td>
    <td>
        <button type="button" title="Düzenle" class="btn btn-edit"><i class="far fa-edit"></i></button>
        <button type="button" title="Sil" class="btn btn-delete"><i class="far fa-trash-alt"></i></button>
    </td>`;
    person_list.append(tableRow);
    allPersonArray.push(personToBeAdded);
}

function updatePerson(personToBeAdded) {
    for(let i = 0; i<allPersonArray.length; i++) {
        if(allPersonArray[i].email === selectedRow.cells[2].textContent) {
            allPersonArray[i] = personToBeAdded;
            break;
        }
    }
    selectedRow.cells[0].textContent = personToBeAdded.name;
    selectedRow.cells[1].textContent = personToBeAdded.surname;
    selectedRow.cells[2].textContent = personToBeAdded.email;
    save_data_button.value = "Kaydet";
    selectedRow = undefined;
}

function doPersonAction(e) {
    const tableRowToBeDeleted = e.target.parentElement.parentElement;
    const emailToBeDeleted = e.target.parentElement.previousElementSibling.textContent;
    if(e.target.classList.contains('btn-delete')) {
        deleteFromGuide(tableRowToBeDeleted, emailToBeDeleted);
    } else if(e.target.classList.contains('btn-edit')) {
        save_data_button.value = 'Güncelle'
        const selectedTableRow = e.target.parentElement.parentElement;
        const emailToBeUpdated = selectedTableRow.cells[2].textContent;

        name.value = selectedTableRow.cells[0].textContent;
        surname.value = selectedTableRow.cells[1].textContent;
        email.value = selectedTableRow.cells[2].textContent;

        selectedRow = selectedTableRow;
    }
}

function deleteFromGuide(tableRowToBeDeleted, emailToBeDeleted) {
    // person.remove();
    // allPersonArray.forEach((per, index) => {
    //     if(per.email === emailToBeDeleted) {
    //         allPersonArray.splice(index, 1);
    //     }
    // });

    const personDontBeDelete = allPersonArray.filter((person, index) => {
        return person.email !== emailToBeDeleted;
    });

    allPersonArray.push(...personDontBeDelete);
}