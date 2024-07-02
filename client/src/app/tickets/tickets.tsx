import { Ticket } from '@acme/shared-models';
import styles from './tickets.module.css';
import { useEffect, useState } from 'react';

export interface TicketsProps {
  tickets: Ticket[];
  onFetchTickets: () => void;
  onSetPopup: (value: boolean) => void;
}

export type FilterType = 'all' | 'assigned' | 'unassigned';

export function Tickets(props: TicketsProps) {
  const [filteredTickets, setFilteredTickets] = useState<Array<Ticket>>([]);
  const [isShowAddPanel, setShowAddPanel] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>('');

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const filter = event.target.value;
    console.log(filter);

    if (filter === 'all') {
      setFilteredTickets([...props.tickets]);
    } else if (filter === 'assigned') {
      setFilteredTickets(props.tickets.filter((x) => x.assigneeId !== null));
    } else {
      const items = props.tickets.filter((x) => x.assigneeId == null);
      console.log(items);

      setFilteredTickets([...items]);
    }
  };

  const createTicket = async () => {
    try {
      if (newDescription.length === 0) {
        // alert('Invalid input!');
        return;
      }
      props.onSetPopup(true);
      const data = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newDescription,
        }),
      }).then();
      if (data?.status === 201) {
        props.onFetchTickets();
        props.onSetPopup(false);
        setShowAddPanel(false);
      }
      console.log(data.status);
    } catch (error) {
      // alert('Create Failed');
      props.onSetPopup(false);
    }
  };

  const handleInputAddChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDescription(event.target.value);
  };

  const handleShowAddNewPanel = () => {
    setNewDescription('');
    setShowAddPanel(true);
  };

  const handleHideAddNewPanel = () => {
    setShowAddPanel(false);
  };

  useEffect(() => {
    setFilteredTickets((x) => (props.tickets ? [...props.tickets] : x));
  }, [props.tickets]);

  return (
    <div className={styles['tickets']}>
      <div className={styles['function-bar']}>
        <h2>Tickets</h2>
        <div className={styles['buttons']}>
          <select
            id="dropdown-filter"
            defaultValue="all"
            onChange={handleDropdownChange}
          >
            <option value="all">All</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
          <button onClick={handleShowAddNewPanel}>Add</button>
        </div>
        {isShowAddPanel && (
          <div className={styles['add-panel']}>
            <span>Add new ticket</span>
            <input
              type="text"
              placeholder="Input description"
              onChange={handleInputAddChange}
            />
            <div className={styles['buttons']}>
              <button onClick={createTicket}>OK</button>
              <button
                className={styles['cancel']}
                onClick={handleHideAddNewPanel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {filteredTickets.length > 0 ? (
        <div className={styles['list']}>
          {filteredTickets.map((t) => (
            <a href={`/${t.id}`} className={styles['ticket']} key={t.id}>
              <div className={styles['ticket-title']}>
                <span>{t.id}</span>
                <span
                  className={styles[t.assigneeId ? 'assigned' : 'no-assigned']}
                >
                  {t.description}
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className={styles['no-item']}>
          <img src="https://www.new4you.in/img/no_products_found.png" alt="" />
        </div>
      )}
    </div>
  );
}

export default Tickets;
