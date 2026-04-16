import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ChevronRight, Building2 } from 'lucide-react';
import { Button } from '../components/Button';

type Step = 'login' | 'onboarding';

const industries = ['Retail', 'Manufacturing', 'IT Services', 'Trading', 'Healthcare', 'Food & Beverage', 'Construction', 'Logistics'];
const revenueRanges = ['Under ₹10L', '₹10L – ₹50L', '₹50L – ₹1Cr', '₹1Cr – ₹5Cr', '₹5Cr – ₹25Cr', 'Above ₹25Cr'];
const banks = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank', 'IndusInd Bank', 'PNB'];

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    gstNumber: '',
    industry: '',
    revenueRange: '',
    bank: '',
  });

  function handleGoogle() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('onboarding');
    }, 1000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  }

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const isFormValid = form.businessName && form.gstNumber && form.industry && form.revenueRange && form.bank;

  if (step === 'onboarding') {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-[#00FF87] rounded-full" />
              <span className="text-[#00FF87] text-xs font-semibold tracking-widest font-mono">STEP 2 OF 2</span>
            </div>
            <h2 className="text-2xl font-bold text-[#F9FAFB] font-heading">Set up your business</h2>
            <p className="text-[#6B7280] text-sm mt-1">We'll personalize AutoCFO for your needs.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 tracking-wide">BUSINESS NAME</label>
              <input
                type="text"
                placeholder="e.g. Mehta Enterprises Pvt Ltd"
                value={form.businessName}
                onChange={(e) => updateForm('businessName', e.target.value)}
                className="w-full bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 text-[#F9FAFB] placeholder-[#4B5563] text-sm focus:outline-none focus:border-[#00FF87]/50 focus:ring-1 focus:ring-[#00FF87]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 tracking-wide">GST NUMBER</label>
              <input
                type="text"
                placeholder="e.g. 27AAPFU0939F1ZV"
                value={form.gstNumber}
                onChange={(e) => updateForm('gstNumber', e.target.value.toUpperCase())}
                maxLength={15}
                className="w-full bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 text-[#F9FAFB] placeholder-[#4B5563] text-sm focus:outline-none focus:border-[#00FF87]/50 focus:ring-1 focus:ring-[#00FF87]/20 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 tracking-wide">INDUSTRY</label>
              <select
                value={form.industry}
                onChange={(e) => updateForm('industry', e.target.value)}
                className="w-full bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#00FF87]/50 focus:ring-1 focus:ring-[#00FF87]/20 transition-all appearance-none"
              >
                <option value="" disabled>Select your industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 tracking-wide">ANNUAL REVENUE</label>
              <select
                value={form.revenueRange}
                onChange={(e) => updateForm('revenueRange', e.target.value)}
                className="w-full bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#00FF87]/50 focus:ring-1 focus:ring-[#00FF87]/20 transition-all appearance-none"
              >
                <option value="" disabled>Select revenue range</option>
                {revenueRanges.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 tracking-wide">PRIMARY BANK</label>
              <select
                value={form.bank}
                onChange={(e) => updateForm('bank', e.target.value)}
                className="w-full bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#00FF87]/50 focus:ring-1 focus:ring-[#00FF87]/20 transition-all appearance-none"
              >
                <option value="" disabled>Select your bank</option>
                {banks.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={!isFormValid}
              className="mt-2"
            >
              {loading ? 'Setting up AutoCFO...' : (
                <span className="flex items-center justify-center gap-2">
                  Launch AutoCFO <ChevronRight size={16} />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00FF87]/10 border border-[#00FF87]/20 mb-5">
            <TrendingUp size={28} className="text-[#00FF87]" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-[#F9FAFB] font-heading tracking-tight mb-2">AutoCFO</h1>
          <p className="text-[#6B7280] text-base leading-relaxed">Your business's CFO.<br />On autopilot.</p>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <h2 className="text-sm font-semibold text-[#9CA3AF] text-center mb-5 tracking-wide">SIGN IN TO CONTINUE</h2>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-[#0A0F1E] font-semibold rounded-xl py-3.5 text-sm hover:bg-[#f0f0f0] active:bg-[#e0e0e0] transition-all duration-150 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#0A0F1E] border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1F2937]" />
            <span className="text-[#4B5563] text-xs">or</span>
            <div className="flex-1 h-px bg-[#1F2937]" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 text-[#9CA3AF] text-sm py-2.5 hover:text-[#F9FAFB] transition-colors disabled:opacity-50"
          >
            <Building2 size={15} />
            Sign in with GST Portal
          </button>
        </div>

        <p className="text-center text-xs text-[#4B5563] mt-5 leading-relaxed">
          By continuing, you agree to AutoCFO's{' '}
          <span className="text-[#6B7280] underline cursor-pointer hover:text-[#9CA3AF]">Terms of Service</span>
          {' '}and{' '}
          <span className="text-[#6B7280] underline cursor-pointer hover:text-[#9CA3AF]">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.344 0-4.3282-1.5836-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853" />
      <path d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.173 0 7.5482 0 9s.3477 2.827.9573 4.0418L3.964 10.71z" fill="#FBBC05" />
      <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1632 6.656 3.5795 9 3.5795z" fill="#EA4335" />
    </svg>
  );
}
