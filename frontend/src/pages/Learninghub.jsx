// Curated learning resources matched to the user's "skillsWanted".
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ExternalLink } from 'lucide-react';

const CATALOG = [
  { skill: 'react',     title: 'React official tutorial', url: 'https://react.dev/learn' },
  { skill: 'python',    title: 'Python crash course',     url: 'https://www.learnpython.org/' },
  { skill: 'machine learning', title: 'Andrew Ng — ML', url: 'https://www.coursera.org/learn/machine-learning' },
  { skill: 'public speaking', title: 'TED Masterclass',  url: 'https://masterclass.ted.com/' },
  { skill: 'design',    title: 'Refactoring UI',          url: 'https://www.refactoringui.com/' },
];

export default function LearningHub() {
  const { user } = useAuth();
  const wanted = (user?.skillsWanted || []).map((s)=>s.toLowerCase());

  const matches = useMemo(() => {
    if (!wanted.length) return CATALOG;
    return CATALOG.filter((c) => wanted.some((w) => c.skill.includes(w) || w.includes(c.skill)));
  }, [wanted]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Learning Hub</h1>
      <p className="text-ink-500 mt-1">
        Resources personalized to {wanted.length ? `the skills you want to learn: ${wanted.join(', ')}` : 'all topics — add skills to your profile to personalize.'}
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {matches.map((m) => (
          <a key={m.title} href={m.url} target="_blank" rel="noreferrer" className="card hover:border-brand-300 transition">
            <p className="text-xs uppercase tracking-wide text-brand-600">{m.skill}</p>
            <p className="font-semibold mt-1 flex items-center gap-2">{m.title} <ExternalLink size={14}/></p>
          </a>
        ))}
      </div>
    </div>
  );
}
