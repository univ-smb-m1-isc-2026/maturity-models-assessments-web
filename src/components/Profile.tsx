import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import AuthService from "../services/auth.service";
import { IUser } from "../types/user.type";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(AuthService.getCurrentUser());
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [is2FASetup, setIs2FASetup] = useState(false);

  const handleInitiate2FA = () => {
    AuthService.generate2FA().then((response) => {
      setSecret(response.data.secret);
      setQrCodeUrl(response.data.otpAuthUrl);
      setIs2FASetup(true);
      setMessage("");
    });
  };

  const handleVerify2FA = () => {
    if (!currentUser) return;
    
    AuthService.enable2FA(secret, verificationCode).then(
      () => {
        const updatedUser = { ...currentUser, using2FA: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setIs2FASetup(false);
        setMessage("2FA Enabled successfully!");
      },
      () => {
        setMessage("Invalid code. Please try again.");
      }
    );
  };

  const handleDisable2FA = () => {
    if (!currentUser) return;

    AuthService.disable2FA().then(() => {
      const updatedUser = { ...currentUser, using2FA: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setMessage("2FA Disabled.");
    });
  };

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
                <dt className="text-sm font-medium text-slate-400">First Name</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{currentUser.firstName}</dd>
              </div>
              <div className="bg-slate-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Last Name</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{currentUser.lastName}</dd>
              </div>
              <div className="bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Email</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{currentUser.email}</dd>
              </div>
              <div className="bg-slate-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Two-Factor Authentication</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  {currentUser.using2FA ? (
                    <div>
                      <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20 mr-4">
                        Enabled
                      </span>
                      <button
                        onClick={handleDisable2FA}
                        className="rounded-md bg-red-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
                      >
                        Disable 2FA
                      </button>
                    </div>
                  ) : (
                    <div>
                      {!is2FASetup ? (
                        <button
                          onClick={handleInitiate2FA}
                          className="rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
                        >
                          Enable 2FA
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-white p-2 inline-block rounded">
                            <QRCodeSVG value={qrCodeUrl} size={128} />
                          </div>
                          <p className="text-xs text-slate-400">
                            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                          </p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="block rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                              placeholder="Enter code"
                            />
                            <button
                              onClick={handleVerify2FA}
                              className="rounded-md bg-green-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400"
                            >
                              Verify & Enable
                            </button>
                            <button
                              onClick={() => setIs2FASetup(false)}
                              className="rounded-md bg-slate-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {message && <p className="mt-2 text-sm text-yellow-400">{message}</p>}
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
