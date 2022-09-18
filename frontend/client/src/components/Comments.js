import React from 'react';

function Comments({ data }) {
  console.log(data);
  return (
    <>
      <div>
        {/* {data.comments.map((comment, index) => {
          return (
            <>
              <p>{comment.commenterId}</p>
              <p>{comment.text}</p>
            </>
          );
        })} */}
      </div>
    </>
  );
}

export default Comments;
