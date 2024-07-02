import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Ticket, User } from '@acme/shared-models';

import styles from './app.module.css';
import Tickets from './tickets/tickets';
import TicketDetail from './ticketDetail/ticketDetail';

const App = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState([] as User[]);
  const [isShowPopup, setShowPopup] = useState<boolean>(false);

  const handleFetchTickets = async () => {
    const data = await fetch('/api/tickets').then();
    setTickets(await data.json());
  };

  const handleFetchUsers = async () => {
    const data = await fetch('/api/users').then();
    setUsers(await data.json());
  };

  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).
  useEffect(() => {
    async function fetchTickets() {
      await handleFetchTickets();
    }

    async function fetchUsers() {
      await handleFetchUsers();
    }

    fetchTickets();
    fetchUsers();
  }, []);

  return (
    <div className={styles['app']}>
      <div className={styles['title']}>
        <h1>Ticketing App</h1>
      </div>
      <div className={styles['container']}>
        <Routes>
          <Route
            path="/"
            element={
              <Tickets
                onSetPopup={setShowPopup}
                onFetchTickets={handleFetchTickets}
                tickets={tickets}
              />
            }
          />
          {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
          <Route
            path="/:id"
            element={
              <TicketDetail
                users={users}
                onSetPopup={setShowPopup}
                onFetchTickets={handleFetchTickets}
              />
            }
          />
        </Routes>
      </div>
      {isShowPopup && <div className={styles['pop-up']}>Please wait...</div>}
    </div>
  );
};

export default App;
