import React from 'react';

function Comments({ data }) {
  console.log(data);

  for (let i = 0; data.length < 0; i++) {
    return (
      <>
        <div>
          <p>{data.comments.text[i]}</p>

          {/* {data.comments.map((comment, index) => {
          return (
            <>
              <p>{comment.commenterId}</p>
            </>
          );
        })} */}
        </div>
      </>
    );
  }
}

export default Comments;
