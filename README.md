# bruttonetto.tools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/techinz/bruttonetto/blob/main/LICENSE)

## German Brutto-Netto Income Calculator with Social Contributions and Tax Deductions

A tool for calculating net income from gross earnings in Germany, accounting for all relevant social contributions and tax deductions. Currently only for freelancers and self-employed professionals (selbständig), with planned expansion to include employed individuals.

<details>
<summary><b>Project Background</b></summary>
This tool was developed to address limitations in existing German tax calculators, which often include paywalls, advertisements, or lack comprehensive features for self-employed individuals. bruttonetto.tools aims to provide a transparent, accessible solution that accurately represents the complexities of the German tax system for freelancers and business owners.
</details>  

**💻 Live Demo**: [bruttonetto.tools](https://bruttonetto.tools)


## 📸 Demonstration

<div align="center">
  <h3>Video</h3>
  
  https://github.com/user-attachments/assets/ea5cd235-eeb9-4180-9cd5-5569bf490d8b
 
  <details> 
  <summary><h3>Screenshots</h3></summary>
  <img src="https://github.com/user-attachments/assets/fbcd6afc-d10b-4e64-a83b-7b4ef6911346" alt="Start page" width="100%" />

  <img src="https://github.com/user-attachments/assets/11edfd4d-5be3-4f16-bd73-d5a9c0180d43" alt="Social payments" width="100%" />
  
  <img src="https://github.com/user-attachments/assets/cca7500f-101a-4716-83ec-f08b4cf2765b" alt="Tax Deductions" width="100%" />

  <img src="https://github.com/user-attachments/assets/7f56b83b-8de7-43f7-aa94-b47b2aa85dae" alt="Office Tax Deduction Calculation" width="100%" />
  
  <img src="https://github.com/user-attachments/assets/1a908d8b-d4ed-4f0a-aad0-cf99beccb911" alt="Results" width="100%" />
  
  <img src="https://github.com/user-attachments/assets/cb564257-dd58-498b-a247-45e580ea8b11" alt="PDF Results" width="100%" />
  </details>
</div>

## ✨ Features

### 💰 Social Contributions Calculation
- 👆 **Mandatory Contributions**
  - Health Insurance (Krankenversicherung)
  - Long-term Care Insurance (Pflegeversicherung)

- 🙌 **Optional Contributions**
  - Pension Insurance (Rentenversicherung) with an option to apply reduced rates for new founders
  - Unemployment Insurance (Arbeitslosenversicherung)
  - Accident Insurance (Unfallversicherung)
  - Artists' Social Security Fund (Künstlersozialkasse)
  - Solidarity Surcharge (Solidaritätszuschlag)
  - Church Tax (Kirchensteuer)

- 🧠 **Smart Contribution Limits**
  - Minimum and maximum monthly contributions
  - Contribution assessment ceilings
  - Automated calculations based on income

### 📋 Tax Deductions Calculation
- 📈 **Monthly Deductions**
  - Office space costs with area-based calculation (Büro/Arbeitszimmer)
  - Health insurance (Krankenversicherung)
  - Internet expenses
  - Custom monthly expenses

- 💸 **One-time Expenses**
  - Custom one-time expenses (Training costs/Professional literature/...)

- 🕔 **Depreciation Management**
  - Linear depreciation (equal amounts per year)
  - Degressive depreciation (higher amounts in earlier years with linear depreciation fallback when beneficial)
  - Customizable useful life for assets

### 🧾 VAT Calculation
- 🔄 **VAT Status Management**
  - Toggle VAT obligation status (Umsatzsteuerpflichtig)
  - Automatic VAT rate application (19%)
  - Small business exemption support (Kleinunternehmerregelung §19 UStG)

- 💰 **Input Tax Deduction**
  - Input tax (Vorsteuer) calculation for eligible expenses
  - Per-expense VAT eligibility toggles

- 📝 **VAT Position Tracking**
  - Automatic calculation of monthly and yearly VAT position
  - VAT refund estimation
  - Payment amount calculation if VAT is due

### 🏢 Advanced Office Space Calculation
- Calculate office deduction percentage based on area ratio
- Visual indicator
- Tax audit warnings (e.g. too big office area)

### 💸 Tax Calculation
- Up-to-date German progressive income tax formulas (2025)
- Spouse splitting advantages ("Ehegattensplitting")
- Taxable income determination after deductions

### 📊 Visual Results & Reports
- Interactive gross-to-net income breakdown
- Percentage visualization of taxes and social contributions
- Detailed monthly and yearly summaries
- Detailed PDF export functionality

### 🌓 Theme Customization
- Dark and light mode support
- Automatic system preference detection
- Persistent theme selection via localStorage
- Optimized color schemes for better readability

### 🌐 Multi-language Support
- 🇩🇪 German (Default), 🇬🇧 English, 🇷🇺 Russian, 🇺🇦 Ukrainian
- Automatic language detection

## 📝 Usage

1. Input your monthly gross income and marital status
2. Configure your social contributions
3. Configure your deductions (monthly, one-time, depreciation)
4. Review your detailed net income calculation
5. Export results as PDF if needed

## ⚠️ Disclaimer

This calculator is provided for informational purposes only and does not substitute professional tax advice. All calculations are approximations based on publicly available tax formulas. Always consult with a tax professional for binding tax information.


## 👨‍💻 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve the project.

---

<p align="center">© 2025 bruttonetto.tools - Free and open tax calculation for Germany</p>