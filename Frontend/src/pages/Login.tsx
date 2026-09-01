import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e?: React.FormEvent, loginEmail?: string, loginPassword?: string) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      await login(loginEmail || email, loginPassword || password);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    setEmail('demo@structureai.com');
    setPassword('demo1234');
    handleLogin(undefined, 'demo@structureai.com', 'demo1234');
  };

  // Generate particles
  const particles = Array.from({ length: 20 });

  return (
    <div className="relative min-h-screen bg-t-bg flex items-center justify-center overflow-hidden">
      {/* Animated gradient backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * -500],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="absolute inset-0 bg-t-card/80 backdrop-blur-2xl rounded-2xl border border-t-border shadow-2xl" />
        
        {/* Animated border wrapper */}
        <div className="absolute inset-0 rounded-2xl border border-transparent overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[slideRight_3s_linear_infinite]" />
        </div>

        <div className="relative">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-t-text tracking-tight">StructureAI</h1>
            <p className="text-sm text-t-muted mt-1 text-center">Structural Health Monitoring Platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-t-muted" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-t-border rounded-xl bg-t-hover text-t-text placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-t-muted" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-10 py-3 border border-t-border rounded-xl bg-t-hover text-t-text placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-t-muted hover:text-t-text"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center text-t-muted">
                <input type="checkbox" className="rounded bg-t-hover border-t-border text-blue-500 focus:ring-blue-500 mr-2" />
                Remember me
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
            </div>

            <div className="pt-4 space-y-3">
              <Button type="submit" fullWidth loading={isLoading} size="lg" className="group">
                Sign In 
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
              
              <Button 
                type="button" 
                variant="secondary" 
                fullWidth 
                onClick={handleDemoAccess}
                disabled={isLoading}
              >
                Demo Access
              </Button>
              
              <Button 
                type="button" 
                variant="secondary" 
                fullWidth 
                onClick={() => navigate('/public')}
                disabled={isLoading}
              >
                Public Portal
              </Button>
            </div>
          </form>
        </div>
      </motion.div>

      <div className="absolute bottom-6 text-t-muted text-sm flex gap-2 items-center">
        <span>Powered by AI</span>
        <span className="w-1 h-1 rounded-full bg-[#94A3B8]" />
        <span>Real-time Monitoring</span>
        <span className="w-1 h-1 rounded-full bg-[#94A3B8]" />
        <span>Predictive Analytics</span>
      </div>

      <style>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Login;
