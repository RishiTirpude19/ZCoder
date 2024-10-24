import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ImportantLink.css'; // Import the CSS

function ImportantLinks() {
  const [impLinks, setImpLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchImpLinks() {
      try {
        const response = await axios.get(`http://localhost:8080/implinks`, { withCredentials: true });
        if (Array.isArray(response.data)) {
          setImpLinks(response.data);
        }
      } catch (error) {
        setImpLinks([]);
      }
    }
    fetchImpLinks();
  }, []);

  return (
    <div className="important-links">
      <div className="btp">
        <button onClick={() => navigate("/importantlink/addlink")}>Add Links</button>
      </div>
      <h3>Codeforces ProblemSet:</h3>
        <a href="https://codeforces.com/problemset" target="_blank" rel="noopener noreferrer">
          https://codeforces.com/problemset
        </a>
        <h3>LeetCode ProblemSet:</h3>
        <a href="https://leetcode.com/problemset/" target="_blank" rel="noopener noreferrer">
          https://leetcode.com/problemset/
        </a>
        <h3>Atcoder ProblemSet:</h3>
        <a href="https://atcoder.jp/home" target="_blank" rel="noopener noreferrer">
          https://atcoder.jp/home
        </a>
        <h3>CSES ProblemSet:</h3>
        <a href="https://cses.fi/problemset/" target="_blank" rel="noopener noreferrer">
          https://cses.fi/problemset/
        </a>
        <h3>Take You Forward:</h3>
        <a href="https://takeuforward.org/" target="_blank" rel="noopener noreferrer">
          https://takeuforward.org/
        </a>
      {impLinks.length > 0 ? (
        impLinks.map((link, index) => (
          <div key={index}>
            <h3>{link.name}</h3>
            <a href={link.link} target="_blank" rel="noopener noreferrer">
              {link.link}
            </a>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}

export default ImportantLinks;