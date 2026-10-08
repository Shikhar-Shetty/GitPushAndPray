interface AIBriefingProps {
  briefing: string
  isMock: boolean
}

function AIBriefing({ briefing, isMock }: AIBriefingProps) {
  return (
    <section className="panel" aria-labelledby="briefing-heading">
      <div className="panel-heading">
        <div>
          <h2 id="briefing-heading">AI briefing</h2>
          <p>{isMock ? 'Demo briefing' : 'Explanation returned with the selected backend prediction'}</p>
        </div>
      </div>
      <div className="card-body">
        <p className="briefing">{briefing}</p>
        {isMock && <p className="briefing-note">Demo content shown while backend prediction data is unavailable.</p>}
      </div>
    </section>
  )
}

export default AIBriefing
