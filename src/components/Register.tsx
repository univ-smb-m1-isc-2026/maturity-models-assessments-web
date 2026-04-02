import { useState, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthService from "../services/auth.service";

const ROLE_OPTIONS = [
  { value: "ROLE_PMO", label: "PMO" },
  { value: "ROLE_TEAM_LEADER", label: "Team Leader" },
  { value: "ROLE_TEAM_MEMBER", label: "Team Member" },
];

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const teamIdParam = searchParams.get("teamId") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("ROLE_TEAM_MEMBER");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setSuccessful(false);
      return;
    }

    const roles = teamIdParam ? undefined : [selectedRole];

    AuthService.register(firstName, lastName, email, password, roles, teamIdParam || undefined).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setTimeout(() => {
            navigate("/verify", { state: { email: email } });
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
          Create an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleRegister}>
          {!successful && (
            <>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-white">
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-white">
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

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
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-white">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {!teamIdParam && (
                <fieldset>
                  <legend className="block text-sm font-medium leading-6 text-white">Select your role</legend>
                  <p className="mt-1 text-xs text-slate-400">
                    This role is used for your personal profile. Team roles can still be adjusted later by a team owner.
                  </p>
                  <div className="mt-3 space-y-3">
                    {ROLE_OPTIONS.map((role) => (
                      <label
                        key={role.value}
                        className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={selectedRole === role.value}
                          onChange={() => setSelectedRole(role.value)}
                          className="h-4 w-4 border-slate-600 text-indigo-500 focus:ring-indigo-500"
                        />
                        <span>{role.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {teamIdParam && (
                <div className="rounded-md border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  You are registering through an invitation. Your team role will be set by the invitation flow.
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </>
          )}

          {message && (
            <div className={`rounded-md p-4 ${successful ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium">{message}</h3>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
