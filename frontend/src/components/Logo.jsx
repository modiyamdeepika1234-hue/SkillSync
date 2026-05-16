import logo from '../assets/logo.png';
export default function Logo({ size = 32 }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="SkillSync" width={size} height={size} className="rounded-md" />
      <span className="font-bold text-lg bg-gradient-to-r from-brand-700 to-accent-500 bg-clip-text text-transparent">
        SkillSync
      </span>
    </div>
  );
}
