"use client";
import { useState } from 'react';
import { signIn } from '../../../utils/auth';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      // Clear input fields after successful sign-in if needed
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="font-sans bg-white min-h-screen flex items-center justify-center p-4">
      <div className="grid md:grid-cols-3 items-center shadow-lg rounded-xl overflow-hidden max-w-4xl w-full">
        <form className="md:col-span-2 w-full py-6 px-6 sm:px-16 bg-white" onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-gray-800 text-2xl font-bold">Sign In</h3>
            <p className="text-gray-800 text-sm mt-3 leading-relaxed">
              Welcome back! Please log in to access your account and explore a world of possibilities. Your journey begins here.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="text-gray-800 text-sm mb-2 block">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
              />
            </div>

            <div className="relative">
              <label className="text-gray-800 text-sm mb-2 block">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-800">
                  Remember me
                </label>
              </div>
              <div>
                <a href="#" className="text-blue-600 font-semibold hover:underline">
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <button
              type="submit"
              className="w-full py-3 px-4 tracking-wider text-sm rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none"
            >
              Sign In
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {error}
            </p>
          )}

          <p className="text-sm text-gray-800 mt-8 text-center">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 font-semibold hover:underline">
              Register here
            </a>
          </p>
        </form>

        <div className="flex flex-col justify-center space-y-8 min-h-full bg-gradient-to-r from-gray-900 to-gray-700 lg:px-8 px-4 py-4">
          <div>
            <h4 className="text-white text-lg font-semibold">Secure Authentication</h4>
            <p className="text-sm text-gray-300 mt-2">
              Log in with your registered email and password securely.
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold">Remember Me</h4>
            <p className="text-sm text-gray-300 mt-2">
              Enable the "Remember Me" option for a seamless login experience in future sessions.
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold">Forgot Password?</h4>
            <p className="text-sm text-gray-300 mt-2">
              Easily recover your account by clicking on the "Forgot Password?" link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
