import { useState } from 'react'
import type { AffectedFacility } from '../../types/flood'

const FACILITIES_PER_PAGE = 7

interface AffectedFacilitiesProps {
  facilities: AffectedFacility[]
}

function AffectedFacilities({ facilities }: AffectedFacilitiesProps) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(facilities.length / FACILITIES_PER_PAGE)
  const currentPage = Math.min(page, Math.max(totalPages - 1, 0))
  const pageStart = currentPage * FACILITIES_PER_PAGE
  const visibleFacilities = facilities.slice(pageStart, pageStart + FACILITIES_PER_PAGE)

  return (
    <section className="panel" aria-labelledby="facilities-heading">
      <div className="panel-heading">
        <div>
          <h2 id="facilities-heading">Affected facilities</h2>
          <p>{facilities.length > 0 ? `${facilities.length} returned near the selected area` : 'No schools or hospitals returned'}</p>
        </div>
      </div>
      <div className="card-body">
        {facilities.length > 0 ? (
          <>
            <ul className="facility-list">
              {visibleFacilities.map((facility, index) => (
                <li className="facility-item" key={`${facility.type}:${facility.name}:${facility.latitude}:${facility.longitude}:${index}`}>
                  <span className="facility-type">{facility.type}</span>
                  <div>
                    <strong>{facility.name}</strong>
                    <span>{facility.latitude.toFixed(4)}, {facility.longitude.toFixed(4)}</span>
                  </div>
                </li>
              ))}
            </ul>
            {totalPages > 1 && (
              <div className="facility-pagination">
                <button type="button" onClick={() => setPage((current) => Math.max(current - 1, 0))} disabled={currentPage === 0}>Previous</button>
                <span aria-live="polite">Page {currentPage + 1} of {totalPages}</span>
                <button type="button" onClick={() => setPage((current) => Math.min(current + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>Next</button>
              </div>
            )}
          </>
        ) : (
          <p className="briefing-note">No facility data is available for this prediction.</p>
        )}
      </div>
    </section>
  )
}

export default AffectedFacilities
