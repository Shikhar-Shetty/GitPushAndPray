function SOSPanel() {
  return (
    <section className="panel sos-panel" aria-labelledby="sos-heading">
      <div className="panel-heading">
        <div>
          <h2 id="sos-heading">Emergency response</h2>
          <p>Response actions will connect to the available service contract.</p>
        </div>
      </div>
      <div className="card-body">
        <div className="metric-label">Need immediate assistance?</div>
        <button className="sos-button" type="button">SOS · Request nearest responder</button>
      </div>
    </section>
  )
}

export default SOSPanel