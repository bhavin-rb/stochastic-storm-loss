# AGENTS.md – Catastrophic Storm Loss Web App

## Project Name - Stochastic Modelling of Catastrophic Storm Losses: Frequency-Severity Analysis for Insurance Pricing

## Project Description

This project transforms the Bachelor Thesis *“Stochastic Modelling of Catastrophic Storm Losses: Frequency-Severity Analysis for Insurance Pricing”* into an interactive web application. The thesis explores advanced stochastic methods for modelling catastrophic storm losses, focusing on **frequency-severity analysis** and its application in insurance premium pricing.  

The web app will serve as a dynamic platform where users can:
- Upload and interact with the dataset (`public_emdat.xlsx`), which contains storm-related catastrophe records from EM-DAT.
- Explore statistical models including **Poisson Regression**, **Negative Binomial Regression**, and **Extreme Value Theory (EVT)** with **Generalized Pareto Distribution (GPD)**.
- Visualize frequency distributions, severity tails, and pure premium calculations through interactive charts.
- Understand how actuarial mathematics applies to real-world insurance pricing challenges.

The app will be designed as a **single-page application (SPA)** using **React.js** for the frontend, with a backend powered by **Node.js/Express** and Python integration for statistical modelling. Visualizations will be implemented using **Chart.js** or **Plotly**, ensuring clarity and interactivity.  

The project will be developed in **phases**, with each phase tested and validated before moving forward. Deliverables include:
- A professional landing page with hero images and an about section (including university name and LinkedIn link).
- Interactive modules for frequency-severity modelling.
- Documentation (AGENTS.md, PLAN.md, README).
- A deployed site accessible to employees and colleagues.

Ultimately, this project bridges academic research with practical application, showcasing actuarial modelling in a modern, accessible, and professional format.

## Objectives

- Build an interactive web application based on the Bachelor Thesis *“Stochastic Modelling of Catastrophic Storm Losses: Frequency-Severity Analysis for Insurance Pricing”*.
- Refer to **Final_Thesis_Submission.pdf** as the primary source of information, methodology, and write-ups.  
  - All explanations, model descriptions, and background context for the web app must be derived directly from this thesis.  
  - No external or unrelated content should be introduced unless explicitly requested.
- Use the dataset **public_emdat.xlsx** as the foundation for frequency-severity modelling and insurance pricing calculations.
- Ensure the app reflects the thesis structure: **Introduction, Methodology, Data Analysis (Frequency & Severity), Conclusion, Appendix (Python code)**.
- Provide interactive modules for:
  - [Frequency analysis](ca://s?q=Frequency_analysis_in_web_app) (Poisson vs Negative Binomial).
  - [Severity analysis](ca://s?q=Severity_analysis_in_web_app) (Extreme Value Theory, GPD).
  - [Insurance pricing](ca://s?q=Insurance_pricing_with_frequency_severity_models) (Pure Premium calculation).
- Deliver a professional, single-page React.js application with menu navigation (Home, Methodology, Models, Results, About).
- Include hero images, about-section visuals, and branding aligned with academic + professional presentation.


##  Architecture
- **Frontend (React.js/Next.js)**  
  - Interactive dashboard UI  
  - Charts via libraries like Chart.js, D3.js, or Recharts  
    **Hero section with image + animated headline**  
  - **About section with image + fade-in animation**  
  - **Other sections with image + fade-in animation**
  - **Dark mode as default theme** (toggle available for light mode)  
  - **Smooth parallax scrolling** for hero and about sections  
  - **Micro-animations** (hover effects, transitions on charts, button highlights)  
  - **Responsive design** for desktop and mobile  

## Phases
1. **Planning & Setup**
   - Define tech stack (React.js frontend, Node.js/Express backend, Python integration).
   - Create hero image, about section, and branding assets. All images are under images folder.
   - Draft PLAN.md for detailed architecture.

2. **Data Integration**
   - Load `public_emdat.xlsx` into backend.
   - Preprocess data (storm type, year, insured losses).
   - Ensure consistency with thesis methodology (frequency counts, severity values in USD).

3. **Model Implementation**
   - Implement Poisson, Negative Binomial, and EVT/GPD models in Python.
   - Wrap models into API endpoints.
   - Validate outputs against thesis results.

4. **Visualization Layer**
   - Interactive charts (frequency distributions, severity tails).
   - Parameter sliders (thresholds, dispersion).
   - Export options (CSV, PDF) - in case this is feasible for this project.

5. **UI/UX**
   - Single-page app with menu tabs: Home, Methodology, Models, Results, About.
   - images for all sections are in folder called images.
   - Parallax scrolling for the main landing page
   - About section with university name, LinkedIn link, and project context.
   - Dark and Light mode options

6. **Deployment**
   - **Frontend:** Host the React.js single-page application on **Vercel** or **Netlify** (free tier).  
   - **Backend:** Host the Python/Node.js API on **Render** (free tier).  
   - Alternatively, choose any other **reliable free-tier hosting service** that supports the required stack for publishing the website or app.  
   

## Success Criteria
- Write and verify success criteria for each phase.
- Test each phase before moving forward.

## Deliverables
- Interactive single-page web app.
- Documentation (README + PLAN.md).
- Deployed site link for employees.

## Implementation priorities
1. Keep the first version focused on the core MVP.
2. Prefer clarity and maintainability over over-engineering.
3. Reuse logic through functions instead of duplicating notebook code.
4. Keep the UI simple and easy to use.
5. No emojis at all.

## Coding standards
1. Use current, widely supported Python and React libraries.
2. Keep the code concise and readable.
3. Avoid unnecessary defensive programming and extra features.
4. Keep the README minimal and focused on setup and usage.
