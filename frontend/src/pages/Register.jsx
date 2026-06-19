// Register page — manual signup (with optional Google on login page)
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from '../components/Toast';

function Register() {
  const navigate = useNavigate();
  const { registerWithPassword } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  function addToast(message, type = 'info') {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    setLoading(true);
    try {
      await registerWithPassword({ name, email, campus, password });
      addToast('Account created successfully.', 'success');
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex page-enter bg-[#f7f3ee]">

      {/* ─── Left column — decorative ─── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center border-r border-[#ded6ca] bg-[#304826] p-12 text-white">
        <BookOpen size={48} className="mb-6 text-[#dbe8c3]" />
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-white/60">Student Access</p>
        <h2 className="font-serif text-5xl leading-tight mb-5">Join CampusMarket</h2>
        <p className="text-base leading-7 text-white/75 max-w-sm">
          Connect with students at your university and trade academic materials easily.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
          {['Books', 'Notes', 'Electronics', 'Lab Gear'].map((item) => (
            <div key={item} className="border border-white/20 bg-white/10 p-3 text-center">
              <span className="text-white text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right column — form ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#fffdf9] overflow-y-auto">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 mb-8">
            <BookOpen size={24} className="text-[#304826]" />
            <span className="font-bold text-xl text-[#304826]">CampusMarket</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Create an account with email and password.
          </p>

          <form className="space-y-3" onSubmit={onSubmit}>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full border border-[#ded6ca] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#304826]"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-[#ded6ca] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#304826]"
            />
            <input
              type="text"
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              placeholder="Campus (optional)"
              className="w-full border border-[#ded6ca] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#304826]"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 chars)"
              className="w-full border border-[#ded6ca] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#304826]"
            />
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full border border-[#ded6ca] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#304826]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#304826] py-3 font-semibold text-white
                transition-colors duration-200 hover:bg-[#24381d] disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p className="text-xs text-gray-400">
              You can also use Google login from the login page.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#304826] font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default Register;
