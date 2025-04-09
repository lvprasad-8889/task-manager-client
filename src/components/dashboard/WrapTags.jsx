import React, { useState } from 'react';

const TagList = ({ tags }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleTags = showAll ? tags : tags.slice(0, 3);
  const remainingCount = tags.length - 3;

  return (
    <div className="">
      {visibleTags.map((tag, index) => (
        <span className="badge bg-primary me-1 mb-1" key={index}>{tag}</span>
      ))}

      {tags.length > 3 && !showAll && (
        <span
        role='button'
          className="badge bg-primary"
          onClick={() => setShowAll(true)}
        >
          +{remainingCount} more
        </span>
      )}

      {tags.length > 3 && showAll && (
        <span
        role='button'
          className="badge bg-primary ms-2"
          onClick={() => setShowAll(false)}
        >
          Show less
        </span>
      )}
    </div>
  );
};

export default TagList;
