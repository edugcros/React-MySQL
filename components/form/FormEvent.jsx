function FormEvent(props) {
    const {
      onSubmit,
      onChange,
      loading,
      stateFormData,
      stateFormError,
      stateFormValid,
      stateFormMessage,
    } = props;
    return (
      <form onSubmit={onSubmit} className="form-job card" method="POST">
        <div className="form-group">
          <h2>Form Event</h2>
          <hr />
          {stateFormMessage.status === 'error' && (
            <h4 className="warning text-center">{stateFormMessage.error}</h4>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            className="form-control"
            type="text"
            id="title"
            name="title"
            placeholder="Event Title"
            onChange={onChange}
            value={stateFormData.title.value}
          />
          {stateFormError.title && (
            <span className="warning">{stateFormError.title.hint}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="text">Text</label>
          <textarea
            className="form-control"
            type="text"
            id="text"
            name="desc"
            placeholder="Description"
            onChange={onChange}
            value={stateFormData.desc.value}
          />
          {stateFormError.desc && (
            <span className="warning">{stateFormError.desc.hint}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="text">Start Event</label>
          <input
            className="form-control"
            type="date"
            id="text"
            name="start"
            placeholder="Start event"
            onChange={onChange}
            readOnly={loading && true}
            value={stateFormData.start.value}
          />
          {stateFormError.start && (
            <span className="warning">{stateFormError.start.hint}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="text">Date Limit</label>
          <input
            className="form-control"
            type="date"
            id="text"
            name="end"
            placeholder="End event"
            onChange={onChange}
            readOnly={loading && true}
            value={stateFormData.end.value}
          />
          {stateFormError.end && (
            <span className="warning">{stateFormError.end.hint}</span>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-block btn-warning"
            disabled={loading}
          >
            {!loading ? 'Submit' : 'Submitting...'}
          </button>
        </div>
      </form>
    );
  }
  export default FormEvent;