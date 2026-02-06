import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { IUser } from "../types/user.type";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {currentUser ? (
        <div className="bg-slate-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-white">Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">User details.</p>
          </div>
          <div className="border-t border-slate-700">
            <dl>
              <div className="bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Username</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{currentUser.username}</dd>
              </div>
              <div className="bg-slate-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Email</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{currentUser.email}</dd>
              </div>
              <div className="bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Roles</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  {currentUser.roles && currentUser.roles.join(", ")}
                </dd>
              </div>
              <div className="bg-slate-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Token</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2 truncate">
                  {currentUser.accessToken && currentUser.accessToken.substring(0, 20)}...{" "}
                  {currentUser.accessToken && currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        <div>Please log in.</div>
      )}
    </div>
  );
};

export default Profile;
