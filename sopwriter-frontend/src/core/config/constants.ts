export const SERVICE_MAP: Record<string, string[]> = {
    documents: [
        "Statement of Purpose (SOP)",
        "Letter of Recommendation (LOR)",
        "Motivation Letter",
        "Research Proposal",
        "University Essays",
        "Thesis Writing",
        "Research Paper Support",
    ],
    profile: [
        "Resume Upgrade",
        "Profile Building Consultation",
        "Interview Preparation",
    ],
    visa: ["USA Visa Interview Prep", "Australia GTE Preparation"],
};

export const PRICING_MAP: Record<string, number> = {
    // Documents
    "Statement of Purpose (SOP)": 2499,
    "Letter of Recommendation (LOR)": 1499,
    "Motivation Letter": 1999,
    "Research Proposal": 3499,
    "University Essays": 1299,
    "Thesis Writing": 9999,
    "Research Paper Support": 4999,

    // Profile
    "Resume Upgrade": 1499,
    "Profile Building Consultation": 999,
    "Interview Preparation": 1999,

    // Visa
    "USA Visa Interview Prep": 2999,
    "Australia GTE Preparation": 2999,
};

export const SERVICE_DESCRIPTIONS: Record<string, string> = {
    "Statement of Purpose (SOP)": "Personalized SOPs crafted to clearly present your academic background, goals, and motivation, aligned with the expectations of your target university and program.",
    "Letter of Recommendation (LOR)": "Professionally written LOR content highlighting your strengths, achievements, and suitability, structured to match international academic standards.",
    "Motivation Letter": "A focused and compelling motivation letter explaining your intent, interests, and future plans, tailored for universities, scholarships, or visa applications.",
    "University Essays": "Well-structured essays addressing specific university prompts, ensuring clarity, originality, and relevance to the institution’s values.",
    "Research Proposal": "Detailed and academically sound research proposals outlining objectives, methodology, and expected outcomes, aligned with faculty and program requirements.",
    "Research Paper Support": "Guidance and editorial support for drafting, refining, and structuring research papers according to academic and publication standards.",
    "Thesis Writing": "Structured assistance for theses and academic projects, including problem formulation, literature review, methodology, and formal presentation.",
    "Resume Upgrade": "Professionally optimized resumes tailored for academic admissions, research roles, or international job applications.",
    "Profile Building Consultation": "One-on-one expert guidance to strengthen your academic and professional profile, including document strategy and application positioning.",
    "Interview Preparation": "Personalized interview preparation sessions focusing on clarity, confidence, and relevant questioning for university or academic interviews.",
    "USA Visa Interview Prep": "Structured mock interviews and guidance based on real visa interview scenarios, focusing on clarity, confidence, and compliance.",
    "Australia GTE Preparation": "Targeted assistance for Genuine Temporary Entrant (GTE) documentation and interview preparation in line with Australian immigration requirements.",
};
