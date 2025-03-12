import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import APIService from "../server";
import { User, Mail, Edit, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await APIService.getUserProfile();
        if (response && response.user) {
          setUser(response.user);
          setEditedUser(response.user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset to original values
      setEditedUser(user);
    }
    setIsEditing(!isEditing);
    setSaveStatus(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // This would be replaced with an actual API call to update the profile
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state with edited values
      setUser(editedUser);
      setIsEditing(false);
      setSaveStatus({ success: true, message: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus({ success: false, message: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-teal mb-4">Error Loading Profile</h2>
          <p className="text-muted mb-6">{error}</p>
          <button 
            onClick={() => navigate("/")}
            className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all duration-300"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-teal leading-tight mb-6 animate-fade-up">
            Your Profile
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto animate-fade-up delay-100">
            Manage your personal information and account settings
          </p>
        </div>
      </section>

      {/* Profile Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative">
          
          {/* Profile Card */}
          <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-up">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-teal">Profile Information</h2>
              <button 
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-background hover:bg-background-secondary transition-colors duration-300"
              >
                {isEditing ? (
                  <>
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-teal p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">
                      {user.name ? user.name.charAt(0) : "?"}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              {isEditing ? (
                <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editedUser.name || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background"
                        disabled
                      />
                      <p className="text-xs text-muted mt-1">Email cannot be changed</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted">Full Name</h3>
                      <p className="text-xl font-medium flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {user.name || "Not set"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted">Email Address</h3>
                      <p className="text-xl font-medium flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Status Message */}
            {saveStatus && (
              <div className={`mt-4 p-4 rounded-lg ${saveStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} flex items-center gap-2`}>
                {saveStatus.success ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{saveStatus.message}</span>
              </div>
            )}
          </div>

          {/* Account Settings Card */}
          <div className="bg-white p-8 rounded-lg shadow-xl mt-8 animate-fade-up delay-100">
            <h2 className="text-3xl font-bold text-teal mb-8">Account Settings</h2>
            
            <div className="space-y-6">
              <div className="p-6 border border-border rounded-lg hover:border-primary transition-all duration-300 bg-background">
                <h3 className="text-xl font-semibold text-primary mb-2">Change Password</h3>
                <p className="text-muted mb-4">Update your password to keep your account secure</p>
                <button className="bg-background-secondary text-primary px-6 py-2.5 rounded-full font-medium hover:bg-background-secondary/80 transition-all duration-300">
                  Change Password
                </button>
              </div>
              
              <div className="p-6 border border-border rounded-lg hover:border-primary transition-all duration-300 bg-background">
                <h3 className="text-xl font-semibold text-primary mb-2">Notification Preferences</h3>
                <p className="text-muted mb-4">Manage how and when you receive notifications</p>
                <button className="bg-background-secondary text-primary px-6 py-2.5 rounded-full font-medium hover:bg-background-secondary/80 transition-all duration-300">
                  Manage Notifications
                </button>
              </div>
              
              <div className="p-6 border border-red-100 rounded-lg hover:border-red-300 transition-all duration-300 bg-red-50">
                <h3 className="text-xl font-semibold text-red-600 mb-2">Delete Account</h3>
                <p className="text-red-500 mb-4">Permanently delete your account and all associated data</p>
                <button className="bg-white text-red-600 border border-red-300 px-6 py-2.5 rounded-full font-medium hover:bg-red-50 transition-all duration-300">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile; 