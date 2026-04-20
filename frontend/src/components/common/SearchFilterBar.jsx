import React from 'react';

function SearchFilterBar({ fields = [], values = {}, onChange, onSubmit, onReset }) {
  return (
    <form className="panel" onSubmit={onSubmit}>
      <div className="grid three">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="label">{field.label}</label>
            {field.type === 'select' ? (
              <select
                className="select"
                value={values[field.name] || ''}
                onChange={(event) => onChange(field.name, event.target.value)}
              >
                <option value="">All</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input"
                type={field.type || 'text'}
                value={values[field.name] || ''}
                onChange={(event) => onChange(field.name, event.target.value)}
                placeholder={field.placeholder || `Filter by ${field.label.toLowerCase()}`}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
        <button className="btn primary" type="submit">
          Apply Filters
        </button>
        <button className="btn secondary" type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  );
}

export default SearchFilterBar;
