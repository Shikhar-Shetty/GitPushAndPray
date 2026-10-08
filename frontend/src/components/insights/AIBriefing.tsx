interface AIBriefingProps {
  briefing: string
}

function AIBriefing({ briefing }: AIBriefingProps) {
  return (
    <section className="panel" aria-labelledby="briefing-heading">
      <div className="panel-heading">
        <div>
          <h2 id="briefing-heading">AI briefing</h2>
          <p>Human-readable guidance placeholder</p>
        </div>
      </div>
      <div className="card-body">
        <p className="briefing">{briefing}</p>
        <p className="briefing-note">Mock content for frontend development. Final guidance will come from the backend LLM pipeline.</p>
      </div>
    </section>
  )
}

export default AIBriefing