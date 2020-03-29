import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element@^2.3.1/lit-element.js?module';
import { classMap } from 'https://unpkg.com/lit-html@^1.2.1/directives/class-map.js?module';

class MyComponent extends LitElement {
  static get properties() {
    return {
      employeeId: {
        type: Number,
        reflect: true,
        attribute: 'employee-id',
      },
      employeesData: {
        type: Array,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: 'Titillium Web', sans-serif;
        font-weight: 600;
      }

      .row {
        display: block;
        padding: 15px 35px;
        background-color: #f5f5f5;
        border-radius: 15px;
        margin-bottom: 25px;
      }

      .row td {
        display: inline-block;
      }

      .column__image {
        margin-right: 15px;
      }

      .image-container {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }

      .image-container img {
        width: 100%;
      }

      .column__name {
        width: 180px;
      }

      .column__client,
      .column__working-from,
      .column__hours {
        width: 120px;
      }

      .status__graphic {
        border-radius: 50%;
        width: 15px;
        height: 15px;
      }

      .column__status.available .status__graphic {
        border: 2px solid green;
      }

      .column__status.leave .status__graphic {
        border: 2px solid orange;
      }
    `;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.fetchEmployees();
  }

  // Probably some tools out there that make this easier, I would start by checking Intl (native in browser)
  serializeDate(date) {
    const dateObj = new Date(date);

    let day = dateObj.getDate();
    if (day < 10) {
      day = `0${day}`;
    }

    let month = dateObj.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    return `${day}-${month}-${dateObj.getFullYear()}`;
  }

  async fetchEmployees() {
    const response = await fetch('../mock-data/employees.json');
    if (response.status === 200) {
      const { employees } = await response.json();

      this.employeesData = employees.map(employee => {
        const serializedDate = this.serializeDate(employee.workingFrom);
        return {
          ...employee,
          workingFrom: serializedDate,
        };
      });
    }
  }

  statusClass(status) {
    return {
      available: status === 'available' ? true : false,
      leave: status === 'leave' ? true : false,
    };
  }

  render() {
    return html`
      <table>
        <tbody>
          ${this.employeesData
            ? html`
                ${this.employeesData.map(
                  employee => html`
                    <tr class="row">
                      <td class="column__image">
                        <div class="image-container">
                          <img
                            src="../assets/images/${employee.name.split(
                              ' ',
                            )[0]}.jpg"
                          />
                        </div>
                      </td>
                      <td class="column__name">${employee.name}</td>
                      <td class="column__client">${employee.client}</td>
                      <td class="column__working-from">
                        ${employee.workingFrom}
                      </td>
                      <td class="column__hours">${employee.hours} hours</td>
                      <td
                        class="column__status ${classMap(
                          this.statusClass(employee.status),
                        )}"
                      >
                        <div class="status__graphic"></div>
                      </td>
                    </tr>
                  `,
                )}
              `
            : html`
                loading...
              `}
        </tbody>
      </table>
    `;
  }
}
customElements.define('my-component', MyComponent);
