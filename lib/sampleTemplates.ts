/**
 * Realistic Indian Job-Market Sample Resume & Matching Job Description Templates
 * 100% static client-side dictionary (uses 0 API tokens).
 */

export interface SampleTemplate {
  id: string;
  label: string;
  pill: string;
  category: string;
  resume: string;
  jobDescription: string;
}

export const SAMPLE_TEMPLATES: Record<string, SampleTemplate> = {
  fresher: {
    id: "fresher",
    label: "Freshers / Campus Placement",
    pill: "🎓 Fresher",
    category: "Campus Placement / Entry-Level",
    resume: `RAHUL VERMA
Pune, Maharashtra | +91 98765 12340 | rahul.verma.grad@email.com
LinkedIn: linkedin.com/in/rahulverma-grad | GitHub: github.com/rahulverma-dev

CAREER OBJECTIVE:
Detail-oriented and proactive B.Tech Graduate (Computer Science & Engineering) with a strong foundation in Python, C++, Data Structures, SQL, and Web Technologies. Eager to launch my career as a Graduate Engineer Trainee where I can contribute to software development projects, learn enterprise architectures, and add value through analytical problem-solving.

ACADEMIC QUALIFICATIONS:
• B.Tech in Computer Science & Engineering (2020 – 2024) | Savitribai Phule Pune University (SPPU) — CGPA: 8.4 / 10
• Class XII (HSC Science) | Maharashtra State Board (2020) — 87.2%
• Class X (SSC) | Maharashtra State Board (2018) — 91.0%

INTERNSHIP EXPERIENCE:
Software Engineering Intern | InfoTech Dynamics, Pune | Jan 2024 – April 2024
• Built and tested automated unit tests for 3 internal CRM modules using Python (PyTest), enhancing test coverage by 20%.
• Assisted senior backend engineers in diagnosing REST API latency issues and documented API endpoints in Postman.
• Participated in daily Agile standups, tracked bug fixes in Jira, and collaborated with QA testers on sprint deliverables.

ACADEMIC & CAPSTONE PROJECTS:
1. Campus Placement & Recruiter Portal (React, Node.js, MongoDB)
• Developed a role-based web portal for college placement drives handling registration for 800+ students and 25+ companies.
• Implemented JWT-based authentication, student resume uploads, and automatic eligibility filtering by CGPA.
2. Hospital OPD Appointment Scheduler (Python, MySQL, Flask)
• Created a relational database schema for doctor-patient slot bookings, reducing scheduling clashes to zero during campus testing.

TECHNICAL SKILLS:
• Languages: Python, C++, Java (Basics), SQL, JavaScript, HTML5/CSS3
• Frameworks & Databases: Flask, Node.js (Basics), MySQL, MongoDB, Git, Postman
• Core Competencies: Object-Oriented Programming (OOP), Data Structures & Algorithms, Debugging, Linux, SDLC

CERTIFICATIONS & CO-CURRICULAR:
• Certified Python for Data Science — Coursera
• Finalist in Pune University Hackathon (Smart City Logistics track)
• Technical Head, Campus CSI (Computer Society of India) Student Chapter (2023 – 2024)`,

    jobDescription: `Graduate Engineer Trainee (GET) / Associate Software Engineer
Company: CloudNexus IT Solutions India Pvt Ltd
Location: Pune / Bengaluru (Hybrid)

About CloudNexus:
CloudNexus is a premier digital engineering and enterprise IT consulting firm delivering cloud modernization, analytics, and software solutions to Fortune 500 enterprises.

About the Role:
We are seeking ambitious, high-potential fresh graduates (B.Tech / B.E. in CSE/IT or MCA/BCA) to join our Graduate Engineer Trainee program. Trainees will undergo an intensive 12-week onboarding bootcamp followed by deployment on real-world client software engineering and cloud implementation projects.

Key Responsibilities:
• Write clean, maintainable, and well-documented code in Python, Java, or C++ in compliance with software design standards.
• Develop, test, and maintain web services, RESTful APIs, and database queries (SQL / NoSQL).
• Collaborate with Senior Developers and QA Engineers to troubleshoot bugs, write automated test cases, and review PRs.
• Support build, test, and release processes in CI/CD pipeline environments (Git, Docker).
• Participate actively in daily scrum standups, sprint grooming, and architecture brainstorming sessions.

Candidate Requirements:
• B.E. / B.Tech (CS, IT, E&TC) or BCA / MCA / B.Sc Computer Science (2023 or 2024 pass-outs).
• Minimum 60% or 6.5 CGPA throughout 10th, 12th, and graduation without active backlogs.
• Solid fundamentals in Object-Oriented Programming (OOP), Data Structures, Algorithms, and Relational Databases (MySQL/PostgreSQL).
• Hands-on familiarity with at least one programming language (Python, C++, Java, or JavaScript).
• Strong verbal and written English communication skills; comfortable presenting technical logic.
• Eagerness to learn cloud architectures (AWS / Azure) and modern full-stack workflows.`,
  },

  sales: {
    id: "sales",
    label: "Sales & Business Development",
    pill: "💼 Sales",
    category: "B2B / B2C Sales & BD",
    resume: `AMIT KULKARNI
Mumbai, India | +91 98200 44551 | amit.kulkarni.sales@email.com
LinkedIn: linkedin.com/in/amitkulkarni-bd

PROFESSIONAL SUMMARY:
High-energy, target-driven Business Development Executive with 3.5 years of experience in B2B SaaS and enterprise corporate sales across Western India. Consistent record of outperforming quarterly quotas, prospecting executive decision-makers (CXOs/VPs), and managing end-to-end sales pipelines in CRM (Salesforce / HubSpot). Proven ability to consultatively sell high-ticket annual software contracts with an average deal size of ₹6L – ₹18L.

WORK EXPERIENCE:
Senior Business Development Executive | FinEdge Technologies, Mumbai | May 2022 – Present
• Drove new client acquisition for cloud ERP and accounting automation suites, generating ₹58 Lakhs in closed revenue in FY23-24 (118% of assigned annual quota).
• Sourced 120+ qualified enterprise leads per quarter through multi-channel cold outreach (LinkedIn Sales Navigator, email drip cadences, and industry conferences).
• Conducted 15+ live product walkthroughs and value-consulting pitch presentations per week to Managing Directors and Chief Financial Officers.
• Shortened average sales cycle from 42 days to 31 days by standardizing quotation templates and objection-handling scripts for the regional team.
• Mentored 3 junior BDRs on lead qualification (BANT framework) and CRM pipeline hygiene.

Business Development Associate | ProScale Logistics, Mumbai | July 2020 – April 2022
• Managed outbound sales for B2B freight software, signing 35+ manufacturing and retail distribution clients across Maharashtra and Gujarat.
• Achieved 105% of quarterly revenue quota for 4 consecutive quarters; recognized as 'Top Business Hunter Q3 2021'.
• Maintained 95%+ CRM accuracy in HubSpot logging pipeline stages, deal velocity, and contractual follow-ups.

CORE COMPETENCIES:
• Sales Strategy: B2B Solution Selling, Outbound Prospecting, Cold Calling, CXO Relationship Building, Contract Negotiation
• Pipeline & CRM: Salesforce CRM, HubSpot, LinkedIn Sales Navigator, ZoomInfo, LeadSquared
• Key Metrics: Pipeline Velocity, Deal Closing Ratio, Quota Overachievement, Customer Lifetime Value (LTV)

EDUCATION:
• Bachelor of Business Administration (BBA in Marketing) | University of Mumbai (2017 – 2020) — First Class with Distinction`,

    jobDescription: `Territory Sales Manager / Enterprise Business Development Manager
Company: ZyloCorp India Cloud Systems
Location: Mumbai / Pune (On-site / Hybrid)

About the Company:
ZyloCorp is a high-growth enterprise software provider specializing in cloud procurement, billing analytics, and workflow automation serving 1,000+ mid-market and enterprise companies across India and APAC.

Role Overview:
We are seeking an aggressive, consultative Territory Sales Manager to own our mid-market commercial sales in Western India. You will be responsible for hunting new logos, pitching C-suite leaders, negotiating enterprise annual contracts, and driving sustained revenue growth.

Key Responsibilities:
• Own the complete sales lifecycle from pipeline generation, product demonstration, and objection handling to commercial negotiations and contract closure.
• Consistently meet or exceed monthly and quarterly sales revenue quotas of ₹15L+ MRR.
• Build strong consultative relationships with key enterprise stakeholders: CFOs, Chief Procurement Officers, and IT Directors.
• Partner with Inside Sales, Solution Architects, and Marketing teams to identify high-probability accounts and run targeted account-based marketing (ABM) campaigns.
• Accurately forecast quarterly revenue figures and maintain disciplined CRM hygiene in Salesforce.

Qualifications & Experience:
• 3 to 6 years of proven B2B direct sales experience (experience in SaaS, Cloud Solutions, IT Services, or Enterprise Software preferred).
• Verifiable track record of meeting or exceeding assigned sales quotas (100%+ achievement in previous roles).
• Excellent communication, executive storytelling, and closing skills with demonstrated ability to negotiate complex corporate deals.
• Experience utilizing Salesforce, LinkedIn Sales Navigator, and enterprise prospecting tools.
• Bachelor’s degree in Business, Marketing, or Engineering; MBA is an advantage.`,
  },

  it: {
    id: "it",
    label: "Software Developer / IT Support",
    pill: "💻 IT / Tech",
    category: "Full-Stack / IT Engineering",
    resume: `NEHA GUPTA
Bengaluru, Karnataka | +91 97410 88992 | neha.gupta.dev@email.com
LinkedIn: linkedin.com/in/nehagupta-dev | GitHub: github.com/nehagupta-code

SUMMARY:
Software Engineer with 3+ years of professional experience architecting, building, and deploying responsive frontend applications and microservice backends using TypeScript, React, Node.js, Express, and PostgreSQL. Passionate about clean modular code, performance optimization, and containerized deployments on AWS.

WORK EXPERIENCE:
Software Engineer | NexaScale Labs, Bengaluru | Feb 2022 – Present
• Architected and maintained 4 high-traffic customer web portals handling 150k+ daily transactions using React, Next.js, and Tailwind CSS.
• Developed scalable Node.js/Express microservices for payments and order processing; optimized SQL queries in PostgreSQL, cutting p95 response latency by 32%.
• Containerized client microservices with Docker and automated testing/deployment pipelines using GitHub Actions, reducing deployment time by 40%.
• Resolved 120+ high-severity production bug tickets and actively participated in weekly code reviews and system design sessions.

Junior Software Developer | BlueSky Software, Bengaluru | Jan 2021 – Jan 2022
• Developed modular React UI components and integrated RESTful endpoints with Redux state management.
• Migrated legacy monolithic JavaScript modules into typed TypeScript code, reducing client-side runtime errors by 18%.
• Wrote automated unit and integration tests using Jest and React Testing Library.

TECHNICAL SKILLS:
• Frontend: React.js, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Redux Toolkit
• Backend & APIs: Node.js, Express.js, REST APIs, GraphQL (Basics), Microservices
• Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (EC2, S3), Git, CI/CD pipelines
• Engineering Practices: Agile/Scrum ceremonies, Jest testing, Test-Driven Development (TDD)

EDUCATION:
• B.Tech in Information Technology | PES University, Bengaluru (2016 – 2020) — CGPA: 8.6 / 10`,

    jobDescription: `Senior Software Engineer (Full Stack - TypeScript, React & Node.js)
Company: HyperGrid Systems India
Location: Bengaluru / Remote

About HyperGrid:
HyperGrid powers mission-critical cloud observability and data pipeline infrastructure for global technology leaders.

Role Overview:
We are looking for a Senior Full-Stack Software Engineer to build resilient distributed web services and scalable user interfaces. You will collaborate closely with product managers and system architects to design, implement, and maintain high-concurrency cloud systems.

Responsibilities:
• Architect, build, and deploy production-grade full-stack features using TypeScript, React, and Node.js.
• Design modular, fault-tolerant microservices, asynchronous queues (Redis/Kafka), and relational database schemas (PostgreSQL).
• Optimize frontend performance, web vitals, state management, and accessibility for data-dense dashboards.
• Establish automated unit/integration test suites (Jest/Cypress) and participate in CI/CD deployment workflows.
• Conduct engineering design reviews, mentor junior and mid-level developers, and maintain 99.9% application uptime.

Requirements:
• 3+ years of professional hands-on software development experience with React and Node.js.
• Strong command of modern TypeScript, asynchronous programming, and relational databases (PostgreSQL/MySQL).
• Practical experience with containerization (Docker) and AWS cloud infrastructure.
• Solid grasp of system design fundamentals, caching mechanisms (Redis), and REST API security.
• Proven team player with strong technical communication and mentoring abilities.`,
  },

  marketing: {
    id: "marketing",
    label: "Digital Marketing & Social Media",
    pill: "📱 Marketing",
    category: "Performance Marketing & Growth",
    resume: `SNEHA PATEL
Gurugram, Delhi NCR | +91 99100 23456 | sneha.patel.growth@email.com
LinkedIn: linkedin.com/in/snehapatel-marketing | Portfolio: snehapatel.digital

PROFESSIONAL SUMMARY:
Performance Marketing Specialist with 3.5 years of experience scaling acquisition, paid social, and SEO channels for leading Indian D2C and consumer internet brands. Managed over ₹85 Lakhs in annual paid media budgets across Meta Ads, Google Search/Shopping, and YouTube with a consistent blended ROAS of 3.8x. Skilled in GA4 analytics, conversion rate optimization (CRO), and content-driven organic growth.

EXPERIENCE:
Senior Performance Marketing Associate | GlowCraft D2C Brands, Gurugram | June 2022 – Present
• Managed ₹8L+ monthly advertising budgets across Meta Ads (Facebook/Instagram) and Google Ads, driving ₹32L+ monthly attributable D2C revenue at an average 3.8x ROAS.
• Conducted 25+ creative A/B experiments per quarter (hooks, UGC videos, landing page copies), decreasing overall Customer Acquisition Cost (CAC) by 24%.
• Spearheaded organic SEO strategy and technical audits, growing non-brand organic search traffic from 45,000 to 110,000 monthly visits within 14 months.
• Set up multi-touch attribution reporting and custom conversion events in Google Analytics 4 (GA4) and Google Tag Manager (GTM).
• Collaborated with graphic designers and copywriters to build high-converting Shoppable video assets for Instagram Reels and YouTube Shorts.

Digital Marketing Executive | WaveMedia Digital Agency, Delhi | July 2020 – May 2022
• Managed paid search and lead-generation campaigns for 6 B2B and educational clients with ₹25L collective quarterly budgets.
• Formulated email marketing flows in Klaviyo, generating ₹4.5L in automated retention revenue.
• Executed on-page SEO, backlink outreach, and keyword research using Ahrefs and SEMrush.

SKILLS & TOOLS:
• Paid Channels: Meta Ads Manager, Google Ads (Search, Performance Max, Display, YouTube), LinkedIn Ads
• Analytics & Tracking: Google Analytics 4 (GA4), Google Tag Manager (GTM), Mixpanel, Hotjar
• SEO & Content: Ahrefs, SEMrush, On-Page SEO, Keyword Clustering, CRO Landing Pages (Unbounce / Shopify)
• Creative Strategy: Ad Copywriting, UGC Briefs, Canva, Creative Testing Frameworks

EDUCATION:
• Bachelor of Mass Media (BMM - Advertising) | Delhi University (2017 – 2020) — First Class`,

    jobDescription: `Digital Marketing Specialist / Performance Marketing Lead
Company: UrbanVitality Health & Wellness
Location: Gurugram / Delhi NCR (Hybrid)

About UrbanVitality:
UrbanVitality is one of India's fastest-growing consumer wellness and nutrition brands, serving over 250,000 active customers across 50+ Indian cities.

Role Overview:
We are looking for a data-driven Digital Marketing Specialist to lead our user acquisition and retention engines. You will manage large-scale paid media campaigns, design rapid creative experiments, and optimize our conversion funnels to scale customer revenue sustainably.

Responsibilities:
• Plan, execute, and optimize multi-channel performance marketing campaigns across Meta Ads, Google Performance Max, and YouTube.
• Manage and allocate monthly digital ad budgets of ₹10L – ₹20L while upholding target ROAS and CAC thresholds.
• Formulate creative briefs for UGC video creators, motion graphics designers, and landing page developers.
• Conduct continuous A/B testing on ad creatives, audiences, value propositions, and Shopify checkout flows.
• Track and report granular full-funnel marketing metrics (CTR, CPC, Conversion Rate, Blended CAC, LTV) in weekly executive growth reviews.
• Collaborate with the Product & Retention team to implement personalized email/WhatsApp automated customer flows.

Requirements:
• 3 to 5 years of hands-on experience in performance marketing for D2C brands, e-commerce, or consumer tech products.
• Proven track record of independently managing monthly budgets of ₹5L+ with verifiable ROAS results.
• Deep expertise in Meta Ads Manager, Google Ads, GA4, and Google Tag Manager.
• Strong analytical mindset with proficiency in Excel/Google Sheets for cohort and attribution modeling.
• Bachelor’s degree in Marketing, Mass Media, or related field.`,
  },

  operations: {
    id: "operations",
    label: "Operations, Banking & Customer Support",
    pill: "🏦 Operations",
    category: "Banking / FinTech / Back-Office Operations",
    resume: `VIKRAM MEHTA
Hyderabad, Telangana | +91 97000 55667 | vikram.mehta.ops@email.com
LinkedIn: linkedin.com/in/vikrammehta-operations

PROFESSIONAL SUMMARY:
Diligent and process-oriented Operations & Client Relationship Specialist with 3.5 years of experience in retail banking, FinTech back-office workflows, KYC/AML compliance, and customer dispute resolution. Proven track record of maintaining 98.4% Customer Satisfaction (CSAT) while processing high-volume daily financial reconciliations and managing escalations in CRM platforms (Zendesk / Salesforce). Advanced skills in MS Excel (VLOOKUP, Pivot Tables, Macro analysis) and operational audit compliance.

WORK EXPERIENCE:
Senior Operations Executive | Apex FinTech Solutions, Hyderabad | Aug 2022 – Present
• Oversee daily transaction reconciliation and merchant settlement verification for 12,000+ daily UPI and card transactions totaling ₹2.5 Cr+.
• Lead KYC verification and document validation processes ensuring 100% compliance with RBI and AML regulatory norms.
• Reduced ticket resolution turnaround time (TAT) from 4.5 hours to 2.1 hours by implementing standardized dispute triage workflows in Zendesk.
• Maintain a consistent 98.5% CSAT score across 150+ monthly escalated customer queries regarding payment refunds and account verification.
• Generate daily and monthly Operational MIS dashboards using advanced Excel formulas (XLOOKUP, Pivot Charts) for leadership review.

Customer Operations Associate | HDFC Bank Merchant Services, Hyderabad | June 2020 – July 2022
• Processed chargeback disputes, POS terminal onboarding, and merchant account maintenance for 450+ commercial accounts.
• Coordinated with internal fraud monitoring teams to flag suspicious transactions, preventing ₹14L in unauthorized charges.
• Awarded 'Employee of the Quarter Q4 2021' for operational accuracy and adherence to SLA metrics.

CORE COMPETENCIES:
• Banking & Ops: KYC/AML Audits, Transaction Reconciliation, Merchant Settlements, Fraud & Dispute Resolution, SLA Management
• Tools & Systems: Zendesk, Freshdesk, Salesforce Service Cloud, Finacle (Core Banking), MS Excel (Advanced), Power BI (Basics)
• Key Metrics: First Contact Resolution (FCR), Customer Satisfaction (CSAT), Average Handling Time (AHT), Audit Quality Score

EDUCATION:
• Bachelor of Commerce (B.Com - Banking & Insurance) | Osmania University, Hyderabad (2017 – 2020) — First Class`,

    jobDescription: `Operations Manager / Senior Relationship Executive (Banking & FinTech)
Company: PaySwift Global Financial Technologies
Location: Hyderabad / Remote (India)

About PaySwift:
PaySwift is a licensed payment aggregator and FinTech infrastructure platform processing digital commerce and neo-banking workflows for over 50,000 Indian businesses.

Role Overview:
We are seeking an experienced Operations / Relationship Executive to manage our back-office settlement workflows, KYC/AML regulatory compliance, merchant dispute resolutions, and operational analytics.

Key Responsibilities:
• Supervise daily payment gateway reconciliations, merchant payouts, and chargeback disputes in compliance with banking regulations.
• Ensure rigorous verification of customer and corporate onboarding documentation under RBI KYC and anti-money laundering (AML) guidelines.
• Act as the senior escalation point of contact for complex merchant inquiries, resolving grievances within strict SLA timelines.
• Audit operational queues daily to identify settlement bottlenecks and collaborate with Product/Engineering teams to automate manual tasks.
• Build, format, and present weekly Management Information System (MIS) reports detailing transaction volumes, fraud incident rates, and operational turnaround times.

Qualifications & Skills:
• 3+ years of experience in back-office operations, retail banking, FinTech support, or merchant dispute processing.
• Thorough understanding of Indian digital payment ecosystems (UPI, IMPS, NEFT, Payment Gateways) and KYC/AML compliance.
• Proficiency in advanced MS Excel (Pivot Tables, VLOOKUP, data reconciliation) and CRM systems (Zendesk/Salesforce).
• Excellent English and Hindi communication skills; professional telephone and written email etiquette.
• Bachelor’s degree in Commerce (B.Com), Business Administration (BBA), or Finance.`,
  },
};
