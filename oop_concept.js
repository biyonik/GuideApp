class Person {
    constructor(name, surname, email) {
        this.name = name;
        this.surname = surname;
        this.email = email;
    }
}

class Util {
    static checkEmptyArea(...areas) {
        let result = true;
        areas.forEach((area) => {
            if (area.length === 0) {
                result = false;
                return result;
            }
            return false;
        });
        return result;
    }
}


class Storage {
    constructor() {
        this.allPersonArray = this.getAll();
    }

    getAll() {
        let allPerson;
        if (localStorage.getItem('all_person') === null) {
            allPerson = [];
        } else {
            allPerson = JSON.parse(localStorage.getItem('all_person'));
        }
        this.allPersonArray = allPerson;
        return allPerson;
    }

    save(data) {
        this.allPersonArray.push(data);
        localStorage.setItem('all_person', JSON.stringify(this.allPersonArray));
    }

    delete(data) {
        this.allPersonArray.forEach((person, index) => {
            if (person.email === data) {
                this.allPersonArray.splice(index, 1);
            }
        });
        localStorage.setItem('all_person', JSON.stringify(this.allPersonArray));
    }

    update(newData, param) {
        this.allPersonArray.forEach((person, index) => {
            if (person.email === param) {
                this.allPersonArray[index] = newData;
            }
        });
        localStorage.setItem('all_person', JSON.stringify(this.allPersonArray));
    }

}

class Screen {
    constructor() {
        this.guide_form = document.querySelector('#guide-form').addEventListener('submit', this.addOrUpdate.bind(this));
        this.name = document.querySelector('#name');
        this.surname = document.querySelector('#surname');
        this.email = document.querySelector('#email');
        this.save_data_button = document.querySelector('#save-data-button');

        this.person_list = document.querySelector('.person-list');
        this.person_list.addEventListener('click', this.updateOrDelete.bind(this));

        this.storage = new Storage();
        this.selectedRow = undefined;
        this.printToScreenAllPerson();
    }

    addOrUpdate(e) {
        e.preventDefault();
        const person = new Person(this.name.value, this.surname.value, this.email.value);
        const areaControlResult = Util.checkEmptyArea(person.name, person.surname, person.email);
        if (areaControlResult) {
            if (this.selectedRow) {
                this.updateOnScreen(person);
                const updated_person = new Person(this.name.value, this.surname.value, this.email.value);
            } else {
                this.addToScreen(person);
                this.storage.save(person);
            }

        } else {
            console.log('Boş alan var');
        }
    }

    addToScreen(personToBeAdded) {
        const createdTableRow = document.createElement('tr');
        createdTableRow.innerHTML =
            `<td>${personToBeAdded.name}</td>
            <td>${personToBeAdded.surname}</td>
            <td>${personToBeAdded.email}</td>
            <td>
                <button type="button" title="Düzenle" class="btn btn-edit"><i class="far fa-edit"></i></button>
                <button type="button" title="Sil" class="btn btn-delete"><i class="far fa-trash-alt"></i></button>
            </td>`;
        this.person_list.appendChild(createdTableRow);
        this.resetForm();
        this.createToast('Kişi başarıyla eklendi', true);
    }

    updateOrDelete(e) {
        const clickedElement = e.target;

        if (clickedElement.classList.contains('btn-delete')) {
            this.selectedRow = clickedElement.parentElement.parentElement;
            this.removeFromScreen();
        } else if (clickedElement.classList.contains('btn-edit')) {
            this.save_data_button.value = 'Güncelle';
            this.selectedRow = clickedElement.parentElement.parentElement;
            const selected_name = this.selectedRow.cells[0].textContent;
            const selected_surname = this.selectedRow.cells[1].textContent;
            const selected_email = this.selectedRow.cells[2].textContent;
            const old_person = new Person(selected_name, selected_surname, selected_email);
            this.name.value = selected_name;
            this.surname.value = selected_surname;
            this.email.value = selected_email;

        }
    }

    removeFromScreen() {
        this.selectedRow.remove();
        const email = this.selectedRow.cells[2].textContent;
        this.storage.delete(email);
        this.resetForm();
        this.selectedRow = undefined;
    }

    updateOnScreen(person) {
        this.storage.update(person, this.selectedRow.cells[2].textContent);

        this.selectedRow.cells[0].textContent = person.name;
        this.selectedRow.cells[1].textContent = person.surname;
        this.selectedRow.cells[2].textContent = person.email;

        this.resetForm();
        this.selectedRow = undefined;
        this.save_data_button.value = 'Kaydet';
    }

    printToScreenAllPerson() {
        this.storage.allPersonArray.forEach((singlePerson) => {
            this.addToScreen(singlePerson);
        });
    }

    resetForm() {
        document.getElementById('guide-form').reset();
    }

    createToast(message, status) {
        const createdInfoDiv = document.createElement('div');
        createdInfoDiv.textContent = message;
        createdInfoDiv.classList.add('info');
        status == true ? createdInfoDiv.classList.add('info-success') : createdInfoDiv.classList.add('info-error');
        document.querySelector('.container').insertBefore(createdInfoDiv, this.guide_form);
        setTimeout(() => {
            document.querySelectorAll('.info').forEach((item) => {
                item.style.transform = 'scale(0)';
                item.style.transition = '1s';
                item.style.display = 'none';
            })
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', function (e) {
    const screen = new Screen();
});