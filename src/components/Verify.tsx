import { useState, useEffect, FormEvent } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleVerify = (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    AuthService.verify(email, code).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Account Verification
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
            Please enter the 6-digit code sent to your email.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {!successful ? (
            <form className="space-y-6" onSubmit={handleVerify}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email
                </label>
                <div className="mt-2">
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
            </div>

            <div>
                <label htmlFor="code" className="block text-sm font-medium leading-6 text-white">
                Verification Code
                </label>
                <div className="mt-2">
                <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    placeholder="123456"
                    maxLength={6}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3 tracking-widest text-center text-xl"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                </div>
            </div>

            <div>
                <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                Verify Account
                </button>
            </div>

            {message && (
                <div className="rounded-md bg-red-900/50 p-4 text-red-400">
                <div className="flex">
                    <div className="ml-3">
                    <h3 className="text-sm font-medium">{message}</h3>
                    </div>
                </div>
                </div>
            )}
            </form>
        ) : (
            <div className="rounded-md bg-green-900/50 p-4 text-green-400 text-center">
                <h3 className="text-sm font-medium mb-4">{message}</h3>
                <Link to="/login" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400 transition-colors">
                    Go to Login
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
