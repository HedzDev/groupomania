import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePostBar from '../components/CreatePostBar';
import Comments from '../components/Comments';
import Header from '../components/Header';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get('http://localhost:4000/api/post/');
        console.log(response.data);
        setData(response.data);
      };
      fetchData();
    } catch (error) {
      console.log(error.response);
    }
  }, []);

  return (
    <>
      <div>
        <Header />
        <CreatePostBar />
        {data.map((post, index) => {
          const timestamp = post.createdAt;
          console.log(timestamp);
          const date = new Date(timestamp).toLocaleDateString('fr');
          console.log(date);
          return (
            <>
              <div>
                <p>{post.userId}</p>
                <p>{post.message}</p>
                <p>{post.likers}</p>
                <p>{date}</p>
              </div>
              <Comments data={data} />
            </>
          );
        })}
      </div>
    </>
  );
}

export default Home;
