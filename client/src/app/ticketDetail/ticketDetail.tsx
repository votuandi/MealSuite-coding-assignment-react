import { Ticket, User } from '@acme/shared-models';
import styles from './ticketDetail.module.css';
import { useEffect, useState } from 'react';

export interface TicketProps {
  users: Array<User>;
  onSetPopup: (value: boolean) => void;
  onFetchTickets: () => void;
}

export function TicketDetail(props: TicketProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [assigner, setAssigner] = useState<User | null>(null);
  const [selectedAssignerId, setSelectedAssignerId] = useState<string>();

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAssignerId(event.target.value);
  };

  const handleUnassign = async () => {
    if (ticket) {
      props.onSetPopup(true);
      try {
        const data = await fetch(`/api/tickets/${ticket.id}/unassign`, {
          method: 'PUT',
        }).then();
        if (data.status === 204) {
          // alert('Unassign Successfully');
          handleFetchTicket(ticket.id.toString());
          props.onFetchTickets();
          props.onSetPopup(false);
        }
      } catch (error) {
        // alert('Unassign Failed');
        props.onSetPopup(false);
      }
    }
  };

  const handleAssign = async () => {
    if (ticket && selectedAssignerId) {
      props.onSetPopup(true);
      try {
        const data = await fetch(
          `/api/tickets/${ticket.id}/assign/${selectedAssignerId}`,
          {
            method: 'PUT',
          }
        ).then();
        if (data.status === 204) {
          // alert('Assign Successfully');
          handleFetchTicket(ticket.id.toString());
          props.onFetchTickets();
          props.onSetPopup(false);
        }
      } catch (error) {
        // alert('Assign Failed');
        props.onSetPopup(false);
      }
    }
  };

  const handleComplete = async () => {
    if (ticket) {
      props.onSetPopup(true);
      try {
        const data = await fetch(`/api/tickets/${ticket.id}/complete`, {
          method: 'PUT',
        }).then();
        if (data.status === 204) {
          // alert('Complete Successfully');
          handleFetchTicket(ticket.id.toString());
          props.onFetchTickets();
          props.onSetPopup(false);
        }
      } catch (error) {
        // alert('Complete Failed');
        props.onSetPopup(false);
      }
    }
  };

  const handleIncomplete = async () => {
    if (ticket) {
      props.onSetPopup(true);
      try {
        const data = await fetch(`/api/tickets/${ticket.id}/complete`, {
          method: 'DELETE',
        }).then();
        if (data.status === 204) {
          // alert('Incomplete Successfully');
          handleFetchTicket(ticket.id.toString());
          props.onFetchTickets();
          props.onSetPopup(false);
        }
      } catch (error) {
        // alert('Incomplete Failed');
        props.onSetPopup(false);
      }
    }
  };

  const handleFetchTicket = async (id: string) => {
    const data = await fetch(`/api/tickets/${id}`).then();
    setTicket(await data.json());
  };

  useEffect(() => {
    const fetchTicket = async (id: string) => {
      await handleFetchTicket(id);
    };

    const ticketId = window.location.pathname.split('/')[1];
    if (ticketId) {
      fetchTicket(ticketId);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async (id: string) => {
      const data = await fetch(`/api/users/${id}`).then();
      setAssigner(await data.json());
    };

    if (ticket?.assigneeId) {
      fetchUser(ticket.assigneeId.toString());
    }
  }, [ticket]);

  return (
    <div className={styles['container']}>
      <h2 className={styles['title']}>Ticket: {ticket?.description}</h2>
      <div className={styles['flex-row']}>
        <span>Assigned:</span>
        {ticket?.assigneeId && assigner ? (
          <>
            <span className={styles['assigner']}>{assigner?.name}</span>
            <button className={styles['unassign-btn']} onClick={handleUnassign}>
              Unassign
            </button>
          </>
        ) : (
          <>
            <select
              id="dropdown"
              defaultValue="all"
              onChange={handleDropdownChange}
            >
              {props.users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <button className={styles['assign-btn']} onClick={handleAssign}>
              Assign
            </button>
          </>
        )}
      </div>
      {ticket?.completed ? (
        <button className={styles['incomplete-btn']} onClick={handleIncomplete}>
          Incomplete
        </button>
      ) : (
        <button className={styles['complete-btn']} onClick={handleComplete}>
          Complete
        </button>
      )}
    </div>
  );
}

export default TicketDetail;
