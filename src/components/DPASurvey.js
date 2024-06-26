import bootstrap from "!!raw-loader!bootstrap/dist/css/bootstrap.min.css";
import styles from "!!raw-loader!./DPASurvey.css";
export default class DPASurvey extends HTMLElement {
  static get observedAttributes() {
    return ["data-step"];
  }

  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Adding styles
    const bStyles = document.createElement("style");
    bStyles.textContent = bootstrap;
    const rcStyles = document.createElement("style");
    rcStyles.textContent = styles;
    shadow.appendChild(bStyles);
    shadow.appendChild(rcStyles);

    // Create result section
    this.appContent = document.createElement("div");
    this.appContent.id = "app-content";
    this.appContent.className = "col-xs-12 col-sm-12 col-md-8 m-auto";
    let row = document.createElement("div");
    row.className = "row";
    row.appendChild(this.appContent);
    shadow.appendChild(row);

    // Track answers
    this.answers = [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.loadSteps(newValue);
  }

  loadSteps(step) {
    let rc = this;
    let qBtns = null;
    let shadow = this.shadowRoot;
    switch (step) {
      case "0":
        this.appContent.innerHTML = `
        <div class="row">
          <p class="text-center">Welcome to the elegibility checker for the Detroit Down Payment Assistance Program</p>
          <p class="text-center">You will need to answer a few questions before you can apply for the program.</p>
        </div>
        <div class="d-flex">
          <div class="m-auto">
            <cod-button data-primary="true" data-size="md" data-disable="undefined" data-label="Start Survey" data-img="" data-img-alt="" data-icon="" data-icon-order="" data-icon-size="" data-shape="undefined" data-aria-label="" data-background-color="primary"></cod-button>
          </div>
        </div>
        `;
        shadow.querySelector("cod-button").addEventListener("click", (e) => {
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
        <cod-button data-id="yes" data-label="Yes" data-background-color="primary" data-primary="true" data-img-alt="" data-icon=""></cod-button>
        <cod-button data-id="no" data-background-color="primary" data-label="No" data-primary="true" data-img-alt="" data-icon=""></cod-button>
        </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            if (e.target.getAttribute("data-label") != null) {
              if (e.target.getAttribute("data-label") == "Yes") {
                rc.answers.push("pass");
                rc.setAttribute("data-step", "3");
              } else {
                rc.setAttribute("data-step", "2");
              }
            }
          });
        });
        break;

      case "2":
        this.appContent.innerHTML = `
        <div class="row">
        <p><strong>Unfortunately, you may not qualify for the Detroit Downpayment Assistance program because you do not meet the residency requirements.</strong></p>
        <p>In order to receive this assistance, you must have lived in the City of Detroit for the last 12 months or lost property to tax foreclosure in the City of Detroit between 2010 – 2016.</p>
        <p>If your circumstances change you may qualify in the future.</p>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            if (e.target.getAttribute("data-label") == "Next") {
              rc.setAttribute("data-step", "4");
            }
          });
        });
        break;

      case "3":
        this.appContent.innerHTML = `
        <div class="row">
        <p>Do you make equal to or less than the income for your household size according to this chart?</p>
        <table class="table">
            <thead> 
                <tr>
                    <th>People</th>
                    <th>Income</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>$43,740</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>$59,160</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>$74,580</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>$90,000</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>$105,420</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>$120,840</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>$136,260</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>$151,680</td>
                </tr>
            </tbody>
        </table>
        </div>
        <div class="d-flex">
        <div class="m-auto">
        <cod-button data-id="yes" data-label="Yes" data-background-color="primary" data-primary="true" data-img-alt="" data-icon=""></cod-button>
        <cod-button data-id="no" data-background-color="primary" data-label="No" data-primary="true" data-img-alt="" data-icon=""></cod-button>
        </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            if (e.target.getAttribute("data-label") != null) {
              if (e.target.getAttribute("data-label") == "Yes") {
                rc.answers.push("pass");
                rc.setAttribute("data-step", "5");
              } else {
                rc.setAttribute("data-step", "4");
              }
            }
          });
        });
        break;

      case "4":
        this.appContent.innerHTML = `
        <div class="row">
        <p><strong>Unfortunately, you may not qualify for the Detroit Downpayment Assistance program because you do not meet income requirements.</strong></p>
        <p>In order to receive this assistance, you must fall within the income guidelines.</p>
        <p>If your circumstances change you may qualify in the future.</p>
        </div>
        `;
        break;

      case "5":
        this.appContent.innerHTML = `
        <div class="row">
        <p>Are you pre-approved by a lender to purchase the property?</p>
        </div>
        <div class="d-flex">
        <div class="m-auto">
        <cod-button data-id="yes" data-label="Yes" data-background-color="primary" data-primary="true" data-img-alt="" data-icon=""></cod-button>
        <cod-button data-id="no" data-background-color="primary" data-label="No" data-primary="true" data-img-alt="" data-icon=""></cod-button>
        </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            if (e.target.getAttribute("data-label") != null) {
              if (e.target.getAttribute("data-label") == "Yes") {
                rc.answers.push("pass");
                rc.setAttribute("data-step", "7");
              } else {
                rc.setAttribute("data-step", "6");
              }
            }
          });
        });
        break;

      case "6":
        this.appContent.innerHTML = `
        <div class="row">
        <p><strong>Unfortunately, you have not completed all the requirements to apply.</strong></p>
        <p>Please visit our <a href="https://training.detroitmi.gov/departments/housing-and-revitalization-department/detroit-down-payment-assistance-program/am-i-ready">"Am I Ready?</a> page to complete all the pre-requisites.</p>
        </div>
        `;
        break;

      case "7":
        this.appContent.innerHTML = `
        <div class="row">
        <p>Have you attended a homebuyer education course and received a certificate of completion?</p>
        </div>
        <div class="d-flex">
        <div class="m-auto">
        <cod-button data-id="yes" data-label="Yes" data-background-color="primary" data-primary="true" data-img-alt="" data-icon=""></cod-button>
        <cod-button data-id="no" data-background-color="primary" data-label="No" data-primary="true" data-img-alt="" data-icon=""></cod-button>
        </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            if (e.target.getAttribute("data-label") != null) {
              if (e.target.getAttribute("data-label") == "Yes") {
                rc.answers.push("pass");
                rc.setAttribute("data-step", "8");
              } else {
                rc.setAttribute("data-step", "6");
              }
            }
          });
        });
        break;

      case "8":
        this.appContent.innerHTML = `
        <div class="row">
        <p>Have you identified the property you want to receive down payment assistance to purchase?</p>
        </div>
        <div class="d-flex">
        <div class="m-auto">
        <cod-button data-id="yes" data-label="Yes" data-background-color="primary" data-primary="true" data-img-alt="" data-icon=""></cod-button>
        <cod-button data-id="no" data-background-color="primary" data-label="No" data-primary="true" data-img-alt="" data-icon=""></cod-button>
        </div>
        </div>
        `;
        qBtns = shadow.querySelectorAll("cod-button");
        qBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            if (e.target.getAttribute("data-label") != null) {
              if (e.target.getAttribute("data-label") == "Yes") {
                rc.answers.push("pass");
                rc.setAttribute("data-step", "9");
              } else {
                rc.setAttribute("data-step", "6");
              }
            }
          });
        });
        break;

      case "9":
        this.appContent.innerHTML = `
        <div class="row">
            <p><strong>You are ready to go!</strong></p>
            <p>Please use the link provided to fill out the application form.</p>
            <p><em>Note: All incomplete applications would not be process.</em></p>
        </div>
        <div class="d-flex">
        <div class="m-auto">
        <cod-button data-primary="true" data-disable="undefined" data-label="Start Application" data-img="" data-img-alt="" data-icon="" data-icon-order="" data-icon-size="" data-shape="undefined" data-aria-label="" data-background-color="primary" data-link="https://app.smartsheet.com/b/form/64d05ddc29af4381a9a09e479ae5c957"></cod-button>
        </div>
        </div>
        `;
        break;
    }
  }
}
