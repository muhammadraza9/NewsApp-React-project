import React from 'react';

const FALLBACK_IMAGE = "https://placehold.co/600x400";

const NewItem = ({ title, description, imageUrl, newsurl, author, date, source }) => {
  const formattedDate = date
    ? new Date(date).toUTCString()
    : "Unknown date";

  return (
    <div className="card h-100 position-relative">

      <span
        className="position-absolute top-0 translate-middle badge rounded-pill bg-success"
        style={{ left: '87%', zIndex: 1 }}
      >
        {source || "Unknown"}
      </span>

      {/* Fixed height image wrapper */}
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img
          src={imageUrl || FALLBACK_IMAGE}
          alt={title || "news"}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* d-flex flex-column pushes button to bottom */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title || "No Title"}</h5>
        <p className="card-text flex-grow-1">{description || "No description available"}</p>
        <p className="card-text">
          <small className="text-body-secondary">
            By {author || "Unknown"} on {formattedDate}
          </small>
        </p>

        {newsurl ? (
          <a href={newsurl} target="_blank" rel="noreferrer" className="btn btn-dark mt-auto">
            Read more
          </a>
        ) : (
          <button className="btn btn-dark mt-auto" disabled>
            Read more
          </button>
        )}
      </div>

    </div>
  );
};

export default NewItem;