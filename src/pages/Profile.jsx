import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/profile.css";

const Profile = () => {

  const [profileEdit, setProfileEdit] =
    useState(false);

  const [user, setUser] = useState({
    name: "Your Name",
    email: "yourmail@gmail.com",
    about: "",
    profilePic:
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    teachSkills: [],
    learnSkills: [],
  });

  const [teachInput, setTeachInput] =
    useState("");

  const [learnInput, setLearnInput] =
    useState("");

  useEffect(() => {

    const savedUser =
      localStorage.getItem("profileData");

    if (savedUser) {

      setUser(JSON.parse(savedUser));
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "profileData",
      JSON.stringify(user)
    );

  }, [user]);

  const handleChange = (e) => {

    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      const reader = new FileReader();

      reader.onloadend = () => {

        setUser({
          ...user,
          profilePic: reader.result,
        });

      };

      reader.readAsDataURL(file);

    }

  };

  const addTeachSkill = () => {

    if (teachInput.trim() === "")
      return;

    setUser({
      ...user,
      teachSkills: [
        ...user.teachSkills,
        teachInput,
      ],
    });

    setTeachInput("");

  };

  const addLearnSkill = () => {

    if (learnInput.trim() === "")
      return;

    setUser({
      ...user,
      learnSkills: [
        ...user.learnSkills,
        learnInput,
      ],
    });

    setLearnInput("");

  };

  const deleteTeachSkill = (index) => {

    const updatedSkills =
      user.teachSkills.filter(
        (_, i) => i !== index
      );

    setUser({
      ...user,
      teachSkills: updatedSkills,
    });

  };

  const deleteLearnSkill = (index) => {

    const updatedSkills =
      user.learnSkills.filter(
        (_, i) => i !== index
      );

    setUser({
      ...user,
      learnSkills: updatedSkills,
    });

  };

  return (

    <div className="profile-layout">

      <Sidebar />

      <div className="profile-page">

        <div className="profile-header">

          <div className="profile-info">

            <div className="profile-image-container">

              <img
                src={user.profilePic}
                alt="profile"
                className="profile-img"
              />

              <label
                htmlFor="profileUpload"
                className="upload-icon"
              >
                +
              </label>

              <input
                type="file"
                id="profileUpload"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />

            </div>

            <div>

              {
                profileEdit ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      className="edit-input"
                      placeholder="Enter Name"
                    />

                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="edit-input"
                      placeholder="Enter Email"
                    />
                  </>
                ) : (
                  <>
                    <h2>{user.name}</h2>

                    <p>{user.email}</p>
                  </>
                )
              }

            </div>

          </div>

          <button
            className="edit-btn"
            onClick={() =>
              setProfileEdit(!profileEdit)
            }
          >
            {
              profileEdit
              ? "Save Profile"
              : "Edit Profile"
            }
          </button>

        </div>

        <div className="profile-content">

          <div className="card">

            <h3>About Me</h3>

            <textarea
              name="about"
              value={user.about}
              onChange={handleChange}
              placeholder="Tell others about yourself..."
            />

          </div>

          <div className="card">

            <h3>My Skills</h3>

            <div className="skill-section">

              <h4>I Can Teach</h4>

              <div className="skill-input">

                <input
                  type="text"
                  value={teachInput}
                  onChange={(e) =>
                    setTeachInput(e.target.value)
                  }
                  placeholder="Add skill"
                />

                <button
                  onClick={addTeachSkill}
                >
                  +
                </button>

              </div>

              <div className="skills-list">

                {
                  user.teachSkills.length === 0 ? (
                    <p>
                      No teaching skills added yet
                    </p>
                  ) : (
                    user.teachSkills.map(
                      (skill, index) => (

                        <div
                          className="skill-tag"
                          key={index}
                        >

                          {skill}

                          <span
                            className="delete-btn"
                            onClick={() =>
                              deleteTeachSkill(index)
                            }
                          >
                            ×
                          </span>

                        </div>
                      )
                    )
                  )
                }

              </div>

            </div>

            <div className="skill-section">

              <h4>I Want to Learn</h4>

              <div className="skill-input">

                <input
                  type="text"
                  value={learnInput}
                  onChange={(e) =>
                    setLearnInput(e.target.value)
                  }
                  placeholder="Add skill"
                />

                <button
                  onClick={addLearnSkill}
                >
                  +
                </button>

              </div>

              <div className="skills-list">

                {
                  user.learnSkills.length === 0 ? (
                    <p>
                      No learning skills added yet
                    </p>
                  ) : (
                    user.learnSkills.map(
                      (skill, index) => (

                        <div
                          className="skill-tag"
                          key={index}
                        >

                          {skill}

                          <span
                            className="delete-btn"
                            onClick={() =>
                              deleteLearnSkill(index)
                            }
                          >
                            ×
                          </span>

                        </div>
                      )
                    )
                  )
                }

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Profile;