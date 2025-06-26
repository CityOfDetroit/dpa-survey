import bootstrap from "!!raw-loader!bootstrap/dist/css/bootstrap.min.css";
import styles from "!!raw-loader!./DPASurvey.css";

const template = document.createElement('template');
template.innerHTML = `
<div class="row">
  <div id="app-content" class="col-xs-12 col-sm-12 col-md-8 m-auto">
  </div>
</div>
`;

export default class DPASurvey extends HTMLElement {
  static get observedAttributes() {
    return ["data-step"];
  }

  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));

    // Adding styles
    const bStyles = document.createElement("style");
    bStyles.textContent = bootstrap;
    const rcStyles = document.createElement("style");
    rcStyles.textContent = styles;
    shadow.appendChild(bStyles);
    shadow.appendChild(rcStyles);

    // Assign result section
    this.appContent = shadow.querySelector('#app-content');

    // Track answers
    this.answers = [];
    // Track previously visited steps for back navigation.
    this.stepStack = [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.loadSteps(newValue);
  }

  loadSteps(step) {
    let rc = this;
    let qBtns = null;
    let backBtn = null;
    let shadow = this.shadowRoot;
    switch (step) {
      case "0":
        this.appContent.innerHTML = `
        <div class="row">
          <p class="text-center">Welcome to the eligibility checker for the Detroit Down Payment Assistance Program</p>
          <p class="text-center">You will need to answer a few questions before you can apply for the program.</p>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button id="start" variant="primary" size="medium">Start Survey</cod-button>
          </div>
        </div>
        `;
        shadow.querySelector("cod-button[id='start']").addEventListener("click", (e) => {
          this.updateStepStack(step);
          this.setAttribute("data-step", "1");
        });
        break;

      case "1":
        this.appContent.innerHTML = `
        <div class="row">
          <p>Have you lived in the City of Detroit for the last 12 months or lost a home to property tax foreclosure in the City of Detroit between 2010-2016?</p>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button id="yes" variant="primary">Yes</cod-button>
            <cod-button id="no" variant="primary">No</cod-button>
          </div>
          <div>
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button[id='yes'], cod-button[id='no']");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            this.updateStepStack(step);
            if (e.target.id === "yes") {
              rc.answers.push("pass");
              rc.setAttribute("data-step", "3");
            } else {
              rc.setAttribute("data-step", "2");
            }
          });
        });
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "2":
        this.appContent.innerHTML = `
        <div class="row">
          <p><strong>Unfortunately, you may not be eligible for the Detroit Downpayment Assistance program because you do not meet the residency requirements.</strong></p>
          <p>In order to receive this assistance, you must have residency verification documents showing you lived in the City of Detroit for the last 12 months or lost property to tax foreclosure in the City of Detroit between 2010 – 2016.</p>
          <p>If your circumstances change, you may qualify in the future.</p>
        </div>
        <div class="d-flex">
          <div class="ms-auto">
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "3":
        this.appContent.innerHTML = `
        <div class="row">
        <p>Can you produce residency documents such as an ID issued at least 12-months prior at a Detroit address OR signed lease agreement OR 12 months of bill statements with a strong preference for utility bills, etc?</p>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button id="yes" variant="primary">Yes</cod-button>
            <cod-button id="no" variant="primary">No</cod-button>
          </div>
          <div>
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button[id='yes'], cod-button[id='no']");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            this.updateStepStack(step);
            if (e.target.id === "yes") {
              rc.answers.push("pass");
              rc.setAttribute("data-step", "4");
            } else {
              rc.setAttribute("data-step", "3.5");
            }
          });
        });
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "3.5":
        this.appContent.innerHTML = `
        <div class="row">
        <p>Can you produce an address proving that you lost a home to property tax foreclosure in the City of Detroit between 2010-2016?</p>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button id="yes" variant="primary">Yes</cod-button>
            <cod-button id="no" variant="primary">No</cod-button>
          </div>
          <div>
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button[id='yes'], cod-button[id='no']");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            this.updateStepStack(step);
            if (e.target.id === "yes") {
              rc.answers.push("pass");
              rc.setAttribute("data-step", "4");
            } else {
              rc.setAttribute("data-step", "2");
            }
          });
        });
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "4":
        this.appContent.innerHTML = `
        <div class="row">
        <p>Do you make equal to or less than the income for your household size according to this chart?</p>
        <table class="table">
            <thead> 
                <tr>
                    <th>Number of People in Household</th>
                    <th>Income</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>$45,180</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>$61,320</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>$77,460</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>$93,600</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>$109,740</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>$125,880</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>$142,020</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>$158,160</td>
                </tr>
            </tbody>
        </table>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button id="yes" variant="primary">Yes</cod-button>
            <cod-button id="no" variant="primary">No</cod-button>
          </div>
          <div>
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button[id='yes'], cod-button[id='no']");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            this.updateStepStack(step);
            if (e.target.id === "yes") {
              rc.answers.push("pass");
              rc.setAttribute("data-step", "6");
            } else {
              rc.setAttribute("data-step", "5");
            }
          });
        });
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "5":
        this.appContent.innerHTML = `
        <div class="row">
        <p><strong>Unfortunately, you may not be eligible for the Detroit Downpayment Assistance program because you do not meet the income requirements.</strong></p>
        <p>In order to receive this assistance, you must fall within the income guidelines.</p>
        <p>If your circumstances change, you may qualify in the future.</p>
        </div>
        <div class="d-flex">
          <div class="ms-auto">
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "6":
        this.appContent.innerHTML = `
        <div class="row">
          <p>Are you pre-approved by a lender to purchase the property?</p>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button id="yes" variant="primary">Yes</cod-button>
            <cod-button id="no" variant="primary">No</cod-button>
          </div>
          <div>
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button[id='yes'], cod-button[id='no']");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            this.updateStepStack(step);
            if (e.target.id === "yes") {
              rc.answers.push("pass");
              rc.setAttribute("data-step", "8");
            } else {
              rc.setAttribute("data-step", "7");
            }
          });
        });
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "7":
        this.appContent.innerHTML = `
        <div class="row">
          <p><strong>Unfortunately, you have not completed all the requirements to apply.</strong></p>
          <p>Please visit our <a href="/departments/housing-and-revitalization-department/detroit-down-payment-assistance-program/am-i-ready">"Am I Ready?</a> page to complete all the pre-requisites.</p>
        </div>
        <div class="d-flex">
          <div class="ms-auto">
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "8":
        this.appContent.innerHTML = `
        <div class="row">
          <p>What is the name of the lender that pre-approved the purchase?</p>
        </div>
        <div class="d-flex align-items-end">
          <form class="m-auto">
            <label for="lenderName" class="form-label">Lender Name</label>
            <input type="text" required class="form-control" id="lenderName" aria-describedby="lenderNameHelp">
            <div id="lenderNameHelp" class="form-text mb-3">The name of the lender that pre-approved the purchase.</div>
            <cod-button id="next" variant="primary">Next</cod-button>
          </form>
          <div>
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        const step8Form = shadow.querySelector("form");
        step8Form.addEventListener("submit", (e) => {
          e.preventDefault();
          const inputElement = this.appContent.querySelector("input");
          if (inputElement.validity.valid) {
            this.updateStepStack(step);
            rc.answers.push("pass");
            rc.setAttribute("data-step", "9");
          }
        });
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "9":
        this.appContent.innerHTML = `
        <div class="row">
          <p>Have you attended a homebuyer education course and received a certificate of completion?</p>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button id="yes" variant="primary">Yes</cod-button>
            <cod-button id="no" variant="primary">No</cod-button>
          </div>
          <div>
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button[id='yes'], cod-button[id='no']");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            this.updateStepStack(step);
            if (e.target.id === "yes") {
              rc.answers.push("pass");
              rc.setAttribute("data-step", "10");
            } else {
              rc.setAttribute("data-step", "7");
            }
          });
        });
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "10":
        this.appContent.innerHTML = `
        <div class="row">
          <p>From which agency did you receive the homebuyer education certifcate?</p>
        </div>
        <div class="d-flex align-items-end">
          <form class="m-auto">
            <label for="educationAgency" class="form-label">Agency Name</label>
            <select id="educationAgency" class="form-select" aria-describedby="agencyNameHelp" required>
              <option value="">Please choose an agency</option>
              <option value="Abayomi Community Development Corporation">Abayomi Community Development Corporation</option>
              <option value="Bridging Communities">Bridging Communities</option>
              <option value="Central Detroit Christian Community Development Corporation (CDC CDC)">Central Detroit Christian Community Development Corporation (CDC CDC)</option>
              <option value="Detroit Hispanic Development Corporation (DHDC)">Detroit Hispanic Development Corporation (DHDC)</option>
              <option value="Framework">Framework</option>
              <option value="Gesher Human Services">Gesher Human Services</option>
              <option value="Jefferson East, Inc.">Jefferson East, Inc.</option>
              <option value="Jewish Vocational Services (JVS)">Jewish Vocational Services (JVS)</option>
              <option value="Matrix Human Services">Matrix Human Services</option>
              <option value="MiWealth (formerly Southwest Solutions)">MiWealth (formerly Southwest Solutions)</option>
              <option value="MSU Extension">MSU Extension</option>
              <option value="Neighborhood Assistance Corporation of America (NACA)">Neighborhood Assistance Corporation of America (NACA)</option>
              <option value="National Faith Homebuyers">National Faith Homebuyers</option>
              <option value="NID Housing Counseling Agency">NID Housing Counseling Agency</option>
              <option value="U-SNAP-BAC">U-SNAP-BAC</option>
              <option value="Wayne Metropolitan Community Action Agency (Wayne Metro)">Wayne Metropolitan Community Action Agency (Wayne Metro)</option>
              <option value="Other">Other</option>
            </select>
            <div id="agencyNameHelp" class="form-text mb-3">The name of the agency that gave you the homebuyer education certificate.</div>
            <cod-button id="next" variant="primary">Next</cod-button>
          </form>
          <div>
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        const step10Form = shadow.querySelector("form");
        step10Form.addEventListener("submit", (e) => {
          e.preventDefault();
          const select = this.appContent.querySelector("select");
          if (select.validity.valid) {
            this.updateStepStack(step);
            rc.answers.push("pass");
            rc.setAttribute("data-step", "11");
          }
        });
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "11":
        this.appContent.innerHTML = `
        <div class="row">
          <p>Have you identified the property you want to receive down payment assistance to purchase?</p>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button id="yes" variant="primary">Yes</cod-button>
            <cod-button id="no" variant="primary">No</cod-button>
          </div>
          <div>
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button[id='yes'], cod-button[id='no']");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            this.updateStepStack(step);
            if (e.target.id === "yes") {
              rc.answers.push("pass");
              rc.setAttribute("data-step", "12");
            } else {
              rc.setAttribute("data-step", "7");
            }
          });
        });
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "12":
        this.appContent.innerHTML = `
        <div class="row">
          <p>Do you have a purchase agreement?</p>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button id="yes" variant="primary">Yes</cod-button>
            <cod-button id="no" variant="primary">No</cod-button>
          </div>
          <div>
            <cod-button id="back" variant="secondary">Back</cod-button>
          </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button[id='yes'], cod-button[id='no']");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            this.updateStepStack(step);
            if (e.target.id === "yes") {
              rc.answers.push("pass");
              rc.setAttribute("data-step", "13");
            } else {
              rc.setAttribute("data-step", "7");
            }
          });
        });
        this.attachBackButtonEvent(shadow, rc);
        break;

      case "13":
        this.appContent.innerHTML = `
        <div class="row">
            <p><strong>You are ready to go!</strong></p>
            <p>Please use the link provided to fill out the application form.</p>
            <p><em>Note: Incomplete applications will not be processed.</em></p>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button variant="primary" href="https://app.smartsheet.com/b/form/d3275c9107234786ae43285233318c6b">Start Application</cod-button>
          </div>
        </div>
        `;
        break;
    }
  }

  updateStepStack(step) {
    this.stepStack.push(step);
  }

  attachBackButtonEvent(shadow, rc) {
    const backBtn = shadow.querySelector("cod-button[id='back']");
    backBtn.addEventListener("click", (e) => {
      const prevStep = this.stepStack.pop();
      rc.answers.push("back");
      rc.setAttribute("data-step", prevStep);
    });
    return backBtn;
  }
}
