import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">About GlobalDocs</h1>
                <div className="w-20 h-1 bg-slate-900 rounded-full"></div>
            </div>

            <div className="prose prose-slate max-w-none space-y-6 text-lg text-slate-700 leading-relaxed">
                <p>
                    Welcome to GlobalDocs. I am an independent consultant dedicated to helping students and professionals achieve their dreams of studying and working abroad. With years of experience in academic writing and visa consulting, I provide personalized support that goes beyond generic templates.
                </p>
                <p>
                    In an era of AI-generated content, I pride myself on offering 100% human-crafted documents. I believe that your Statement of Purpose, Letters of Recommendation, and essays should reflect <em>your</em> unique voice and story. That's why I take the time to interview each client, understanding their background, motivations, and aspirations before writing a single word.
                </p>
                <p>
                    Over the years, I have helped dozens of students secure admissions to top universities in the USA, UK, Canada, Australia, and Germany. Whether you are a fresh graduate or a working professional looking to upskill, I have the expertise to guide you through the complex application and visa process.
                </p>
            </div>

            <div className="bg-slate-50 border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-slate-900">Who I work with:</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                    {[
                        "Students aiming for Top 100 Universities",
                        "Working professionals seeking MBA/MS",
                        "PhD candidates needing research proposals",
                        "Visa applicants (F1, B1/B2, Study Permit)"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700">
                            <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pt-4">
                <Button size="lg" asChild>
                    <Link to="/contact">Work with me</Link>
                </Button>
            </div>
        </div>
    );
}
