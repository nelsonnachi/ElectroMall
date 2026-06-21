import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Camera, ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import {
  getAvatarStyle,
  getUserInitial,
  hasCustomAvatar,
} from "../utils/avatar";
import { updateProfile } from "../redux/features/user/userAPI";
import { removeErrors, removeSuccess } from "../redux/features/user/userSlice";

const EditProfile = () => {
  const { user, error, success, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- LOCAL INPUT FORM STATES (Pre-filled with existing user data) ---
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(null); 
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size too large. Maximum size limit is 2MB.");
      return;
    }

    setAvatar(file); 

    // Render client-side view representation
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- FORM SUBMISSION TRIGGER ENGINE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required fields.");
      return;
    }

    try {
      const myForm = new FormData();
      myForm.set("name", name);
      myForm.set("email", email);
      
      if (avatar) {
        myForm.set("avatar", avatar); 
      }

      dispatch(updateProfile(myForm));
    } catch (err) {
      toast.error(err?.message || "Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    if (success) {
      toast.success(success?.message || "Profile updated successfully!");
      dispatch(removeSuccess());
      navigate("/profile"); 
    }
    
    if (error) {
      toast.error(error?.message || "An unexpected error occurred.");
      dispatch(removeErrors());
    }
  }, [success, error, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Header Ribbon Frame */}
        <div className="px-6 py-5 bg-white border-b border-neutral-100 flex items-center gap-4">
          <Link
            to="/profile"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-lg font-bold text-neutral-900">
            Edit Profile Details
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Avatar Segment */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-neutral-100 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : hasCustomAvatar(user?.avatar) ? (
                  <img
                    src={user?.avatar?.url}
                    alt="Current Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    style={getAvatarStyle(user)}
                    className="w-full h-full flex items-center justify-center text-white text-3xl font-bold tracking-wide"
                  >
                    {getUserInitial(user)}
                  </div>
                )}
              </div>

              <label
                htmlFor="edit-avatar-picker"
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-colors cursor-pointer"
                title="Choose new profile photo"
              >
                <Camera size={14} />
                <input
                  type="file"
                  id="edit-avatar-picker"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <span className="text-xs text-neutral-400 font-medium mt-3">
              Click badge icon to change photo
            </span>
          </div>

          {/* Form Field: Full Name Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="name-input"
                className="text-xs font-bold uppercase tracking-wider text-neutral-400"
              >
                Full Name
              </label>
            </div>
            <div className="relative flex items-center">
              <User
                size={16}
                className="absolute left-4 text-neutral-400 pointer-events-none"
              />
              <input
                type="text"
                id="name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new name"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition"
              />
            </div>
          </div>

          {/* Form Field: Email Address Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="email-input"
                className="text-xs font-bold uppercase tracking-wider text-neutral-400"
              >
                Email Address
              </label> 
            </div>
            <div className="relative flex items-center">
              <Mail
                size={16}
                className="absolute left-4 text-neutral-400 pointer-events-none"
              />
              <input
                type="email"
                id="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter new email"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition"
              />
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link
              to="/profile"
              className="w-full sm:w-auto text-center px-5 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition cursor-pointer"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition disabled:bg-neutral-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
