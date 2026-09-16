import { EventSummary } from '../types'

export default function EventSummaryCard({ summary }: { summary: EventSummary }) {
  return (
    <div className="card">
      <h2>{summary.eventName}</h2>
      <table>
        <tbody>
          <tr>
            <th>Maximum capacity</th>
            <td>{summary.maxCapacity}</td>
          </tr>
          <tr>
            <th>Registered count</th>
            <td>{summary.registeredCount}</td>
          </tr>
          <tr>
            <th>Checked-in count</th>
            <td>{summary.checkedInCount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
