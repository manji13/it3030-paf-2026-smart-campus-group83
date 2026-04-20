import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { member3Api } from '../../api/member3Api';
import StatusBadge from '../../components/common/StatusBadge';
import { TICKET_STATUS_OPTIONS } from '../../types/statusOptions';

function TicketListPage() {
  const [filters, setFilters] = useState({ status: '', mine: false });
  const [tickets, setTickets] = useState([]);

  const loadTickets = async (activeFilters = filters) => {
    const params = {};
    if (activeFilters.status) params.status = activeFilters.status;
    if (activeFilters.mine) params.mine = true;

    const response = await member3Api.listTickets(params);
    setTickets(response.data.data || []);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div className="grid">
      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Ticket List (member3)</h2>
        <div className="grid two">
          <div>
            <label className="label">Status</label>
            <select
              className="select"
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All</option>
              {TICKET_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={filters.mine}
                onChange={(e) => setFilters((prev) => ({ ...prev, mine: e.target.checked }))}
              />
              Show only my tickets
            </label>
          </div>
        </div>
        <div style={{ marginTop: '0.8rem' }}>
          <button className="btn primary" onClick={() => loadTickets(filters)}>
            Apply
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.category}</td>
                  <td>{ticket.priority}</td>
                  <td>
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td>{ticket.createdBy}</td>
                  <td>
                    <Link className="btn secondary" to={`/tickets/${ticket.id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default TicketListPage;
