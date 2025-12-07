export type ServiceCategory = "Writing" | "Consulting" | "Visa";

export interface Service {
    id: string;
    slug: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    category: ServiceCategory;
}

export const services: Service[] = [
    {
        id: "1",
        slug: "letter-of-recommendation",
        name: "Letter of Recommendation Writing",
        shortDescription: "Professional LORs that highlight your strengths and achievements.",
        longDescription: "I craft personalized Letters of Recommendation that effectively showcase your academic and professional potential. Unlike generic templates, I interview you to understand your unique relationship with the recommender and your specific achievements, ensuring a genuine and compelling narrative. All content is 100% human-written to maintain authenticity.",
        category: "Writing",
    },
    {
        id: "2",
        slug: "research-proposal",
        name: "Research Proposal",
        shortDescription: "Structured research proposals for PhD and Master's applications.",
        longDescription: "Get a well-structured and scientifically sound research proposal tailored to your field of study. I help you articulate your research questions, methodology, and significance clearly. This service involves deep discussion about your research interests to ensure the proposal reflects your original ideas while meeting academic standards.",
        category: "Writing",
    },
    {
        id: "3",
        slug: "research-paper-support",
        name: "Research Paper Support",
        shortDescription: "Guidance and editing for your academic research papers.",
        longDescription: "From structuring your arguments to refining your academic tone, I provide comprehensive support for your research papers. Whether you need help with the literature review, methodology section, or overall flow, I ensure your paper is publication-ready. Note: I do not ghostwrite research; I help you polish and perfect your own work.",
        category: "Writing",
    },
    {
        id: "4",
        slug: "resume-cv",
        name: "Resume / CV",
        shortDescription: "ATS-friendly and impactful resumes for academic or job applications.",
        longDescription: "I design clean, professional, and ATS-optimized resumes and CVs. By focusing on your key achievements and skills, I create a document that stands out to admissions committees and employers. Every bullet point is carefully crafted to maximize impact, without using AI-generated buzzwords.",
        category: "Writing",
    },
    {
        id: "5",
        slug: "statement-of-purpose",
        name: "Statement of Purpose (SOP)",
        shortDescription: "Compelling SOPs that tell your unique story to admissions committees.",
        longDescription: "Your SOP is the most critical part of your application. I work with you to weave your experiences, motivations, and goals into a coherent and persuasive story. I avoid clichés and focus on what makes you truly unique. This is a fully collaborative, human-led process to ensure your voice shines through.",
        category: "Writing",
    },
    {
        id: "6",
        slug: "academic-writing",
        name: "Academic Writing – Thesis & Projects",
        shortDescription: "Support for thesis writing, project reports, and assignments.",
        longDescription: "Struggling with your thesis or project report? I offer guidance on structure, argumentation, and academic style. I help you organize your thoughts and present your findings clearly. My goal is to help you produce high-quality academic work that adheres to university guidelines.",
        category: "Writing",
    },
    {
        id: "7",
        slug: "catalog-making",
        name: "Catalog Making",
        shortDescription: "Professional product or service catalogs for businesses.",
        longDescription: "I create visually appealing and well-organized catalogs for your business products or services. Content is written to engage your target audience and highlight the value of your offerings. I ensure clear descriptions and a professional layout.",
        category: "Writing",
    },
    {
        id: "8",
        slug: "profile-building",
        name: "Profile Building – Expert Guidance",
        shortDescription: "Strategic advice to strengthen your profile for top universities.",
        longDescription: "Not sure where to start? I analyze your current profile and provide a roadmap to improve your chances of admission. This includes course recommendations, internship advice, and extracurricular strategy. I help you build a profile that aligns with the requirements of your dream universities.",
        category: "Consulting",
    },
    {
        id: "9",
        slug: "essays-curated",
        name: "Essays Curated for Your University",
        shortDescription: "Custom essays tailored to specific university prompts.",
        longDescription: "Many universities have specific essay prompts that require tailored responses. I help you brainstorm and write essays that directly address these prompts while showcasing your fit for the program. I ensure that every essay is distinct and relevant to the specific university's values.",
        category: "Writing",
    },
    {
        id: "10",
        slug: "interview-preparation",
        name: "One-to-One Interview Preparation",
        shortDescription: "Mock interviews and feedback for university admissions.",
        longDescription: "Prepare for your university admission interviews with confidence. I conduct mock interviews simulating real scenarios and provide detailed feedback on your answers, body language, and delivery. I help you articulate your thoughts clearly and handle difficult questions with ease.",
        category: "Consulting",
    },
    {
        id: "11",
        slug: "motivation-letter",
        name: "Motivation Letter",
        shortDescription: "Persuasive motivation letters for scholarships and jobs.",
        longDescription: "A strong motivation letter can make all the difference. I write persuasive letters that clearly explain why you are the perfect candidate for a scholarship, internship, or job. I focus on connecting your background with the opportunity at hand, creating a compelling case for your selection.",
        category: "Writing",
    },
    {
        id: "12",
        slug: "usa-visa-interview",
        name: "USA Visa Interview Preparation",
        shortDescription: "Specialized coaching for US F1/B1/B2 visa interviews.",
        longDescription: "The US visa interview can be daunting. I provide specialized coaching to help you navigate the process. We cover common questions, documentation, and how to present your intent clearly to the visa officer. My goal is to help you feel prepared and confident on the day of your interview.",
        category: "Visa",
    },
    {
        id: "13",
        slug: "australia-gte",
        name: "Australia GTE Preparation",
        shortDescription: "Assistance with the Genuine Temporary Entrant (GTE) statement.",
        longDescription: "The GTE statement is crucial for Australian student visas. I help you draft a statement that meets the Department of Home Affairs' criteria. We focus on explaining your study plans, financial circumstances, and ties to your home country to demonstrate your genuine intent to study in Australia.",
        category: "Visa",
    },
];
