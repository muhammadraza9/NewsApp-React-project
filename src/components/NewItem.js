import React from 'react'

const NewItem = (props) => {

  let { title, description, imageUrl, newsurl, author, date, source } = props;

  return (
    <div>
      <div className="card">

        <span
          className="position-absolute top-0 translate-middle badge rounded-pill bg-success"
          style={{ left: '87%', zIndex: '1' }}
        >
          {source || "Unknown"}
        </span>

        {/* ✅ FIX: fallback image */}
        <img
          src={imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
          className="card-img-top"
          alt="news"
        />

        <div className="card-body">

          <h5 className="card-title">{title || "No Title"}</h5>

          <p className="card-text">{description || "No description available"}</p>

          {/* ✅ FIX: safe date */}
          <p className="card-text">
            <small className="text-body-secondary">
              By {!author ? "Unknown" : author} on {date ? new Date(date).toGMTString() : "Unknown date"}
            </small>
          </p>

          <a href={newsurl} target="_blank" rel="noreferrer" className="btn btn-dark">
            Read more
          </a>

        </div>
      </div>
    </div>
  )
}

export default NewItem