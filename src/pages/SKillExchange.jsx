import React, { useMemo, useState } from "react";
import "../styles/skillExchange.css";
import Sidebar from "../components/Sidebar";

const SkillExchange = () => {

  const [users] = useState([
    {
      id: 1,
      name: "Harsh Shinde",
      bio: "Video Editor from Pune",
      teachSkills: ["Video Editing", "Premiere Pro"],
      learnSkills: ["Coding"],
      match: 92,
      online: true,
      image:
        "https://randomuser.me/api/portraits/men/32.jpg",
    },

    {
      id: 2,
      name: "Kunal Mali",
      bio: "UI/UX Designer from Mumbai",
      teachSkills: ["Design", "Figma"],
      learnSkills: ["React"],
      match: 88,
      online: true,
      image:
        "https://randomuser.me/api/portraits/men/45.jpg",
    },

    {
      id: 3,
      name: "Varad Patil",
      bio: "Frontend Developer from Delhi",
      teachSkills: ["React", "JavaScript"],
      learnSkills: ["UI Design"],
      match: 81,
      online: false,
      image:
        "https://randomuser.me/api/portraits/men/67.jpg",
    },

    {
      id: 4,
      name: "Sachin Mali",
      bio: "Singer from Hyderabad",
      teachSkills: ["Singing"],
      learnSkills: ["Acting"],
      match: 75,
      online: true,
      image:
        "https://randomuser.me/api/portraits/men/12.jpg",
    },
  ]);

  const [search, setSearch] = useState("");

  const [showMatches, setShowMatches] =
    useState(false);

  const filteredUsers = useMemo(() => {

    let filtered = [...users];

    filtered = filtered.filter((user) => {

      const text =
        `${user.name}
        ${user.bio}
        ${user.teachSkills.join(" ")}
        ${user.learnSkills.join(" ")}`.toLowerCase();

      return text.includes(search.toLowerCase());

    });

    if (showMatches) {

      filtered = filtered.filter(
        (user) => user.match >= 85
      );

    }

    return filtered;

  }, [users, search, showMatches]);

  const handleConnect = (name) => {

    alert(`Connection request sent to ${name}`);

  };

  return (

    <div className="exchange-layout">

      <Sidebar />

      <div className="exchange-page">

        <div className="exchange-hero">

          <div>

            <h1>
              Skill Exchange Network
            </h1>

            <p>
              Connect with people who want
              to share their skills and
              learn from you.
            </p>

          </div>

          <div className="hero-controls">

            <input
              type="text"
              placeholder="Search skills or users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="search-input"
            />

            <button
              className={`filter-btn ${
                showMatches ? "active-btn" : ""
              }`}
              onClick={() =>
                setShowMatches(!showMatches)
              }
            >
              {
                showMatches
                  ? "Showing Top Matches"
                  : "Show Matches"
              }
            </button>

          </div>

        </div>

        <div className="users-grid">

          {
            filteredUsers.length === 0 ? (

              <div className="empty-state">

                <h2>No Users Found</h2>

                <p>
                  Try searching another skill.
                </p>

              </div>

            ) : (

              filteredUsers.map((user) => (

                <div
                  className="user-card"
                  key={user.id}
                >

                  <div className="card-top">

                    <div className="profile-wrapper">

                      <img
                        src={user.image}
                        alt={user.name}
                        className="profile-image"
                      />

                      <span
                        className={`status-dot ${
                          user.online
                            ? "online"
                            : "offline"
                        }`}
                      />

                    </div>

                    <div className="user-info">

                      <h3>{user.name}</h3>

                      <p>{user.bio}</p>

                    </div>

                  </div>

                  <div className="match-badge">

                    {user.match}% Match

                  </div>

                  <div className="skill-block">

                    <h4>Can Teach</h4>

                    <div className="tags-container">

                      {
                        user.teachSkills.map(
                          (skill, index) => (
                            <span
                              className="skill-tag teach-tag"
                              key={index}
                            >
                              {skill}
                            </span>
                          )
                        )
                      }

                    </div>

                  </div>

                  <div className="skill-block">

                    <h4>Wants To Learn</h4>

                    <div className="tags-container">

                      {
                        user.learnSkills.map(
                          (skill, index) => (
                            <span
                              className="skill-tag learn-tag"
                              key={index}
                            >
                              {skill}
                            </span>
                          )
                        )
                      }

                    </div>

                  </div>

                  <button
                    className="connect-btn"
                    onClick={() =>
                      handleConnect(user.name)
                    }
                  >
                    Connect
                  </button>

                </div>

              ))

            )
          }

        </div>

      </div>

    </div>

  );

};

export default SkillExchange;