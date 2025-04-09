import React, { useState } from 'react';

const TagInput = ({fetchTagsToParent}) => {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim() !== '') {
      e.preventDefault();
      const newTag = input.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        fetchTagsToParent(newTag);
      }
      setInput('');
    }
  };

  const handleRemove = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-3">
      <label className="form-label">Tags</label>
      <div className="form-control d-flex flex-wrap align-items-center gap-2" style={{ minHeight: '60px' }}>
        {tags.map((tag, index) => (
          <span className="badge bg-primary tag d-flex align-items-center" key={index}>
            {tag}
            <button
              type="button"
              className="btn-close btn-close-white btn-sm ms-2"
              onClick={() => handleRemove(index)}
              aria-label="Remove"
            ></button>
          </span>
        ))}
        <input
          type="text"
          className="border-0 flex-grow-1 form-control"
          placeholder="Type and press enter..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default TagInput;
